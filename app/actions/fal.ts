'use server';

import { fal } from '@fal-ai/client';

fal.config({
  credentials: process.env.FAL_KEY || process.env.FAL_AI_API_KEY!,
});

export async function generateImage(prompt: string) {
  try {
    const result = await fal.subscribe('fal-ai/flux-schnell', {
      input: {
        prompt: prompt,
        image_size: "landscape_4_3" as const,
        num_images: 1,
        output_format: "jpeg",
      },
    });

    const imageUrl = (result as any)?.images?.[0]?.url || '';

    if (!imageUrl) {
      return { 
        success: false, 
        error: "No image returned. Check your credits." 
      };
    }

    return { 
      success: true, 
      imageUrl,
      model: "Flux Schnell (Fast & Cheap)"
    };

  } catch (error: any) {
    console.error("fal.ai Error:", error);
    return { 
      success: false, 
      error: error.message || "Generation failed" 
    };
  }
}
