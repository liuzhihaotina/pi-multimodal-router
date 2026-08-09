# Multimodal Router Extension

## 项目概述

这是一个为 [Pi Coding Agent](https://pi.dev) 开发的多模态路由扩展，通过 SiliconFlow API 为纯文本模型（Claude、DeepSeek、ChatGPT）提供多模态能力。

### 核心理念

**主模型永远是"大脑"，SiliconFlow 模型是"感知器"和"工具"。**

## 快速开始

### 1. 部署扩展

```powershell
cd D:\_tina\learning\AI_project\pi_custom\multimodal-router
.\deploy.ps1
```

### 2. 启动 Pi

```bash
pi
```

### 3. 测试功能

```
# 图片生成
生成一张日落的图片

# 视觉理解（附加图片后）
这张图片是什么？
```

## 当前功能

✅ **视觉理解** - 自动为不支持视觉的模型提供图片分析  
✅ **图片生成** - 通过 `generate_image` 工具生成高质量图片  
🚧 **视频生成** - 计划中  
🚧 **音频转录** - 计划中  
🚧 **PDF RAG** - 计划中  

## 技术架构

```
主模型 (Claude/DeepSeek/ChatGPT)
    │
    ├─► 视觉理解 → Qwen3-VL-32B
    ├─► 图片生成 → Qwen-Image
    ├─► Embedding → Qwen3-VL-Embedding-8B
    └─► 音频转录 → SenseVoiceSmall
```

## 文档

- [USAGE.md](./USAGE.md) - 详细使用说明
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南
- [README.md](./README.md) - 完整项目文档
- [instruction.md](../instruction.md) - 架构设计文档

## 文件结构

```
multimodal-router/
├── index.ts              # 扩展入口
├── config.json           # 配置文件
├── package.json          # 包信息
├── deploy.ps1            # Windows 部署脚本
├── deploy.sh             # Linux/Mac 部署脚本
├── test-api.mjs          # API 测试脚本
└── src/
    ├── siliconflow/      # SiliconFlow API 封装
    │   ├── client.ts     # HTTP 客户端
    │   ├── vision.ts     # 视觉理解
    │   ├── image.ts      # 图片生成
    │   ├── video.ts      # 视频生成
    │   └── stt.ts        # 语音转文字
    └── tools/            # Pi 工具定义
        └── generate-image.ts
```

## 配置

编辑 `~/.pi/agent/extensions/multimodal-router/config.json`：

```json
{
  "siliconflow": {
    "vision": {
      "model": "Qwen/Qwen3-VL-32B-Instruct"
    },
    "imageGeneration": {
      "model": "Qwen/Qwen-Image"
    }
  },
  "routing": {
    "autoVisionFallback": true
  }
}
```

## 测试

```powershell
# 测试 API 连接
$env:SILICONFLOW_API_KEY='sk-...'
node test-api.mjs
```

## 故障排查

### 扩展未加载
```powershell
.\deploy.ps1
```

### API Key 未生效
重启终端使环境变量生效。

### 查看生成的图片
```powershell
explorer D:\_tina\learning\AI_project\pi_custom\.artifacts
```

## 开发计划

- [x] 视觉理解 (Phase 1) ✅
- [x] 图片生成 (Phase 1) ✅
- [ ] 视频生成 (Phase 2)
- [ ] 音频转文字 (Phase 2)
- [ ] PDF RAG (Phase 3)

## License

MIT

---

Created with ❤️ for Pi Coding Agent
