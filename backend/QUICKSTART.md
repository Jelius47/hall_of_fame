# Quick Start Guide

## Start the Backend Server

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run the server
python run.py
```

The server will start at:
- **API**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## Test the API

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Create a User (Claim Art)
```bash
curl -X POST http://localhost:8000/api/auth/claim-art \
  -H "Content-Type: application/json" \
  -d '{
    "artist_name": "TestArtist",
    "email": "test@example.com"
  }'
```

### Upload Artwork (with auth)
First, get the token from the claim-art response, then:

```bash
curl -X POST http://localhost:8000/api/artworks/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.png" \
  -F "title=My First Artwork" \
  -F "description=A beautiful creation"
```

### Get Gallery
```bash
curl http://localhost:8000/api/gallery/
```

## Database

The SQLite database file `canvasquest.db` will be created automatically in the backend directory.

To reset the database, simply delete the file:
```bash
rm canvasquest.db
```

The tables will be recreated on the next server start.

## Troubleshooting

### Port already in use
If port 8000 is already in use, modify `run.py` and change the port number.

### Import errors
Make sure you're in the virtual environment:
```bash
source venv/bin/activate
```

### Database issues
Delete the database file and restart:
```bash
rm canvasquest.db
python run.py
```
