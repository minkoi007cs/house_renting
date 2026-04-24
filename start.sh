#!/bin/bash

echo "🚀 Starting House Rental App (Monorepo)..."

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
  echo "⚠️  Warning: backend/.env not found. Copy from .env.example"
fi

if [ ! -f "frontend/.env" ]; then
  echo "⚠️  Warning: frontend/.env not found. Copy from .env.example"
fi

echo ""
echo "════════════════════════════════════════"
echo "Starting services..."
echo "════════════════════════════════════════"
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""

# Start both services
if command -v concurrently &> /dev/null; then
  npm run dev
else
  echo "⚠️  concurrently not installed. Installing..."
  npm install
  npm run dev
fi
