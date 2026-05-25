export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '/validate') {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Epic Tech AI</title>
          <style>
            body { 
              margin: 0; padding: 0; background: #050505; color: white; 
              font-family: system-ui, -apple-system, sans-serif; 
              display: flex; align-items: center; justify-content: center; 
              min-height: 100vh; text-align: center;
            }
            .container { max-width: 600px; padding: 40px; }
            h1 { font-size: 3.5rem; margin: 0 0 16px 0; background: linear-gradient(90deg, #a855f7, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            p { color: #888; font-size: 1.2rem; }
            .btn {
              display: inline-block; margin: 20px 10px; padding: 14px 32px; 
              background: #a855f7; color: white; text-decoration: none; 
              border-radius: 9999px; font-weight: bold;
            }
            .btn:hover { background: #c026d3; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Epic Tech AI</h1>
            <p>Running on Cloudflare Workers with real AI models</p>
            <div>
              <a href="/chat" class="btn">💬 Chat with Llama 3.1</a><br><br>
              <a href="/image" class="btn">🌌 Generate Image with FLUX.1</a>
            </div>
            <p style="margin-top: 60px; font-size: 0.9rem; color: #444;">
              Single file deployment • env.AI.run() active
            </p>
          </div>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' }});
    }

    if (path === '/chat' || path === '/api/chat') {
      return handleChat(request, env);
    }

    if (path === '/image' || path === '/api/generate-image') {
      return handleImageGeneration(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};

async function handleChat(request, env) {
  try {
    let message = "Hello from Epic Tech AI on Cloudflare";
    if (request.method === "POST") {
      const data = await request.json().catch(() => ({}));
      message = data.message || message;
    }

    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: "system", content: "You are Epic Tech AI - helpful, witty, and creative." },
        { role: "user", content: message }
      ]
    });

    return Response.json({ 
      response: result.response || "Hello! I'm running live on Cloudflare Workers AI." 
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function handleImageGeneration(request, env) {
  try {
    let prompt = "A beautiful cyberpunk city at night with flying cars and neon lights";
    if (request.method === "POST") {
      const data = await request.json().catch(() => ({}));
      prompt = data.prompt || prompt;
    }

    const result = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: prompt,
      num_steps: 8,
      guidance: 3.5
    });

    return new Response(result.image, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    return new Response('Image generation failed: ' + err.message, { status: 500 });
  }
}
