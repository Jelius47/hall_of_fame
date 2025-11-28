# 🐳 Docker + GitHub Actions Deployment Guide

Complete guide for deploying CanvasQuest to your own server using Docker and GitHub Actions for automated CI/CD.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Server Setup](#server-setup)
4. [GitHub Setup](#github-setup)
5. [Deploy](#deploy)
6. [Management](#management)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**What you'll get:**
- ✅ Automated deployments on every git push
- ✅ Docker containers for easy management
- ✅ PostgreSQL database
- ✅ Nginx web server
- ✅ Health monitoring
- ✅ Easy backups and rollbacks

**Architecture:**
```
GitHub Push → GitHub Actions → SSH to Server → Docker Compose → Running App
```

---

## ✅ Prerequisites

### What you need:
- [ ] A server (DigitalOcean, AWS EC2, Linode, etc.)
- [ ] Ubuntu 20.04+ or Debian 11+
- [ ] At least 2GB RAM (4GB recommended)
- [ ] Root or sudo access
- [ ] Domain name (optional but recommended)

### Recommended Providers:
| Provider | Cost | Setup Ease |
|----------|------|------------|
| **DigitalOcean** | $6/month | ⭐⭐⭐⭐⭐ |
| **Linode** | $5/month | ⭐⭐⭐⭐⭐ |
| **AWS EC2** | ~$10/month | ⭐⭐⭐ |
| **Hetzner** | €4/month | ⭐⭐⭐⭐ |

---

## 🖥️ Server Setup

### Step 1: Get a Server

**DigitalOcean (Recommended):**
1. Go to [digitalocean.com](https://www.digitalocean.com)
2. Create Droplet
3. Choose: Ubuntu 22.04 LTS
4. Plan: Basic $6/month (2GB RAM)
5. Choose datacenter region
6. Add SSH key (or use password)
7. Create Droplet

### Step 2: Connect to Server

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Or if using a user account:
ssh yourusername@YOUR_SERVER_IP
```

### Step 3: Run Setup Script

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/scripts/setup-server.sh -o setup.sh
chmod +x setup.sh
sudo ./setup.sh
```

This script will:
- ✅ Update system packages
- ✅ Install Docker
- ✅ Install Docker Compose
- ✅ Install Git
- ✅ Configure firewall
- ✅ Generate SSH key for GitHub

**IMPORTANT:** The script will show you an SSH public key. **Copy it** - you'll need it for GitHub!

### Step 4: Clone Repository

```bash
# Switch to your user (if you were root)
su - yourusername

# Go to home directory
cd ~

# Clone your repository
git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git canvasquest

# Or with HTTPS:
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git canvasquest

cd canvasquest
```

### Step 5: Create Environment File

```bash
# Copy example file
cp .env.example .env

# Edit the file
nano .env
```

**Update these values:**
```bash
# Generate a secure password
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Generate secret key
SECRET_KEY=$(openssl rand -hex 32)

# Your domain (or server IP)
CORS_ORIGINS=http://YOUR_SERVER_IP,http://your-domain.com
VITE_API_URL=http://YOUR_SERVER_IP:8000/api
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

---

## 🔧 GitHub Setup

### Step 1: Add Server SSH Key to GitHub

1. On your **server**, display the public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. Copy the entire output

3. Go to your GitHub repo → **Settings** → **Deploy keys**

4. Click **Add deploy key**
   - Title: "Production Server"
   - Key: Paste the key you copied
   - ✅ Allow write access (optional)
   - Click **Add key**

### Step 2: Configure GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**

Click **New repository secret** and add these:

| Secret Name | Value | Example |
|------------|-------|---------|
| `SERVER_HOST` | Your server IP | `123.45.67.89` |
| `SERVER_USER` | SSH username | `root` or `ubuntu` |
| `SSH_PRIVATE_KEY` | Private key from server | See below |
| `SERVER_PORT` | SSH port (usually 22) | `22` |
| `POSTGRES_DB` | Database name | `canvasquest` |
| `POSTGRES_USER` | DB username | `canvasquest` |
| `POSTGRES_PASSWORD` | DB password | From `.env` file |
| `SECRET_KEY` | Backend secret | From `.env` file |
| `CORS_ORIGINS` | Frontend URLs | `http://YOUR_IP` |
| `VITE_API_URL` | API endpoint | `http://YOUR_IP:8000/api` |

#### Getting SSH_PRIVATE_KEY:

**On your server:**
```bash
cat ~/.ssh/id_ed25519
```

Copy **everything** including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Paste this entire block into the `SSH_PRIVATE_KEY` secret.

---

## 🚀 Deploy

### Method 1: Automatic Deployment (GitHub Actions)

Simply push to your main branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

GitHub Actions will:
1. ✅ Run tests
2. ✅ Build Docker images
3. ✅ Deploy to your server
4. ✅ Run health checks

Watch the deployment:
- Go to your GitHub repo
- Click **Actions** tab
- Watch the workflow run

### Method 2: Manual Deployment

On your server:

```bash
cd ~/canvasquest
./scripts/deploy.sh
```

### First Deployment

After first deployment, the app will be available at:
- **Frontend:** `http://YOUR_SERVER_IP`
- **Backend API:** `http://YOUR_SERVER_IP:8000`
- **API Docs:** `http://YOUR_SERVER_IP:8000/docs`

---

## 🛠️ Management

### View Logs

```bash
# Interactive log viewer
./scripts/logs.sh

# Or directly:
docker-compose logs -f           # All logs
docker-compose logs -f backend   # Backend only
docker-compose logs -f frontend  # Frontend only
```

### Backup Database

```bash
./scripts/backup.sh
```

Backups are saved to `./backups/` directory.

### Restart Services

```bash
# Restart everything
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Everything

```bash
docker-compose down
```

### Check Status

```bash
docker-compose ps
```

### Update Application

```bash
cd ~/canvasquest
git pull origin main
./scripts/deploy.sh
```

---

## 🔒 Security (Optional but Recommended)

### 1. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

### 2. Change SSH Port

```bash
sudo nano /etc/ssh/sshd_config
# Change: Port 22 to Port 2222
sudo systemctl restart sshd

# Update firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### 3. Setup Fail2Ban

```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🐛 Troubleshooting

### Issue: Container won't start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs db
```

**Common fixes:**
```bash
# Rebuild without cache
docker-compose build --no-cache

# Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

### Issue: Database connection error

**Check database is running:**
```bash
docker-compose ps
```

**Check DATABASE_URL in .env:**
```bash
cat .env | grep DATABASE
```

Should be:
```
DATABASE_URL=postgresql://canvasquest:PASSWORD@db:5432/canvasquest
```

### Issue: GitHub Actions deployment fails

**Check secrets are set correctly:**
- Go to repo → Settings → Secrets and variables → Actions
- Verify all required secrets are present

**Check SSH connection:**
```bash
ssh -i ~/.ssh/id_ed25519 SERVER_USER@SERVER_HOST
```

### Issue: Port already in use

**Check what's using port 80:**
```bash
sudo lsof -i :80
```

**Stop conflicting service:**
```bash
sudo systemctl stop apache2  # If Apache is running
sudo systemctl stop nginx    # If Nginx is running
```

### Issue: Out of disk space

**Check disk usage:**
```bash
df -h
```

**Clean Docker:**
```bash
docker system prune -a
docker volume prune
```

---

## 📊 Monitoring

### Health Checks

```bash
# Check backend
curl http://YOUR_SERVER_IP:8000/api/health

# Check frontend
curl http://YOUR_SERVER_IP/health
```

### Resource Usage

```bash
# Check Docker stats
docker stats

# Check system resources
htop
```

### Database Size

```bash
docker-compose exec db psql -U canvasquest -c "SELECT pg_database_size('canvasquest');"
```

---

## 🔄 Common Tasks

### Add New Environment Variable

1. Add to `.env` file on server
2. Add to GitHub Secrets
3. Restart: `docker-compose restart`

### Roll Back Deployment

```bash
# Go back to previous commit
git log --oneline
git checkout PREVIOUS_COMMIT_HASH
./scripts/deploy.sh
```

### Scale Services

Edit `docker-compose.yml`:
```yaml
backend:
  deploy:
    replicas: 2  # Run 2 instances
```

### Connect to Database

```bash
docker-compose exec db psql -U canvasquest -d canvasquest
```

---

## 📈 Performance Tips

1. **Enable Gzip** - Already configured in nginx.conf

2. **Use CDN** for static assets (CloudFlare, etc.)

3. **Add Redis** for caching:
   ```yaml
   # Add to docker-compose.yml
   redis:
     image: redis:alpine
     ports:
       - "6379:6379"
   ```

4. **Increase PostgreSQL memory:**
   ```yaml
   db:
     command: postgres -c shared_buffers=256MB -c max_connections=200
   ```

5. **Monitor with tools:**
   - Prometheus + Grafana
   - Uptime Kuma
   - Netdata

---

## 🎉 Success!

Your CanvasQuest is now running with:
- ✅ Automated CI/CD
- ✅ Docker containers
- ✅ PostgreSQL database
- ✅ Easy management scripts
- ✅ Health monitoring

**Access your app:**
- Frontend: http://YOUR_SERVER_IP
- Backend: http://YOUR_SERVER_IP:8000
- API Docs: http://YOUR_SERVER_IP:8000/docs

---

## 📞 Need Help?

- Check logs: `./scripts/logs.sh`
- Check status: `docker-compose ps`
- Restart everything: `docker-compose restart`
- View this guide: You're already here! 😊

**Happy deploying! 🚀**
