/**
 * Image Generation Provider Router
 * 
 * Smart routing logic:
 * 1. Check current provider for image generation capability
 * 2. If supported, use current provider (e.g., apidock/gpt-image-2)
 * 3. If not supported, fallback to SiliconFlow
 */

import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { generateImageWithApidock } from "./apidock.js";
import type { SiliconFlowClient } from "../siliconflow/client.js";
import { generateImage as generateWithSiliconFlow } from "../siliconflow/image.js";

export interface ImageGenParams {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
}

export interface ImageGenResult {
  url: string;
  localPath: string;
  seed?: number;
  provider: string;
  model: string;
}

// Provider image generation model mapping
const PROVIDER_IMAGE_MODELS: Record<string, string> = {
  apidock: "gpt-image-2",
  // Add more providers here as needed
};

export async function routeImageGeneration(
  params: ImageGenParams,
  ctx: ExtensionContext,
  siliconFlowClient: SiliconFlowClient,
  config: any
): Promise<ImageGenResult> {
  const currentProvider = ctx.model?.provider;
  const artifactsDir = config.storage.artifactsDir;

  // Strategy: Try current provider first if it supports image generation
  if (currentProvider && PROVIDER_IMAGE_MODELS[currentProvider]) {
    const imageModel = PROVIDER_IMAGE_MODELS[currentProvider];
    
    try {
      console.log(`🎨 Using ${currentProvider}/${imageModel} for image generation`);

      // Get API key for current provider
      const providerAuth = ctx.modelRegistry.getProviderAuth?.(currentProvider);
      const apiKey = providerAuth?.apiKey || process.env[`${currentProvider.toUpperCase()}_API_KEY`];

      if (!apiKey) {
        throw new Error(`API key not found for ${currentProvider}`);
      }

      // Route to appropriate provider
      if (currentProvider === "apidock") {
        const result = await generateImageWithApidock(
          apiKey,
          {
            model: imageModel,
            prompt: params.prompt,
            width: params.width,
            height: params.height,
            seed: params.seed,
          },
          artifactsDir
        );
        return { ...result, model: imageModel };
      }

      // Add more provider handlers here
      throw new Error(`Provider ${currentProvider} not implemented yet`);
    } catch (error: any) {
      console.warn(`⚠️ ${currentProvider} image generation failed: ${error.message}`);
      console.log(`🔄 Falling back to SiliconFlow...`);
    }
  }

  // Fallback: Use SiliconFlow
  console.log(`🎨 Using SiliconFlow/${config.siliconflow.imageGeneration.model} for image generation`);
  
  const result = await generateWithSiliconFlow(
    siliconFlowClient,
    {
      model: config.siliconflow.imageGeneration.model,
      prompt: params.prompt,
      width: params.width || config.siliconflow.imageGeneration.defaultWidth,
      height: params.height || config.siliconflow.imageGeneration.defaultHeight,
      seed: params.seed,
    },
    artifactsDir
  );

  return {
    ...result,
    provider: "siliconflow",
    model: config.siliconflow.imageGeneration.model,
  };
}
