"""
Unit and integration tests for Hacktoberfest Copilot FastAPI backend.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    """Verify that the health check endpoint returns 200, healthy status, uptime, and cache stats."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "healthy"
    assert data.get("service") == "hacktoberfest-copilot-api"
    assert "version" in data
    assert "uptime_seconds" in data
    assert "cache" in data
    assert "active_entries" in data["cache"]


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


def test_suggest_tests_invalid_payload():
    """Verify 422 Unprocessable Entity when suggest-tests payload is invalid."""
    response = client.post("/api/suggest-tests", json={})
    assert response.status_code == 422


def test_generate_pr_invalid_payload():
    """Verify 422 Unprocessable Entity when generate-pr payload is invalid."""
    response = client.post("/api/generate-pr", json={})
    assert response.status_code == 422


def test_suggest_tests_invalid_url():
    """Verify error status when repository URL is malformed."""
    response = client.post(
        "/api/suggest-tests",
        json={"repo_url": "invalid-url", "issue_number": 1, "plan": "test plan"},
    )
    assert response.status_code in [400, 404, 500, 502]


def test_generate_pr_invalid_url():
    """Verify error status when repository URL is malformed."""
    response = client.post(
        "/api/generate-pr",
        json={"repo_url": "invalid-url", "issue_number": 1, "changes_summary": "test"},
    )
    assert response.status_code in [400, 404, 500, 502]


def test_explain_issue_invalid_payload():
    """Verify 422 Unprocessable Entity when explain-issue payload is invalid."""
    response = client.post("/api/explain-issue", json={})
    assert response.status_code == 422


def test_explain_issue_invalid_url():
    """Verify error status when explain-issue URL is malformed."""
    response = client.post(
        "/api/explain-issue",
        json={"repo_url": "invalid-url", "issue_number": 1},
    )
    assert response.status_code in [400, 404, 500, 502]


def test_generate_plan_invalid_payload():
    """Verify 422 Unprocessable Entity when generate-plan payload is invalid."""
    response = client.post("/api/generate-plan", json={})
    assert response.status_code == 422


def test_generate_plan_invalid_url():
    """Verify error status when generate-plan URL is malformed."""
    response = client.post(
        "/api/generate-plan",
        json={"repo_url": "invalid-url", "issue_number": 1},
    )
    assert response.status_code in [400, 404, 500, 502]


def test_ttl_cache_lifecycle():
    """Verify SimpleTTLCache set, get, expiration, and clear operations."""
    import time
    from app.services.github_client import SimpleTTLCache

    cache = SimpleTTLCache(ttl_seconds=1)
    cache.set("key1", "value1")
    assert cache.get("key1") == "value1"
    assert cache.size() == 1

    # Test custom ttl expiration
    cache.set("short", "expire_fast", ttl=0)
    time.sleep(0.01)
    assert cache.get("short") is None

    cache.clear()
    assert cache.size() == 0
    assert cache.get("key1") is None


def test_ai_service_threadpool_execution(monkeypatch):
    """Ensure ai_service._generate delegates content generation without blocking the event loop."""
    import asyncio
    from unittest.mock import MagicMock
    from app.services.ai_service import ai_service

    mock_model = MagicMock()
    mock_model.generate_content.return_value = MagicMock(text="Mocked AI response")
    monkeypatch.setattr(ai_service, "_get_model", lambda: mock_model)

    res = asyncio.run(ai_service._generate("test prompt"))
    assert res == "Mocked AI response"
    mock_model.generate_content.assert_called_once_with("test prompt")

