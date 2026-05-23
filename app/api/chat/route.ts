import { NextRequest } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // Try Cloudflare first
    if (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) {
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct-fast`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                { 
                  role: "system", 
                  content: "You are Epic Tech AI Agent™️, a creative, cinematic, and highly intelligent AI assistant specialized in media generation, film, and visual storytelling." 
                },
                ...history,
                { role: "user", content: message }
              ],
              max_tokens: 800,
              temperature: 0.85,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          return Response.json({ 
            reply: data.result?.response || "Got it!" 
          });
        }
      } catch (cfError) {
        console.log("Cloudflare failed, trying Groq fallback...");
      }
    }

    // Groq Fallback
    if (GROQ_API_KEY) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",   // or "mixtral-8x7b-32768"
            messages: [
              { 
                role: "system", 
                content: "You are Epic Tech AI Agent™️, a creative, cinematic, and highly intelligent AI assistant specialized in media generation." 
              },
              ...history,
              { role: "user", content: message }
            ],
            max_tokens: 800,
            temperature: 0.85,
          }),
        });

        const data = await groqResponse.json();
        return Response.json({ 
          reply: data.choices?.[0]?.message?.content || "Understood!" 
        });
      } catch (groqError) {
        console.error("Groq also failed:", groqError);
      }
    }

    // Final fallback
    return Response.json({ 
      reply: "I'm currently at capacity. Please try again in a moment." 
    });

  } catch (error) {
    console.error("Chat Error:", error);
    return Response.json({ 
      reply: "Sorry, I'm having trouble connecting right now." 
    });
  }
}
