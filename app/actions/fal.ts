'use server';

import { fal } from '@fal-ai/client';

fal.config({
  credentials: process.env.FAL_KEY || process.env.FAL_AI_API_KEY!,
});

export async function generateImage(prompt: string) {
  try {
    console.log("Starting generation with prompt:", prompt.substring(0, 100));

    const result = await fal.subscribe('fal-ai/flux-pro/v1.1', {
      input: {
        prompt: prompt,
        image_size: "landscape_4_3" as const,   // Changed to match docs
        num_images: 1,
        output_format: "jpeg",
        safety_tolerance: "2",
      },
    });

    const imageUrl = (result as any)?.images?.[0]?.url || '';

    if (!imageUrl) {
      throw new Error("No image URL returned from fal.ai");
    }

    return { 
      success: true, 
      imageUrl 
    };

  } catch (error: any) {
    console.error("=== FAL.AI FULL ERROR ===", {
      message: error.message,
      status: error.status,
      details: error,
    });

    return { 
      success: false, 
      error: error.message || "Unknown error from fal.ai" 
    };
  }
}
