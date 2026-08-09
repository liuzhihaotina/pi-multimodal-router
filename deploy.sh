#!/bin/bash
# Deploy multimodal-router extension to Pi

set -e

echo "🚀 Deploying Multimodal Router Extension..."

# Determine home directory (cross-platform)
if [ -n "$USERPROFILE" ]; then
    # Windows
    HOME_DIR="$USERPROFILE"
else
    # Linux/Mac
    HOME_DIR="$HOME"
fi

PI_EXT_DIR="$HOME_DIR/.pi/agent/extensions/multimodal-router"

echo "📁 Target directory: $PI_EXT_DIR"

# Create extension directory
mkdir -p "$PI_EXT_DIR/src/siliconflow"
mkdir -p "$PI_EXT_DIR/src/tools"
mkdir -p "$PI_EXT_DIR/src/storage"

# Copy files
echo "📋 Copying files..."
cp index.ts "$PI_EXT_DIR/"
cp config.json "$PI_EXT_DIR/"
cp package.json "$PI_EXT_DIR/"
cp README.md "$PI_EXT_DIR/"

cp -r src/siliconflow/* "$PI_EXT_DIR/src/siliconflow/"
cp -r src/tools/* "$PI_EXT_DIR/src/tools/"

# Check if storage directories exist
if [ ! -d "D:/_tina/learning/AI_project/pi_custom/.artifacts" ]; then
    mkdir -p "D:/_tina/learning/AI_project/pi_custom/.artifacts"
fi

if [ ! -d "D:/_tina/learning/AI_project/pi_custom/.indexes" ]; then
    mkdir -p "D:/_tina/learning/AI_project/pi_custom/.indexes"
fi

echo "✅ Extension deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Restart Pi or run '/reload' command"
echo "2. Check status with '/reload'"
echo "3. Try: 'generate an image of a sunset'"
echo ""
echo "Multimodal Router is ready! 🎨"
