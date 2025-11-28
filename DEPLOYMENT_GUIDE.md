# 🚀 CanvasQuest Production Deployment Guide

This guide will help you deploy your CanvasQuest application to production.

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## 🎯 Overview

**Architecture:**
- **Backend:** FastAPI (Python) - API Server
- **Frontend:** React + Vite - Web Application
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **File Storage:** Local filesystem (can upgrade to S3/CloudFlare)

---

## ✅ Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account (for code hosting)
- [ ] Domain name (optional but recommended)
- [ ] PostgreSQL database (for production)

---

## 🔧 Backend Deployment

### Option 1: Railway (Recommended - Easy & Free Tier)

**Why Railway?**
- ✅ Free tier with $5 credit
- ✅ Built-in PostgreSQL
- ✅ Automatic deployments from GitHub
- ✅ Easy environment variables management

**Steps:**

1. **Push code to GitHub:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the Dockerfile

3. **Add PostgreSQL:**
   - In your Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision a database

4. **Set Environment Variables:**
   - Click on your backend service
   - Go to "Variables" tab
   - Add these variables:
     ```
     ENVIRONMENT=production
     DEBUG=False
     SECRET_KEY=<generate-random-secret-key>
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     CORS_ORIGINS=https://your-frontend-domain.com
     PORT=8000
     ```

5. **Deploy:**
   - Railway will automatically deploy
   - Note your backend URL (e.g., `https://your-app.railway.app`)

---

### Option 2: Render

**Steps:**

1. Push code to GitHub (same as above)

2. Go to [render.com](https://render.com)

3. Create "New Web Service"

4. Connect GitHub repo

5. Configure:
   - **Environment:** Docker
   - **Plan:** Free
   - **Environment Variables:** (same as Railway)

6. Click "Create Web Service"

---

### Option 3: Heroku

**Steps:**

1. Install Heroku CLI:
   ```bash
   brew install heroku/brew/heroku  # macOS
   ```

2. Create `Procfile` in backend:
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

3. Deploy:
   ```bash
   cd backend
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   heroku config:set ENVIRONMENT=production
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=your-secret-key
   git push heroku main
   ```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Free tier
- ✅ Automatic HTTPS
- ✅ Instant deployments
- ✅ Built for React/Vite

**Steps:**

1. **Update production API URL:**
   ```bash
   cd frontend
   # Edit .env.production
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production ready"
   git push
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable:**
   - In Vercel dashboard
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`

5. **Deploy:**
   - Vercel will automatically deploy
   - You'll get a URL like `https://your-app.vercel.app`

---

### Option 2: Netlify

**Steps:**

1. Update `.env.production` (same as Vercel)

2. Go to [netlify.com](https://netlify.com)

3. Click "Add new site" → "Import an existing project"

4. Connect GitHub repo

5. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

6. Add environment variable:
   - Site settings → Environment variables
   - Add `VITE_API_URL`

7. Deploy

---

## 🔐 Environment Variables

### Backend (.env.production)

```bash
# Required
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-with: openssl rand -hex 32>
DATABASE_URL=postgresql://user:password@host:5432/dbname

# CORS - Add your frontend URLs
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com

# Optional
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE=10485760
PORT=8000
```

### Frontend (.env.production)

```bash
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🎯 Quick Deploy Checklist

### Backend
- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] CORS origins include frontend URL
- [ ] Backend deployed and running
- [ ] Database migrations run (if needed)

### Frontend
- [ ] `VITE_API_URL` points to production backend
- [ ] Code pushed to GitHub
- [ ] Frontend deployed
- [ ] Can access the site

### Testing
- [ ] Frontend loads correctly
- [ ] Can create artwork
- [ ] Can save artwork
- [ ] Gallery displays artworks
- [ ] Quotes/descriptions show
- [ ] Authentication works

---

## 🔄 Update Backend CORS

After deploying frontend, update backend CORS:

**Railway:**
1. Go to your backend service
2. Variables tab
3. Update `CORS_ORIGINS`:
   ```
   https://your-frontend.vercel.app,https://your-custom-domain.com
   ```

---

## 🛠️ Post-Deployment

### 1. Test Everything

```bash
# Test backend health
curl https://your-backend.railway.app/api/health

# Test frontend
open https://your-frontend.vercel.app
```

### 2. Monitor Logs

**Railway:**
- Click on service → "Deployments" tab → View logs

**Vercel:**
- Project → "Deployments" → Click deployment → "Functions" tab

### 3. Set Up Custom Domain (Optional)

**Frontend (Vercel):**
1. Go to project settings → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

**Backend (Railway):**
1. Settings → "Networking"
2. "Custom Domain" → Add domain
3. Update DNS records

### 4. Update CORS Again
After adding custom domain, update `CORS_ORIGINS` to include it.

---

## 🚨 Common Issues

### Issue: CORS Error
**Solution:** Make sure `CORS_ORIGINS` includes your frontend URL

### Issue: Database Connection Error
**Solution:** Check `DATABASE_URL` format:
```
postgresql://user:password@host:5432/dbname
```

### Issue: 404 on Routes
**Frontend Solution:** Check `vercel.json` or `netlify.toml` for rewrites

### Issue: Environment Variables Not Working
**Solution:** Rebuild/redeploy after changing env vars

---

## 📊 Cost Estimate

**Free Tier Setup:**
- Backend (Railway): $5 credit (~1 month free)
- Frontend (Vercel): Unlimited
- Database (Railway PostgreSQL): Included
- **Total:** FREE for first month, then ~$5-10/month

**Paid Tier (Recommended for Production):**
- Backend: $5-10/month
- Frontend: Free
- Database: $5/month
- **Total:** ~$10-15/month

---

## 🎉 You're Live!

Your CanvasQuest app is now in production! 🎨

**Your URLs:**
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-app.railway.app
- **API Docs:** https://your-app.railway.app/docs

---

## 📞 Support

Need help? Check:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com

---

**Built with ❤️ for the Neurotech Hackathon**
