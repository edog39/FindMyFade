# Database Setup - Global Shared Database 🌍

To enable **global account discovery** where anyone can see barbers created from any computer, you need to set up a cloud database.

## Quick Setup with Neon (Free PostgreSQL) - 5 Minutes ⚡

### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub (easiest) or email
3. Click **"Create a Project"**

### Step 2: Get Your Connection String
1. On the Neon dashboard, you'll see your project
2. Click on your project name
3. Click **"Connection Details"** or **"Connection String"**
4. Copy the **full connection string** (looks like: `postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)

### Step 3: Add to Your Project
1. In your project root (`/Users/ethanpeterson/.cursor-tutor/`), create a file called `.env.local`
2. Add this line (replace with YOUR actual connection string):
```
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Step 4: Run Database Migration
Run these commands in your terminal:
```bash
cd /Users/ethanpeterson/.cursor-tutor
npx prisma db push
npx prisma generate
```

### Step 5: Restart the Server
```bash
npm run dev
```

## ✅ That's It!

Now when anyone creates a barber account:
- ✅ It's saved to the Neon cloud database
- ✅ Everyone around the world can discover it
- ✅ No more local-only accounts!

## Alternative: Supabase (Also Free)
If you prefer Supabase:
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the **Connection String** (Transaction mode)
5. Use that as your DATABASE_URL

## Troubleshooting
- If you see "Environment variable not found" → Make sure `.env.local` exists in the root directory
- If database won't connect → Check that your connection string is correct and includes `?sslmode=require`
- If you get migration errors → Try `npx prisma migrate reset` first

