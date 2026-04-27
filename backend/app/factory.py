"""
Application factory — keeps main.py minimal and fully testable.
"""

import asyncio
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import get_settings
from app.core.dependencies import get_vector_store

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ── Middleware ─────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routes ─────────────────────────────────────────────────────────────────
    app.include_router(api_router)

    # ── Startup: pre-warm models in a background thread ───────────────────────
    @app.on_event("startup")
    async def _startup() -> None:
        logger.info("LawBot starting — pre-warming models in background…")
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, get_vector_store().warm_up)

    return app