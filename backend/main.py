"""
Entry point — run with:

    uvicorn main:app --reload
"""

import logging

from app.factory import create_app

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)

app = create_app()