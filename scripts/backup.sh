#!/bin/bash

###############################################################################
# Database Backup Script
# Backs up PostgreSQL database and uploads directory
###############################################################################

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="canvasquest_backup_${TIMESTAMP}.sql.gz"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   CanvasQuest Backup Script        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
echo -e "${YELLOW}📊 Backing up database...${NC}"
docker-compose exec -T db pg_dump -U canvasquest canvasquest | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Backup uploads directory
echo -e "${YELLOW}📁 Backing up uploads...${NC}"
tar -czf "$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz" backend/uploads/

# Keep only last 7 backups
echo -e "${YELLOW}🧹 Cleaning old backups...${NC}"
cd "$BACKUP_DIR"
ls -t canvasquest_backup_*.sql.gz | tail -n +8 | xargs -r rm
ls -t uploads_*.tar.gz | tail -n +8 | xargs -r rm
cd ..

echo -e "${GREEN}✅ Backup completed!${NC}"
echo -e "Database: $BACKUP_DIR/$BACKUP_FILE"
echo -e "Uploads: $BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz"
echo
