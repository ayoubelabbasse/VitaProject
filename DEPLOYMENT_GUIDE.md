# 🚀 Deployment Guide - TAQA Supplements Store

## Quick Deploy to Vercel (Recommended - FREE)

### Step 1: Prepare Your Code
1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. **Done!** You'll get a free URL like: `yourproject.vercel.app`

#### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Step 3: Configure Environment Variables (If Needed)
In Vercel Dashboard → Your Project → Settings → Environment Variables:
- Add any required env vars (if you have database URLs, API keys, etc.)

### Step 4: Database Considerations
**Important:** SQLite (local file) won't work on Vercel. You have options:

**Option 1: Use Vercel Postgres (Recommended for production)**
- Free tier available
- In Vercel Dashboard → Storage → Create Postgres Database
- Update `DATABASE_URL` in environment variables

**Option 2: Use External Database (Free options)**
- **Supabase** (free tier): https://supabase.com
- **PlanetScale** (free tier): https://planetscale.com
- **Railway** (free tier): https://railway.app

**Option 3: For Testing Only**
- You can deploy without database first to test UI
- Database features won't work until you add a database

### Step 5: Custom Domain (Optional - Later)
1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. **No need to buy domain now** - free subdomain works perfectly!

## 🎯 Quick Start Commands

```bash
# 1. Commit and push code
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy to Vercel (choose one method above)
```

## 📋 What You Get (FREE)
- ✅ Free subdomain: `yourproject.vercel.app`
- ✅ HTTPS automatically enabled
- ✅ Auto-deploy on git push
- ✅ Unlimited bandwidth (with limits)
- ✅ Global CDN
- ✅ Environment variables support

## 🔒 Security Notes
- Never commit `.env` files
- Use Vercel's environment variables for secrets
- Database credentials should be in environment variables

## 🆘 Troubleshooting
- **Build fails?** Check build logs in Vercel dashboard
- **Database errors?** Make sure you're using a cloud database, not SQLite
- **Environment variables?** Add them in Vercel dashboard settings

## 📞 Need Help?
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment







