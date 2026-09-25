#!/bin/bash

echo "🔧 Fixing import paths from 'src/*' to relative paths..."

# Fix all TypeScript files in src directory
find src -name "*.ts" -type f | while read file; do
    # Get the depth of the file (how many directories deep)
    depth=$(echo "$file" | grep -o '/' | wc -l)

    # Calculate relative path prefix
    # e.g., src/auth/auth.controller.ts has depth 2, so prefix is "../"
    if [ $depth -eq 1 ]; then
        # File is in src/ directly
        prefix="./"
    elif [ $depth -eq 2 ]; then
        # File is in src/module/
        prefix="../"
    else
        # File is deeper
        prefix="../../"
    fi

    # Replace all 'src/ imports with relative paths
    # First pass: replace 'src/config/
    sed -i "" "s|from 'src/config/|from '${prefix}config/|g" "$file"

    # Replace 'src/common/
    sed -i "" "s|from 'src/common/|from '${prefix}common/|g" "$file"

    # Replace other src/ paths
    sed -i "" "s|from 'src/|from '${prefix}|g" "$file"

    # Also handle import statements (not just from)
    sed -i "" "s|import '${prefix}|from '${prefix}|g" "$file"
done

echo "✅ Import paths fixed!"
echo ""
echo "🔍 Verifying changes:"
grep -r "from 'src/" src/ 2>/dev/null || echo "✓ No 'src/' imports found"

echo ""
echo "🔨 Building to verify..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed - check errors above"
fi
