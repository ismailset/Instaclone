#!/bin/bash

echo "🚀 Starting Instagram Clone..."
echo "📱 This will start both frontend and backend servers"
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    if [ ! -d "backend/node_modules" ]; then
        echo "Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
    if [ ! -d "frontend/node_modules" ]; then
        echo "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
    fi
fi

echo "🌱 Seeding demo data (if not already done)..."
cd backend && npm run seed > /dev/null 2>&1 && cd ..

echo ""
echo "🎉 Starting servers..."
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "📋 Demo Login Credentials:"
echo "Username: john_doe, Password: demo123"
echo "Username: jane_smith, Password: demo123"
echo "Username: mike_wilson, Password: demo123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers using concurrently
npm run dev