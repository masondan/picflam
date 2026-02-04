import { json } from "@sveltejs/kit";
import { b as private_env } from "../../../../chunks/shared-server.js";
const REPLICATE_MODEL_VERSION = "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";
async function POST({ request }) {
  const apiKey = private_env.REPLICATE_API_KEY;
  if (!apiKey) {
    return json({ error: "Replicate API key not configured" }, { status: 500 });
  }
  try {
    const { image, scale = 4 } = await request.json();
    if (!image) {
      return json({ error: "No image provided" }, { status: 400 });
    }
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL_VERSION,
        input: {
          image,
          scale,
          face_enhance: true
        }
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return json({ error: errorData.detail || `API error: ${response.status}` }, { status: response.status });
    }
    const result = await response.json();
    if (result.status === "failed") {
      return json({ error: result.error || "Upscaling failed" }, { status: 500 });
    }
    if (result.status === "succeeded" && result.output) {
      return json({ output: result.output, status: "succeeded" });
    }
    if (result.status === "processing" || result.status === "starting") {
      return json({
        status: result.status,
        pollUrl: result.urls?.get
      });
    }
    return json({ error: "Unexpected response from Replicate" }, { status: 500 });
  } catch (error) {
    console.error("Upscale API error:", error);
    return json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
async function GET({ url }) {
  const apiKey = private_env.REPLICATE_API_KEY;
  if (!apiKey) {
    return json({ error: "Replicate API key not configured" }, { status: 500 });
  }
  const pollUrl = url.searchParams.get("pollUrl");
  if (!pollUrl) {
    return json({ error: "No poll URL provided" }, { status: 400 });
  }
  try {
    const response = await fetch(pollUrl, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    if (!response.ok) {
      return json({ error: `Polling error: ${response.status}` }, { status: response.status });
    }
    const result = await response.json();
    if (result.status === "succeeded" && result.output) {
      return json({ output: result.output, status: "succeeded" });
    }
    if (result.status === "failed") {
      return json({ error: result.error || "Upscaling failed" }, { status: 500 });
    }
    return json({ status: result.status });
  } catch (error) {
    console.error("Poll API error:", error);
    return json({ error: error.message || "Polling failed" }, { status: 500 });
  }
}
export {
  GET,
  POST
};
