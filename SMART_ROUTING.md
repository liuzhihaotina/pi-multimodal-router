# 🎨 Smart Image Generation Routing

## 新功能：智能 Provider 路由 (v0.2.0)

`generate_image` 工具现在支持**智能路由**！

### 工作原理

```
用户请求生成图片
    ↓
检测当前会话的 provider
    ↓
┌─────────────────┬─────────────────┐
│ Provider 支持？  │      行为        │
├─────────────────┼─────────────────┤
│ apidock         │ 使用 gpt-image-2 │
│ deepseek        │ 降级 SiliconFlow │
│ openai          │ 降级 SiliconFlow │
│ anthropic       │ 降级 SiliconFlow │
└─────────────────┴─────────────────┘
    ↓
返回结果（显示使用的 provider 和 model）
```

### 优势

1. **零配置** - 自动检测，无需设置
2. **就近原则** - 优先使用当前 provider 的模型
3. **自动降级** - 失败时自动切换到 SiliconFlow
4. **透明显示** - 告诉用户使用了哪个 provider

### 使用示例

#### 在 Apidock 会话中
```
user (with apidock/gpt-5.6-terra): 生成一张日落的图片

🎨 Using apidock/gpt-image-2 for image generation

✅ Image generated successfully!
Provider: apidock
Model: gpt-image-2
Saved to: .artifacts/2025-08-09/image-apidock-xxx.png
```

#### 在 DeepSeek 会话中
```
user (with deepseek/deepseek-v4-pro): 生成一张日落的图片

🎨 Using SiliconFlow/Qwen/Qwen-Image for image generation

✅ Image generated successfully!
Provider: siliconflow
Model: Qwen/Qwen-Image
Saved to: .artifacts/2025-08-09/image-xxx.png
```

#### 失败自动降级
```
user (with apidock/gpt-5.6-terra): 生成一张图片

🎨 Using apidock/gpt-image-2 for image generation
⚠️ apidock image generation failed: API error
🔄 Falling back to SiliconFlow...
🎨 Using SiliconFlow/Qwen/Qwen-Image for image generation

✅ Image generated successfully!
Provider: siliconflow (fallback)
Model: Qwen/Qwen-Image
```

### 支持的 Providers

| Provider | Image Model | Status |
|----------|-------------|--------|
| apidock | gpt-image-2 | ✅ 已实现 |
| siliconflow | Qwen/Qwen-Image | ✅ Fallback |
| deepseek | - | ❌ 不支持 |
| openai | - | 🚧 可扩展 |
| anthropic | - | ❌ 不支持 |

### 扩展新 Provider

编辑 `src/providers/router.ts`：

```typescript
const PROVIDER_IMAGE_MODELS: Record<string, string> = {
  apidock: "gpt-image-2",
  openai: "dall-e-3",  // 添加新的 provider
};
```

然后实现对应的 provider 模块：

```typescript
// src/providers/openai.ts
export async function generateImageWithOpenAI(...) {
  // 实现 OpenAI DALL-E API
}
```

### 配置

当前配置（config.json）：

```json
{
  "imageGeneration": {
    "model": "Qwen/Qwen-Image",
    "description": "SiliconFlow fallback",
    "defaultWidth": 1024,
    "defaultHeight": 1024
  }
}
```

这个配置是 fallback 设置，当前 provider 不支持或失败时使用。

### 技术细节

路由逻辑（`src/providers/router.ts`）：

1. 获取当前会话的 provider
2. 检查该 provider 是否支持图片生成
3. 如果支持，获取 API key 并调用
4. 如果失败或不支持，降级到 SiliconFlow
5. 返回结果并标注使用的 provider

### 未来计划

- [ ] 支持更多 providers（OpenAI, Stability AI）
- [ ] 支持手动优先级配置（方案 C）
- [ ] 支持 provider 级别的参数映射
- [ ] 缓存 provider 能力检测结果

### 变更日志

**v0.2.0** (2025-08-09)
- ✅ 新增智能 provider 路由
- ✅ 支持 apidock/gpt-image-2
- ✅ 自动降级到 SiliconFlow
- ✅ 显示使用的 provider 和 model

**v0.1.0** (2025-08-09)
- ✅ 基础图片生成（仅 SiliconFlow）
- ✅ 视觉理解 fallback
