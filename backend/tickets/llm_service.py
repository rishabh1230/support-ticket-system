import os
import json
from google import genai


def classify_ticket(description: str):
    api_key = os.getenv("LLM_API_KEY")

    if not api_key:
        print("LLM_API_KEY not found")
        return None, None

    try:
        # Create client properly (new SDK style)
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

        # Remove markdown code blocks if present
        if "```" in text:
            text = text.split("```")[1]
            text = text.replace("json", "").strip()

        parsed = json.loads(text)

        return parsed.get("category"), parsed.get("priority")

    except Exception as e:
        print("========== LLM ERROR ==========")
        print(e)
        print("================================")
        return None, None
