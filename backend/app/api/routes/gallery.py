from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.schemas import GalleryResponse, ArtworkResponse
from app.services import ArtworkService

router = APIRouter(prefix="/gallery", tags=["Hall of Fame"])


@router.get("/", response_model=GalleryResponse)
async def get_hall_of_fame(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get the Hall of Fame gallery - all public artworks.
    Returns regular artworks and featured artworks separately.
    """
    # Get all public artworks
    artworks = ArtworkService.get_gallery_artworks(db, skip=skip, limit=limit)

    # Get featured artworks
    featured = ArtworkService.get_gallery_artworks(db, skip=0, limit=10, featured_only=True)

    return GalleryResponse(
        artworks=[ArtworkResponse.model_validate(a) for a in artworks],
        featured=[ArtworkResponse.model_validate(a) for a in featured],
        total=len(artworks)
    )


@router.get("/featured", response_model=list[ArtworkResponse])
async def get_featured_artworks(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get only featured artworks for the spotlight section.
    """
    featured = ArtworkService.get_gallery_artworks(db, skip=0, limit=limit, featured_only=True)
    return [ArtworkResponse.model_validate(a) for a in featured]


@router.get("/latest", response_model=list[ArtworkResponse])
async def get_latest_artworks(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get the latest artworks (newest first).
    """
    artworks = ArtworkService.get_gallery_artworks(db, skip=0, limit=limit)
    return [ArtworkResponse.model_validate(a) for a in artworks]
