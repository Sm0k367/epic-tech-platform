import { NextRequest } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    const systemPrompt = {
      role: "system",
      content: "You are Epic Tech AI Agent™️, a creative, cinematic, and highly intelligent AI assistant specialized in media generation, film, and visual storytelling."
    };

    // === 1. Cloudflare ===
    if (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) {
      try {
        const cfRes = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct-fast`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [systemPrompt, ...history, { role: "user", content: message }],
              max_tokens: 750,
              temperature: 0.85,
            }),
          }
        );

        const cfData = await cfRes.json();

        // Success
        if (cfRes.ok && cfData.result?.response) {
          return Response.json({ 
            reply: cfData.result.response, 
            provider: "Cloudflare" 
          });
        }

        // Check for daily limit error
        if (cfData.errors?.some((e: any) => e.code === 4006 || e.message.includes("daily free allocation"))) {
          console.log("Cloudflare daily limit reached → Falling back");
        } else {
          console.log("Cloudflare error:", cfData);
        }
      } catch (e) {
        console.log("Cloudflare request failed");
      }
    }

    // === 2. Groq Fallback ===
    if (GROQ_API_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [systemPrompt, ...history, { role: "user", content: message }],
            max_tokens: 800,
            temperature: 0.85,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          return Response.json({ 
            reply: data.choices?.[0]?.message?.content || "Got it!", 
            provider: "Groq" 
          });
        }
      } catch (e) {
        console.log("Groq failed");
      }
    }

    // === 3. Hugging Face Fallback ===
    if (HUGGINGFACE_API_KEY) {
      try {
        const hfRes = await fetch(
          "https://api-inference.huggingface.co/models/meta-llama/Llama-3.3-70B-Instruct",
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: message,
              parameters: { max_new_tokens: 750, temperature: 0.85, return_full_text: false }
            }),
          }
        );

        if (hfRes.ok) {
          const data = await hfRes.json();
          const reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
          return Response.json({ 
            reply: reply || "Understood!", 
            provider: "Hugging Face" 
          });
        }
      } catch (e) {
        console.log("Hugging Face failed");
      }
    }

    // Final fallback message
    return Response.json({ 
      reply: "All AI providers are currently at capacity. Please try again in a few minutes.", 
      provider: "None" 
    });

  } catch (error) {
    console.error("Chat Error:", error);
    return Response.json({ 
      reply: "Sorry, I'm having trouble connecting right now.", 
      provider: "Error" 
    });
  }
}
