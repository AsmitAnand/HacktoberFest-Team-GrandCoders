"""
AI Service — Google AI Studio (Gemma 4) Integration

Handles all AI-powered features:
- Issue explanation
- Implementation plan generation
- Test suggestions
- PR description generation
- Code explanation
"""

import os
import asyncio
import google.generativeai as genai
from app.config import settings


class AIService:
    """Service for AI-powered features using Gemma 4 via Google AI Studio."""

    def __init__(self):
        self.api_key = settings.google_api_key
        self.model_name = settings.gemma_model
        self._model = None
        self._available_models = None

    def _get_available_models(self, api_key: str) -> list[str]:
        """Discover models that support generateContent on this API key."""
        if self._available_models:
            return self._available_models

        discovered = []
        try:
            genai.configure(api_key=api_key)
            models = genai.list_models()
            for m in models:
                methods = getattr(m, "supported_generation_methods", []) or []
                if "generateContent" in methods:
                    name = m.name
                    discovered.append(name)
                    clean = name.replace("models/", "")
                    if clean not in discovered:
                        discovered.append(clean)
        except Exception:
            pass

        def sort_priority(name: str) -> int:
            n = name.lower()
            if "1.5-flash" in n:
                return 1
            if "2.0-flash" in n:
                return 2
            if "gemini-pro" in n or "gemini-1.0-pro" in n:
                return 3
            if "gemini" in n:
                return 4
            return 10

        discovered.sort(key=sort_priority)
        if discovered:
            self._available_models = discovered
            return discovered

        return [
            "gemini-1.5-flash",
            "models/gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-pro",
            "models/gemini-pro",
            "gemini-1.0-pro",
            "models/gemini-1.0-pro",
            "gemini-1.5-pro",
            "models/gemini-1.5-pro",
        ]

    def _get_model(self, model_name: str | None = None):
        """Initialize the GenerativeModel instance."""
        target_model = model_name or self.model_name
        api_key = os.getenv("GOOGLE_API_KEY") or self.api_key
        if not api_key:
            raise ValueError(
                "GOOGLE_API_KEY environment variable is not set. "
                "Get your key at https://aistudio.google.com"
            )
        genai.configure(api_key=api_key)
        return genai.GenerativeModel(target_model)

    async def _generate(self, prompt: str) -> str:
        """Generate a response from AI asynchronously in a worker thread, trying primary model and standard fallbacks."""
        api_key = os.getenv("GOOGLE_API_KEY") or self.api_key
        if not api_key:
            return "AI service unavailable: GOOGLE_API_KEY environment variable is not set. Please configure it in your Railway/Vercel dashboard."

        models_to_try = []
        if self.model_name and self.model_name not in ["gemma-4", ""]:
            models_to_try.append(self.model_name)

        available = await asyncio.to_thread(self._get_available_models, api_key)
        for m in available:
            if m not in models_to_try:
                models_to_try.append(m)

        last_error = None
        for model_name in models_to_try:
            try:
                model = self._get_model(model_name)
                response = await asyncio.to_thread(model.generate_content, prompt)
                if response and hasattr(response, "text") and response.text:
                    return response.text
            except Exception as e:
                last_error = e
                continue

        return f"AI service temporarily unavailable: {str(last_error)}"

    def _build_context(
        self,
        readme: str = "",
        file_tree: list[dict] | None = None,
        contributing: str = "",
    ) -> str:
        """Build repository context string for prompts."""
        context_parts = []

        if readme:
            # Truncate README to keep prompt manageable
            truncated = readme[:3000]
            context_parts.append(f"## Repository README\n{truncated}")

        if file_tree:
            tree_str = "\n".join(
                f"{'📁' if item['type'] == 'dir' else '📄'} {item['path']}"
                for item in file_tree[:100]
            )
            context_parts.append(f"## File Structure\n{tree_str}")

        if contributing:
            truncated = contributing[:1500]
            context_parts.append(f"## Contributing Guidelines\n{truncated}")

        return "\n\n".join(context_parts)

    async def explain_issue(
        self,
        issue_title: str,
        issue_body: str,
        issue_labels: list[str],
        readme: str = "",
        file_tree: list[dict] | None = None,
    ) -> dict:
        """
        Explain a GitHub issue in beginner-friendly language.

        Returns:
            dict with: simplified_explanation, difficulty, required_skills,
                       relevant_files, jargon_explained
        """
        context = self._build_context(readme=readme, file_tree=file_tree)

        prompt = f"""You are an expert open-source mentor helping first-time contributors understand GitHub issues.

{context}

## Issue to Explain
**Title:** {issue_title}
**Labels:** {', '.join(issue_labels) if issue_labels else 'None'}
**Description:**
{issue_body or 'No description provided.'}

## Your Task
Analyze this issue and provide the following in a structured format:

1. **SIMPLIFIED_EXPLANATION:** Rewrite the issue in simple, beginner-friendly language. Explain what needs to be done as if talking to someone who has never contributed to open source before. (2-4 paragraphs)

2. **DIFFICULTY:** Rate as exactly one of: Beginner, Intermediate, Advanced

3. **REQUIRED_SKILLS:** List the specific technical skills needed (e.g., "JavaScript", "React hooks", "CSS Flexbox", "Python unittest"). List 2-6 skills.

4. **RELEVANT_FILES:** Based on the file structure, list the files that likely need to be modified. List file paths. If unsure, suggest where to look.

5. **JARGON_EXPLAINED:** Identify any technical jargon in the issue and explain each term simply. Format as "term: explanation" on separate lines.

Format your response exactly like this:
SIMPLIFIED_EXPLANATION:
<your explanation>

DIFFICULTY: <Beginner|Intermediate|Advanced>

REQUIRED_SKILLS:
- skill1
- skill2

RELEVANT_FILES:
- path/to/file1
- path/to/file2

JARGON_EXPLAINED:
- term1: explanation1
- term2: explanation2"""

        response = await self._generate(prompt)
        return self._parse_explain_response(response)

    def _parse_explain_response(self, response: str) -> dict:
        """Parse the AI response for issue explanation."""
        result = {
            "simplified_explanation": "",
            "difficulty": "Beginner",
            "required_skills": [],
            "relevant_files": [],
            "jargon_explained": {},
        }

        sections = response.split("\n")
        current_section = ""
        current_content = []

        for line in sections:
            line_stripped = line.strip()
            if line_stripped.startswith("SIMPLIFIED_EXPLANATION:"):
                if current_section:
                    result = self._save_section(result, current_section, current_content)
                current_section = "simplified_explanation"
                remainder = line_stripped.replace("SIMPLIFIED_EXPLANATION:", "").strip()
                current_content = [remainder] if remainder else []
            elif line_stripped.startswith("DIFFICULTY:"):
                if current_section:
                    result = self._save_section(result, current_section, current_content)
                current_section = "difficulty"
                remainder = line_stripped.replace("DIFFICULTY:", "").strip()
                current_content = [remainder] if remainder else []
            elif line_stripped.startswith("REQUIRED_SKILLS:"):
                if current_section:
                    result = self._save_section(result, current_section, current_content)
                current_section = "required_skills"
                current_content = []
            elif line_stripped.startswith("RELEVANT_FILES:"):
                if current_section:
                    result = self._save_section(result, current_section, current_content)
                current_section = "relevant_files"
                current_content = []
            elif line_stripped.startswith("JARGON_EXPLAINED:"):
                if current_section:
                    result = self._save_section(result, current_section, current_content)
                current_section = "jargon_explained"
                current_content = []
            else:
                current_content.append(line)

        if current_section:
            result = self._save_section(result, current_section, current_content)

        if not result["simplified_explanation"] and response:
            result["simplified_explanation"] = response.strip()

        return result

    def _save_section(self, result: dict, section: str, content: list[str]) -> dict:
        """Save parsed section content to result dict."""
        if section == "simplified_explanation":
            result["simplified_explanation"] = "\n".join(content).strip()
        elif section == "difficulty":
            difficulty = " ".join(content).strip()
            if difficulty in ("Beginner", "Intermediate", "Advanced"):
                result["difficulty"] = difficulty
            else:
                result["difficulty"] = "Beginner"
        elif section in ("required_skills", "relevant_files"):
            items = []
            for line in content:
                line = line.strip().lstrip("- •*").strip()
                if line:
                    items.append(line)
            result[section] = items
        elif section == "jargon_explained":
            jargon = {}
            for line in content:
                line = line.strip().lstrip("- •*").strip()
                if ":" in line:
                    term, explanation = line.split(":", 1)
                    jargon[term.strip()] = explanation.strip()
            result["jargon_explained"] = jargon
        return result

    async def generate_plan(
        self,
        issue_title: str,
        issue_body: str,
        readme: str = "",
        file_tree: list[dict] | None = None,
        contributing: str = "",
    ) -> dict:
        """Generate a step-by-step implementation plan for an issue."""
        context = self._build_context(
            readme=readme, file_tree=file_tree, contributing=contributing
        )

        prompt = f"""You are an expert open-source mentor. A beginner contributor needs a step-by-step implementation plan.

{context}

## Issue
**Title:** {issue_title}
**Description:**
{issue_body or 'No description provided.'}

## Your Task
Create a detailed, beginner-friendly implementation plan. Include:

1. **APPROACH:** A brief overview of the approach (2-3 sentences)

2. **STEPS:** Numbered step-by-step instructions. Each step should be small and actionable. Include code hints where helpful. Start from forking/cloning.

3. **FILES_TO_MODIFY:** List the specific files that need to be created or modified.

4. **TESTING_APPROACH:** How to test the changes locally.

5. **PR_CHECKLIST:** What to verify before submitting the PR.

Format your response exactly like this:
APPROACH:
<your approach>

STEPS:
1. Step one
2. Step two
...

FILES_TO_MODIFY:
- path/to/file1
- path/to/file2

TESTING_APPROACH:
<how to test>

PR_CHECKLIST:
- [ ] Checklist item 1
- [ ] Checklist item 2"""

        response = await self._generate(prompt)
        return self._parse_plan_response(response)

    def _parse_plan_response(self, response: str) -> dict:
        """Parse the AI response for implementation plan."""
        result = {
            "steps": [],
            "files_to_modify": [],
            "approach": "",
            "testing_approach": "",
            "pr_checklist": [],
        }

        sections = response.split("\n")
        current_section = ""
        current_content = []

        for line in sections:
            line_stripped = line.strip()
            upper = line_stripped.upper()

            if upper.startswith("APPROACH:"):
                if current_section:
                    result = self._save_plan_section(result, current_section, current_content)
                current_section = "approach"
                remainder = line_stripped[len("APPROACH:"):].strip()
                current_content = [remainder] if remainder else []
            elif upper.startswith("STEPS:"):
                if current_section:
                    result = self._save_plan_section(result, current_section, current_content)
                current_section = "steps"
                current_content = []
            elif upper.startswith("FILES_TO_MODIFY:"):
                if current_section:
                    result = self._save_plan_section(result, current_section, current_content)
                current_section = "files_to_modify"
                current_content = []
            elif upper.startswith("TESTING_APPROACH:"):
                if current_section:
                    result = self._save_plan_section(result, current_section, current_content)
                current_section = "testing_approach"
                current_content = []
            elif upper.startswith("PR_CHECKLIST:"):
                if current_section:
                    result = self._save_plan_section(result, current_section, current_content)
                current_section = "pr_checklist"
                current_content = []
            else:
                current_content.append(line)

        if current_section:
            result = self._save_plan_section(result, current_section, current_content)

        if not result["approach"] and response:
            result["approach"] = response.strip()

        return result

    def _save_plan_section(self, result: dict, section: str, content: list[str]) -> dict:
        """Save parsed plan section content to result dict."""
        if section in ("approach", "testing_approach"):
            result[section] = "\n".join(content).strip()
        elif section in ("steps", "pr_checklist"):
            items = []
            for line in content:
                line = line.strip().lstrip("- •*").strip()
                # Remove leading numbers like "1. " or "1) "
                if line and line[0].isdigit():
                    parts = line.split(".", 1) if "." in line[:4] else line.split(")", 1)
                    if len(parts) > 1:
                        line = parts[1].strip()
                # Remove checkbox markers
                line = line.replace("[ ]", "").replace("[x]", "").strip()
                if line:
                    items.append(line)
            result[section] = items
        elif section == "files_to_modify":
            items = []
            for line in content:
                line = line.strip().lstrip("- •*").strip()
                if line:
                    items.append(line)
            result[section] = items
        return result

    async def suggest_tests(
        self,
        issue_title: str,
        issue_body: str,
        plan: str = "",
        file_tree: list[dict] | None = None,
    ) -> dict:
        """Suggest tests for a proposed change."""
        context = self._build_context(file_tree=file_tree)
        plan_section = f"## Implementation Plan\n{plan}" if plan else ""

        prompt = f"""You are an expert software testing mentor helping a beginner write tests.

{context}

## Issue
**Title:** {issue_title}
**Description:**
{issue_body or 'No description provided.'}

{plan_section}

## Your Task
Suggest appropriate tests for this change. Include:

1. **TEST_FRAMEWORK:** Recommend a testing framework based on the project's tech stack.

2. **TEST_CASES:** List specific test cases to write (both unit and integration tests). Each should be a clear, one-line description.

3. **EXAMPLE_CODE:** Write example test code for the most important test case.

Format your response exactly like this:
TEST_FRAMEWORK: <framework name>

TEST_CASES:
- Test case 1 description
- Test case 2 description

EXAMPLE_CODE:
```
<example test code>
```"""

        response = await self._generate(prompt)
        return self._parse_test_response(response)

    def _parse_test_response(self, response: str) -> dict:
        """Parse the AI response for test suggestions."""
        result = {
            "test_framework": "",
            "test_cases": [],
            "example_code": "",
        }

        lines = response.split("\n")
        current_section = ""
        current_content = []

        for line in lines:
            line_stripped = line.strip()
            upper = line_stripped.upper()

            if upper.startswith("TEST_FRAMEWORK:"):
                if current_section:
                    self._save_test_section(result, current_section, current_content)
                current_section = "test_framework"
                remainder = line_stripped[len("TEST_FRAMEWORK:"):].strip()
                current_content = [remainder] if remainder else []
            elif upper.startswith("TEST_CASES:"):
                if current_section:
                    self._save_test_section(result, current_section, current_content)
                current_section = "test_cases"
                current_content = []
            elif upper.startswith("EXAMPLE_CODE:"):
                if current_section:
                    self._save_test_section(result, current_section, current_content)
                current_section = "example_code"
                current_content = []
            else:
                current_content.append(line)

        if current_section:
            self._save_test_section(result, current_section, current_content)

        return result

    def _save_test_section(self, result: dict, section: str, content: list[str]) -> dict:
        """Save parsed test section content to result dict."""
        if section == "test_framework":
            result["test_framework"] = " ".join(content).strip()
        elif section == "test_cases":
            items = []
            for line in content:
                line = line.strip().lstrip("- •*").strip()
                if line:
                    items.append(line)
            result["test_cases"] = items
        elif section == "example_code":
            code = "\n".join(content).strip()
            # Remove code fence markers
            code = code.removeprefix("```").removesuffix("```").strip()
            # Remove language identifier on first line if present
            if code and not code[0].isspace() and "\n" in code:
                first_line = code.split("\n")[0]
                if len(first_line) < 20 and first_line.isalpha():
                    code = "\n".join(code.split("\n")[1:])
            result["example_code"] = code
        return result

    async def generate_pr_description(
        self,
        issue_title: str,
        issue_body: str,
        issue_number: int,
        changes_summary: str = "",
        contributing: str = "",
    ) -> dict:
        """Generate a pull request description."""
        changes_section = f"## Changes Summary\n{changes_summary}" if changes_summary else ""
        contributing_section = f"## Contributing Guidelines\n{contributing[:1000]}" if contributing else ""

        prompt = f"""You are an expert open-source contributor. Generate a professional PR description.

## Issue Being Addressed
**Issue #{issue_number}: {issue_title}**
{issue_body or 'No description provided.'}

{changes_section}

{contributing_section}

## Your Task
Generate a pull request with:

1. **PR_TITLE:** A clear, concise PR title following conventional commit format.

2. **PR_BODY:** A well-structured PR description including:
   - What this PR does
   - Related issue reference (Closes #{issue_number})
   - Changes made (bullet points)
   - How to test
   - Checklist

Format your response exactly like this:
PR_TITLE: <title>

PR_BODY:
<full PR body in markdown>"""

        response = await self._generate(prompt)
        return self._parse_pr_response(response, issue_number)

    def _parse_pr_response(self, response: str, issue_number: int) -> dict:
        """Parse the AI response for PR description."""
        result = {
            "title": "",
            "body": "",
        }

        lines = response.split("\n")
        in_body = False
        body_lines = []

        for line in lines:
            line_stripped = line.strip()
            if line_stripped.upper().startswith("PR_TITLE:"):
                result["title"] = line_stripped[len("PR_TITLE:"):].strip()
            elif line_stripped.upper().startswith("PR_BODY:"):
                in_body = True
            elif in_body:
                body_lines.append(line)

        result["body"] = "\n".join(body_lines).strip()

        # Ensure the issue reference is present
        if f"#{issue_number}" not in result["body"]:
            result["body"] += f"\n\nCloses #{issue_number}"

        return result


# Singleton instance
ai_service = AIService()
