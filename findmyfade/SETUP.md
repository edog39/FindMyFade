# FindMyFade - Complete Setup Guide 🚀

## Quick Start (5 Minutes)

### Step 1: Install Node.js
If you don't have Node.js installed:

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart your terminal or run:
source ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node -v  # Should show v20.x.x or similar
npm -v   # Should show v10.x.x or similar
```

### Step 2: Install Dependencies

```bash
cd /Users/ethanpeterson/.cursor-tutor/findmyfade
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Prisma (database)
- And all other dependencies

### Step 3: Run the Development Server

```bash
npm run dev
```

**That's it!** Open http://localhost:3000 in your browser.

---

## Features Available Immediately

All pages work with mock data - no database or API keys needed to explore:

✅ **Landing Page** - http://localhost:3000
✅ **Discovery** - http://localhost:3000/discover
✅ **Map View** - http://localhost:3000/map
✅ **Barber Profile** - http://localhost:3000/barber/1
✅ **AI Style Recs** - http://localhost:3000/ai-style
✅ **Booking** - http://localhost:3000/book/1
✅ **Reels** - http://localhost:3000/reels
✅ **Wallet** - http://localhost:3000/wallet
✅ **Reviews** - http://localhost:3000/reviews/1
✅ **Auth Pages** - http://localhost:3000/login, /signup

---

## Troubleshooting

### "Command not found: npm"
- You need to install Node.js first (see Step 1 above)

### "Cannot find module 'react'"
- Run `npm install` to install all dependencies

### TypeScript Errors
- These are normal before running `npm install`
- All errors will disappear after dependencies are installed

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run dev
```

---

## Deploy to Production (Optional)

### Deploy to Vercel (Recommended - Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts (accept all defaults)
# Get your live URL!
```

### Deploy to Other Platforms

The app works on:
- **Vercel** (Best for Next.js)
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

---

## Optional: Database Setup (For Real Data)

The app works fine with mock data, but for production:

1. **Create a PostgreSQL database** (free options):
   - Railway.app
   - Supabase
   - Neon.tech
   - Local PostgreSQL

2. **Add connection string**:
   ```bash
   # Create .env.local file
   DATABASE_URL="postgresql://..."
   ```

3. **Initialize database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## Optional: Add API Keys (For Production Features)

### Google Maps (for real maps)
```bash
# In .env.local
GOOGLE_MAPS_API_KEY="your-key-here"
```

### Stripe (for real payments)
```bash
# In .env.local
STRIPE_PUBLIC_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
```

### NextAuth (for real authentication)
```bash
# In .env.local
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Lint code
npm run lint

# Format with Prettier (optional)
npm run format
```

---

## Project Structure

```
findmyfade/
├── src/
│   ├── app/              # All pages
│   │   ├── page.tsx     # Landing page
│   │   ├── discover/    # Search & discovery
│   │   ├── map/         # Map view
│   │   ├── barber/      # Barber profiles
│   │   ├── book/        # Booking system
│   │   ├── ai-style/    # AI recommendations
│   │   ├── reels/       # Social media feed
│   │   ├── wallet/      # Loyalty & payments
│   │   ├── reviews/     # Review system
│   │   └── login|signup # Authentication
│   ├── components/      # Shared components
│   ├── lib/            # Utilities
│   └── types/          # TypeScript types
├── prisma/             # Database schema
├── public/             # Static files
└── package.json        # Dependencies
```

---

## Need Help?

1. **Check the console** - Most errors show helpful messages
2. **Restart dev server** - Many issues fixed with a restart
3. **Clear cache**: `rm -rf .next && npm run dev`
4. **Reinstall**: `rm -rf node_modules && npm install`

---

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Explore all features at http://localhost:3000
4. ✅ Deploy to Vercel for a live demo
5. 📊 Add real database (optional)
6. 🔑 Add API keys (optional)
7. 🎨 Customize design and features

**You're all set! Enjoy FindMyFade!** 🎉
