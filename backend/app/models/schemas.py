"""
Pydantic schemas for request/response models.
"""

from pydantic import BaseModel, Field


# ─── Request Models ──────────────────────────────────────────────────

class RepoAnalyzeRequest(BaseModel):
    """Request to analyze a GitHub repository."""
    repo_url: str = Field(
        ...,
        description="Full GitHub repository URL (e.g., https://github.com/owner/repo)",
        examples=["https://github.com/facebook/react"],
    )


class IssueExplainRequest(BaseModel):
    """Request to explain a GitHub issue in beginner-friendly language."""
    repo_url: str = Field(..., description="Full GitHub repository URL")
    issue_number: int = Field(..., description="Issue number to explain", ge=1)


class PlanGenerateRequest(BaseModel):
    """Request to generate an implementation plan for an issue."""
    repo_url: str = Field(..., description="Full GitHub repository URL")
    issue_number: int = Field(..., description="Issue number to generate plan for", ge=1)


class TestSuggestRequest(BaseModel):
    """Request to suggest tests for an issue."""
    repo_url: str = Field(..., description="Full GitHub repository URL")
    issue_number: int = Field(..., description="Issue number to suggest tests for", ge=1)
    plan: str = Field(
        default="",
        description="Optional implementation plan for more targeted test suggestions",
    )


class PRGenerateRequest(BaseModel):
    """Request to generate a pull request description."""
    repo_url: str = Field(..., description="Full GitHub repository URL")
    issue_number: int = Field(..., description="Issue number the PR addresses", ge=1)
    changes_summary: str = Field(
        default="",
        description="Optional summary of changes made",
    )


# ─── Response Models ─────────────────────────────────────────────────

class RepoInfo(BaseModel):
    """Basic repository information."""
    name: str
    full_name: str
    description: str | None = None
    language: str | None = None
    stars: int = 0
    forks: int = 0
    open_issues_count: int = 0
    topics: list[str] = []
    html_url: str = ""
    default_branch: str = "main"


class FileTreeItem(BaseModel):
    """A single item in the repository file tree."""
    path: str
    type: str  # "file" or "dir"
    size: int = 0


class IssueInfo(BaseModel):
    """Information about a single GitHub issue."""
    number: int
    title: str
    body: str | None = None
    labels: list[str] = []
    state: str = "open"
    html_url: str = ""
    created_at: str = ""
    user: str = ""
    comments: int = 0


class RepoAnalyzeResponse(BaseModel):
    """Full repository analysis response."""
    repo: RepoInfo
    file_tree: list[FileTreeItem] = []
    readme_summary: str = ""
    contributing_summary: str = ""
    tech_stack: list[str] = []
    beginner_issues: list[IssueInfo] = []
    all_open_issues: list[IssueInfo] = []


class IssueExplainResponse(BaseModel):
    """AI-generated issue explanation."""
    issue: IssueInfo
    simplified_explanation: str = ""
    difficulty: str = "Beginner"  # Beginner, Intermediate, Advanced
    required_skills: list[str] = []
    relevant_files: list[str] = []
    jargon_explained: dict[str, str] = {}


class PlanGenerateResponse(BaseModel):
    """AI-generated implementation plan."""
    issue_number: int
    steps: list[str] = []
    files_to_modify: list[str] = []
    approach: str = ""
    testing_approach: str = ""
    pr_checklist: list[str] = []


class TestSuggestResponse(BaseModel):
    """AI-generated test suggestions."""
    issue_number: int
    test_framework: str = ""
    test_cases: list[str] = []
    example_code: str = ""


class PRGenerateResponse(BaseModel):
    """AI-generated pull request description."""
    issue_number: int
    title: str = ""
    body: str = ""
