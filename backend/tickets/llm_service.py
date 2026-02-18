import os
import json
from google import genai


VALID_CATEGORIES = {"billing", "technical", "account", "general"}
VALID_PRIORITIES = {"low", "medium", "high", "critical"}


def classify_ticket(description: str):
    api_key = os.getenv("LLM_API_KEY")

    if not api_key:
        print("LLM_API_KEY not found")
        return None, None

    try:
        client = genai.Client(api_key=api_key)

        prompt = f"""
You are a support ticket classifier.

Based on the description below, determine:
- category: billing, technical, account, or general
- priority: low, medium, high, or critical

Return ONLY valid JSON in this format:
{{
  "category": "...",
  "priority": "..."
}}

Description:
{description}
"""

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        text = response.text.strip()
        
        if "```" in text:
            parts = text.split("```")
            if len(parts) >= 2:
                text = parts[1]
            text = text.replace("json", "").strip()

        parsed = json.loads(text)

        category = parsed.get("category")
        priority = parsed.get("priority")

        # Validate output strictly
        if category not in VALID_CATEGORIES:
            print("Invalid category from LLM:", category)
            category = None

        if priority not in VALID_PRIORITIES:
            print("Invalid priority from LLM:", priority)
            priority = None

        return category, priority

    except Exception as e:
        print("========== LLM ERROR ==========")
        print(e)
        print("================================")
        return None, None
