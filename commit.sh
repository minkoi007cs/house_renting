#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Git Commit & Push Script${NC}\n"

# Check if there are changes
if [[ -z $(git status -s) ]]; then
    echo -e "${YELLOW}ℹ️  No changes to commit${NC}"
    exit 0
fi

# Show changes
echo -e "${YELLOW}📝 Changes to commit:${NC}"
git status -s
echo ""

# Ask for commit message
read -p "📌 Enter commit message: " commit_message

if [[ -z "$commit_message" ]]; then
    commit_message="Update application - $(date +%Y-%m-%d\ %H:%M:%S)"
fi

# Stage all changes
echo -e "${YELLOW}📦 Staging changes...${NC}"
git add -A

# Commit
echo -e "${YELLOW}💾 Committing...${NC}"
git commit -m "$commit_message

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

if [[ $? -ne 0 ]]; then
    echo -e "${RED}❌ Commit failed${NC}"
    exit 1
fi

# Push
echo -e "${YELLOW}⬆️  Pushing to remote...${NC}"
git push origin main

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ Successfully pushed to remote!${NC}"
else
    echo -e "${RED}❌ Push failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All done!${NC}"
