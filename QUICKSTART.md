# Multimodal Router Extension - Quick Start Guide

## 快速开始

### 1. 部署扩展

**Windows (PowerShell):**
```powershell
cd D:\_tina\learning\AI_project\pi_custom\multimodal-router
.\deploy.ps1
```

**Linux/Mac:**
```bash
cd ~/path/to/multimodal-router
chmod +x deploy.sh
./deploy.sh
```

### 2. 重启 Pi 或重新加载

```bash
# 在 Pi 中执行
/reload
```

### 3. 测试功能

#### 图片生成测试
```
generate a beautiful sunset over mountains, oil painting style
```

#### 视觉理解测试（需要附件图片）
```
# 先附加一张图片，然后问：
what do you see in this image?
```

## 环境变量检查

```bash
# Windows CMD
echo %SILICONFLOW_API_KEY%

# Windows PowerShell
$env:SILICONFLOW_API_KEY

# Linux/Mac
echo $SILICONFLOW_API_KEY
```

如果为空，设置环境变量：

```bash
# Windows (永久设置，需要重启终端)
setx SILICONFLOW_API_KEY "sk-your-api-key"

# Linux/Mac (添加到 ~/.bashrc 或 ~/.zshrc)
export SILICONFLOW_API_KEY="sk-your-api-key"
```

## 验证安装

### 检查扩展文件

**Windows:**
```powershell
ls $env:USERPROFILE\.pi\agent\extensions\multimodal-router
```

**Linux/Mac:**
```bash
ls ~/.pi/agent/extensions/multimodal-router
```

应该看到：
```
index.ts
config.json
package.json
README.md
src/
  siliconflow/
    client.ts
    vision.ts
    image.ts
    stt.ts
    video.ts
  tools/
    generate-image.ts
```

### 检查存储目录

```bash
ls D:/_tina/learning/AI_project/pi_custom/.artifacts
ls D:/_tina/learning/AI_project/pi_custom/.indexes
```

## 常见问题

### Q: 扩展没有加载
A: 
1. 确认文件已正确部署到 `~/.pi/agent/extensions/multimodal-router/`
2. 在 Pi 中运行 `/reload`
3. 检查终端输出是否有错误信息

### Q: API Key 错误
A:
1. 确认环境变量已设置
2. 重启终端使环境变量生效
3. 检查 API Key 是否有效

### Q: 图片生成失败
A:
1. 检查网络连接
2. 确认 SiliconFlow API 额度
3. 查看错误信息

### Q: 视觉理解不工作
A:
1. 确认图片已正确附加
2. 检查当前模型是否支持图片（Claude/GPT-4V 等会直接使用原生能力）
3. 纯文本模型会自动调用 SiliconFlow Vision

## 测试用例

### 1. 基础图片生成
```
generate a cute cat playing with yarn
```

### 2. 高级图片生成
```
generate a cyberpunk cityscape at night, neon lights, rain, highly detailed, 8k, photorealistic
```

### 3. 自定义尺寸
```
generate a wide landscape banner image of mountains at sunset, 2048x512
```

### 4. 视觉理解 + 代码
```
[附加代码截图]
what error is shown in this screenshot?
```

### 5. 多图对比
```
[附加两张图]
compare these two images and tell me the differences
```

## 进阶使用

### 自定义配置

编辑 `~/.pi/agent/extensions/multimodal-router/config.json`:

```json
{
  "siliconflow": {
    "imageGeneration": {
      "model": "black-forest-labs/FLUX.1-schnell",
      "defaultWidth": 1920,
      "defaultHeight": 1080
    }
  },
  "routing": {
    "autoVisionFallback": true
  }
}
```

修改后运行 `/reload`。

### 查看生成的图片

```bash
# Windows
explorer D:\_tina\learning\AI_project\pi_custom\.artifacts

# Linux
nautilus ~/.artifacts

# Mac
open ~/.artifacts
```

## 下一步

- ✅ 图片生成 - 已完成
- ✅ 视觉理解 - 已完成
- 🚧 视频生成 - 开发中
- 🚧 音频转文字 - 开发中
- 🚧 PDF RAG - 计划中

## 反馈

如有问题或建议，请查看 README.md 或修改配置文件。
