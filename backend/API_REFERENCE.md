# CanvasQuest API Reference

Base URL: `http://localhost:8000/api`

## Authentication Endpoints

### POST /auth/claim-art
Create a new user account (Quest-based authentication)

**Request Body:**
```json
{
  "artist_name": "string (required, 3-100 chars)",
  "email": "string (optional)",
  "password": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "artist_name": "string",
    "email": "string",
    "bio": null,
    "avatar_url": null,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /auth/login
Login with artist name and password

**Request Body:**
```json
{
  "artist_name": "string",
  "password": "string"
}
```

**Response:** `200 OK` (same structure as claim-art)

### POST /auth/logout
Logout current user

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Successfully logged out",
  "success": true
}
```

### GET /auth/me
Get current user information

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "artist_name": "string",
  "email": "string",
  "bio": null,
  "avatar_url": null,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## Artwork Endpoints

### POST /artworks/upload
Upload a new artwork

**Headers:** `Authorization: Bearer <token>`

**Form Data:**
- `file`: File (required) - PNG, JPG, JPEG, or SVG
- `title`: string (optional, max 200 chars)
- `description`: string (optional)
- `width`: integer (optional)
- `height`: integer (optional)
- `canvas_data`: string (optional, JSON)

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "file_path": "string",
  "thumbnail_path": "string",
  "file_format": "png",
  "file_size": 1024,
  "width": 800,
  "height": 600,
  "hearts": 0,
  "views": 0,
  "is_featured": false,
  "is_public": true,
  "artist_id": 1,
  "artist": { /* User object */ },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": null
}
```

### GET /artworks/{artwork_id}
Get a specific artwork by ID

**Response:** `200 OK` (same structure as upload response)

**Note:** Increments view count on each request

### GET /artworks/artist/{artist_id}
Get all artworks by a specific artist

**Query Parameters:**
- `skip`: integer (default: 0)
- `limit`: integer (default: 100, max: 100)

**Response:** `200 OK`
```json
{
  "artworks": [ /* Array of Artwork objects */ ],
  "total": 10,
  "skip": 0,
  "limit": 100
}
```

### POST /artworks/{artwork_id}/heart
Add a heart/like to an artwork

**Response:** `200 OK` (Artwork object with updated hearts count)

**Note:** Public endpoint, no authentication required

### DELETE /artworks/{artwork_id}
Delete an artwork (owner only)

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Artwork deleted successfully",
  "success": true
}
```

---

## Gallery Endpoints (Hall of Fame)

### GET /gallery/
Get the Hall of Fame gallery

**Query Parameters:**
- `skip`: integer (default: 0, min: 0)
- `limit`: integer (default: 50, min: 1, max: 100)

**Response:** `200 OK`
```json
{
  "artworks": [ /* Array of public Artwork objects */ ],
  "featured": [ /* Array of featured Artwork objects (max 10) */ ],
  "total": 50
}
```

### GET /gallery/featured
Get only featured artworks

**Query Parameters:**
- `limit`: integer (default: 10, min: 1, max: 50)

**Response:** `200 OK`
```json
[ /* Array of featured Artwork objects */ ]
```

### GET /gallery/latest
Get the latest artworks

**Query Parameters:**
- `limit`: integer (default: 20, min: 1, max: 100)

**Response:** `200 OK`
```json
[ /* Array of Artwork objects, sorted by creation date (newest first) */ ]
```

---

## General Endpoints

### GET /
API root endpoint

**Response:** `200 OK`
```json
{
  "app": "CanvasQuest API",
  "version": "1.0.0",
  "status": "running",
  "message": "Welcome to CanvasQuest API! 🎨"
}
```

### GET /api/health
Health check endpoint

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "app": "CanvasQuest API",
  "version": "1.0.0"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 413 Request Entity Too Large
```json
{
  "detail": "File too large. Maximum size: 10MB"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Authentication

Most endpoints require authentication using JWT Bearer tokens.

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained from:
- `/api/auth/claim-art` (new user registration)
- `/api/auth/login` (existing user login)

Tokens expire after 7 days (configurable in settings).

---

## File Uploads

Uploaded files are stored in `uploads/artworks/` directory.

**Supported formats:** PNG, JPG, JPEG, SVG
**Maximum file size:** 10MB (configurable)
**Thumbnails:** Automatically generated for non-SVG images

Access uploaded files at: `http://localhost:8000/uploads/artworks/{filename}`
