import { json } from "@sveltejs/kit";
import { b as private_env } from "../../../../chunks/shared-server.js";
const CODEFORMER_VERSION = "cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2";
async function POST({ request }) {
  const apiKey = private_env.REPLICATE_API_KEY;
  if (!apiKey) {
    return json({ error: "Replicate API key not configured" }, { status: 500 });
  }
  try {
    const { image, scale = 4, faceEnhance = 0.5 } = await request.json();
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
        version: CODEFORMER_VERSION,
        input: {
          image,
          codeformer_fidelity: Number(faceEnhance),
          upscale: Number(scale),
          face_upsample: true,
          background_enhance: true
        }
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return json({ error: errorData.detail || `API error: ${response.status}` }, { status: response.status });
    }
    const result = await response.json();
    if (result.status === "failed") {
      return json({ error: result.error || "Face enhancement failed" }, { status: 500 });
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
    console.error("Face enhance API error:", error);
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
      return json({ error: result.error || "Face enhancement failed" }, { status: 500 });
    }
    return json({ status: result.status });
  } catch (error) {
    console.error("Face enhance poll error:", error);
    return json({ error: error.message || "Polling failed" }, { status: 500 });
  }
}
export {
  GET,
  POST
};
