#!/bin/bash

echo "🔧 FindMyFade Database Fix Script"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Creating .env file..."
    echo "Please add your DATABASE_URL to the .env file:"
    echo ""
    echo "DATABASE_URL=\"postgresql://username:password@your-neon-host/neondb?sslmode=require\""
    echo ""
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL not found in .env"
    echo ""
    echo "Add this line to your .env file:"
    echo "DATABASE_URL=\"your-neon-connection-string\""
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL is configured"
echo ""

# Kill any running servers
echo "🛑 Stopping any running servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
echo ""

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate
echo ""

# Push database schema
echo "📤 Syncing database schema..."
npx prisma db push --accept-data-loss
echo ""

# Start dev server
echo "🚀 Starting dev server..."
echo ""
echo "=================================="
echo "✅ Setup complete!"
echo ""
echo "Your server is starting at: http://localhost:3000"
echo ""
echo "Visit these pages to verify:"
echo "  • http://localhost:3000/setup-check (System status)"
echo "  • http://localhost:3000/api/health (API health)"
echo "  • http://localhost:3000/clear-cache (Clear cache)"
echo ""
echo "To test authentication:"
echo "  node test-auth.js"
echo ""
echo "=================================="
echo ""

npm run dev

