# 🚀 Deploy BNB Wallet Server (FREE)

## Option 1: Render.com (Recommended - Easiest)

### Steps:

1. **Push code to GitHub:**
   ```bash
   cd /Users/ani/Desktop/claude-skill/bnb-wallet-server
   git init
   git add .
   git commit -m "Initial commit"

   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/bnb-wallet-server.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com
   - Sign up (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Name:** bnb-wallet-server
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
   - Click "Create Web Service"

3. **Get your URL:**
   - You'll get: `https://bnb-wallet-server.onrender.com`
   - Test: `https://bnb-wallet-server.onrender.com/api/health`

**Pros:**
- ✅ Free tier available
- ✅ Auto-deploys on git push
- ✅ SSL included
- ✅ Stays running (sleeps after 15min inactive, wakes on request)

---

## Option 2: Railway.app (Good Alternative)

1. **Go to:** https://railway.app
2. **Login with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select:** bnb-wallet-server repo
5. **Deploy:** Automatic!

**Free tier:** $5/month credit

---

## Option 3: Vercel (Serverless - Fastest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd /Users/ani/Desktop/claude-skill/bnb-wallet-server
   vercel --prod
   ```

3. **Follow prompts** and get your URL instantly!

**Pros:**
- ✅ Instant deployment
- ✅ Global CDN
- ✅ Free tier

---

## Option 4: Fly.io

1. **Install Fly CLI:**
   ```bash
   brew install flyctl
   ```

2. **Deploy:**
   ```bash
   cd /Users/ani/Desktop/claude-skill/bnb-wallet-server
   fly launch
   fly deploy
   ```

**Free tier:** 3 shared-cpu VMs

---

## After Deployment

Once deployed, you'll get a URL like:
```
https://bnb-wallet-server.onrender.com
https://bnb-wallet-server.vercel.app
https://bnb-wallet-server.fly.dev
```

### Test your deployment:

```bash
# Health check
curl https://YOUR-URL.com/api/health

# Balance check
curl https://YOUR-URL.com/api/balance/0x3a474032fe8660c274a48e7c6fe5a0ffa218fca8
```

### Update Claude Desktop Skill:

Update the `SERVER_URL` in:
- `bnb-local-server/scripts/check_balance.py`
- `bnb-local-server/scripts/check_token.py`

Change from:
```python
SERVER_URL = "http://localhost:3000"
```

To:
```python
SERVER_URL = "https://YOUR-DEPLOYED-URL.com"
```

Then re-package and upload to Claude Desktop!

---

## Recommended: Render.com

**Why?**
- ✅ Easiest to set up
- ✅ Free tier is generous
- ✅ Auto-redeploys on git push
- ✅ Built-in monitoring
- ✅ SSL certificate included

**Free tier limits:**
- 750 hours/month
- Sleeps after 15min inactive (wakes in ~30sec)
- 512MB RAM
- 0.1 CPU

Perfect for this use case!
