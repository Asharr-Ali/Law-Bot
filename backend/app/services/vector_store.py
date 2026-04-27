"""
Vector store service — wraps ChromaDB + SentenceTransformers.

Responsibilities:
  • Lazy-load the embedding model (downloaded once, ~80 MB).
  • Persist PPC section embeddings in ChromaDB.
  • Expose semantic_search() for the analysis pipeline.
"""

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.core.config import Settings

logger = logging.getLogger(__name__)


# ── Singleton accessors ────────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _load_embedder(model_name: str):
    from sentence_transformers import SentenceTransformer

    logger.info("Loading embedding model '%s' (first run may download ~80 MB)…", model_name)
    model = SentenceTransformer(model_name)
    logger.info("Embedding model ready.")
    return model


def _get_or_build_collection(settings: Settings):
    """Return a populated ChromaDB collection, building the index if needed."""
    import chromadb

    logger.info("Initialising ChromaDB at '%s'…", settings.chroma_db_path)
    client = chromadb.PersistentClient(path=settings.chroma_db_path)

    try:
        collection = client.get_collection(settings.chroma_collection)
        count = collection.count()
        logger.info("Loaded existing collection '%s' with %d sections.", settings.chroma_collection, count)
        if count == 0:
            raise ValueError("Collection exists but is empty — rebuilding.")
        return collection
    except Exception:
        logger.info("Building vector index from dataset '%s'…", settings.dataset_path)
        collection = client.get_or_create_collection(
            name=settings.chroma_collection,
            metadata={"hnsw:space": "cosine"},
        )
        _populate_index(collection, settings)
        return collection


def _populate_index(collection: Any, settings: Settings) -> None:
    """Embed all PPC sections and upsert them into the collection."""
    embedder = _load_embedder(settings.embedding_model)

    with open(settings.dataset_path, "r", encoding="utf-8") as fh:
        laws: list[dict] = json.load(fh)

    ids, embeddings, documents, metadatas = [], [], [], []

    for law in laws:
        text = (
            f"Section {law['section']}: {law['title']}. "
            f"{law['description']} "
            f"Keywords: {', '.join(law.get('keywords', []))}"
        )
        ids.append(f"ppc-sec-{law['section']}")
        embeddings.append(embedder.encode(text).tolist())
        documents.append(text)
        metadatas.append(
            {
                "section": str(law["section"]),
                "title": law["title"],
                "category": law["category"],
                "law_code": law.get("law_code", "PPC-1860"),
                "description": law["description"][:500],
            }
        )

    batch = settings.search_index_batch_size
    for start in range(0, len(ids), batch):
        collection.add(
            ids=ids[start : start + batch],
            embeddings=embeddings[start : start + batch],
            documents=documents[start : start + batch],
            metadatas=metadatas[start : start + batch],
        )

    logger.info("Indexed %d PPC sections.", len(ids))


# ── Public API ─────────────────────────────────────────────────────────────────

class VectorStoreService:
    """Stateful wrapper around ChromaDB + embedder — use as a FastAPI dependency."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._embedder = None
        self._collection = None

    # Lazy initialisation so the HTTP server starts instantly.
    def _ensure_ready(self) -> None:
        if self._collection is None:
            self._embedder = _load_embedder(self._settings.embedding_model)
            self._collection = _get_or_build_collection(self._settings)

    def warm_up(self) -> None:
        """Call during app startup to pre-load models in a background thread."""
        self._ensure_ready()

    def semantic_search(self, query: str, top_k: int | None = None) -> list[dict]:
        """
        Embed *query* and return the top-k most relevant PPC sections.

        Returns a list of dicts with keys:
          section, title, category, law_code, description, relevance (0–100).
        """
        self._ensure_ready()
        k = top_k or self._settings.search_top_k
        query_emb = self._embedder.encode(query).tolist()

        results = self._collection.query(
            query_embeddings=[query_emb],
            n_results=k,
            include=["documents", "metadatas", "distances"],
        )

        hits = []
        for i, meta in enumerate(results["metadatas"][0]):
            distance = results["distances"][0][i]
            hits.append(
                {
                    "section": meta["section"],
                    "title": meta["title"],
                    "category": meta["category"],
                    "law_code": meta["law_code"],
                    "description": meta["description"],
                    "relevance": round((1 - distance) * 100, 1),
                }
            )
        return hits