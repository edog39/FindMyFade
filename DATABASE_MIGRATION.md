# Database Migration Guide

## Issue: Production Database Schema Mismatch

If you're seeing errors like:
```
Invalid `prisma.user.findUnique()` invocation
Validation Error Count: 1
```

This means your production database schema is out of sync with your Prisma schema.

## Solution: Sync Production Database

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI if you haven't:
   ```bash
   npm i -g vercel
   ```

2. Pull production environment variables:
   ```bash
   vercel env pull .env.production
   ```

3. Sync the production database:
   ```bash
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma db push
   ```

4. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```

### Option 2: Using Script

1. Set your production DATABASE_URL:
   ```bash
   export DATABASE_URL="your-production-database-url"
   ```

2. Run the sync script:
   ```bash
   npm run db:sync
   ```

### Option 3: Manual Sync

1. Get your production DATABASE_URL from Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Copy the DATABASE_URL value

2. Run Prisma db push:
   ```bash
   DATABASE_URL="your-production-url" npx prisma db push
   ```

3. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```

## After Migration

Once the database is synced:
1. Redeploy your Vercel application
2. Test signup/login functionality
3. Verify all endpoints are working

## Notes

- `prisma db push` syncs the schema without creating migration files
- This is fine for development and smaller projects
- For production apps, consider using `prisma migrate` for version-controlled migrations
- Always backup your production database before running migrations

