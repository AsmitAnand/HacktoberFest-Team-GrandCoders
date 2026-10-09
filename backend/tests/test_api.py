"""
Unit and integration tests for Hacktoberfest Copilot FastAPI backend.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    """Verify that the health check endpoint returns 200 and healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "healthy"
    assert data.get("service") == "hacktoberfest-copilot-api"
    assert "version" in data


def test_root_endpoint():
    """Verify root endpoint returns welcome banner and documentation links."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "🎃 Hacktoberfest Copilot API" in data.get("message", "")
    assert "/docs" in data.get("docs", "")
    assert "/api/health" in data.get("health", "")


def test_not_found_endpoint():
    """Verify 404 response for unknown routes."""
    response = client.get("/api/unknown-route-12345")
    assert response.status_code == 404


def test_analyze_repo_invalid_payload():
    """Verify 422 Unprocessable Entity when request body is missing required fields."""
    response = client.post("/api/analyze-repo", json={})
    assert response.status_code == 422
