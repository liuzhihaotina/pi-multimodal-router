/**
 * SiliconFlow Image Generation API
 */

import type { SiliconFlowClient } from "./client.js";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface ImageGenerationOptions {
  model: string;
  prompt: string;
  width?: number;
  height?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
  batchSize?: number;
  seed?: number;
}

export interface ImageGenerationResult {
  url: string;
  localPath: string;
  seed: number;
}

export async function generateImage(
  client: SiliconFlowClient,
  options: ImageGenerationOptions,
  artifactsDir: string
): Promise<ImageGenerationResult> {
  const {
    model,
    prompt,
    width = 1024,
    height = 1024,
    numInferenceSteps = 20,
    guidanceScale = 7.5,
    batchSize = 1,
    seed,
  } = options;

  const payload: any = {
    model,
    prompt,
    image_size: `${width}x${height}`,
    batch_size: batchSize,
    num_inference_steps: numInferenceSteps,
    guidance_scale: guidanceScale,
  };

  if (seed !== undefined) {
    payload.seed = seed;
  }

  const response = await client.post("/images/generations", payload);

  // Download image to local storage
  const imageUrl = response.images[0].url;
  const usedSeed = response.images[0].seed || seed || 0;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `image-${timestamp}-${usedSeed}.png`;

  // Create date-based subdirectory
  const dateDir = new Date().toISOString().split("T")[0];
  const targetDir = join(artifactsDir, dateDir);
  await mkdir(targetDir, { recursive: true });

  const localPath = join(targetDir, fileName);

  // Download image
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  await writeFile(localPath, Buffer.from(imageBuffer));

  return {
    url: imageUrl,
    localPath,
    seed: usedSeed,
  };
}
