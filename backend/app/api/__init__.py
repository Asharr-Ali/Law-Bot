"""
Central router — import this and include it in the FastAPI app.
"""

from fastapi import APIRouter

from app.api.routes import analyze, documents, health, sections

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(analyze.router)
api_router.include_router(documents.router)
api_router.include_router(sections.router)