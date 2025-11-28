from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.schemas import ArtworkResponse, ArtworkListResponse, MessageResponse
from app.services import ArtworkService, FileService
from app.api.middleware import get_current_user, get_current_user_optional
from app.models import User

router = APIRouter(prefix="/artworks", tags=["Artworks"])


@router.post("/upload", response_model=ArtworkResponse, status_code=status.HTTP_201_CREATED)
async def upload_artwork(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    canvas_data: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a new artwork file and create artwork entry.
    Requires authentication.
    """
    # Save artwork file
    file_path, file_size, file_format = await FileService.save_artwork_file(file)

    # Create thumbnail
    thumbnail_path = FileService.create_thumbnail(file_path)

    # Create artwork entry
    artwork = ArtworkService.create_artwork(
        db=db,
        artist_id=current_user.id,
        file_path=file_path,
        file_format=file_format,
        file_size=file_size,
        title=title,
        description=description,
        width=width,
        height=height,
        canvas_data=canvas_data,
        thumbnail_path=thumbnail_path
    )

    return ArtworkResponse.model_validate(artwork)


@router.get("/{artwork_id}", response_model=ArtworkResponse)
async def get_artwork(
    artwork_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get a specific artwork by ID.
    Public endpoint - increments view count.
    """
    artwork = ArtworkService.get_artwork(db, artwork_id)

    if not artwork:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artwork not found"
        )

    # Check if artwork is public or belongs to current user
    if not artwork.is_public and (not current_user or artwork.artist_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This artwork is private"
        )

    return ArtworkResponse.model_validate(artwork)


@router.get("/artist/{artist_id}", response_model=ArtworkListResponse)
async def get_artist_artworks(
    artist_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get all artworks by a specific artist.
    Public artworks only unless requesting own artworks.
    """
    artworks = ArtworkService.get_artworks_by_artist(db, artist_id, skip, limit)

    # Filter private artworks unless user is viewing their own
    if not current_user or current_user.id != artist_id:
        artworks = [a for a in artworks if a.is_public]

    return ArtworkListResponse(
        artworks=[ArtworkResponse.model_validate(a) for a in artworks],
        total=len(artworks),
        skip=skip,
        limit=limit
    )


@router.post("/{artwork_id}/heart", response_model=ArtworkResponse)
async def add_heart(
    artwork_id: int,
    db: Session = Depends(get_db)
):
    """
    Add a heart/like to an artwork.
    Public endpoint - no authentication required.
    """
    artwork = ArtworkService.add_heart(db, artwork_id)
    return ArtworkResponse.model_validate(artwork)


@router.delete("/{artwork_id}", response_model=MessageResponse)
async def delete_artwork(
    artwork_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an artwork.
    Only the artist who created it can delete.
    """
    # Delete from database
    success = ArtworkService.delete_artwork(db, artwork_id, current_user.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete artwork"
        )

    return MessageResponse(message="Artwork deleted successfully")
