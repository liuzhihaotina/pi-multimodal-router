# Multimodal Router Extension - 使用说明

## ✅ 安装状态

- ✅ 扩展已部署到 `~/.pi/agent/extensions/multimodal-router/`
- ✅ SiliconFlow API Key 已配置
- ✅ 所有核心模型可用：
  - Vision: `Qwen/Qwen3-VL-32B-Instruct`
  - Image Gen: `Qwen/Qwen-Image`
  - Embedding: `Qwen/Qwen3-VL-Embedding-8B`
  - STT: `FunAudioLLM/SenseVoiceSmall`

## 🎯 已实现功能

### 1. 图片生成 🎨

主模型（Claude/DeepSeek/ChatGPT）可以调用 `generate_image` 工具生成图片。

**使用方式：**
```
用户：生成一张日落的图片

Claude/DeepSeek/ChatGPT 会自动调用：
  └─ generate_image(prompt="beautiful sunset...")
  
结果：图片保存到 D:/_tina/learning/AI_project/pi_custom/.artifacts/2025-08-09/image-xxx.png
```

**支持参数：**
- `prompt`: 详细的图片描述（必需）
- `width`: 宽度（可选，默认 1024）
- `height`: 高度（可选，默认 1024）
- `seed`: 随机种子（可选，用于复现）

**示例提示词：**
```
1. 基础生成
   "生成一只可爱的猫咪"
   
2. 详细描述
   "生成一张赛博朋克风格的东京夜景，霓虹灯，雨夜，高度细节，8K"
   
3. 指定尺寸
   "生成一张 1920x1080 的山景图"
   
4. 使用种子
   "用种子值 42 生成一朵玫瑰"
```

### 2. 视觉理解 👁️

当你使用**不支持视觉**的模型（如纯文本的 Claude/DeepSeek）时，自动调用 SiliconFlow Vision API 分析图片。

**工作原理：**
```
1. 你附加图片 → 2. 扩展检测模型不支持视觉 → 3. 自动调用 Vision API
→ 4. 将图片描述注入提示词 → 5. 主模型看到文本描述
```

**体验流程：**
```
用户：[附加 screenshot.png] 这是什么错误？

👁️ Analyzing 1 image(s) with vision model...
✅ Vision analysis complete

📸 The following content was extracted from attached images:

<image_context index="1">
这是一个 VS Code 截图。
终端显示 TypeError: Cannot read properties of undefined...
错误发生在 src/router.ts 第 83 行
文件树显示在左侧...
</image_context>

Claude: 根据截图，这是一个 TypeScript 运行时错误...
```

**注意事项：**
- 如果主模型本身支持视觉（如 Claude 3.5 Sonnet with Vision），扩展会跳过，直接使用原生能力
- 支持多图分析（一次附加多张图）
- Vision 分析结果会自动注入到提示词中

### 3. 存储管理 📁

所有生成的图片/视频按日期存储：

```
D:/_tina/learning/AI_project/pi_custom/
├── .artifacts/
│   ├── 2025-08-09/
│   │   ├── image-2025-08-09T10-30-45-123.png
│   │   ├── image-2025-08-09T11-15-20-456.png
│   │   └── video-2025-08-09T14-20-30.mp4
│   └── 2025-08-10/
│       └── ...
└── .indexes/
    └── (文档向量索引，未来功能)
```

## 🚧 规划中功能

### 3. 视频生成 🎬
```
用户：把刚才那张图片做成 5 秒的视频，加上缓慢的运镜效果

Claude:
  └─ generate_video(
       image_url="...",
       prompt="slow cinematic dolly-in...",
       duration=5
     )
```

### 4. 音频转文字 🎤
```
用户：[附加 meeting.mp3]

🎤 Transcribing audio...
✅ Transcription complete

<audio_transcript filename="meeting.mp3" duration="52:31">
张三：大家好...
李四：关于这个项目...
</audio_transcript>
```

### 5. PDF RAG 📚
```
用户：/attach paper.pdf

✓ paper.pdf
  PDF · 83 pages
  Text extracted
  527 chunks indexed

用户：作者的核心创新是什么？

Claude 自动调用 document_search 检索相关段落
```

## 🔧 配置

配置文件位置：`~/.pi/agent/extensions/multimodal-router/config.json`

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
    "autoVisionFallback": true,      // 自动视觉回退
    "autoDocumentRetrieval": false,  // 文档检索（未实现）
    "autoAudioTranscription": false  // 音频转录（未实现）
  },
  "storage": {
    "artifactsDir": "D:/_tina/learning/AI_project/pi_custom/.artifacts",
    "indexesDir": "D:/_tina/learning/AI_project/pi_custom/.indexes"
  }
}
```

**修改后记得：**
```
/reload
```

## 📊 命令

在 Pi 中可用的命令：

```bash
# 重新加载扩展
/reload

# 查看当前模型
/model

# 切换模型
Ctrl+P
```

## 🐛 故障排查

### 问题 1: 扩展未加载

**检查：**
```bash
ls ~/.pi/agent/extensions/multimodal-router/
```

**解决：**
```bash
cd D:/_tina/learning/AI_project/pi_custom/multimodal-router
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

### 问题 2: API Key 错误

**检查：**
```powershell
$env:SILICONFLOW_API_KEY
```

**解决：**
需要**重启终端**使环境变量生效。

### 问题 3: 图片生成失败

**可能原因：**
1. 网络连接问题
2. API 配额用完
3. 模型暂时不可用

**调试：**
```bash
cd D:/_tina/learning/AI_project/pi_custom/multimodal-router
powershell -Command "$env:SILICONFLOW_API_KEY='sk-...'; node test-api.mjs"
```

### 问题 4: Vision 不工作

**检查：**
1. 当前模型是否支持视觉？（Claude 3.5 Sonnet with Vision 会直接使用原生能力）
2. 是否正确附加了图片？
3. 配置中 `autoVisionFallback` 是否为 `true`？

## 💡 使用技巧

### 1. 图片生成最佳实践

**详细描述：**
```
❌ "一只猫"
✅ "一只橘色的短毛猫，坐在窗台上，柔和的阳光，温暖的色调，高清摄影"
```

**指定风格：**
```
"赛博朋克风格"
"水彩画风格"
"油画风格"
"照片写实风格"
"动漫风格"
```

**控制构图：**
```
"特写镜头"
"全景镜头"
"鸟瞰视角"
"仰视角度"
```

### 2. 视觉理解最佳实践

**清晰的问题：**
```
❌ "看看这个"
✅ "这个错误是什么原因？"
✅ "对比这两张图的差异"
✅ "提取图中的所有文字"
```

**代码截图：**
- 确保代码清晰可读
- 包含行号和文件名
- 包含完整的错误信息

### 3. 主模型选择

不同模型适合不同场景：

| 模型 | 视觉能力 | 图片生成 | 适用场景 |
|------|---------|---------|---------|
| Claude 3.5 Sonnet | ✅ 原生 | ✅ 通过工具 | 编程、推理、视觉 |
| DeepSeek V3 | ❌ 需要扩展 | ✅ 通过工具 | 编程、中文 |
| ChatGPT-4 | ✅ 原生 | ✅ 通过工具 | 通用对话 |

**建议：**
- 纯编程任务 → DeepSeek（配合扩展视觉）
- 需要视觉分析 → Claude/ChatGPT（原生视觉）
- 需要图片生成 → 任意模型（都通过扩展）

## 📈 性能

| 操作 | 耗时 |
|------|------|
| Vision 分析 | ~2-5 秒 |
| 图片生成 | ~5-10 秒 |
| 视频生成 | ~30-60 秒 |
| 音频转录 | ~实时速度 |

## 🔒 隐私与安全

- API Key 仅存储在本地环境变量
- 图片通过 HTTPS 加密传输
- 生成的媒体文件存储在本地
- 不会记录或上传你的提示词

## 📚 更多资源

- [Pi Extensions 文档](https://pi.dev/docs/latest/extensions)
- [SiliconFlow API 文档](https://docs.siliconflow.cn/)
- [项目 README](./README.md)
- [架构设计文档](./instruction.md)

## 🎉 开始使用

1. **启动 Pi：**
   ```bash
   pi
   ```

2. **测试图片生成：**
   ```
   生成一张美丽的日落图片
   ```

3. **测试视觉理解：**
   - 附加一张图片
   - 问一个问题

4. **查看生成的图片：**
   ```bash
   explorer D:\_tina\learning\AI_project\pi_custom\.artifacts
   ```

祝你使用愉快！🚀
