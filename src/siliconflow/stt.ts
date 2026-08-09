/**
 * SiliconFlow Speech-to-Text API
 */

import type { SiliconFlowClient } from "./client.js";
import { readFile } from "node:fs/promises";

export interface STTOptions {
  model: string;
  audioPath: string;
  language?: string;
}

export interface STTResult {
  text: string;
  duration?: number;
  language?: string;
}

export async function transcribeAudio(
  client: SiliconFlowClient,
  options: STTOptions
): Promise<STTResult> {
  const { model, audioPath, language } = options;

  // Read audio file
  const audioBuffer = await readFile(audioPath);
  const audioBlob = new Blob([audioBuffer]);

  // Create form data
  const formData = new FormData();
  formData.append("model", model);
  formData.append("file", audioBlob, "audio.mp3");

  if (language) {
    formData.append("language", language);
  }

  const response = await client.postFormData(
    "/audio/transcriptions",
    formData
  );

  return {
    text: response.text,
    duration: response.duration,
    language: response.language,
  };
}
