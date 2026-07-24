from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.document import DocumentResponse
from app.services.document_service import (
    save_uploaded_document,
    get_user_documents,
    get_user_document_by_id,
    update_document,
    delete_document
)
from app.core.security import get_current_user

router = APIRouter(prefix="/documents", tags=["Document Management"])

@router.post("/upload", response_model=DocumentResponse)
def add_document(
    file: UploadFile = File(...),
    db:Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return save_uploaded_document(
        db=db, 
        file = file, 
        user_id = user["id"]
    )

@router.get("/")
def list_documents(
    db:Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return get_user_documents(db, user["id"])

@router.get("/{document_id}")
def view_document_by_id(
    document_id:int,
    db:Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return get_user_document_by_id(
        db=db,
        document_id=document_id,
        user_id=user["id"]
    )

@router.put("/{document_id}", response_model=DocumentResponse)
def edit_document(
    new_filename: str,
    document_id:int,
    db:Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return update_document(
        db=db,
        document_id=document_id,
        user_id=user["id"],
        new_filename=new_filename
    )    

@router.delete("/{document_id}")
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return delete_document(
        db=db,
        document_id=document_id,
        user_id=user["id"],
    )
