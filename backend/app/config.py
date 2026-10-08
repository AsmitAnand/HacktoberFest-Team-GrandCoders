"""
Application configuration loaded from environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings from environment variables."""

    # GitHub API
    github_token: str = os.getenv("GITHUB_TOKEN", "")
    github_api_base: str = "https://api.github.com"

    # Google AI Studio (Gemma 4)
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    gemma_model: str = os.getenv("GEMMA_MODEL", "gemma-4")

    # CORS
    cors_origins: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000"
    ).split(",")

    # App
    app_env: str = os.getenv("APP_ENV", "development")
    cache_ttl_seconds: int = int(os.getenv("CACHE_TTL_SECONDS", "3600"))


settings = Settings()
