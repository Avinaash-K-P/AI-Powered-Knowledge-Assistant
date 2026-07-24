from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Document(Base):

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete= "CASCADE"), nullable=False)

    filename = Column(String(255), nullable=False)

    original_filename = Column(String(255), nullable=False)

    file_type = Column(String(20), nullable=False)

    file_size = Column(Integer, nullable=False)

    file_path = Column(String(500), nullable=False)

    uploaded_at = Column(DateTime(timezone=True), server_default=func.now() )
            
    user = relationship("User", back_populates="documents")