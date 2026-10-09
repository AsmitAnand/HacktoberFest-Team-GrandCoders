"""
Custom application exceptions and error models.
"""

from typing import Any, Optional


class AppException(Exception):
    """Base application exception with status code and error details."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_SERVER_ERROR",
        details: Optional[Any] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}


class GitHubAPIError(AppException):
    """Raised when GitHub API requests fail or are rate-limited."""

    def __init__(self, message: str, status_code: int = 502, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status_code,
            error_code="GITHUB_API_ERROR",
            details=details,
        )


class AIServiceError(AppException):
    """Raised when Gemma 4 / AI Studio generation fails."""

    def __init__(self, message: str, status_code: int = 503, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status_code,
            error_code="AI_SERVICE_UNAVAILABLE",
            details=details,
        )


class ResourceNotFoundError(AppException):
    """Raised when a requested repository, issue, or resource is not found."""

    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=404,
            error_code="RESOURCE_NOT_FOUND",
            details=details,
        )


class RateLimitError(AppException):
    """Raised when an external or internal rate limit is encountered."""

    def __init__(self, message: str, retry_after: int = 60):
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
            details={"retry_after_seconds": retry_after},
        )
