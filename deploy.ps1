# Deploy multimodal-router extension to Pi (Windows PowerShell)

Write-Host "🚀 Deploying Multimodal Router Extension..." -ForegroundColor Cyan

$PI_EXT_DIR = "$env:USERPROFILE\.pi\agent\extensions\multimodal-router"

Write-Host "📁 Target directory: $PI_EXT_DIR" -ForegroundColor Yellow

# Create extension directory structure
New-Item -ItemType Directory -Force -Path "$PI_EXT_DIR\src\siliconflow" | Out-Null
New-Item -ItemType Directory -Force -Path "$PI_EXT_DIR\src\tools" | Out-Null
New-Item -ItemType Directory -Force -Path "$PI_EXT_DIR\src\providers" | Out-Null
New-Item -ItemType Directory -Force -Path "$PI_EXT_DIR\src\storage" | Out-Null

# Copy files
Write-Host "📋 Copying files..." -ForegroundColor Yellow

Copy-Item -Path "index.ts" -Destination "$PI_EXT_DIR\" -Force
Copy-Item -Path "config.json" -Destination "$PI_EXT_DIR\" -Force
Copy-Item -Path "package.json" -Destination "$PI_EXT_DIR\" -Force
Copy-Item -Path "README.md" -Destination "$PI_EXT_DIR\" -Force

Copy-Item -Path "src\siliconflow\*" -Destination "$PI_EXT_DIR\src\siliconflow\" -Force
Copy-Item -Path "src\tools\*" -Destination "$PI_EXT_DIR\src\tools\" -Force
Copy-Item -Path "src\providers\*" -Destination "$PI_EXT_DIR\src\providers\" -Force

# Check and create storage directories
$artifactsDir = "D:\_tina\learning\AI_project\pi_custom\.artifacts"
$indexesDir = "D:\_tina\learning\AI_project\pi_custom\.indexes"

if (-not (Test-Path $artifactsDir)) {
    New-Item -ItemType Directory -Force -Path $artifactsDir | Out-Null
}

if (-not (Test-Path $indexesDir)) {
    New-Item -ItemType Directory -Force -Path $indexesDir | Out-Null
}

Write-Host ""
Write-Host "✅ Extension deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart Pi or run '/reload' command"
Write-Host "2. Try: 'generate an image of a sunset'"
Write-Host "3. Or attach an image and ask a question"
Write-Host ""
Write-Host "Multimodal Router is ready! 🎨" -ForegroundColor Green
