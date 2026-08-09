# Contributing to Pi Multimodal Router

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/liuzhihaotina/pi-multimodal-router.git
   cd pi-multimodal-router
   ```
3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Setup

### Prerequisites

- Node.js 18+
- Pi Coding Agent installed
- SiliconFlow API key

### Local Testing

1. Deploy to your local Pi:
   ```bash
   ./deploy.sh  # or .\deploy.ps1 on Windows
   ```

2. Test in Pi:
   ```bash
   pi
   /reload
   ```

3. Test the extension:
   ```
   > generate a test image
   ```

## 🎯 Areas for Contribution

### High Priority

- **Video Generation** - Implement `generate_video` tool
- **Audio Transcription** - Implement STT functionality
- **PDF RAG** - Document processing and retrieval
- **More Providers** - Add support for OpenAI, Stability AI, etc.

### Medium Priority

- **Manual Priority Configuration** - Allow users to set provider priorities
- **Provider Parameter Mapping** - Handle different API parameters
- **Capability Caching** - Cache provider capability checks
- **Error Handling** - Improve error messages and recovery

### Low Priority

- **UI Improvements** - Better progress indicators
- **Performance Optimization** - Reduce latency
- **Documentation** - Improve docs and examples
- **Tests** - Add automated tests

## 📐 Code Style

### TypeScript

- Use TypeScript with strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs

Example:
```typescript
/**
 * Generate an image using the specified provider
 * @param params - Image generation parameters
 * @param ctx - Extension context
 * @returns Image generation result with local path
 */
export async function generateImage(
  params: ImageGenParams,
  ctx: ExtensionContext
): Promise<ImageGenResult> {
  // Implementation
}
```

### File Organization

- API wrappers: `src/siliconflow/`
- Provider implementations: `src/providers/`
- Tools: `src/tools/`
- Utilities: `src/utils/` (create if needed)

## 🧪 Testing

Before submitting a PR:

1. **Test API connectivity**:
   ```bash
   node test-api.mjs
   ```

2. **Test in Pi**:
   - Test with multiple providers
   - Test fallback scenarios
   - Test error handling

3. **Check for console errors**:
   - No TypeScript errors
   - No runtime errors

## 📄 Pull Request Process

1. **Update documentation**:
   - Update README if adding features
   - Add JSDoc comments
   - Update CHANGELOG (create if needed)

2. **Commit messages**:
   - Use clear, descriptive messages
   - Format: `type: description`
   - Examples:
     - `feat: add OpenAI provider support`
     - `fix: handle null API key gracefully`
     - `docs: update installation instructions`

3. **PR description**:
   - Describe what changed and why
   - Include screenshots if UI changed
   - Mention any breaking changes
   - Link related issues

4. **Code review**:
   - Address review comments
   - Keep commits focused
   - Rebase if needed

## 🐛 Bug Reports

When reporting bugs, include:

- **Pi version**: `pi --version`
- **Extension version**: Check `package.json`
- **OS**: Windows/Linux/Mac
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Console output** (if applicable)
- **Screenshots** (if applicable)

## 💡 Feature Requests

When requesting features:

- **Use case**: Why do you need this?
- **Proposed solution**: How should it work?
- **Alternatives**: Other approaches you considered
- **Example**: Show expected usage

## 📋 Adding New Providers

To add support for a new image generation provider:

1. **Create provider file**:
   ```bash
   touch src/providers/yourprovider.ts
   ```

2. **Implement the interface**:
   ```typescript
   export async function generateImageWithYourProvider(
     apiKey: string,
     options: YourProviderOptions,
     artifactsDir: string
   ): Promise<ImageGenResult> {
     // Call provider API
     // Download image
     // Return result
   }
   ```

3. **Register in router**:
   ```typescript
   // src/providers/router.ts
   const PROVIDER_IMAGE_MODELS: Record<string, string> = {
     apidock: "gpt-image-2",
     yourprovider: "your-model",
   };
   ```

4. **Add routing logic**:
   ```typescript
   if (currentProvider === "yourprovider") {
     return await generateImageWithYourProvider(...);
   }
   ```

5. **Test thoroughly**:
   - API key handling
   - Error scenarios
   - Fallback behavior

6. **Update docs**:
   - Add to supported providers table
   - Add usage example
   - Update configuration docs

## 🔐 Security

- **Never commit API keys** or secrets
- **Validate all user inputs**
- **Handle errors gracefully**
- **Report security issues privately**

## 📞 Questions?

- Open a [Discussion](https://github.com/liuzhihaotina/pi-multimodal-router/discussions)
- Check existing [Issues](https://github.com/liuzhihaotina/pi-multimodal-router/issues)
- Read the [Documentation](docs/)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
