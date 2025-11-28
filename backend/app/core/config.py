from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings and configuration"""

    # Application
    APP_NAME: str = "CanvasQuest API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./canvasquest.db")

    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".png", ".jpg", ".jpeg", ".svg"}

    # CORS
    @property
    def CORS_ORIGINS(self) -> list:
        """Get CORS origins based on environment"""
        origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://localhost:8000",
            "http://127.0.0.1:8000"
        ]

        # Add production origins from environment variable
        prod_origins = os.getenv("CORS_ORIGINS", "")
        if prod_origins:
            origins.extend([origin.strip() for origin in prod_origins.split(",")])

        return origins

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
