"""
Pydantic models for request bodies and API responses.
"""

from typing import Optional
from pydantic import BaseModel, Field


# ── Request bodies ────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=4_000, description="User's case description or question.")
    extracted_doc_text: Optional[str] = Field(None, max_length=10_000, description="Text pre-extracted from an uploaded PDF.")


# ── Shared sub-models ─────────────────────────────────────────────────────────

class PPCSection(BaseModel):
    section: str
    title: str
    category: str
    law_code: str
    description: str
    relevance: Optional[float] = Field(None, description="Cosine similarity score (0–100).")


class CategoryStat(BaseModel):
    name: str
    count: int


# ── Response models ───────────────────────────────────────────────────────────

class AnalyzeResponse(BaseModel):
    success: bool
    analysis: str
    retrieved_sections: list[PPCSection]
    query_used: str


class UploadResponse(BaseModel):
    success: bool
    extracted_text: str
    char_count: int
    filename: str


class SectionsResponse(BaseModel):
    sections: list[dict]
    total: int


class KeywordSearchResponse(BaseModel):
    results: list[dict]
    count: int


class CategoriesResponse(BaseModel):
    categories: list[CategoryStat]


class HealthResponse(BaseModel):
    status: str


class RootResponse(BaseModel):
    status: str
    version: str