# CanvasQuest Backend API

Backend API for CanvasQuest - The Ultimate Drawing & Hall of Fame Platform.

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (local) / PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens
- **File Storage**: Local filesystem (can be switched to S3)

## Features

- Quest-based authentication (create art first, claim later)
- JWT-based session management
- Artwork upload and storage
- Hall of Fame gallery system
- Heart/like system for artworks
- User profiles and artist management

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── middleware/      # Authentication middleware
│   │   ├── routes/          # API endpoints
│   │   └── schemas.py       # Pydantic models
│   ├── core/
│   │   ├── config.py        # Configuration settings
│   │   ├── database.py      # Database setup
│   │   └── security.py      # Security utilities
│   ├── models/              # SQLAlchemy models
│   ├── services/            # Business logic
│   └── main.py             # FastAPI app entry point
├── uploads/                # Local file storage
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables
```

## Installation & Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and set your configuration (SECRET_KEY, etc.)
```

### 4. Run the Server

```bash
# Development mode with hot reload
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using the main.py directly
python app/main.py
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/auth/claim-art` - Create new user (quest-based)
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user info

### Artworks

- `POST /api/artworks/upload` - Upload new artwork
- `GET /api/artworks/{id}` - Get artwork by ID
- `GET /api/artworks/artist/{id}` - Get artist's artworks
- `POST /api/artworks/{id}/heart` - Add heart/like
- `DELETE /api/artworks/{id}` - Delete artwork

### Gallery (Hall of Fame)

- `GET /api/gallery/` - Get Hall of Fame gallery
- `GET /api/gallery/featured` - Get featured artworks
- `GET /api/gallery/latest` - Get latest artworks

## Database

### SQLite (Development)

The application uses SQLite by default for local development. The database file `canvasquest.db` will be created automatically in the backend directory.

### PostgreSQL (Production)

To switch to PostgreSQL, update the `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/canvasquest"
```

## Authentication Flow

### Quest-Based Auth (Recommended)

1. User creates artwork (no auth required)
2. User "claims" artwork by setting artist name: `POST /api/auth/claim-art`
3. Receives JWT token for authenticated requests

### Traditional Auth

1. User registers via `POST /api/auth/claim-art` with password
2. User logs in via `POST /api/auth/login`
3. Receives JWT token

### Using JWT Token

Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## File Uploads

Artworks are stored locally in the `uploads/` directory:

- `uploads/artworks/` - Original artwork files
- `uploads/thumbnails/` - Generated thumbnails

Supported formats: PNG, JPG, JPEG, SVG

## Development

### Running Tests

```bash
# TODO: Add tests
pytest
```

### Database Migrations

For production with Alembic:

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

## Production Deployment

### Environment Variables

Make sure to set secure values for:

- `SECRET_KEY` - Use a strong random key
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGINS` - Your frontend domains
- `DEBUG` - Set to False

### Recommended Deployment

- **Platform**: Railway, AWS ECS, or DigitalOcean
- **Database**: AWS RDS PostgreSQL or Railway PostgreSQL
- **File Storage**: AWS S3 (requires FileService modification)

## Security Notes

- Change `SECRET_KEY` in production
- Use HTTPS in production
- Set appropriate CORS origins
- Implement rate limiting for production
- Consider adding file upload validation/scanning

## License

MIT
