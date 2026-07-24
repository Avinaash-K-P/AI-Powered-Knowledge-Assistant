import os
from pathlib import Path
from uuid import uuid4
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.models.document import Document

from app.ai.text_extraction import extract_text
from app.ai.chunking import split_text_into_chunks
from app.ai.vector_store import add_document_chunks
from app.ai.vector_store import delete_document_chunks

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
UPLOAD_DIR = Path("uploads/documents")

def _get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()

def validate_document_file(file: UploadFile) -> str:
    extension = _get_file_extension(file.filename or "")

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, DOCX, and TXT files are supported.",
        )

    return extension

def save_uploaded_document(db: Session, file: UploadFile, user_id: int) -> Document:
    extension = validate_document_file(file)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / stored_filename

    content = file.file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    with file_path.open("wb") as buffer:
        buffer.write(content)

    document = Document(
        filename=stored_filename,
        original_filename=file.filename or stored_filename,
        file_type=extension.lstrip("."),
        file_path=str(file_path),
        file_size=len(content),
        user_id=user_id,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    print("DOCUMENT DB SAVE DONE", document.id)

    try:
        print("TEXT EXTRACTION START")

        extracted_text = extract_text(document.file_path) # type: ignore

        print("TEXT EXTRACTION DONE", len(extracted_text))
    
        print("CHUNKING STARTED")
    
        chunks = split_text_into_chunks(extracted_text)

        print("CHUNKING DONE", len(chunks))

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the uploaded document",
            )

        print("FIASS ADD START")

        add_document_chunks(
            user_id=user_id,
            document_id=document.id, # type: ignore
            filename=document.filename, # type: ignore
            chunks=chunks,
        )

        print("FIASS ADD DONE")
    
    except Exception as error:
         
        db.delete(document)
        db.commit() 

        raise HTTPException(
            status_code=500,
            detail=f"Document uploaded but processing failed: {str(error)}",
        )

    return document

def get_user_documents(db: Session, user_id: int):

    documents = (
        db.query(Document)
        .filter(Document.user_id == user_id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return documents

def get_user_document_by_id(db:Session, user_id:int, document_id:int):

    document = (db.query(Document).filter(
        Document.user_id == user_id,
        Document.id == document_id
        ).first())
        
    if not document:
        raise HTTPException(status_code=404, detail="Document doesnt exist")

    return document

def update_document(
    db: Session,
    document_id: int,
    user_id: int,
    new_filename: str | None = None,
):
    document = get_user_document_by_id(
        db=db,
        document_id=document_id,
        user_id=user_id,
    ) 

    if new_filename is not None:
        cleaned_filename = new_filename.strip()

        if not cleaned_filename:
            raise HTTPException(
                status_code=400,
                detail="Filename cannot be empty",
            )

        document.original_filename = cleaned_filename # type: ignore

    db.commit()
    db.refresh(document)

    return document

def delete_document(db: Session, document_id: int, user_id: int):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == user_id,
        )
        .first()
    )

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if document.file_path and os.path.exists(document.file_path): # type: ignore
        os.remove(document.file_path) # type: ignore

    db.delete(document)
    db.commit()

    delete_document_chunks(
    user_id=user_id,
    document_id=document_id,
    )

    return {"message": "Document deleted successfully"} 
