import os
from pathlib import Path
from typing import Any
from dotenv import load_dotenv
from app.ai.gemini_client import generate_embedding
import json
import faiss
import numpy as np

load_dotenv()

VECTOR_DB_PATH = Path(os.getenv("VECTOR_DB_PATH", "./vector_index"))
INDEX_FILE = VECTOR_DB_PATH / "faiss.index"
CHUNKS_FILE = VECTOR_DB_PATH / "chunks.json"

VECTOR_DB_PATH.mkdir(parents=True, exist_ok=True)

def load_chunks() -> list[dict[str, Any]]:
    if not CHUNKS_FILE.exists():
        return []

    with CHUNKS_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)
    
def save_chunks(chunks: list[dict[str, Any]]) -> None:
    with CHUNKS_FILE.open("w", encoding="utf-8") as file:
        json.dump(chunks, file, ensure_ascii=False, indent=2)

def load_index(dimension: int | None = None):
    if INDEX_FILE.exists():
        return faiss.read_index(str(INDEX_FILE))

    if dimension is None:
        raise ValueError("Dimension is required to create a new FAISS index")

    return faiss.IndexFlatL2(dimension)

def save_index(index) -> None:
    faiss.write_index(index, str(INDEX_FILE))


def rebuild_index(chunks: list[dict[str, Any]]) -> None:
    if not chunks:
        if INDEX_FILE.exists():
            INDEX_FILE.unlink()
        save_chunks([])
        return

    vectors = np.array(
        [chunk["embedding"] for chunk in chunks],
        dtype="float32",
    )

    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)

    save_index(index)
    save_chunks(chunks)            

def add_document_chunks(
    user_id: int,
    document_id: int,
    filename: str,
    chunks: list[str],
) -> None:
    if not chunks:
        return

    stored_chunks = load_chunks()

    for index, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)

        stored_chunks.append(
            {
                "id": f"user_{user_id}_doc_{document_id}_chunk_{index}",
                "user_id": int(user_id),
                "document_id": int(document_id),
                "filename": filename,
                "chunk_index": int(index),
                "text": chunk,
                "embedding": embedding,
            }
        )

    rebuild_index(stored_chunks)       

def search_relevant_chunks(
    user_id: int,
    question: str,
    top_k: int = 5,
):
    stored_chunks = load_chunks()

    user_chunks = [
        chunk
        for chunk in stored_chunks
        if chunk["user_id"] == int(user_id)
    ]

    if not user_chunks:
        return {
            "documents": [[]],
            "metadatas": [[]],
        }

    question_embedding = generate_embedding(question)

    vectors = np.array(
        [chunk["embedding"] for chunk in user_chunks],
        dtype="float32",
    )

    query_vector = np.array([question_embedding], dtype="float32")

    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)

    result_count = min(top_k, len(user_chunks))
    distances, indices = index.search(query_vector, result_count)

    documents = []
    metadatas = []

    for matched_index in indices[0]:
        chunk = user_chunks[int(matched_index)]

        documents.append(chunk["text"])
        metadatas.append(
            {
                "document_id": chunk["document_id"],
                "filename": chunk["filename"],
                "chunk_index": chunk["chunk_index"],
            }
        )

    return {
        "documents": [documents],
        "metadatas": [metadatas],
        "distances": distances.tolist(),
    }

def delete_document_chunks(user_id: int, document_id: int) -> None:
    stored_chunks = load_chunks()

    remaining_chunks = [
        chunk
        for chunk in stored_chunks
        if not (
            chunk["user_id"] == int(user_id)
            and chunk["document_id"] == int(document_id)
        )
    ]

    rebuild_index(remaining_chunks)