from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base
from datetime import datetime

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True, index=True, nullable=False)

    email = Column(String(100), unique=True, index=True, nullable=False)

    password = Column(String(100), nullable=False)

    created_at = Column(DateTime, default= datetime.utcnow())

    is_active = Column(Boolean, default=True)

    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")