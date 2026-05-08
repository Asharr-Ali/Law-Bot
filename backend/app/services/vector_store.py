"""
Vector store service — wraps ChromaDB + SentenceTransformers.

Responsibilities:
  • Lazy-load the embedding model (downloaded once, ~80 MB).
  • Persist PPC section embeddings in ChromaDB.
  • Expose semantic_search() for the analysis pipeline.
"""

import json
import logging
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.core.config import Settings

logger = logging.getLogger(__name__)
INDEX_SCHEMA_VERSION = "2-summary-augmented-chunks"


def _split_sentences(text: str) -> list[str]:
    normalized = " ".join(text.split())
    if not normalized:
        return []
    sentences = re.split(r"(?<=[.!?])\s+", normalized)
    return [s.strip() for s in sentences if s.strip()]


def _summarize_chunk(text: str, max_sentences: int) -> str:
    """Lightweight extractive summary that avoids LLM/network dependency at index time."""
    sentences = _split_sentences(text)
    if not sentences:
        return text.strip()
    return " ".join(sentences[:max_sentences]).strip()


def _chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    normalized = " ".join(text.split())
    if not normalized:
        return []
    if len(normalized) <= chunk_size:
        return [normalized]

    chunks: list[str] = []
    start = 0
    step = max(1, chunk_size - overlap)

    while start < len(normalized):
        end = min(len(normalized), start + chunk_size)
        chunk = normalized[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(normalized):
            break
        start += step
    return chunks


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
        metadata = collection.metadata or {}
        schema_version = metadata.get("schema_version")
        logger.info(
            "Loaded existing collection '%s' with %d chunks (schema=%s).",
            settings.chroma_collection,
            count,
            schema_version or "unknown",
        )
        if count == 0:
            raise ValueError("Collection exists but is empty — rebuilding.")
        if schema_version != INDEX_SCHEMA_VERSION:
            raise ValueError("Collection schema changed — rebuilding.")
        return collection
    except Exception:
        logger.info("Building vector index from dataset '%s'…", settings.dataset_path)
        try:
            client.delete_collection(settings.chroma_collection)
        except Exception:
            # Collection may not exist yet; safe to ignore.
            pass
        collection = client.create_collection(
            name=settings.chroma_collection,
            metadata={
                "hnsw:space": "cosine",
                "schema_version": INDEX_SCHEMA_VERSION,
            },
        )
        _populate_index(collection, settings)
        return collection


def _populate_index(collection: Any, settings: Settings) -> None:
    """Embed summary-augmented chunks and upsert them into the collection."""
    embedder = _load_embedder(settings.embedding_model)

    with open(settings.dataset_path, "r", encoding="utf-8") as fh:
        laws: list[dict] = json.load(fh)

    ids, embeddings, documents, metadatas = [], [], [], []

    for law in laws:
        law_code = law.get("law_code", "PPC-1860")
        section = str(law["section"])
        title = law["title"]
        description = law["description"]
        keywords = law.get("keywords", [])
        category = law["category"]

        chunks = _chunk_text(
            description,
            chunk_size=settings.chunk_size_chars,
            overlap=settings.chunk_overlap_chars,
        )
        if not chunks:
            continue

        chunk_count = len(chunks)
        for idx, chunk in enumerate(chunks):
            summary = _summarize_chunk(chunk, settings.chunk_summary_sentence_count)
            augmented_text = (
                f"Law: {law_code}\n"
                f"Section: {section}\n"
                f"Title: {title}\n"
                f"Summary: {summary}\n"
                f"Keywords: {', '.join(keywords)}\n"
                f"Chunk: {chunk}"
            )

            ids.append(f"ppc-sec-{section}-chunk-{idx}")
            embeddings.append(embedder.encode(augmented_text).tolist())
            documents.append(augmented_text)
            metadatas.append(
                {
                    "section": section,
                    "title": title,
                    "category": category,
                    "law_code": law_code,
                    "description": chunk[:500],
                    "summary": summary[:300],
                    "chunk_index": idx,
                    "chunk_count": chunk_count,
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

    logger.info("Indexed %d summary-augmented chunks.", len(ids))


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