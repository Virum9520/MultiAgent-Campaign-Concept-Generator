import chromadb

from app.config import get_settings

_collection: chromadb.Collection | None = None


def get_collection() -> chromadb.Collection:
    global _collection
    if _collection is None:
        settings = get_settings()
        client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        _collection = client.get_or_create_collection(
            name=settings.chroma_collection_name,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def query_similar_campaigns(
    brand: str, industry: str, audience: str, k: int = 3
) -> list[dict]:
    collection = get_collection()
    if collection.count() == 0:
        return []
    query_text = f"Brand: {brand}, Industry: {industry}, Audience: {audience}"
    results = collection.query(query_texts=[query_text], n_results=min(k, collection.count()))
    if not results["documents"] or not results["documents"][0]:
        return []
    return [
        {"document": doc, "metadata": meta}
        for doc, meta in zip(results["documents"][0], results["metadatas"][0])
    ]


def store_campaign(campaign_id: str, summary: str, metadata: dict) -> None:
    collection = get_collection()
    collection.upsert(
        ids=[campaign_id],
        documents=[summary],
        metadatas=[metadata],
    )
