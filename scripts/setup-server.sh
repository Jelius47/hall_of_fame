#!/bin/bash

###############################################################################
# Server Setup Script
# Run this script on your fresh server to install all dependencies
###############################################################################

set -e

echo "╔════════════════════════════════════╗"
echo "║   CanvasQuest Server Setup         ║"
echo "╚════════════════════════════════════╝"
echo

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh

    # Add current user to docker group
    usermod -aG docker $SUDO_USER || true

    echo "✅ Docker installed successfully"
else
    echo "✅ Docker is already installed"
fi

# Install Docker Compose
echo "📦 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose is already installed"
fi

# Install Git
echo "📦 Installing Git..."
apt-get install -y git

# Install other useful tools
echo "📦 Installing additional tools..."
apt-get install -y curl wget htop vim ufw

# Setup firewall
echo "🔥 Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8000/tcp  # Backend API
ufw --force enable

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p /home/$SUDO_USER/canvasquest
chown -R $SUDO_USER:$SUDO_USER /home/$SUDO_USER/canvasquest

# Generate SSH key for GitHub (optional)
echo "🔑 Setting up SSH key for GitHub..."
if [ ! -f /home/$SUDO_USER/.ssh/id_ed25519 ]; then
    sudo -u $SUDO_USER ssh-keygen -t ed25519 -C "canvasquest-deploy" -f /home/$SUDO_USER/.ssh/id_ed25519 -N ""
    echo
    echo "✅ SSH key generated. Add this public key to your GitHub repo:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat /home/$SUDO_USER/.ssh/id_ed25519.pub
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
fi

# Install Nginx (optional, for SSL/reverse proxy)
echo "📦 Installing Nginx..."
apt-get install -y nginx

echo
echo "╔════════════════════════════════════╗"
echo "║   Server Setup Complete! 🎉        ║"
echo "╚════════════════════════════════════╝"
echo
echo "📝 Next steps:"
echo "1. Add the SSH public key to GitHub (if shown above)"
echo "2. Clone your repository to ~/canvasquest"
echo "3. Create .env file from .env.example"
echo "4. Run ./scripts/deploy.sh"
echo
echo "🔄 You may need to log out and back in for Docker group changes to take effect"
echo
