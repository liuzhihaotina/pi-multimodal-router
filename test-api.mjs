/**
 * Test SiliconFlow API connectivity and models
 */

const API_KEY = process.env.SILICONFLOW_API_KEY;

if (!API_KEY) {
  console.error("❌ SILICONFLOW_API_KEY not found in environment");
  process.exit(1);
}

console.log("🔍 Testing SiliconFlow API...\n");

// Test 1: List models
console.log("1. Testing model list API...");
try {
  const response = await fetch("https://api.siliconflow.cn/v1/models", {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  console.log(`✅ API accessible - Found ${data.data.length} models\n`);
} catch (error) {
  console.error(`❌ Failed: ${error.message}\n`);
  process.exit(1);
}

// Test 2: Check vision model
console.log("2. Testing vision model availability...");
try {
  const visionModel = "Qwen/Qwen3-VL-32B-Instruct";
  const response = await fetch("https://api.siliconflow.cn/v1/models", {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();
  const hasVision = data.data.some((m) => m.id === visionModel);

  if (hasVision) {
    console.log(`✅ Vision model available: ${visionModel}\n`);
  } else {
    console.log(`⚠️ Vision model not found: ${visionModel}\n`);
  }
} catch (error) {
  console.error(`❌ Failed: ${error.message}\n`);
}

// Test 3: Check image generation model
console.log("3. Testing image generation model availability...");
try {
  const imageModel = "Qwen/Qwen-Image";
  const response = await fetch("https://api.siliconflow.cn/v1/models", {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();
  const hasImageGen = data.data.some((m) => m.id === imageModel);

  if (hasImageGen) {
    console.log(`✅ Image generation model available: ${imageModel}\n`);
  } else {
    console.log(`⚠️ Image generation model not found: ${imageModel}\n`);
  }
} catch (error) {
  console.error(`❌ Failed: ${error.message}\n`);
}

// Test 4: Check embedding model
console.log("4. Testing embedding model availability...");
try {
  const embeddingModel = "Qwen/Qwen3-VL-Embedding-8B";
  const response = await fetch("https://api.siliconflow.cn/v1/models", {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();
  const hasEmbedding = data.data.some((m) => m.id === embeddingModel);

  if (hasEmbedding) {
    console.log(`✅ Embedding model available: ${embeddingModel}\n`);
  } else {
    console.log(`⚠️ Embedding model not found: ${embeddingModel}\n`);
  }
} catch (error) {
  console.error(`❌ Failed: ${error.message}\n`);
}

console.log("✅ All API tests completed!\n");
console.log("Next steps:");
console.log("1. Start Pi: pi");
console.log("2. Test image generation: 'generate a sunset image'");
console.log("3. Test vision: attach an image and ask a question");
