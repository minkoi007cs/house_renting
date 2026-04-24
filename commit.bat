@echo off
setlocal enabledelayedexpansion

echo.
echo 🚀 Git Commit ^& Push Script
echo.

REM Check if there are changes
git status -s >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('git status -s') do set "haschanges=1"
)

if not defined haschanges (
    echo ℹ️  No changes to commit
    exit /b 0
)

REM Show changes
echo 📝 Changes to commit:
git status -s
echo.

REM Ask for commit message
set /p commit_message="📌 Enter commit message: "

if "!commit_message!"=="" (
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
    for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)
    set commit_message=Update application - !mydate! !mytime!
)

REM Stage all changes
echo.
echo 📦 Staging changes...
git add -A

REM Commit
echo 💾 Committing...
git commit -m "!commit_message!

Co-Authored-By: Claude Haiku 4.5 ^<noreply@anthropic.com^>"

if %errorlevel% neq 0 (
    echo ❌ Commit failed
    exit /b 1
)

REM Push
echo ⬆️  Pushing to remote...
git push origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to remote!
) else (
    echo ❌ Push failed
    exit /b 1
)

echo.
echo 🎉 All done!
pause
