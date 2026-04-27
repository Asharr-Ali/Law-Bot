"""
/api/upload-document  — PDF upload & text extraction.
"""

import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.core.config import Settings, get_settings
from app.core.dependencies import get_document_service
from app.models.schemas import UploadResponse
from app.services.document import DocumentService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["documents"])


@router.post("/upload-document", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    settings: Settings = Depends(get_settings),
    doc_service: DocumentService = Depends(get_document_service),
) -> UploadResponse:
    """Accept a PDF (≤ 10 MB) and return extracted plain text."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()

    if len(file_bytes) > settings.upload_max_bytes:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB).")

    try:
        text = doc_service.extract_text(file_bytes)
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("PDF extraction failed for '%s'", file.filename)
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {exc}") from exc

    preview = text[: settings.upload_doc_text_preview]

    return UploadResponse(
        success=True,
        extracted_text=preview,
        char_count=len(text),
        filename=file.filename,
    )