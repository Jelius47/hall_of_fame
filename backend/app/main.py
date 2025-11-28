from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from starlette.middleware.base import BaseHTTPMiddleware
import os

from app.core.config import settings
from app.core.database import init_db
from app.api.routes import auth, artworks, gallery


class CORSPreflightMiddleware(BaseHTTPMiddleware):
    """Middleware to handle CORS preflight requests"""
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "*")

        # Log all requests in debug mode
        if settings.DEBUG:
            print(f"🔍 {request.method} {request.url.path} - Origin: {origin}")

        if request.method == "OPTIONS":
            if settings.DEBUG:
                print(f"✅ Handling OPTIONS preflight for {request.url.path}")

            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                    "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers", "*"),
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Max-Age": "3600",
                }
            )

        response = await call_next(request)
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    print("🚀 Starting CanvasQuest API...")

    # Initialize database
    init_db()
    print("✅ Database initialized")

    # Ensure upload directories exist
    from app.services import FileService
    FileService.ensure_upload_dir()
    print("✅ Upload directories created")

    yield

    # Shutdown
    print("👋 Shutting down CanvasQuest API...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for CanvasQuest - The Ultimate Drawing & Hall of Fame Platform",
    lifespan=lifespan
)

# Add CORS preflight middleware FIRST (processes before route handlers)
app.add_middleware(CORSPreflightMiddleware)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Mount static files for uploads (if directory exists)
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(artworks.router, prefix="/api")
app.include_router(gallery.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "message": "Welcome to CanvasQuest API! 🎨"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
