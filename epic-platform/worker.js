export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Simple validation endpoint
    if (pathname.includes('cfut_') || pathname === '/validate') {
      return new Response('✅ Epic Tech AI Playground is running on Cloudflare Workers AI', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // API: Chat with Llama
    if (pathname === '/api/chat') {
      return handleChat(request, env);
    }

    // API: Generate image with Flux
    if (pathname === '/api/generate-image') {
      return handleImageGeneration(request, env);
    }

    // Serve the interactive playground
    return serveUI();
  }
};

async function handleChat(request, env) {
  try {
    const { message } = await request.json();
    if (!message) return Response.json({ error: "Message required" }, { status: 400 });

    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: "system", content: "You are a helpful, creative, and epic AI assistant." },
        { role: "user", content: message }
      ]
    });

    return Response.json({ response: result.response || result });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function handleImageGeneration(request, env) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return Response.json({ error: "Prompt required" }, { status: 400 });

    const result = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: prompt,
      num_steps: 8,
      guidance: 3.5
    });

    return Response.json({ 
      image: result.image ? `data:image/jpeg;base64,${result.image}` : null 
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

function serveUI() {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Epic Tech AI Playground</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, sans-serif; background: #0a0a0a; color: white; }
    .glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); }
  </style>
</head>
<body class="min-h-screen p-8">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
      Epic Tech AI Playground
    </h1>
    <p class="text-center text-gray-400 mb-12">Real Cloudflare Workers AI • Llama 3.1 + FLUX.1</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Chat -->
      <div class="glass border border-white/10 rounded-3xl p-8">
        <h2 class="text-xl font-semibold mb-6">💬 Chat with Llama 3.1</h2>
        <div id="chat" class="h-80 overflow-y-auto mb-6 space-y-4 text-sm"></div>
        <div class="flex gap-3">
          <input id="input" type="text" placeholder="Ask anything..." 
                 class="flex-1 bg-black border border-white/20 rounded-2xl px-5 py-4 focus:outline-none">
          <button onclick="sendMessage()" 
                  class="bg-white text-black px-8 rounded-2xl font-medium">Send</button>
        </div>
      </div>

      <!-- Image -->
      <div class="glass border border-white/10 rounded-3xl p-8">
        <h2 class="text-xl font-semibold mb-6">🌌 Generate Image with FLUX.1</h2>
        <input id="prompt" type="text" placeholder="A cyberpunk samurai in neon rain..." 
               class="w-full bg-black border border-white/20 rounded-2xl px-5 py-4 mb-6 focus:outline-none">
        <button onclick="generateImage()" 
                class="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl font-bold">
          Generate Image
        </button>
        <div id="image-area" class="mt-8 hidden">
          <img id="result-image" class="rounded-2xl w-full" alt="Generated">
        </div>
      </div>
    </div>
  </div>

  <script>
    async function sendMessage() {
      const input = document.getElementById('input');
      const msg = input.value.trim();
      if (!msg) return;
      addMessage('You', msg);
      input.value = '';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message: msg})
      });
      const data = await res.json();
      addMessage('Llama 3.1', data.response || data.error);
    }

    async function generateImage() {
      const prompt = document.getElementById('prompt').value.trim();
      if (!prompt) return alert('Enter a prompt');

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({prompt})
      });
      const data = await res.json();

      if (data.image) {
        document.getElementById('result-image').src = data.image;
        document.getElementById('image-area').classList.remove('hidden');
      } else {
        alert('Error: ' + (data.error || 'Failed'));
      }
    }

    function addMessage(sender, text) {
      const chat = document.getElementById('chat');
      const div = document.createElement('div');
      div.innerHTML = \`<strong>\${sender}:</strong> \${text}\`;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }
  </script>
</body>
</html>`, {
    headers: { 'content-type': 'text/html;charset=UTF-8' }
  });
}
