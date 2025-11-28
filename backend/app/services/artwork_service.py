from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import Artwork, User


class ArtworkService:
    """Service for handling artwork operations"""

    @staticmethod
    def create_artwork(
        db: Session,
        artist_id: int,
        file_path: str,
        file_format: str,
        file_size: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        width: Optional[int] = None,
        height: Optional[int] = None,
        canvas_data: Optional[str] = None,
        thumbnail_path: Optional[str] = None
    ) -> Artwork:
        """
        Create a new artwork entry.

        Args:
            db: Database session
            artist_id: ID of the artist/user
            file_path: Path to the artwork file
            file_format: File format (png, svg, jpg)
            file_size: File size in bytes
            title: Optional artwork title
            description: Optional artwork description
            width: Optional canvas width
            height: Optional canvas height
            canvas_data: Optional JSON canvas state
            thumbnail_path: Optional thumbnail path

        Returns:
            Created Artwork object
        """
        artwork = Artwork(
            artist_id=artist_id,
            title=title,
            description=description,
            file_path=file_path,
            thumbnail_path=thumbnail_path,
            file_format=file_format,
            file_size=file_size,
            width=width,
            height=height,
            canvas_data=canvas_data
        )

        db.add(artwork)
        db.commit()
        db.refresh(artwork)

        return artwork

    @staticmethod
    def get_artwork(db: Session, artwork_id: int) -> Optional[Artwork]:
        """
        Get an artwork by ID and increment view count.

        Args:
            db: Database session
            artwork_id: Artwork ID

        Returns:
            Artwork object if found, None otherwise
        """
        artwork = db.query(Artwork).filter(Artwork.id == artwork_id).first()

        if artwork:
            # Increment view count
            artwork.views += 1
            db.commit()

        return artwork

    @staticmethod
    def get_artworks_by_artist(db: Session, artist_id: int, skip: int = 0, limit: int = 100) -> List[Artwork]:
        """
        Get all artworks by a specific artist.

        Args:
            db: Database session
            artist_id: Artist/User ID
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List of Artwork objects
        """
        return db.query(Artwork).filter(Artwork.artist_id == artist_id).offset(skip).limit(limit).all()

    @staticmethod
    def get_gallery_artworks(db: Session, skip: int = 0, limit: int = 100, featured_only: bool = False) -> List[Artwork]:
        """
        Get artworks for the Hall of Fame gallery.

        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            featured_only: If True, only return featured artworks

        Returns:
            List of Artwork objects sorted by creation date (newest first)
        """
        query = db.query(Artwork).filter(Artwork.is_public == True)

        if featured_only:
            query = query.filter(Artwork.is_featured == True)

        return query.order_by(Artwork.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def add_heart(db: Session, artwork_id: int) -> Artwork:
        """
        Add a heart/like to an artwork.

        Args:
            db: Database session
            artwork_id: Artwork ID

        Returns:
            Updated Artwork object

        Raises:
            HTTPException: If artwork not found
        """
        artwork = db.query(Artwork).filter(Artwork.id == artwork_id).first()

        if not artwork:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Artwork not found"
            )

        artwork.hearts += 1
        db.commit()
        db.refresh(artwork)

        return artwork

    @staticmethod
    def delete_artwork(db: Session, artwork_id: int, user_id: int) -> bool:
        """
        Delete an artwork (only by the owner).

        Args:
            db: Database session
            artwork_id: Artwork ID
            user_id: ID of the user attempting to delete

        Returns:
            True if successful

        Raises:
            HTTPException: If artwork not found or user not authorized
        """
        artwork = db.query(Artwork).filter(Artwork.id == artwork_id).first()

        if not artwork:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Artwork not found"
            )

        if artwork.artist_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this artwork"
            )

        db.delete(artwork)
        db.commit()

        return True
