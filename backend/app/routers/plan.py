"""
Implementation plan generator router.

Endpoint: POST /api/generate-plan
Generates a step-by-step implementation plan for a GitHub issue.
"""

from fastapi import APIRouter

from app.models.schemas import PlanGenerateRequest, PlanGenerateResponse
from app.exceptions import AppException, ResourceNotFoundError, GitHubAPIError, AIServiceError
from app.services.github_client import github_client
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/generate-plan", response_model=PlanGenerateResponse)
async def generate_plan(request: PlanGenerateRequest):
    """
    Generate a step-by-step implementation plan for a GitHub issue.

    Uses Gemma 4 to create an actionable plan including files to modify,
    testing approach, and PR checklist.
    """
    try:
        # Fetch issue and repo context
        issue_data = await github_client.get_issue(
            request.repo_url, request.issue_number
        )
        readme = await github_client.get_readme(request.repo_url)
        file_tree = await github_client.get_file_tree(request.repo_url)
        contributing = await github_client.get_contributing(request.repo_url)

        # Generate plan with AI
        plan = await ai_service.generate_plan(
            issue_title=issue_data["title"],
            issue_body=issue_data.get("body", ""),
            readme=readme,
            file_tree=file_tree,
            contributing=contributing,
        )

        return PlanGenerateResponse(
            issue_number=request.issue_number,
            steps=plan.get("steps", []),
            files_to_modify=plan.get("files_to_modify", []),
            approach=plan.get("approach", ""),
            testing_approach=plan.get("testing_approach", ""),
            pr_checklist=plan.get("pr_checklist", []),
        )

    except ValueError as e:
        raise ResourceNotFoundError(str(e))
    except AppException:
        raise
    except Exception as e:
        raise AppException(
            message=f"Failed to generate plan: {str(e)}",
            status_code=500,
            error_code="PLAN_GENERATE_ERROR",
        )
