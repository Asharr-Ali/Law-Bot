"""
Dependency injection — single source of truth for all shared services.

Use with FastAPI's Depends():

    from app.core.dependencies import get_vector_store, get_llm_service

    @router.post("/analyze")
    def analyze(vs: VectorStoreService = Depends(get_vector_store), ...):
        ...
"""

from functools import lru_cache

from app.core.config import Settings, get_settings
from app.services.document import DocumentService
from app.services.llm import LLMService
from app.services.vector_store import VectorStoreService


@lru_cache(maxsize=1)
def get_vector_store() -> VectorStoreService:
    return VectorStoreService(get_settings())


@lru_cache(maxsize=1)
def get_llm_service() -> LLMService:
    return LLMService(get_settings())


@lru_cache(maxsize=1)
def get_document_service() -> DocumentService:
    return DocumentService()