const KEY = process.env.SILICONFLOW_API_KEY;
const r = await fetch("https://api.siliconflow.cn/v1/images/generations", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "Qwen/Qwen-Image", prompt: "a red apple on a wooden table", image_size: "1024x1024", batch_size: 1, num_inference_steps: 20, guidance_scale: 7.5 }),
});
console.log("status:", r.status);
console.log((await r.text()).slice(0, 1200));
