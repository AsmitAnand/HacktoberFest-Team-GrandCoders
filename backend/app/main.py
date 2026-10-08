"""
Hacktoberfest Copilot — FastAPI Application Entry Point

This module creates and configures the FastAPI application with:
- CORS middleware for frontend communication
- API routers for all endpoints
- Health check endpoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import repo, issues, plan, pr, tests

# ─── App Setup ───────────────────────────────────────────────────────

app = FastAPI(
    title="Hacktoberfest Copilot API",
    description=(
        "AI-powered assistant that helps beginners navigate "
        "the open-source contribution process. Powered by Gemma 4."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS Middleware ─────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ───────────────────────────────────────────────

app.include_router(repo.router, prefix="/api", tags=["Repository"])
app.include_router(issues.router, prefix="/api", tags=["Issues"])
app.include_router(plan.router, prefix="/api", tags=["Plan"])
app.include_router(pr.router, prefix="/api", tags=["Pull Request"])
app.include_router(tests.router, prefix="/api", tags=["Tests"])


# ─── Health Check ────────────────────────────────────────────────────

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify the API is running."""
    return {
        "status": "healthy",
        "service": "hacktoberfest-copilot-api",
        "version": "1.0.0",
    }


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "🎃 Hacktoberfest Copilot API",
        "docs": "/docs",
        "health": "/api/health",
    }
