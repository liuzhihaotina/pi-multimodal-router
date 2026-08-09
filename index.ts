/**
 * Multimodal Router Extension for Pi
 * 
 * Provides multimodal capabilities to text-only models through SiliconFlow API:
 * - Vision understanding (images)
 * - Image generation
 * - Speech-to-text
 * - Video generation
 * - PDF RAG (planned)
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SiliconFlowClient } from "./src/siliconflow/client.js";
import { analyzeImage } from "./src/siliconflow/vision.js";
import { createGenerateImageTool } from "./src/tools/generate-image.js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Load config
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, "config.json");
const configText = await readFile(configPath, "utf-8");
const config = JSON.parse(configText);

export default async function (pi: ExtensionAPI) {
  // Get API key from environment
  const apiKey = process.env.SILICONFLOW_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ SILICONFLOW_API_KEY not found in environment variables");
    console.warn("   Multimodal router will not function properly");
    return;
  }

  // Initialize SiliconFlow client
  const client = new SiliconFlowClient({
    baseUrl: config.siliconflow.baseUrl,
    apiKey,
  });

  console.log("✅ Multimodal Router Extension loaded");
  console.log(`   Vision: ${config.siliconflow.vision.model}`);
  console.log(`   Image Gen: ${config.siliconflow.imageGeneration.model}`);
  console.log(`   STT: ${config.siliconflow.speechToText.model}`);

  // ========================================
  // 1. Vision Fallback (Input Hook)
  // ========================================
  if (config.routing.autoVisionFallback) {
    pi.on("input", async (event, ctx) => {
      // Skip if no images attached
      if (!event.images || event.images.length === 0) {
        return { action: "continue" };
      }

      // Skip if source is from extension (avoid loops)
      if (event.source === "extension") {
        return { action: "continue" };
      }

      // Check if current model supports vision
      const model = ctx.model;
      const supportsVision = model?.input?.includes("image") ?? false;

      if (supportsVision) {
        // Model already supports vision, pass through
        return { action: "continue" };
      }

      // Model doesn't support vision - analyze images with SiliconFlow
      ctx.ui.notify(`👁️ Analyzing ${event.images.length} image(s) with vision model...`, "info");

      const descriptions: string[] = [];

      for (let i = 0; i < event.images.length; i++) {
        const image = event.images[i];
        try {
          const description = await analyzeImage(
            client,
            image,
            {
              model: config.siliconflow.vision.model,
              userQuestion: event.text,
              detail: "high",
            }
          );
          descriptions.push(description);
        } catch (error: any) {
          descriptions.push(`[Error analyzing image ${i + 1}: ${error.message}]`);
        }
      }

      // Build multimodal context
      const multimodalContext = descriptions
        .map(
          (text, i) =>
            `<image_context index="${i + 1}">
${text}
</image_context>`
        )
        .join("\n\n");

      const transformedText = `${event.text}

📸 The following content was extracted from attached images by a vision model:

${multimodalContext}`;

      ctx.ui.notify("✅ Vision analysis complete", "success");

      return {
        action: "transform",
        text: transformedText,
        images: [], // Remove images since we've converted them to text
      };
    });
  }

  // ========================================
  // 2. Image Generation Tool
  // ========================================
  const generateImageTool = createGenerateImageTool(client, config);
  pi.registerTool(generateImageTool);

  // ========================================
  // 3. Session Start Notification
  // ========================================
  pi.on("session_start", async (_event, ctx) => {
    if (ctx.mode === "tui") {
      ctx.ui.setStatus(
        "multimodal",
        `🎨 Multimodal: Vision + Image Gen enabled`
      );
    }
  });

  // ========================================
  // 4. Video Generation Tool (Coming Soon)
  // ========================================
  // TODO: Implement video generation tool

  // ========================================
  // 5. Audio Transcription (Coming Soon)
  // ========================================
  // TODO: Implement audio transcription in input hook

  // ========================================
  // 6. PDF RAG (Coming Soon)
  // ========================================
  // TODO: Implement PDF attachment and RAG
}
