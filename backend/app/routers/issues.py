"""
Issue explanation router.

Endpoint: POST /api/explain-issue
Explains a GitHub issue in beginner-friendly language using Gemma 4.
"""

from fastapi import APIRouter, HTTPException

from app.models.schemas import IssueExplainRequest, IssueExplainResponse, IssueInfo
from app.services.github_client import github_client
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/explain-issue", response_model=IssueExplainResponse)
async def explain_issue(request: IssueExplainRequest):
    """
    Explain a GitHub issue in beginner-friendly language.

    Uses Gemma 4 to simplify the issue description, categorize difficulty,
    identify required skills, and suggest relevant files.
    """
    try:
        # Fetch issue details
        issue_data = await github_client.get_issue(
            request.repo_url, request.issue_number
        )

        # Fetch repo context for better AI understanding
        readme = await github_client.get_readme(request.repo_url)
        file_tree = await github_client.get_file_tree(request.repo_url)

        # Use AI to explain the issue
        explanation = await ai_service.explain_issue(
            issue_title=issue_data["title"],
            issue_body=issue_data.get("body", ""),
            issue_labels=issue_data.get("labels", []),
            readme=readme,
            file_tree=file_tree,
        )

        return IssueExplainResponse(
            issue=IssueInfo(**issue_data),
            simplified_explanation=explanation.get("simplified_explanation", ""),
            difficulty=explanation.get("difficulty", "Beginner"),
            required_skills=explanation.get("required_skills", []),
            relevant_files=explanation.get("relevant_files", []),
            jargon_explained=explanation.get("jargon_explained", {}),
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to explain issue: {str(e)}",
        )
