#!/bin/bash

echo "🌍 FindMyFade - Cloud Database Setup"
echo "===================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
  echo "✅ Found .env.local file"
  
  # Check if DATABASE_URL is set
  if grep -q "DATABASE_URL" .env.local; then
    echo "✅ DATABASE_URL is configured"
    
    # Check if it's a cloud database (not SQLite)
    if grep -q "postgresql://" .env.local; then
      echo "✅ Using PostgreSQL cloud database"
    else
      echo "⚠️  Warning: Not using a cloud database!"
      echo "   Please update DATABASE_URL in .env.local to use a cloud PostgreSQL database"
      echo "   See CLOUD_DATABASE_SETUP.md for instructions"
      exit 1
    fi
  else
    echo "❌ DATABASE_URL not found in .env.local"
    echo "   Please add your cloud database URL"
    exit 1
  fi
else
  echo "❌ .env.local file not found"
  echo ""
  echo "📝 Creating .env.local file..."
  echo "DATABASE_URL=\"postgresql://user:password@hostname:5432/database?sslmode=require\"" > .env.local
  echo "✅ Created .env.local"
  echo ""
  echo "⚠️  IMPORTANT: You need to replace the DATABASE_URL with your actual cloud database URL!"
  echo ""
  echo "🚀 Quick Steps:"
  echo "1. Go to https://neon.tech and create a free account"
  echo "2. Create a new project called 'FindMyFade'"
  echo "3. Copy your connection string"
  echo "4. Replace the DATABASE_URL in .env.local with your connection string"
  echo "5. Run this script again"
  echo ""
  echo "📖 Full instructions: See CLOUD_DATABASE_SETUP.md"
  exit 1
fi

echo ""
echo "🔄 Setting up database schema..."
echo ""

# Run Prisma migrations
npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database schema created successfully!"
else
  echo ""
  echo "❌ Failed to create database schema"
  echo "   Check your DATABASE_URL and try again"
  exit 1
fi

echo ""
echo "🔧 Generating Prisma Client..."
echo ""

# Generate Prisma client
npx prisma generate

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Prisma Client generated successfully!"
else
  echo ""
  echo "❌ Failed to generate Prisma Client"
  exit 1
fi

echo ""
echo "✨ Setup Complete!"
echo ""
echo "🎉 Your FindMyFade app is now using a GLOBAL CLOUD DATABASE!"
echo ""
echo "🌍 Anyone in the world can now:"
echo "   • Create a barber account"
echo "   • Upload showcase videos"
echo "   • Be discovered by clients globally"
echo ""
echo "🚀 Start your dev server:"
echo "   npm run dev"
echo ""
echo "📊 View your database:"
echo "   npx prisma studio"
echo ""

