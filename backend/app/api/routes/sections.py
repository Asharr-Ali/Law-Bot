"""
/api/sections  — browse, keyword-search, and categorise PPC sections.
"""

import json
import logging
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, Depends, Query

from app.core.config import Settings, get_settings
from app.models.schemas import CategoriesResponse, CategoryStat, KeywordSearchResponse, SectionsResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["sections"])


# Cache the full dataset in memory after the first read.
@lru_cache(maxsize=1)
def _load_dataset(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _dataset(settings: Settings) -> list[dict]:
    return _load_dataset(str(settings.dataset_path))


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.get("/sections", response_model=SectionsResponse)
def get_all_sections(settings: Settings = Depends(get_settings)) -> SectionsResponse:
    """Return every PPC section (useful for a browse / index view)."""
    laws = _dataset(settings)
    return SectionsResponse(sections=laws, total=len(laws))


@router.get("/sections/search", response_model=KeywordSearchResponse)
def keyword_search(
    q: str = Query(..., min_length=1, description="Keyword to search for."),
    limit: int = Query(10, ge=1, le=100),
    settings: Settings = Depends(get_settings),
) -> KeywordSearchResponse:
    """Simple full-text keyword search over title, description, and keywords."""
    laws = _dataset(settings)
    q_lower = q.lower()

    results = []
    for law in laws:
        haystack = (
            f"{law['title']} {law['description']} "
            f"{' '.join(law.get('keywords', []))}"
        ).lower()
        if q_lower in haystack:
            results.append(law)
        if len(results) >= limit:
            break

    return KeywordSearchResponse(results=results, count=len(results))


@router.get("/categories", response_model=CategoriesResponse)
def get_categories(settings: Settings = Depends(get_settings)) -> CategoriesResponse:
    """Return all PPC categories sorted by section count (descending)."""
    laws = _dataset(settings)

    counts: dict[str, int] = {}
    for law in laws:
        counts[law["category"]] = counts.get(law["category"], 0) + 1

    categories = [
        CategoryStat(name=name, count=count)
        for name, count in sorted(counts.items(), key=lambda x: -x[1])
    ]
    return CategoriesResponse(categories=categories)