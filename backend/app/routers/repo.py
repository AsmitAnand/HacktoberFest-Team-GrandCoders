"""
Repository analysis router.

Endpoint: POST /api/analyze-repo
Analyzes a GitHub repository and returns structured information.
"""

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    RepoAnalyzeRequest,
    RepoAnalyzeResponse,
    RepoInfo,
    FileTreeItem,
    IssueInfo,
)
from app.services.github_client import github_client
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/analyze-repo", response_model=RepoAnalyzeResponse)
async def analyze_repo(request: RepoAnalyzeRequest):
    """
    Analyze a GitHub repository.

    Returns repository metadata, file structure, README summary,
    tech stack detection, and beginner-friendly issues.
    """
    try:
        # Fetch all repo data in parallel-ish fashion
        repo_data = await github_client.get_repo(request.repo_url)
        file_tree_data = await github_client.get_file_tree(request.repo_url)
        readme_raw = await github_client.get_readme(request.repo_url)
        contributing_raw = await github_client.get_contributing(request.repo_url)
        beginner_issues = await github_client.get_beginner_issues(request.repo_url)
        all_issues = await github_client.get_issues(request.repo_url)

        # Use AI to summarize and detect tech stack
        readme_summary = ""
        tech_stack = []
        contributing_summary = ""

        if readme_raw:
            readme_summary = await _summarize_readme(readme_raw)
            tech_stack = _detect_tech_stack(readme_raw, file_tree_data)

        if contributing_raw:
            contributing_summary = await _summarize_contributing(contributing_raw)

        return RepoAnalyzeResponse(
            repo=RepoInfo(**repo_data),
            file_tree=[FileTreeItem(**item) for item in file_tree_data],
            readme_summary=readme_summary,
            contributing_summary=contributing_summary,
            tech_stack=tech_stack,
            beginner_issues=[IssueInfo(**issue) for issue in beginner_issues],
            all_open_issues=[IssueInfo(**issue) for issue in all_issues],
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze repository: {str(e)}",
        )


async def _summarize_readme(readme: str) -> str:
    """Use AI to create a concise summary of the README."""
    truncated = readme[:4000]
    prompt = (
        "Summarize this README in 3-4 sentences for a beginner contributor. "
        "Focus on: what the project does, its main technology, and how to "
        "get started.\n\n"
        f"{truncated}"
    )
    try:
        return await ai_service._generate(prompt)
    except Exception:
        # Fallback: return first 500 chars of README
        return readme[:500] + "..."


async def _summarize_contributing(contributing: str) -> str:
    """Use AI to summarize contributing guidelines."""
    truncated = contributing[:3000]
    prompt = (
        "Summarize these contributing guidelines in 2-3 bullet points. "
        "Focus on the most important rules a first-time contributor must know.\n\n"
        f"{truncated}"
    )
    try:
        return await ai_service._generate(prompt)
    except Exception:
        return contributing[:300] + "..."


def _detect_tech_stack(readme: str, file_tree: list[dict]) -> list[str]:
    """Detect the tech stack from README content and file extensions."""
    tech_indicators = {
        ".py": "Python",
        ".js": "JavaScript",
        ".ts": "TypeScript",
        ".jsx": "React",
        ".tsx": "React + TypeScript",
        ".vue": "Vue.js",
        ".go": "Go",
        ".rs": "Rust",
        ".java": "Java",
        ".rb": "Ruby",
        ".php": "PHP",
        ".swift": "Swift",
        ".kt": "Kotlin",
        ".cs": "C#",
        ".cpp": "C++",
        ".c": "C",
        "Dockerfile": "Docker",
        "docker-compose": "Docker Compose",
        ".github/workflows": "GitHub Actions",
        "package.json": "Node.js",
        "requirements.txt": "Python (pip)",
        "Cargo.toml": "Rust (Cargo)",
        "go.mod": "Go Modules",
        "Gemfile": "Ruby (Bundler)",
        "pom.xml": "Java (Maven)",
        "build.gradle": "Java (Gradle)",
    }

    detected = set()
    for item in file_tree:
        path = item["path"].lower()
        for indicator, tech in tech_indicators.items():
            if path.endswith(indicator.lower()) or indicator.lower() in path:
                detected.add(tech)

    return sorted(list(detected))
