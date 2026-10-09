# 📖 Hacktoberfest Copilot — API Documentation

This document describes the REST API endpoints provided by the Hacktoberfest Copilot FastAPI backend.

The interactive Swagger UI is available at `http://localhost:8000/docs` (or `/redoc`).
A ready-to-import Postman collection is located at [`docs/Hacktoberfest_Copilot.postman_collection.json`](./Hacktoberfest_Copilot.postman_collection.json).

---

## 🌐 Base URL & Environments

| Environment | Base URL |
|---|---|
| **Local Development** | `http://localhost:8000` |
| **Production (Railway / Render)** | `https://hacktoberfest-copilot-api.up.railway.app` |

---

## 🔒 Authentication & Headers

- Standard endpoints accept `Content-Type: application/json`.
- Optional: `Authorization: Bearer <GITHUB_TOKEN>` can be passed to bypass GitHub anonymous rate limits (60 req/hr).
- CORS is enabled for frontend origins (default `http://localhost:3000`).

---

## 📑 Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API Welcome message & service links |
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/analyze-repo` | Analyze GitHub repository structure & extract beginner issues |
| `POST` | `/api/explain-issue` | Simplify an issue using Gemma 4 AI |
| `POST` | `/api/generate-plan` | Generate step-by-step contribution implementation plan |
| `POST` | `/api/suggest-tests` | Recommend test framework, test cases, and code snippet |
| `POST` | `/api/generate-pr` | Generate professional PR title and description |

---

## 1. Health Check
`GET /api/health`

Verifies that the backend service is operational.

### Response `200 OK`
```json
{
  "status": "healthy",
  "service": "hacktoberfest-copilot-api",
  "version": "1.0.0"
}
```

---

## 2. Analyze Repository
`POST /api/analyze-repo`

Fetches repository metadata, file tree, detects tech stack, and extracts issues labeled `good first issue`, `help wanted`, `beginner`, etc.

### Request Body
```json
{
  "repo_url": "https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders"
}
```

### Response `200 OK`
```json
{
  "repo": {
    "name": "HacktoberFest-Team-GrandCoders",
    "full_name": "AsmitAnand/HacktoberFest-Team-GrandCoders",
    "description": "AI-Powered Open-Source Contribution Assistant",
    "stars": 1,
    "forks": 0,
    "open_issues_count": 8,
    "language": "JavaScript",
    "topics": ["hacktoberfest", "nextjs", "fastapi"]
  },
  "file_tree": [
    { "path": "frontend/src/app/page.js", "type": "blob", "size": 4200 },
    { "path": "backend/app/main.py", "type": "blob", "size": 3100 }
  ],
  "readme_summary": "Hacktoberfest Copilot is an AI assistant designed to guide beginners from finding an issue to submitting a PR.",
  "contributing_summary": "Fork repository, create topic branch, submit draft PR early.",
  "tech_stack": ["Next.js", "FastAPI", "Python", "React", "Docker"],
  "beginner_issues": [
    {
      "number": 10,
      "title": "repo: Add .gitignore for Next.js + Python",
      "labels": ["good first issue", "chore"],
      "comments_count": 0,
      "created_at": "2026-10-09T08:00:00Z",
      "html_url": "https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders/issues/10"
    }
  ],
  "all_open_issues": [...]
}
```

---

## 3. Explain Issue
`POST /api/explain-issue`

Uses Google AI Studio (Gemma 4) to translate technical issue descriptions into plain language, outline required skills, explain jargon, and suggest relevant files.

### Request Body
```json
{
  "repo_url": "https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders",
  "issue_number": 10
}
```

### Response `200 OK`
```json
{
  "issue": {
    "number": 10,
    "title": "repo: Add .gitignore for Next.js + Python",
    "html_url": "https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders/issues/10"
  },
  "simplified_explanation": "This issue asks to configure Git to ignore temporary files from Node.js (like node_modules) and Python (like __pycache__ and venv).",
  "difficulty": "Beginner",
  "required_skills": ["Git", "File Systems"],
  "relevant_files": [".gitignore"],
  "jargon_explained": {
    "node_modules": "Directory containing installed NPM packages.",
    "venv": "Isolated Python virtual environment folder."
  }
}
```

---

## 4. Generate Implementation Plan
`POST /api/generate-plan`

Generates an actionable step-by-step roadmap for solving the selected issue.

### Request Body
```json
{
  "repo_url": "https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders",
  "issue_number": 10
}
```

### Response `200 OK`
```json
{
  "issue_number": 10,
  "approach": "Create a unified .gitignore at the repository root containing rules for Node.js, Python, and IDE metadata.",
  "steps": [
    "Step 1: Check existing .gitignore in root directory.",
    "Step 2: Add standard Python patterns (__pycache__, *.pyc, venv/).",
    "Step 3: Add standard Node.js patterns (node_modules/, .next/, out/).",
    "Step 4: Verify with git status that ignored files are untracked."
  ],
  "files_to_modify": [".gitignore"],
  "testing_approach": "Run git status to verify build artifacts are ignored.",
  "pr_checklist": [
    "Branch created with feat/gitignore-rules",
    "Commit message follows conventional commits",
    "Verified untracked status of cache files"
  ]
}
```

---

## 5. Suggest Tests
`POST /api/suggest-tests`

Recommends appropriate testing frameworks, test cases, and code snippets for proposed changes.

### Request Body
```json
{
  "repo_url": "https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders",
  "issue_number": 13,
  "plan": "Add unit tests for health check and API endpoints"
}
```

### Response `200 OK`
```json
{
  "issue_number": 13,
  "test_framework": "pytest with FastAPI TestClient",
  "test_cases": [
    "Test GET /api/health returns 200 and healthy status",
    "Test invalid payload returns 422 Unprocessable Entity",
    "Test unknown route returns 404"
  ],
  "example_code": "from fastapi.testclient import TestClient\nfrom app.main import app\n\nclient = TestClient(app)\n\ndef test_health():\n    response = client.get('/api/health')\n    assert response.status_code == 200\n"
}
```

---

## 6. Generate Pull Request Description
`POST /api/generate-pr`

Drafts a clean, professional Pull Request title and description ready to paste into GitHub.

### Request Body
```json
{
  "repo_url": "https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders",
  "issue_number": 13,
  "changes_summary": "Added test suggestion endpoint with pytest suite"
}
```

### Response `200 OK`
```json
{
  "issue_number": 13,
  "title": "feat(api): Add test suggestion endpoint with automated test suite (#13)",
  "body": "## Summary of Changes\nCloses #13\n\n### 🚀 What's Changed\n- Added POST /api/suggest-tests endpoint\n- Integrated Gemma 4 prompt for framework and code recommendation\n\n### 🧪 Testing\n- Tested with pytest backend/tests\n"
}
```

---

## ⚠️ Error Responses

All endpoints return a standardized error envelope:

```json
{
  "error": "RESOURCE_NOT_FOUND",
  "message": "Repository or issue does not exist.",
  "details": {},
  "path": "/api/explain-issue"
}
```

### Common Error Codes
| HTTP Status | Error Code | Description |
|---|---|---|
| `400` | `INVALID_REQUEST` | Missing or malformed parameters |
| `404` | `RESOURCE_NOT_FOUND` | Repository or issue number not found on GitHub |
| `422` | `UNPROCESSABLE_ENTITY` | Pydantic payload validation failure |
| `429` | `RATE_LIMIT_EXCEEDED` | GitHub or Gemini API rate limit reached |
| `502` | `GITHUB_API_ERROR` | Upstream GitHub REST API communication failure |
| `503` | `AI_SERVICE_UNAVAILABLE` | Gemma 4 AI generation service timeout or failure |
