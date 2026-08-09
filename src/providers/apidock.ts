/**
 * Apidock Image Generation Provider
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface ApidockImageGenOptions {
  model: string;
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
}

export interface ApidockImageGenResult {
  url: string;
  localPath: string;
  seed?: number;
  provider: string;
}

export async function generateImageWithApidock(
  apiKey: string,
  options: ApidockImageGenOptions,
  artifactsDir: string
): Promise<ApidockImageGenResult> {
  const { model, prompt, width = 1024, height = 1024, seed } = options;

  // Apidock uses OpenAI-compatible image generation API
  const payload: any = {
    model,
    prompt,
    size: `${width}x${height}`,
    n: 1,
    response_format: "url",
  };

  if (seed !== undefined) {
    payload.seed = seed;
  }

  const response = await fetch("https://api.apidock.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apidock API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const imageUrl = data.data[0].url;

  // Download image to local storage
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `image-apidock-${timestamp}.png`;

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
    seed,
    provider: "apidock",
  };
}
