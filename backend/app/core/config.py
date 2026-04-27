"""
Application configuration — driven by environment variables.
Copy .env.example → .env and fill in values.
"""

from functools import lru_cache
from pathlib import Path
from pydantic import Field

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── App ──────────────────────────────────────────────────────────────────
    app_name: str = "LawBot API"
    app_version: str = "2.0.0"
    debug: bool = False

    # ── CORS ─────────────────────────────────────────────────────────────────
    allowed_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # ── Paths ─────────────────────────────────────────────────────────────────
    base_dir: Path = Path(__file__).resolve().parents[2]
    dataset_path: Path = base_dir / "ppc_dataset_final.json"
    chroma_db_path: str = "./chroma_db"
    chroma_collection: str = "ppc_laws"

    # ── Embedding model ───────────────────────────────────────────────────────
    embedding_model: str = "all-MiniLM-L6-v2"

    # ── LLM: Groq ────────────────────────────────────────────────────────────
    groq_api_key: str = Field(alias="GROQ_API_KEY")
    groq_model: str = "llama-3.3-70b-versatile"
    groq_base_url: str = "https://api.groq.com/openai/v1/chat/completions"
    groq_max_tokens: int = 1500
    groq_temperature: float = 0.3

    # ── LLM: Ollama (local fallback) ─────────────────────────────────────────
    ollama_base_url: str = "http://localhost:11434/api/generate"
    ollama_model: str = "llama3.2"
    ollama_timeout: int = 120

    # ── Search ────────────────────────────────────────────────────────────────
    search_top_k: int = 6
    search_index_batch_size: int = 100

    # ── Upload limits ─────────────────────────────────────────────────────────
    upload_max_bytes: int = 10 * 1024 * 1024  # 10 MB
    upload_doc_text_preview: int = 3_000       # chars returned to client
    upload_doc_text_for_prompt: int = 2_000    # chars injected into LLM prompt


@lru_cache
def get_settings() -> Settings:
    return Settings()