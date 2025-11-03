#!/bin/bash

# FindMyFade Quick Start Script
echo "🚀 FindMyFade Quick Start"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "2. Restart terminal and run: nvm install --lts"
    echo "3. Then run this script again"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo "✅ npm found: $(npm -v)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "This may take a few minutes..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully!"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Starting development server..."
echo "Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================="
echo ""

npm run dev
