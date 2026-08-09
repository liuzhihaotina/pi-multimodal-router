# 🧪 测试指南 - Smart Provider Routing (v0.2.0)

## 测试前准备

### 1. 确认扩展已部署

```bash
ls "C:\Users\liuzh\.pi\agent\extensions\multimodal-router\src\providers\"
```

应该看到：
- apidock.ts
- router.ts

### 2. 确认环境变量

```powershell
# SiliconFlow (必需)
$env:SILICONFLOW_API_KEY

# Apidock (测试 apidock 路由时需要)
$env:APIDOCK_API_KEY
```

如果 APIDOCK_API_KEY 未设置，在 apidock 会话中会自动降级到 SiliconFlow。

## 测试用例

### 测试 1: DeepSeek 会话（应使用 SiliconFlow）

```bash
pi --model deepseek/deepseek-v4-pro
```

在 Pi 中执行：
```
生成一张美丽的日落图片
```

**预期结果**:
```
🎨 Using SiliconFlow/Qwen/Qwen-Image for image generation

✅ Image generated successfully!
Provider: siliconflow
Model: Qwen/Qwen-Image
Saved to: D:\_tina\...\image-2025-08-09T...png
```

**验证点**:
- ✅ 没有尝试 DeepSeek（因为不支持）
- ✅ 直接使用 SiliconFlow
- ✅ 图片成功生成并保存

---

### 测试 2: Apidock 会话（应尝试 gpt-image-2）

```bash
pi --model apidock/gpt-5.6-terra
```

在 Pi 中执行：
```
生成一张赛博朋克风格的东京街景
```

**预期结果 A（Apidock 成功）**:
```
🎨 Using apidock/gpt-image-2 for image generation

✅ Image generated successfully!
Provider: apidock
Model: gpt-image-2
Saved to: D:\_tina\...\image-apidock-2025-08-09T...png
```

**预期结果 B（Apidock 失败，自动降级）**:
```
🎨 Using apidock/gpt-image-2 for image generation
⚠️ apidock image generation failed: ...
🔄 Falling back to SiliconFlow...
🎨 Using SiliconFlow/Qwen/Qwen-Image for image generation

✅ Image generated successfully!
Provider: siliconflow
Model: Qwen/Qwen-Image
```

**验证点**:
- ✅ 首先尝试 apidock/gpt-image-2
- ✅ 失败时自动降级到 SiliconFlow
- ✅ 图片成功生成

---

### 测试 3: 查看生成的图片

```powershell
explorer D:\_tina\learning\AI_project\pi_custom\.artifacts
```

**验证点**:
- ✅ 按日期组织（YYYY-MM-DD 目录）
- ✅ Apidock 图片文件名包含 "apidock"
- ✅ SiliconFlow 图片文件名不包含 "apidock"

---

### 测试 4: 验证日志输出

在 Pi 的终端输出中查找：

**DeepSeek 会话**:
```
🎨 Using SiliconFlow/Qwen/Qwen-Image for image generation
```

**Apidock 会话**:
```
🎨 Using apidock/gpt-image-2 for image generation
```

**验证点**:
- ✅ 日志清楚显示使用的 provider
- ✅ 日志显示使用的 model

---

## 故障排查

### 问题 1: 找不到 providers 模块

**症状**:
```
Error: Cannot find module './src/providers/router.js'
```

**解决**:
```bash
cd D:\_tina\learning\AI_project\pi_custom\multimodal-router
.\deploy.ps1
```

在 Pi 中：
```
/reload
```

---

### 问题 2: Apidock API Key 未找到

**症状**:
```
⚠️ apidock image generation failed: API key not found for apidock
🔄 Falling back to SiliconFlow...
```

**这是正常行为**！如果没有 APIDOCK_API_KEY，会自动降级。

如果想测试 apidock，设置环境变量：
```powershell
$env:APIDOCK_API_KEY = "your-apidock-key"
pi
```

---

### 问题 3: 所有 provider 都失败

**症状**:
```
❌ Failed to generate image: ...
```

**检查**:
1. SILICONFLOW_API_KEY 是否设置？
2. 网络连接是否正常？
3. API 配额是否用完？

**测试 SiliconFlow 连接**:
```bash
cd D:\_tina\learning\AI_project\pi_custom\multimodal-router
$env:SILICONFLOW_API_KEY = "sk-..."
node test-api.mjs
```

---

## 预期文件结构

部署后的文件结构：

```
C:\Users\liuzh\.pi\agent\extensions\multimodal-router\
├── index.ts
├── config.json
├── package.json
└── src\
    ├── siliconflow\
    │   ├── client.ts
    │   ├── vision.ts
    │   ├── image.ts
    │   ├── video.ts
    │   └── stt.ts
    ├── tools\
    │   └── generate-image.ts
    └── providers\          ← 新增
        ├── router.ts       ← 新增
        └── apidock.ts      ← 新增
```

---

## 成功标准

✅ **全部通过** 则 v0.2.0 功能正常：

1. ✅ DeepSeek 会话直接使用 SiliconFlow
2. ✅ Apidock 会话尝试 gpt-image-2
3. ✅ 失败时自动降级到 SiliconFlow
4. ✅ 结果中显示 provider 和 model
5. ✅ 图片正确保存到 .artifacts/
6. ✅ 日志输出清晰易懂

---

## 快速测试脚本

```bash
# 1. 部署扩展
cd D:\_tina\learning\AI_project\pi_custom\multimodal-router
.\deploy.ps1

# 2. 启动 Pi 测试
pi --model deepseek/deepseek-v4-pro

# 在 Pi 中
> 生成一张日落的图片

# 3. 查看结果
explorer D:\_tina\learning\AI_project\pi_custom\.artifacts

# 4. 切换到 Apidock 测试
Ctrl+P (选择 apidock 模型)
> 生成一张赛博朋克风格的图片
```

---

## 测试报告模板

```
测试日期: 2025-08-09
测试人: [你的名字]
版本: v0.2.0

[ ] 测试 1: DeepSeek 会话 - 通过/失败
[ ] 测试 2: Apidock 会话 - 通过/失败
[ ] 测试 3: 文件保存 - 通过/失败
[ ] 测试 4: 日志输出 - 通过/失败

问题记录:
- [如有问题，记录在此]

总结:
- [整体评价]
```

---

## 下一步

测试通过后：
- ✅ 更新 README.md
- ✅ 创建 v0.2.0 release notes
- 🚧 开始 Phase 2（视频生成）

祝测试顺利！🧪
