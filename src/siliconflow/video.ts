/**
 * SiliconFlow Video Generation API
 */

import type { SiliconFlowClient } from "./client.js";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface VideoGenerationOptions {
  model: string;
  prompt: string;
  imageUrl?: string;
  duration?: number;
  pollInterval?: number;
  maxRetries?: number;
}

export interface VideoGenerationResult {
  url: string;
  localPath: string;
  requestId: string;
}

export async function generateVideo(
  client: SiliconFlowClient,
  options: VideoGenerationOptions,
  artifactsDir: string
): Promise<VideoGenerationResult> {
  const {
    model,
    prompt,
    imageUrl,
    duration = 5,
    pollInterval = 3000,
    maxRetries = 100,
  } = options;

  // Submit video generation request
  const submitPayload: any = {
    model,
    prompt,
    duration,
  };

  if (imageUrl) {
    submitPayload.image_url = imageUrl;
  }

  const submitResponse = await client.post("/videos/submit", submitPayload);
  const requestId = submitResponse.request_id;

  // Poll for completion
  let retries = 0;
  let videoUrl: string | null = null;

  while (retries < maxRetries) {
    const statusResponse = await client.get(`/videos/status/${requestId}`);

    if (statusResponse.status === "completed") {
      videoUrl = statusResponse.video_url;
      break;
    } else if (statusResponse.status === "failed") {
      throw new Error(`Video generation failed: ${statusResponse.error}`);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    retries++;
  }

  if (!videoUrl) {
    throw new Error("Video generation timed out");
  }

  // Download video to local storage
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `video-${timestamp}.mp4`;

  const dateDir = new Date().toISOString().split("T")[0];
  const targetDir = join(artifactsDir, dateDir);
  await mkdir(targetDir, { recursive: true });

  const localPath = join(targetDir, fileName);

  // Download video
  const videoResponse = await fetch(videoUrl);
  const videoBuffer = await videoResponse.arrayBuffer();
  await writeFile(localPath, Buffer.from(videoBuffer));

  return {
    url: videoUrl,
    localPath,
    requestId,
  };
}
