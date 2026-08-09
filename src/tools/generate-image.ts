/**
 * Generate Image Tool
 */

import { Type } from "@earendil-works/pi-ai";
import { defineTool } from "@earendil-works/pi-coding-agent";
import type { SiliconFlowClient } from "../siliconflow/client.js";
import { routeImageGeneration } from "../providers/router.js";

export function createGenerateImageTool(
  client: SiliconFlowClient,
  config: any
) {
  return defineTool({
    name: "generate_image",
    label: "Generate Image",
    description:
      "Generate an image using available image generation models. Automatically uses the current provider's image model if available (e.g., apidock/gpt-image-2), otherwise falls back to SiliconFlow. Use this when the user explicitly requests image creation, drawing, rendering, or visual generation.",
    promptSnippet:
      "Generate images when the user requests visual creation or illustration.",
    promptGuidelines: [
      "Use generate_image when the user asks to create, draw, render, or generate an image",
      "Write detailed, descriptive prompts for best results",
      "Include style, mood, lighting, and composition details in the prompt",
    ],
    parameters: Type.Object({
      prompt: Type.String({
        description:
          "Detailed description of the image to generate. Be specific about style, composition, lighting, colors, and mood.",
      }),
      width: Type.Optional(
        Type.Number({
          description: "Image width in pixels (default: 1024)",
          minimum: 256,
          maximum: 2048,
        })
      ),
      height: Type.Optional(
        Type.Number({
          description: "Image height in pixels (default: 1024)",
          minimum: 256,
          maximum: 2048,
        })
      ),
      seed: Type.Optional(
        Type.Number({
          description:
            "Random seed for reproducibility. Use the same seed to generate similar images.",
        })
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      try {
        // Smart routing: try current provider first, then fallback to SiliconFlow
        const result = await routeImageGeneration(
          {
            prompt: params.prompt,
            width: params.width,
            height: params.height,
            seed: params.seed,
          },
          ctx,
          client,
          config
        );

        const actualWidth = params.width || config.siliconflow.imageGeneration.defaultWidth;
        const actualHeight = params.height || config.siliconflow.imageGeneration.defaultHeight;

        return {
          content: [
            {
              type: "text",
              text: `✅ Image generated successfully!

**Provider**: ${result.provider}
**Model**: ${result.model}
**Prompt**: ${params.prompt}
**Dimensions**: ${actualWidth}x${actualHeight}
**Seed**: ${result.seed || 'auto'}
**Saved to**: ${result.localPath}

The image has been saved locally and is ready to use.`,
            },
          ],
          details: {
            prompt: params.prompt,
            url: result.url,
            localPath: result.localPath,
            seed: result.seed,
            width: actualWidth,
            height: actualHeight,
            provider: result.provider,
            model: result.model,
          },
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Failed to generate image: ${error.message}`,
            },
          ],
          details: { error: error.message },
          isError: true,
        };
      }
    },
  });
}
