# Pi Multimodal Router Extension

🎨 Bring multimodal capabilities to [Pi Coding Agent](https://pi.dev) through smart provider routing and SiliconFlow API integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Pi Extension](https://img.shields.io/badge/Pi-Extension-blue)](https://pi.dev)
[![Version](https://img.shields.io/badge/version-0.2.0-green)]()

## ✨ Features

### 🎨 Smart Image Generation
- **Intelligent Provider Routing** - Automatically uses the current provider's image model (e.g., `apidock/gpt-image-2`)
- **Auto Fallback** - Seamlessly falls back to SiliconFlow when provider fails or doesn't support image generation
- **Zero Configuration** - Works out of the box with smart detection

### 👁️ Vision Understanding
- **Automatic Fallback** - Provides vision capabilities to text-only models
- **Multi-Image Support** - Analyze multiple images simultaneously
- **Powered by Qwen3-VL-32B** - High-quality vision analysis

### 🔄 Auto Degradation
- Transparent failover between providers
- Clear logging of which model is being used
- No user intervention required

## 🚀 Quick Start

### Prerequisites

- [Pi Coding Agent](https://pi.dev) installed
- SiliconFlow API key ([Get one here](https://siliconflow.cn))

### Installation

#### Option 1: Global Installation (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/pi-multimodal-router.git

# Deploy the extension
cd pi-multimodal-router
./deploy.sh  # Linux/Mac
# or
.\deploy.ps1  # Windows
```

#### Option 2: Project-Local Installation

```bash
# Clone into your project
git clone https://github.com/yourusername/pi-multimodal-router.git .pi/extensions/multimodal-router

# Configure Pi to load the extension
# Extension will be auto-discovered from .pi/extensions/
```

### Configuration

Set your SiliconFlow API key:

```bash
# Linux/Mac
export SILICONFLOW_API_KEY="sk-your-api-key"

# Windows
setx SILICONFLOW_API_KEY "sk-your-api-key"
```

Optional: Set Apidock API key for `gpt-image-2` support:

```bash
export APIDOCK_API_KEY="your-apidock-key"
```

## 📖 Usage

### Image Generation

The extension automatically detects your current provider and routes accordingly.

**With Apidock:**
```
pi --model apidock/gpt-5.6-terra

> Generate a cyberpunk Tokyo street scene

🎨 Using apidock/gpt-image-2 for image generation
✅ Image generated successfully!
```

**With DeepSeek (auto fallback):**
```
pi --model deepseek/deepseek-v4-pro

> Generate a sunset image

🎨 Using SiliconFlow/Qwen/Qwen-Image for image generation
✅ Image generated successfully!
```

### Vision Understanding

For text-only models, images are automatically analyzed:

```
pi --model deepseek/deepseek-v4-pro

[Paste image with Alt+V]
What error is shown in this screenshot?

👁️ Analyzing 1 image(s) with vision model...
✅ Vision analysis complete
```

## 🔧 Configuration

Edit `config.json` to customize behavior:

```json
{
  "siliconflow": {
    "vision": {
      "model": "Qwen/Qwen3-VL-32B-Instruct"
    },
    "imageGeneration": {
      "model": "Qwen/Qwen-Image",
      "defaultWidth": 1024,
      "defaultHeight": 1024
    }
  },
  "routing": {
    "autoVisionFallback": true
  },
  "storage": {
    "artifactsDir": "~/.pi/artifacts",
    "indexesDir": "~/.pi/indexes"
  }
}
```

## 📁 Project Structure

```
pi-multimodal-router/
├── index.ts              # Extension entry point
├── config.json           # Configuration
├── src/
│   ├── siliconflow/      # SiliconFlow API wrappers
│   ├── providers/        # Provider-specific implementations
│   └── tools/            # Pi tool definitions
├── deploy.sh             # Linux/Mac deployment script
├── deploy.ps1            # Windows deployment script
└── docs/                 # Documentation
```

## 🧪 Testing

```bash
# Test API connectivity
node test-api.mjs

# Start Pi and test
pi
> generate a sunset image
```

## 🎯 Supported Providers

| Provider | Image Generation | Status |
|----------|------------------|--------|
| Apidock | gpt-image-2 | ✅ Supported |
| SiliconFlow | Qwen/Qwen-Image | ✅ Fallback |
| DeepSeek | - | ❌ Not supported |
| OpenAI | - | 🚧 Extensible |

## 📚 Documentation

- [USAGE.md](USAGE.md) - Detailed usage guide
- [SMART_ROUTING.md](SMART_ROUTING.md) - How smart routing works
- [TESTING.md](TESTING.md) - Testing guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide

## 🗺️ Roadmap

- [x] Vision understanding fallback
- [x] Smart provider routing
- [x] Image generation
- [ ] Video generation
- [ ] Audio transcription
- [ ] PDF RAG
- [ ] Manual priority configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding New Providers

1. Add the provider to `src/providers/router.ts`:
```typescript
const PROVIDER_IMAGE_MODELS: Record<string, string> = {
  apidock: "gpt-image-2",
  yourprovider: "your-model",  // Add here
};
```

2. Create `src/providers/yourprovider.ts`:
```typescript
export async function generateImageWithYourProvider(...) {
  // Implementation
}
```

3. Update the router to handle your provider.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Pi Coding Agent](https://pi.dev) - Excellent AI coding assistant framework
- [SiliconFlow](https://siliconflow.cn) - High-quality AI API platform
- [Qwen Team](https://github.com/QwenLM) - Open-source multimodal models

## 📧 Contact

- GitHub Issues: [Report a bug or request a feature](https://github.com/yourusername/pi-multimodal-router/issues)
- Discussions: [Join the discussion](https://github.com/yourusername/pi-multimodal-router/discussions)

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

---

**Version**: 0.2.0  
**Status**: Production Ready  
**Last Updated**: 2025-08-09
