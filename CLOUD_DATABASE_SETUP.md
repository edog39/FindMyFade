# ☁️ Cloud Database Setup for FindMyFade

## 🌍 Global Database - Accessible Worldwide

Currently, you're using a **local SQLite database** (`prisma/dev.db`). This means data is stored only on your computer and not accessible from other devices or users worldwide.

To make FindMyFade **globally accessible**, you need a **cloud PostgreSQL database**.

---

## 📋 Quick Setup (Recommended: Neon - Free Forever)

### Step 1: Create a Free Neon Account

1. Go to **[Neon.tech](https://neon.tech)**
2. Click **"Sign Up"** (it's free forever!)
3. Sign in with GitHub (easiest option)

### Step 2: Create a New Project

1. Click **"Create a Project"**
2. Name it: `FindMyFade`
3. Select region: **US East (or closest to you)**
4. Click **"Create Project"**

### Step 3: Copy Your Connection String

1. After project creation, you'll see a **Connection String**
2. It looks like:
   ```
   postgresql://username:password@hostname.neon.tech/dbname?sslmode=require
   ```
3. **Copy this entire URL!**

### Step 4: Add to Your Project

1. In your terminal, run:
   ```bash
   cd /Users/ethanpeterson/.cursor-tutor
   echo 'DATABASE_URL="YOUR_NEON_CONNECTION_STRING_HERE"' > .env.local
   ```
   
   **Replace** `YOUR_NEON_CONNECTION_STRING_HERE` with the URL you copied!

2. Run database migrations:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

### Step 5: Test It!

1. Sign up as a barber on your computer
2. Open the app on another device or browser
3. You should see your barber profile! 🎉

---

## 🚀 Alternative: Supabase (Also Free)

### Setup Steps:

1. Go to **[Supabase.com](https://supabase.com)**
2. Create a new project
3. Go to **Settings → Database**
4. Copy the **Connection String (Pooler)**
5. Follow Step 4 above with your Supabase URL

---

## 🔧 Alternative: PlanetScale (Free Tier)

### Setup Steps:

1. Go to **[PlanetScale.com](https://planetscale.com)**
2. Create a new database
3. Copy the connection string
4. Follow Step 4 above with your PlanetScale URL

---

## ✅ Verification

After setup, verify your cloud database is working:

```bash
# Check Prisma can connect
npx prisma db push

# Check database is online
npx prisma studio
```

---

## 📝 Environment Variables

Your `.env.local` file should look like this:

```bash
# Cloud Database (Neon, Supabase, or PlanetScale)
DATABASE_URL="postgresql://user:pass@host.region.provider.tech/db?sslmode=require"
```

**⚠️ IMPORTANT:** 
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Keep your database password secure!

---

## 🌐 Deploy to Production (Vercel/Netlify)

When deploying to Vercel or Netlify:

1. Go to your project settings
2. Add **Environment Variable**: `DATABASE_URL`
3. Paste your cloud database connection string
4. Redeploy

Your app will now use the cloud database in production! 🚀

---

## 🔄 Migrating Existing Data

If you have existing data in your local database:

```bash
# Export data from SQLite (optional)
npx prisma db pull

# Push schema to cloud database
npx prisma db push

# Migrate data (manual or use seed scripts)
```

---

## 🆘 Troubleshooting

### "Error: P1001: Can't reach database server"
- Check your internet connection
- Verify the DATABASE_URL is correct
- Make sure SSL mode is included (`?sslmode=require`)

### "Error: Invalid DATABASE_URL"
- Double-check the connection string format
- Ensure no extra spaces or quotes

### "Connection pooling errors"
- Use the **pooler/connection pooling URL** from your provider
- Add `?pgbouncer=true` to the end of Supabase URLs

---

## 📞 Support

Need help? Contact FindMyFade support or check:
- [Neon Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**You're almost there! Once set up, FindMyFade will be globally accessible! 🌍✨**

