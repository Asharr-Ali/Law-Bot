"""
LLM service — provider chain: Groq → Ollama (local) → rule-based fallback.

Each provider is isolated behind a clean interface so adding new ones
(e.g. OpenAI, Anthropic) requires only a new _call_* function.
"""

import logging

import httpx

from app.core.config import Settings

logger = logging.getLogger(__name__)

# ── Prompt builder ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = (
    "You are LawBot, an expert Pakistani legal assistant specialising in the "
    "Pakistan Penal Code. Always cite specific PPC sections in English; "
    "do not generate Urdu text."
)

_RESPONSE_TEMPLATE = """\
## ⚖️ Case Analysis

**Applicable PPC Section(s):** [list section numbers and titles]

**Offence Identified:** [plain language explanation of what crime/offence this falls under]

## 📋 Legal Guidance

[Step-by-step numbered guidance: what the user should do next — FIR filing, evidence, court procedure, etc.]

## ⚠️ Punishment Under PPC

[Mention imprisonment range, fine, or other penalties from the relevant sections]

## 🔔 Important Disclaimer
This is preliminary legal information only. Please consult a qualified lawyer (وکیل) \
before taking any legal action. LawBot does not provide final legal verdicts.\
"""


def build_prompt(user_query: str, retrieved_sections: list[dict]) -> str:
    sections_text = "\n".join(
        f"---\n"
        f"PPC Section {s['section']} ({s['law_code']}) — {s['title']}\n"
        f"Category: {s['category']}\n"
        f"Law: {s['description']}"
        for s in retrieved_sections
    )

    return (
        "You are LawBot — a knowledgeable Pakistani legal assistant trained on the "
        "Pakistan Penal Code (PPC 1860).\n\n"
        "A user has submitted their legal case or FIR. Your job is to:\n"
        "1. Identify the most applicable PPC section(s) from the retrieved laws below\n"
        "2. Explain in simple language what offence has occurred\n"
        "3. Give clear, actionable step-by-step legal guidance\n"
        "4. Mention the punishment range if applicable\n"
        "5. End with a disclaimer to consult a lawyer\n\n"
        f"RETRIEVED PPC SECTIONS:\n{sections_text}\n\n"
        f"USER'S CASE / FIR DESCRIPTION:\n{user_query}\n\n"
        f"Respond using this structure:\n{_RESPONSE_TEMPLATE}"
    )


# ── Provider implementations ───────────────────────────────────────────────────

def _call_groq(prompt: str, settings: Settings) -> str:
    logger.info("Calling Groq API (model=%s)…", settings.groq_model)
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }
    body = {
        "model": settings.groq_model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": settings.groq_max_tokens,
        "temperature": settings.groq_temperature,
    }
    response = httpx.post(settings.groq_base_url, headers=headers, json=body, timeout=60)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


def _call_ollama(prompt: str, settings: Settings) -> str:
    logger.info("Calling Ollama (model=%s)…", settings.ollama_model)
    body = {
        "model": settings.ollama_model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": settings.groq_temperature,
            "num_predict": settings.groq_max_tokens,
        },
    }
    response = httpx.post(settings.ollama_base_url, json=body, timeout=settings.ollama_timeout)
    response.raise_for_status()
    return response.json()["response"]


def _rule_based_fallback() -> str:
    return (
        "## ⚖️ Case Analysis\n\n"
        "I've retrieved the most relevant PPC sections for your case (see below). "
        "However, a full AI-generated analysis requires a live LLM.\n\n"
        "**To enable AI analysis, set up one of:**\n"
        "- **Groq** (free tier): https://console.groq.com → set `GROQ_API_KEY` in `.env`\n"
        "- **Ollama** (local, free): https://ollama.com → `ollama pull llama3.2`\n\n"
        "## 🔔 Important Disclaimer\n"
        "Please consult a qualified lawyer (وکیل) before taking any legal action."
    )


# ── Public façade ──────────────────────────────────────────────────────────────

class LLMService:
    """
    Chains Groq → Ollama → rule-based fallback.
    Constructor receives Settings so the service is trivially testable/mockable.
    """

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def generate(self, prompt: str) -> str:
        """Return LLM-generated analysis for *prompt*."""
        # 1. Groq (requires API key)
        if self._settings.groq_api_key:
            try:
                return _call_groq(prompt, self._settings)
            except Exception as exc:
                logger.warning("Groq call failed (%s); trying Ollama…", exc)

        # 2. Ollama (local)
        try:
            return _call_ollama(prompt, self._settings)
        except Exception as exc:
            logger.warning("Ollama call failed (%s); using rule-based fallback.", exc)

        # 3. Rule-based
        return _rule_based_fallback()