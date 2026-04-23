#!/bin/bash

# San Gabriel Portal - Hostinger Build Automation Script
# This script prepares a production-ready static export for Hostinger deployment.

# Exit on error
set -e

# Define paths
ZIP_NAME="hostinger-build.zip"
OUTPUT_DIR="out"

echo "🚀 Starting Hostinger Build Process..."

# 1. Clean up old builds
echo "🧹 Cleaning up previous artifacts..."
rm -f $ZIP_NAME
rm -rf hostinger-build/

# 2. Run Next.js Build
echo "🏗️ Building Next.js project..."
npm run build

# 3. Verify .htaccess (Ensure it was copied from public/)
if [ ! -f "$OUTPUT_DIR/.htaccess" ]; then
    echo "⚠️ Warning: .htaccess not found in $OUTPUT_DIR. Copying manually..."
    cp public/.htaccess $OUTPUT_DIR/
fi

# 4. Create the deployment ZIP
echo "📦 Packaging project for Hostinger..."
cd $OUTPUT_DIR
zip -r ../$ZIP_NAME .
cd ..

echo "✅ Success! Your deployment file is ready: $ZIP_NAME"
echo "👉 Instructions: Upload $ZIP_NAME to your Hostinger public_html directory and extract it."
