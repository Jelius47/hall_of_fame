#!/usr/bin/env python
"""
Simple script to run the CanvasQuest backend server.
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"""
    🎨 CanvasQuest API Server
    ========================

    Starting {settings.APP_NAME} v{settings.APP_VERSION}

    Server will be available at:
    - API: http://localhost:8000
    - Docs: http://localhost:8000/docs
    - ReDoc: http://localhost:8000/redoc

    Press CTRL+C to stop the server.
    """)

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
