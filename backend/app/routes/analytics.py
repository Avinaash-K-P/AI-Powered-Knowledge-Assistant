from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import get_current_user
from app.services.analytics_service import get_analytics

router = APIRouter(tags=["Analytics"])

@router.get("/analytics")
def view_analytics(
    db:Session = Depends(get_db),
    user = Depends(get_current_user)    
):
    return get_analytics(db=db)


