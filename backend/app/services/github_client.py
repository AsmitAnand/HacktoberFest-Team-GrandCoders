"""
GitHub API Client Service

Handles all communication with the GitHub REST API v3.
Fetches repository metadata, file trees, issues, README, and more.
"""

import re
import base64
import httpx
from functools import lru_cache
from typing import Any

from app.config import settings


class GitHubClient:
    """Client for interacting with the GitHub REST API."""

    def __init__(self):
        self.base_url = settings.github_api_base
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "HacktoberfestCopilot/1.0",
        }
        if settings.github_token:
            self.headers["Authorization"] = f"Bearer {settings.github_token}"

    def _parse_repo_url(self, repo_url: str) -> tuple[str, str]:
        """
        Extract owner and repo name from a GitHub URL.

        Supports formats:
        - https://github.com/owner/repo
        - https://github.com/owner/repo.git
        - github.com/owner/repo
        - owner/repo
        """
        # Remove trailing slashes and .git
        repo_url = repo_url.rstrip("/").removesuffix(".git")

        # Try full URL pattern
        match = re.search(r"github\.com/([^/]+)/([^/]+)", repo_url)
        if match:
            return match.group(1), match.group(2)

        # Try owner/repo pattern
        parts = repo_url.split("/")
        if len(parts) == 2:
            return parts[0], parts[1]

        raise ValueError(
            f"Invalid GitHub URL: {repo_url}. "
            "Expected format: https://github.com/owner/repo"
        )

    async def _get(self, endpoint: str, params: dict | None = None) -> Any:
        """Make a GET request to the GitHub API."""
        url = f"{self.base_url}{endpoint}"
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url, headers=self.headers, params=params, timeout=30.0
            )
            response.raise_for_status()
            return response.json()

    async def get_repo(self, repo_url: str) -> dict:
        """Fetch repository metadata."""
        owner, repo = self._parse_repo_url(repo_url)
        data = await self._get(f"/repos/{owner}/{repo}")
        return {
            "name": data.get("name", ""),
            "full_name": data.get("full_name", ""),
            "description": data.get("description"),
            "language": data.get("language"),
            "stars": data.get("stargazers_count", 0),
            "forks": data.get("forks_count", 0),
            "open_issues_count": data.get("open_issues_count", 0),
            "topics": data.get("topics", []),
            "html_url": data.get("html_url", ""),
            "default_branch": data.get("default_branch", "main"),
        }

    async def get_file_tree(self, repo_url: str) -> list[dict]:
        """Fetch the repository file tree (recursive)."""
        owner, repo = self._parse_repo_url(repo_url)
        try:
            data = await self._get(
                f"/repos/{owner}/{repo}/git/trees/HEAD",
                params={"recursive": "1"},
            )
            tree = data.get("tree", [])
            return [
                {
                    "path": item["path"],
                    "type": "dir" if item["type"] == "tree" else "file",
                    "size": item.get("size", 0),
                }
                for item in tree[:500]  # Limit to 500 items
            ]
        except httpx.HTTPStatusError:
            return []

    async def get_readme(self, repo_url: str) -> str:
        """Fetch and decode the repository README."""
        owner, repo = self._parse_repo_url(repo_url)
        try:
            data = await self._get(f"/repos/{owner}/{repo}/readme")
            content = data.get("content", "")
            encoding = data.get("encoding", "base64")
            if encoding == "base64" and content:
                return base64.b64decode(content).decode("utf-8", errors="replace")
            return content
        except httpx.HTTPStatusError:
            return ""

    async def get_contributing(self, repo_url: str) -> str:
        """Fetch the CONTRIBUTING.md file content if it exists."""
        owner, repo = self._parse_repo_url(repo_url)
        try:
            data = await self._get(
                f"/repos/{owner}/{repo}/contents/CONTRIBUTING.md"
            )
            content = data.get("content", "")
            encoding = data.get("encoding", "base64")
            if encoding == "base64" and content:
                return base64.b64decode(content).decode("utf-8", errors="replace")
            return content
        except httpx.HTTPStatusError:
            return ""

    async def get_issues(
        self,
        repo_url: str,
        labels: str = "",
        state: str = "open",
        per_page: int = 30,
    ) -> list[dict]:
        """Fetch issues from the repository."""
        owner, repo = self._parse_repo_url(repo_url)
        params = {"state": state, "per_page": per_page}
        if labels:
            params["labels"] = labels

        try:
            data = await self._get(f"/repos/{owner}/{repo}/issues", params=params)
            return [
                {
                    "number": issue["number"],
                    "title": issue["title"],
                    "body": issue.get("body", ""),
                    "labels": [label["name"] for label in issue.get("labels", [])],
                    "state": issue["state"],
                    "html_url": issue["html_url"],
                    "created_at": issue.get("created_at", ""),
                    "user": issue.get("user", {}).get("login", ""),
                    "comments": issue.get("comments", 0),
                }
                for issue in data
                if "pull_request" not in issue  # Filter out PRs
            ]
        except httpx.HTTPStatusError:
            return []

    async def get_beginner_issues(self, repo_url: str) -> list[dict]:
        """
        Fetch beginner-friendly issues.
        Searches for common beginner labels.
        """
        beginner_labels = [
            "good first issue",
            "help wanted",
            "beginner",
            "easy",
            "starter",
            "first-timers-only",
            "good-first-issue",
        ]

        all_issues = []
        seen_numbers = set()

        for label in beginner_labels:
            issues = await self.get_issues(repo_url, labels=label)
            for issue in issues:
                if issue["number"] not in seen_numbers:
                    seen_numbers.add(issue["number"])
                    all_issues.append(issue)

        return all_issues

    async def get_issue(self, repo_url: str, issue_number: int) -> dict:
        """Fetch a single issue by number."""
        owner, repo = self._parse_repo_url(repo_url)
        data = await self._get(f"/repos/{owner}/{repo}/issues/{issue_number}")
        return {
            "number": data["number"],
            "title": data["title"],
            "body": data.get("body", ""),
            "labels": [label["name"] for label in data.get("labels", [])],
            "state": data["state"],
            "html_url": data["html_url"],
            "created_at": data.get("created_at", ""),
            "user": data.get("user", {}).get("login", ""),
            "comments": data.get("comments", 0),
        }

    async def get_file_content(self, repo_url: str, file_path: str) -> str:
        """Fetch the content of a specific file from the repository."""
        owner, repo = self._parse_repo_url(repo_url)
        try:
            data = await self._get(
                f"/repos/{owner}/{repo}/contents/{file_path}"
            )
            content = data.get("content", "")
            encoding = data.get("encoding", "base64")
            if encoding == "base64" and content:
                return base64.b64decode(content).decode("utf-8", errors="replace")
            return content
        except httpx.HTTPStatusError:
            return ""


# Singleton instance
github_client = GitHubClient()
