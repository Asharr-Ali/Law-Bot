"""
Document service — PDF text extraction via PyMuPDF (fitz).
"""

import logging
import os
import tempfile

logger = logging.getLogger(__name__)


class DocumentService:
    """Extracts plain text from PDF byte payloads."""

    @staticmethod
    def extract_text(file_bytes: bytes) -> str:
        """
        Write *file_bytes* to a temp file, extract all text via PyMuPDF,
        then clean up.  Raises RuntimeError if extraction yields nothing.
        """
        import fitz  # PyMuPDF — imported lazily so startup stays fast

        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            doc = fitz.open(tmp_path)
            text = "".join(page.get_text() for page in doc)
            doc.close()
        finally:
            os.unlink(tmp_path)

        text = text.strip()
        if not text:
            raise RuntimeError("Could not extract text from PDF.")
        return text