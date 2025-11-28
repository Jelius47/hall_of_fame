from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ============= User Schemas =============

class UserCreate(BaseModel):
    """Schema for creating a new user (Quest-based auth)"""
    artist_name: str = Field(..., min_length=3, max_length=100)
    email: Optional[str] = None
    password: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login"""
    artist_name: str
    password: str


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    artist_name: str
    email: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Auth Schemas =============

class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============= Artwork Schemas =============

class ArtworkCreate(BaseModel):
    """Schema for creating artwork metadata"""
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    canvas_data: Optional[str] = None


class ArtworkResponse(BaseModel):
    """Schema for artwork response"""
    id: int
    title: Optional[str]
    description: Optional[str]
    file_path: str
    thumbnail_path: Optional[str]
    file_format: str
    file_size: int
    width: Optional[int]
    height: Optional[int]
    hearts: int
    views: int
    is_featured: bool
    is_public: bool
    artist_id: int
    artist: UserResponse
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ArtworkListResponse(BaseModel):
    """Schema for list of artworks"""
    artworks: list[ArtworkResponse]
    total: int
    skip: int
    limit: int


# ============= Gallery Schemas =============

class GalleryResponse(BaseModel):
    """Schema for Hall of Fame gallery response"""
    artworks: list[ArtworkResponse]
    featured: list[ArtworkResponse]
    total: int


# ============= Generic Responses =============

class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
    success: bool = True
