"""
Pull request description generator router.

Endpoint: POST /api/generate-pr
Generates a professional pull request description for a GitHub issue.
"""

from fastapi import APIRouter, HTTPException

from app.models.schemas import PRGenerateRequest, PRGenerateResponse
from app.exceptions import AppException, ResourceNotFoundError, GitHubAPIError, AIServiceError
from app.services.github_client import github_client
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/generate-pr", response_model=PRGenerateResponse)
async def generate_pr(request: PRGenerateRequest):
    """
    Generate a pull request description for a GitHub issue.

    Uses Gemma 4 to create a well-structured PR with title,
    description, issue reference, and checklist.
    """
    try:
        # Fetch issue details and contributing guidelines
        issue_data = await github_client.get_issue(
            request.repo_url, request.issue_number
        )
        contributing = await github_client.get_contributing(request.repo_url)

        # Generate PR description with AI
        pr = await ai_service.generate_pr_description(
            issue_title=issue_data["title"],
            issue_body=issue_data.get("body", ""),
            issue_number=request.issue_number,
            changes_summary=request.changes_summary,
            contributing=contributing,
        )

        return PRGenerateResponse(
            issue_number=request.issue_number,
            title=pr.get("title", ""),
            body=pr.get("body", ""),
        )

    except ValueError as e:
        raise ResourceNotFoundError(str(e))
    except AppException:
        raise
    except Exception as e:
        raise AppException(
            message=f"Failed to generate PR description: {str(e)}",
            status_code=500,
            error_code="PR_GENERATION_ERROR",
        )
