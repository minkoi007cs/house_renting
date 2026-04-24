@echo off
echo 🚀 Starting House Rental App (Monorepo)...

REM Check if dependencies are installed
if not exist "backend\node_modules" (
  echo 📦 Installing backend dependencies...
  cd backend && call npm install && cd ..
)

if not exist "frontend\node_modules" (
  echo 📦 Installing frontend dependencies...
  cd frontend && call npm install && cd ..
)

REM Check if .env files exist
if not exist "backend\.env" (
  echo ⚠️  Warning: backend\.env not found. Copy from .env.example
)

if not exist "frontend\.env" (
  echo ⚠️  Warning: frontend\.env not found. Copy from .env.example
)

echo.
echo ════════════════════════════════════════
echo Starting services...
echo ════════════════════════════════════════
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.

REM Check if concurrently is installed
where concurrently >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ⚠️  concurrently not installed. Installing...
  call npm install
)

call npm run dev
pause
