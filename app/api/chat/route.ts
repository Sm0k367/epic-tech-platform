import { NextRequest } from 'next/server';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct-fast`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { 
              role: "system", 
              content: "You are Epic Tech AI Agent™️, a creative, cinematic, and highly intelligent AI assistant specialized in media generation." 
            },
            ...history,
            { role: "user", content: message }
          ],
          max_tokens: 700,
          temperature: 0.85,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json({ 
      reply: data.result?.response || "Sorry, I couldn't generate a response." 
    });

  } catch (error) {
    console.error("Chat Error:", error);
    return Response.json({ 
      reply: "Sorry, I'm having trouble connecting right now. Please try again." 
    });
  }
}
