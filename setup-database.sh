#!/bin/bash

echo "🔥 FindMyFade - Database Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo ""
    echo "Please create a .env.local file with your database connection string:"
    echo ""
    echo "DATABASE_URL=\"postgresql://username:password@host/database?sslmode=require\""
    echo ""
    echo "📖 See DATABASE_SETUP.md for detailed instructions"
    echo ""
    exit 1
fi

echo "✅ Found .env.local file"
echo ""
echo "📊 Pushing database schema to cloud..."
npx prisma db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database schema deployed successfully!"
    echo ""
    echo "🔄 Generating Prisma Client..."
    npx prisma generate
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✨ All set! Your database is ready!"
        echo ""
        echo "🚀 Run 'npm run dev' to start the server"
        echo ""
        echo "Now anyone can:"
        echo "  ✓ Create barber accounts"
        echo "  ✓ Discover ALL barbers globally"
        echo "  ✓ See barbers from any device/location"
        echo ""
    fi
else
    echo ""
    echo "❌ Database setup failed"
    echo "Please check your DATABASE_URL in .env.local"
    echo ""
fi

