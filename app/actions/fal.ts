'use server';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function generateImage(prompt: string) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          num_steps: 20,
          guidance: 3.5,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare Error: ${errorText}`);
    }

    const data = await response.json();
    const imageBase64 = data.result?.image;

    if (!imageBase64) {
      return { 
        success: false, 
        error: "No image returned from Cloudflare. Check your API token." 
      };
    }

    const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

    return { 
      success: true, 
      imageUrl,
      model: "Flux Schnell (Cloudflare)"
    };

  } catch (error: any) {
    console.error("Cloudflare AI Error:", error);
    return { 
      success: false, 
      error: error.message || "Generation failed" 
    };
  }
}
