/**
 * SiliconFlow Vision API
 */

import type { SiliconFlowClient } from "./client.js";

export interface VisionAnalysisOptions {
  model: string;
  userQuestion?: string;
  detail?: "low" | "high";
}

export async function analyzeImage(
  client: SiliconFlowClient,
  base64Image: string,
  options: VisionAnalysisOptions
): Promise<string> {
  const { model, userQuestion = "", detail = "high" } = options;

  const systemPrompt = `You are a precise visual analysis assistant. Your job is to extract and describe visual information accurately.

Focus on:
1. Text content (code, error messages, UI text)
2. Technical details (file names, line numbers, UI state)
3. Visual layout and structure
4. Key elements relevant to the user's question

Do NOT answer the user's question - only provide factual visual information.`;

  const userPrompt = userQuestion
    ? `User's question: ${userQuestion}\n\nAnalyze this image and provide detailed visual information that would help answer the question.`
    : "Analyze this image and provide detailed visual information.";

  const payload = {
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userPrompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
              detail,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
  };

  const response = await client.post("/chat/completions", payload);
  return response.choices[0].message.content;
}
