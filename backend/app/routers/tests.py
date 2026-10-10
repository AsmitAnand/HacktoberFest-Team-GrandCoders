"""
Test suggestion router.

Endpoint: POST /api/suggest-tests
Suggests appropriate tests for a proposed change.
"""

from fastapi import APIRouter, HTTPException

from app.models.schemas import TestSuggestRequest, TestSuggestResponse
from app.exceptions import AppException, ResourceNotFoundError, GitHubAPIError, AIServiceError
from app.services.github_client import github_client
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/suggest-tests", response_model=TestSuggestResponse)
async def suggest_tests(request: TestSuggestRequest):
    """
    Suggest tests for a proposed change to address a GitHub issue.

    Uses Gemma 4 to recommend test framework, test cases,
    and example test code.
    """
    try:
        import asyncio
        issue_data, file_tree = await asyncio.gather(
            github_client.get_issue(request.repo_url, request.issue_number),
            github_client.get_file_tree(request.repo_url),
        )

        # Generate test suggestions with AI
        tests = await ai_service.suggest_tests(
            issue_title=issue_data["title"],
            issue_body=issue_data.get("body", ""),
            plan=request.plan,
            file_tree=file_tree,
        )

        return TestSuggestResponse(
            issue_number=request.issue_number,
            test_framework=tests.get("test_framework", ""),
            test_cases=tests.get("test_cases", []),
            example_code=tests.get("example_code", ""),
        )

    except ValueError as e:
        raise ResourceNotFoundError(str(e))
    except AppException:
        raise
    except Exception as e:
        raise AppException(
            message=f"Failed to suggest tests: {str(e)}",
            status_code=500,
            error_code="TEST_SUGGESTION_ERROR",
        )
