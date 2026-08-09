# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-08-09

### Added
- 🎯 **Smart Provider Routing** - Automatically detects current provider and routes to appropriate image generation model
- ✅ **Apidock Support** - Native support for `apidock/gpt-image-2`
- 🔄 **Auto Fallback** - Seamless fallback to SiliconFlow when provider fails or doesn't support image generation
- 📊 **Provider Info Display** - Shows which provider and model was used for generation
- 📝 **New Documentation**:
  - SMART_ROUTING.md - Detailed routing mechanism explanation
  - TESTING.md - Comprehensive testing guide
  - RELEASE_v0.2.0.md - Release notes

### Changed
- 🔧 **Enhanced `generate_image` tool** - Now uses smart routing instead of direct SiliconFlow call
- 📖 **Updated README** - Added smart routing information
- ⚙️ **Config description** - Clarified SiliconFlow as fallback

### Fixed
- 🐛 **Config file loading** - Fixed path resolution issue on Windows using `fileURLToPath` and `dirname`

## [0.1.0] - 2025-08-09

### Added
- 👁️ **Vision Understanding Fallback** - Automatically provides vision capabilities to text-only models
- 🎨 **Image Generation** - Generate images using SiliconFlow's Qwen-Image model
- 🔧 **SiliconFlow API Integration** - Complete API wrapper for vision, image generation, STT, and video
- 📦 **Deployment Scripts** - Cross-platform deployment (`deploy.ps1` for Windows, `deploy.sh` for Linux/Mac)
- 🧪 **Testing Scripts** - API connectivity and image generation tests
- 📚 **Comprehensive Documentation**:
  - README.md - Complete project documentation
  - USAGE.md - Detailed usage guide with examples
  - QUICKSTART.md - Quick start guide
  - PROJECT_SUMMARY.md - Project summary
  - QUICK_REFERENCE.txt - Quick reference card

### Technical Details
- 📁 **Modular Architecture**:
  - `src/siliconflow/` - API wrappers (client, vision, image, video, stt)
  - `src/tools/` - Pi tool definitions
  - `src/storage/` - Storage utilities (for future use)
- ⚙️ **Configuration System** - JSON-based configuration with sensible defaults
- 🎯 **Multi-Image Support** - Analyze multiple images simultaneously
- 💾 **Local Storage** - Automatically saves generated images to local `.artifacts/` directory

### Supported Models
- **Vision**: Qwen/Qwen3-VL-32B-Instruct (32B parameters)
- **Image Generation**: Qwen/Qwen-Image
- **Embedding**: Qwen/Qwen3-VL-Embedding-8B
- **STT**: FunAudioLLM/SenseVoiceSmall

### Dependencies
- Pi Coding Agent (Extension API)
- SiliconFlow API (requires API key)
- Node.js 18+ (for development)

---

## [Unreleased]

### Planned Features
- 🎬 **Video Generation** - Generate videos from text or images
- 🎤 **Audio Transcription** - Convert speech to text
- 📚 **PDF RAG** - Document processing with retrieval-augmented generation
- ⚙️ **Manual Priority Configuration** - Allow users to customize provider priorities
- 🔌 **More Provider Support** - OpenAI, Stability AI, etc.

---

## Version Naming

- **Major** (X.0.0): Breaking changes or major feature additions
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes, documentation updates

## Links

- [GitHub Releases](https://github.com/yourusername/pi-multimodal-router/releases)
- [Issues](https://github.com/yourusername/pi-multimodal-router/issues)
- [Discussions](https://github.com/yourusername/pi-multimodal-router/discussions)
