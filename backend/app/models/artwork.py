from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Artwork(Base):
    """Artwork model for user creations"""

    __tablename__ = "artworks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)

    # File information
    file_path = Column(String(500), nullable=False)
    thumbnail_path = Column(String(500), nullable=True)
    file_format = Column(String(10), nullable=False)  # png, svg, jpg
    file_size = Column(Integer, nullable=False)  # in bytes

    # Artwork metadata
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    canvas_data = Column(Text, nullable=True)  # JSON string of canvas state

    # Engagement metrics
    hearts = Column(Integer, default=0)
    views = Column(Integer, default=0)

    # Status
    is_featured = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)

    # Foreign keys
    artist_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    artist = relationship("User", back_populates="artworks")

    def __repr__(self):
        return f"<Artwork(id={self.id}, title='{self.title}', artist_id={self.artist_id})>"
