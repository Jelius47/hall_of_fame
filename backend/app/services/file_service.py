import os
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from PIL import Image

from app.core.config import settings


class FileService:
    """Service for handling file uploads and storage"""

    @staticmethod
    def ensure_upload_dir():
        """Ensure upload directory exists"""
        Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
        Path(f"{settings.UPLOAD_DIR}/artworks").mkdir(parents=True, exist_ok=True)
        Path(f"{settings.UPLOAD_DIR}/thumbnails").mkdir(parents=True, exist_ok=True)

    @staticmethod
    def validate_file(file: UploadFile) -> tuple[str, str]:
        """
        Validate uploaded file.

        Args:
            file: Uploaded file object

        Returns:
            Tuple of (file_extension, content_type)

        Raises:
            HTTPException: If file is invalid
        """
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided"
            )

        # Get file extension
        file_ext = os.path.splitext(file.filename)[1].lower()

        # Validate extension
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_ext} not allowed. Allowed types: {settings.ALLOWED_EXTENSIONS}"
            )

        return file_ext, file.content_type or "application/octet-stream"

    @staticmethod
    async def save_artwork_file(file: UploadFile) -> tuple[str, int, str]:
        """
        Save an artwork file to disk.

        Args:
            file: Uploaded file object

        Returns:
            Tuple of (file_path, file_size, file_format)

        Raises:
            HTTPException: If file is invalid or save fails
        """
        FileService.ensure_upload_dir()

        # Validate file
        file_ext, _ = FileService.validate_file(file)

        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = f"{settings.UPLOAD_DIR}/artworks/{unique_filename}"

        # Read file content
        content = await file.read()
        file_size = len(content)

        # Check file size
        if file_size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )

        # Save file
        try:
            with open(file_path, "wb") as f:
                f.write(content)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )

        return file_path, file_size, file_ext.lstrip('.')

    @staticmethod
    def create_thumbnail(source_path: str, max_size: tuple[int, int] = (300, 300)) -> Optional[str]:
        """
        Create a thumbnail from an image file.

        Args:
            source_path: Path to source image
            max_size: Maximum thumbnail dimensions (width, height)

        Returns:
            Path to thumbnail file or None if failed
        """
        try:
            FileService.ensure_upload_dir()

            # Skip SVG files (can't create thumbnails easily)
            if source_path.lower().endswith('.svg'):
                return None

            # Open image
            with Image.open(source_path) as img:
                # Convert RGBA to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background

                # Create thumbnail
                img.thumbnail(max_size, Image.Resampling.LANCZOS)

                # Generate thumbnail filename
                source_filename = os.path.basename(source_path)
                thumb_filename = f"thumb_{os.path.splitext(source_filename)[0]}.jpg"
                thumb_path = f"{settings.UPLOAD_DIR}/thumbnails/{thumb_filename}"

                # Save thumbnail
                img.save(thumb_path, "JPEG", quality=85)

                return thumb_path

        except Exception as e:
            print(f"Failed to create thumbnail: {e}")
            return None

    @staticmethod
    def delete_file(file_path: str) -> bool:
        """
        Delete a file from disk.

        Args:
            file_path: Path to file to delete

        Returns:
            True if successful, False otherwise
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
            return True
        except Exception as e:
            print(f"Failed to delete file: {e}")
            return False
