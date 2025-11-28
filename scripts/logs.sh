#!/bin/bash

###############################################################################
# View Logs Script
# Quick access to Docker container logs
###############################################################################

echo "╔════════════════════════════════════╗"
echo "║   CanvasQuest Logs Viewer          ║"
echo "╚════════════════════════════════════╝"
echo
echo "Select service to view logs:"
echo "1) Backend"
echo "2) Frontend"
echo "3) Database"
echo "4) All services"
echo "5) Follow all logs (live)"
echo
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        docker-compose logs backend
        ;;
    2)
        docker-compose logs frontend
        ;;
    3)
        docker-compose logs db
        ;;
    4)
        docker-compose logs
        ;;
    5)
        echo "Following logs... (Press Ctrl+C to stop)"
        docker-compose logs -f
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
