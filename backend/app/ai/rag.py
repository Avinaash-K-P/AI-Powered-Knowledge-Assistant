from app.ai.gemini_client import generate_ai_answer
from app.ai.vector_store import search_relevant_chunks


def answer_question_from_documents(user_id: int, question: str):

    print("RAG START")
    print("SEARCH START")
    
    results = search_relevant_chunks(
        user_id=user_id,
        question=question,
        top_k=5,
    )
    print("SEARCH DONE")

    documents = results.get("documents", [[]])[0] # type: ignore
    metadatas = results.get("metadatas", [[]])[0] # type: ignore

    print("DOCUMENTS FOUND:", len(documents))

    if not documents:
        return {
            "answer": "I could not find this information in your uploaded documents.",
            "sources": [],
        }

    context = "\n\n".join(
        f"Source {index + 1} ({metadatas[index].get('filename')}):\n{chunk}"
        for index, chunk in enumerate(documents)
    )

    prompt = f"""
You are an AI knowledge assistant.

Answer the user's question using only the document context below.
Do not use outside knowledge.

If the answer is not available in the context, say:
"I could not find this information in your uploaded documents."

Document context:
{context}

User question:
{question}

Answer:
"""

    answer = generate_ai_answer(prompt)

    sources = [
        {
            "document_id": metadata.get("document_id"),
            "filename": metadata.get("filename"),
            "chunk_index": metadata.get("chunk_index"),
        }
        for metadata in metadatas
    ]

    return {
        "answer": answer,
        "sources": sources,
    }