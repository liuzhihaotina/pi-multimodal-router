# Pi Multimodal Router

🎨 Multimodal capability routing for [Pi Coding Agent](https://pi.dev) — give text-only models vision, image generation, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](CHANGELOG.md)
[![Pi Extension](https://img.shields.io/badge/Pi-Extension-blue.svg)](https://pi.dev/docs/latest/extensions)

**English** | [中文](#中文文档)

---

## Core Idea

Your main model stays the brain. Everything else becomes a sensor or a tool.

```
        ┌─────────── Claude / ChatGPT / DeepSeek ───────────┐
        │              Main agent (the brain)               │
        └────────────────────────┬──────────────────────────┘
                                 │
                       Multimodal Router
                                 │
        ┌────────────────┬───────┴────────┬────────────────┐
        │                │                │                │
   Vision (in)     Image gen (out)   Audio (planned)  Docs (planned)
        │                │                │                │
   Qwen3-VL-32B    Provider-aware    SenseVoice        PDF RAG
                    routing
```

Instead of switching models mid-session, the router quietly converts what your model can't read into something it can, and exposes generation capabilities as tools.

## Features

### 👁️ Vision Fallback

When your active model has no image input, attached images are analyzed by a vision model and injected as text. No configuration, no model switching.

```
> [paste screenshot with Alt+V] What's causing this error?

👁️ Analyzing 1 image(s) with vision model...
✅ Vision analysis complete

DeepSeek: The traceback in the screenshot shows a TypeError at src/router.ts:83 ...
```

If your model already supports images (Claude, GPT-5.x), the router steps aside and lets the native capability handle it.

### 🎨 Smart Image Generation

The `generate_image` tool prefers your current provider's own image model, and falls back automatically.

| Session provider | Model used | Why |
|---|---|---|
| `apidock` | `gpt-image-2` | Provider has a native image model |
| `deepseek` | `Qwen/Qwen-Image` (SiliconFlow) | Provider has none |
| any, on failure | `Qwen/Qwen-Image` (SiliconFlow) | Automatic fallback |

```
> Generate a cyberpunk Tokyo street at night, neon, rain, cinematic

🎨 Using apidock/gpt-image-2 for image generation
✅ Image generated successfully!
   Provider: apidock
   Saved to: .artifacts/2026-08-09/image-apidock-....png
```

Generated files are downloaded immediately to local storage, so expiring remote URLs never end up in your session history.

## Requirements

- [Pi Coding Agent](https://pi.dev) installed
- Node.js 18+
- A [SiliconFlow](https://siliconflow.cn) API key (used for vision and as the image fallback)
- Optional: an Apidock API key, if you want `gpt-image-2`

## Installation

```bash
git clone git@github.com:liuzhihaotina/pi-multimodal-router.git
cd pi-multimodal-router
```

Then deploy to your Pi extensions directory:

```bash
# Windows
.\deploy.ps1

# Linux / macOS
chmod +x deploy.sh && ./deploy.sh
```

This copies the extension into `~/.pi/agent/extensions/multimodal-router/`, where Pi auto-discovers it.

### Set your API key

```bash
# Windows (restart the terminal afterwards)
setx SILICONFLOW_API_KEY "sk-your-key"

# Linux / macOS
export SILICONFLOW_API_KEY="sk-your-key"

# Optional, enables apidock/gpt-image-2
export APIDOCK_API_KEY="your-key"
```

### Verify

```bash
node test-api.mjs
```

Then start Pi. You should see the extension announce itself:

```
✅ Multimodal Router Extension loaded
   Vision: Qwen/Qwen3-VL-32B-Instruct
   Image Gen: Qwen/Qwen-Image
```

## Configuration

Edit `config.json` (or the deployed copy in `~/.pi/agent/extensions/multimodal-router/`), then run `/reload` inside Pi.

```json
{
  "siliconflow": {
    "vision":          { "model": "Qwen/Qwen3-VL-32B-Instruct" },
    "imageGeneration": { "model": "Qwen/Qwen-Image", "defaultWidth": 1024, "defaultHeight": 1024 }
  },
  "routing": {
    "autoVisionFallback": true
  },
  "storage": {
    "artifactsDir": "path/to/.artifacts"
  }
}
```

| Key | Meaning |
|---|---|
| `siliconflow.vision.model` | Model used to describe images for text-only models |
| `siliconflow.imageGeneration.model` | Fallback image model |
| `routing.autoVisionFallback` | Set `false` to disable automatic image analysis |
| `storage.artifactsDir` | Where generated media is saved |

## Adding a Provider

Register the model, implement the call, and the router handles the rest.

```typescript
// src/providers/router.ts
const PROVIDER_IMAGE_MODELS: Record<string, string> = {
  apidock: "gpt-image-2",
  openai: "dall-e-3", // ← your addition
};
```

```typescript
// src/providers/openai.ts
export async function generateImageWithOpenAI(apiKey, options, artifactsDir) {
  // call the API, download the result, return { url, localPath, provider }
}
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full walkthrough.

## Project Layout

```
pi-multimodal-router/
├── index.ts                    # Extension entry: hooks + tool registration
├── config.json                 # Models, routing flags, storage paths
├── src/
│   ├── siliconflow/            # API wrappers (client, vision, image, video, stt)
│   ├── providers/              # router.ts (routing logic) + per-provider impls
│   └── tools/                  # Pi tool definitions
├── deploy.ps1 / deploy.sh      # Install into ~/.pi/agent/extensions/
└── test-api.mjs                # Connectivity and model availability check
```

## Roadmap

- [x] Vision fallback for text-only models
- [x] Image generation with smart provider routing
- [ ] Video generation (`generate_video`)
- [ ] Audio transcription (speech → text)
- [ ] PDF RAG with `document_search`
- [ ] User-defined provider priority lists

## Documentation

| Document | Contents |
|---|---|
| [QUICKSTART.md](QUICKSTART.md) | Fastest path to a working setup |
| [USAGE.md](USAGE.md) | Detailed usage, tips, troubleshooting |
| [SMART_ROUTING.md](SMART_ROUTING.md) | How provider routing and fallback work |
| [TESTING.md](TESTING.md) | Test cases and expected output |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development setup and PR process |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

## Security Notes

- API keys are read from environment variables only, never committed or logged.
- All API traffic uses HTTPS.
- Pi extensions run with your full user permissions — review the source before installing any extension, including this one.

See [SECURITY.md](SECURITY.md) to report a vulnerability.

## License

MIT — see [LICENSE](LICENSE).

## Acknowledgments

- [Pi Coding Agent](https://pi.dev) for the extension API
- [SiliconFlow](https://siliconflow.cn) for model hosting
- [Qwen](https://github.com/QwenLM) for the open multimodal models

---

<a name="中文文档"></a>

# Pi Multimodal Router（中文文档）

🎨 为 [Pi Coding Agent](https://pi.dev) 提供多模态能力路由 —— 让纯文本模型也能看图、生图。

[English](#pi-multimodal-router) | **中文**

## 设计理念

主模型始终是"大脑"，其他模型退化为"感知器"和"工具"。

```
        ┌─────────── Claude / ChatGPT / DeepSeek ───────────┐
        │                主 Agent（大脑）                    │
        └────────────────────────┬──────────────────────────┘
                                 │
                        多模态路由层
                                 │
        ┌────────────────┬───────┴────────┬────────────────┐
        │                │                │                │
    图片理解(入)      图片生成(出)      音频(计划)      文档(计划)
        │                │                │                │
   Qwen3-VL-32B    Provider 感知路由   SenseVoice       PDF RAG
```

与"会话中频繁切换模型"不同，路由层在后台把模型读不懂的内容转成它读得懂的文本，并把生成能力注册成工具。

## 功能

### 👁️ 视觉回退

当前模型不支持图片输入时，附件图片会先交给视觉模型分析，再以文本形式注入提示词。零配置，不切换模型。

```
> [Alt+V 粘贴截图] 这个报错是什么原因？

👁️ Analyzing 1 image(s) with vision model...
✅ Vision analysis complete

DeepSeek: 截图中的调用栈显示 src/router.ts 第 83 行抛出 TypeError……
```

如果主模型本身支持图片（Claude、GPT-5.x），路由层会自动让位，直接使用原生能力。

### 🎨 智能图片生成

`generate_image` 工具优先使用当前 provider 自带的图片模型，失败则自动降级。

| 会话 provider | 实际使用模型 | 原因 |
|---|---|---|
| `apidock` | `gpt-image-2` | provider 自带图片模型 |
| `deepseek` | `Qwen/Qwen-Image`（SiliconFlow） | provider 不支持 |
| 任意，调用失败时 | `Qwen/Qwen-Image`（SiliconFlow） | 自动降级 |

```
> 生成一张赛博朋克风格的东京夜景，霓虹，雨夜，电影感

🎨 Using apidock/gpt-image-2 for image generation
✅ Image generated successfully!
   Provider: apidock
   Saved to: .artifacts/2026-08-09/image-apidock-....png
```

生成结果会立即下载到本地，避免把有时效的远程 URL 写进会话历史。

## 环境要求

- 已安装 [Pi Coding Agent](https://pi.dev)
- Node.js 18+
- [硅基流动](https://siliconflow.cn) API Key（用于视觉理解和图片生成兜底）
- 可选：Apidock API Key（启用 `gpt-image-2`）

## 安装

```bash
git clone git@github.com:liuzhihaotina/pi-multimodal-router.git
cd pi-multimodal-router
```

部署到 Pi 扩展目录：

```bash
# Windows
.\deploy.ps1

# Linux / macOS
chmod +x deploy.sh && ./deploy.sh
```

脚本会把扩展复制到 `~/.pi/agent/extensions/multimodal-router/`，Pi 会自动发现。

### 配置 API Key

```bash
# Windows（设置后需重启终端才生效）
setx SILICONFLOW_API_KEY "sk-your-key"

# Linux / macOS
export SILICONFLOW_API_KEY="sk-your-key"

# 可选，用于启用 apidock/gpt-image-2
export APIDOCK_API_KEY="your-key"
```

### 验证安装

```bash
node test-api.mjs
```

启动 Pi，应看到扩展加载提示：

```
✅ Multimodal Router Extension loaded
   Vision: Qwen/Qwen3-VL-32B-Instruct
   Image Gen: Qwen/Qwen-Image
```

## 配置说明

修改 `config.json`（或已部署的 `~/.pi/agent/extensions/multimodal-router/config.json`），然后在 Pi 中执行 `/reload`。

| 配置项 | 说明 |
|---|---|
| `siliconflow.vision.model` | 为纯文本模型描述图片所用的模型 |
| `siliconflow.imageGeneration.model` | 图片生成兜底模型 |
| `routing.autoVisionFallback` | 设为 `false` 可关闭自动图片分析 |
| `storage.artifactsDir` | 生成的媒体文件保存位置 |

## 使用技巧

**粘贴图片**：Pi 原生支持，Windows 用 `Alt+V`，Linux/macOS 用 `Ctrl+V`，部分终端也支持直接拖拽图片文件。

**写好生图提示词**：描述越具体效果越好。

```
❌ 一只猫
✅ 一只橘色短毛猫坐在窗台上，柔和的午后阳光，暖色调，浅景深，高清摄影
```

**按主模型选择场景**：

| 主模型 | 原生视觉 | 建议 |
|---|---|---|
| Claude / GPT-5.x | ✅ | 视觉分析走原生，生图走本扩展 |
| DeepSeek | ❌ | 视觉与生图都由本扩展补齐 |

## 扩展新 Provider

注册模型、实现调用，路由逻辑无需改动。

```typescript
// src/providers/router.ts
const PROVIDER_IMAGE_MODELS: Record<string, string> = {
  apidock: "gpt-image-2",
  openai: "dall-e-3", // ← 新增
};
```

```typescript
// src/providers/openai.ts
export async function generateImageWithOpenAI(apiKey, options, artifactsDir) {
  // 调用 API、下载结果、返回 { url, localPath, provider }
}
```

完整步骤见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 目录结构

```
pi-multimodal-router/
├── index.ts                    # 扩展入口：事件钩子 + 工具注册
├── config.json                 # 模型、路由开关、存储路径
├── src/
│   ├── siliconflow/            # API 封装（client / vision / image / video / stt）
│   ├── providers/              # router.ts（路由逻辑）+ 各 provider 实现
│   └── tools/                  # Pi 工具定义
├── deploy.ps1 / deploy.sh      # 安装到 ~/.pi/agent/extensions/
└── test-api.mjs                # 连通性与模型可用性检查
```

## 常见问题

**扩展没加载？** 重新执行部署脚本，然后在 Pi 中 `/reload`。

**API Key 不生效？** Windows 上 `setx` 需要重启终端；可用 `echo $env:SILICONFLOW_API_KEY` 确认。

**生成的图片在哪？** 默认在 `config.json` 的 `storage.artifactsDir`，按日期分目录存放。

更多排查步骤见 [USAGE.md](USAGE.md) 与 [TESTING.md](TESTING.md)。

## 开发路线

- [x] 纯文本模型的视觉回退
- [x] 带智能 provider 路由的图片生成
- [ ] 视频生成（`generate_video`）
- [ ] 音频转写（语音 → 文本）
- [ ] PDF RAG 与 `document_search`
- [ ] 用户自定义 provider 优先级

## 安全说明

- API Key 仅从环境变量读取，不写入仓库、不打印到日志
- 所有 API 请求走 HTTPS
- Pi 扩展以你的完整用户权限运行 —— 安装任何扩展（包括本项目）前请先审阅源码

漏洞反馈方式见 [SECURITY.md](SECURITY.md)。

## 参与贡献

欢迎 Issue 和 Pull Request。开发环境搭建、代码风格与提交规范见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 开源协议

MIT，详见 [LICENSE](LICENSE)。

## 致谢

- [Pi Coding Agent](https://pi.dev) —— 提供扩展 API
- [硅基流动](https://siliconflow.cn) —— 提供模型托管
- [Qwen](https://github.com/QwenLM) —— 开源多模态模型
