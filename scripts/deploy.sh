#!/bin/bash

###############################################################################
# CanvasQuest Deployment Script
# This script deploys the application using Docker Compose
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   CanvasQuest Deployment Script   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file from .env.example${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Pulling latest changes...${NC}"
git pull origin main || echo "Skipping git pull..."

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down

echo -e "${YELLOW}🔨 Building images...${NC}"
docker-compose build --no-cache

echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 15

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Containers are running!${NC}"
else
    echo -e "${RED}❌ Some containers failed to start!${NC}"
    docker-compose ps
    exit 1
fi

# Run database migrations
echo -e "${YELLOW}📊 Running database migrations...${NC}"
docker-compose exec -T backend alembic upgrade head || echo "No migrations to run"

# Health checks
echo -e "${YELLOW}🏥 Running health checks...${NC}"
sleep 5

# Check backend
if curl -f http://localhost:8000/api/health &> /dev/null; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

# Check frontend
if curl -f http://localhost/health &> /dev/null; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
fi

# Show running containers
echo
echo -e "${GREEN}📦 Running containers:${NC}"
docker-compose ps

# Clean up old images
echo
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

echo
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Deployment Complete! 🎉         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo
echo -e "${GREEN}🌐 Frontend:${NC} http://localhost"
echo -e "${GREEN}🔧 Backend:${NC}  http://localhost:8000"
echo -e "${GREEN}📚 API Docs:${NC} http://localhost:8000/docs"
echo
echo -e "${YELLOW}📝 View logs:${NC} docker-compose logs -f"
echo -e "${YELLOW}🛑 Stop:${NC}      docker-compose down"
echo
