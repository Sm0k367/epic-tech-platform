'use server';

import { fal } from '@fal-ai/client';

fal.config({
  credentials: process.env.FAL_KEY || process.env.FAL_AI_API_KEY,
});

export async function generateImage(prompt: string) {
  try {
    const result = await fal.subscribe('fal-ai/flux-pro/v1.1', {
      input: {
        prompt: prompt,
        image_size: 'landscape_16_9' as const,
        num_images: 1,
        guidance_scale: 3.5,
        // num_inference_steps removed — not supported in this model version
      },
    });

    return {
      success: true,
      imageUrl: result.images?.[0]?.url || '',
      model: 'Flux Pro 1.1',
    };
  } catch (error: any) {
    console.error('fal.ai error:', error);
    return {
      success: false,
      error: error.message || 'Image generation failed',
    };
  }
}
