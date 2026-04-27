"""
/api/analyze  — semantic search + LLM case analysis.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_llm_service, get_vector_store
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.llm import LLMService, build_prompt
from app.services.vector_store import VectorStoreService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_case(
    req: AnalyzeRequest,
    vector_store: VectorStoreService = Depends(get_vector_store),
    llm: LLMService = Depends(get_llm_service),
) -> AnalyzeResponse:
    """
    Full pipeline:
      1. Combine query + (optional) extracted doc text for semantic search.
      2. Retrieve the top-k most relevant PPC sections.
      3. Build an LLM prompt and generate the analysis.
    """
    if not req.query and not req.extracted_doc_text:
        raise HTTPException(status_code=400, detail="Provide a query or document text.")

    # ── 1. Search ──────────────────────────────────────────────────────────────
    search_input = req.query
    if req.extracted_doc_text:
        search_input = f"{req.query} {req.extracted_doc_text[:1_000]}"

    try:
        sections = vector_store.semantic_search(search_input)
    except Exception as exc:
        logger.exception("Semantic search failed")
        raise HTTPException(status_code=500, detail=f"Search failed: {exc}") from exc

    # ── 2. Build prompt ────────────────────────────────────────────────────────
    full_query = req.query
    if req.extracted_doc_text:
        full_query += f"\n\n[Extracted from uploaded document]:\n{req.extracted_doc_text[:2_000]}"

    prompt = build_prompt(full_query, sections)

    # ── 3. Generate ────────────────────────────────────────────────────────────
    analysis = llm.generate(prompt)

    return AnalyzeResponse(
        success=True,
        analysis=analysis,
        retrieved_sections=sections,
        query_used=req.query[:200],
    )