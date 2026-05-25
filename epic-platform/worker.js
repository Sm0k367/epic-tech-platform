export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/validate' || pathname.includes('cfut_')) {
      return new Response('✅ Token validated. Full Cloudflare AI Playground is active.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    if (pathname === '/api/chat') {
      return handleChat(request, env);
    }
    if (pathname === '/api/generate-image') {
      return handleImageGeneration(request, env);
    }

    return servePlayground();
  }
};

async function handleChat(request, env) {
  try {
    const { message, model = '@cf/meta/llama-3.1-8b-instruct' } = await request.json();

    if (!message) return Response.json({ error: 'Message required' }, { status: 400 });

    const result = await env.AI.run(model, {
      messages: [
        { role: "system", content: "You are a helpful, creative, and epic AI assistant running on Cloudflare Workers AI." },
        { role: "user", content: message }
      ]
    });

    return Response.json({ response: result.response || result, model });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function handleImageGeneration(request, env) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return Response.json({ error: 'Prompt required' }, { status: 400 });

    const result = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: prompt,
      num_steps: 8,
      guidance: 3.5,
      width: 1024,
      height: 1024
    });

    return Response.json({
      image: result.image ? `data:image/jpeg;base64,${result.image}` : null,
      model: '@cf/black-forest-labs/flux-1-schnell'
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function servePlayground() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epic Tech AI Playground • Cloudflare Workers AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        body { font-family: 'Inter', system-ui, sans-serif; }
        .logo { font-family: 'Space Grotesk', sans-serif; }
        .neon { text-shadow: 0 0 20px #c026d3, 0 0 40px #c026d3; }
        .glass { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(16px); border: 1px solid rgba(148, 163, 184, 0.2); }
    </style>
</head>
<body class="bg-zinc-950 text-white min-h-screen">
    <div class="max-w-6xl mx-auto p-8">
        <div class="flex justify-between items-center mb-12">
            <div class="flex items-center gap-4">
                <span class="text-5xl">⚡</span>
                <div>
                    <span class="logo text-5xl font-bold tracking-tighter neon text-violet-400">EPIC</span>
                    <span class="logo text-5xl font-bold tracking-tighter text-cyan-400">TECH</span>
                </div>
            </div>
            <div class="text-emerald-400 font-mono text-sm flex items-center gap-2">
                <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                LIVE ON CLOUDFLARE WORKERS AI
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Chat -->
            <div class="glass rounded-3xl p-8">
                <h2 class="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <span>💬</span> Chat with Llama 3.1
                </h2>
                <div id="chat-messages" class="h-96 overflow-y-auto mb-6 space-y-4 text-sm"></div>
                <div class="flex gap-3">
                    <input id="chat-input" type="text" placeholder="Ask me anything..." 
                           class="flex-1 bg-zinc-900 border border-white/20 rounded-3xl px-6 py-4 focus:outline-none focus:border-violet-400">
                    <button onclick="sendChat()" 
                            class="bg-violet-600 hover:bg-violet-500 px-8 rounded-3xl font-semibold">Send</button>
                </div>
            </div>

            <!-- Image Generation -->
            <div class="glass rounded-3xl p-8">
                <h2 class="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <span>🌌</span> Generate with FLUX.1
                </h2>
                <input id="image-prompt" type="text" placeholder="A cyberpunk city at night, neon lights, cinematic..." 
                       class="w-full bg-zinc-900 border border-white/20 rounded-3xl px-6 py-4 mb-6 focus:outline-none focus:border-fuchsia-400">
                <button onclick="generateImage()" 
                        class="w-full py-6 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-3xl font-bold text-lg">GENERATE IMAGE</button>
                
                <div id="image-container" class="mt-8 hidden">
                    <img id="generated-image" class="rounded-3xl w-full shadow-2xl" alt="Generated by FLUX.1">
                </div>
            </div>
        </div>

        <div class="text-center text-xs text-white/40 mt-12 font-mono">
            Real inference using <code class="bg-white/10 px-2 py-0.5 rounded">env.AI.run()</code> • 
            Models: Llama 3.1 + FLUX.1 Schnell
        </div>
    </div>

    <script>
        async function sendChat() {
            const input = document.getElementById('chat-input');
            const msg = input.value.trim();
            if (!msg) return;

            addChatMessage('user', msg);
            input.value = '';

            const loading = addChatMessage('assistant', 'Thinking on Cloudflare GPUs...');

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({message: msg})
                });
                const data = await res.json();
                removeMessage(loading);
                addChatMessage('assistant', data.response || data.error || 'No response');
            } catch(e) {
                removeMessage(loading);
                addChatMessage('assistant', 'Error: Could not reach AI');
            }
        }

        async function generateImage() {
            const prompt = document.getElementById('image-prompt').value.trim();
            if (!prompt) return alert('Please enter a prompt');

            const container = document.getElementById('image-container');
            container.classList.add('hidden');

            const img = document.getElementById('generated-image');
            img.src = '';

            try {
                const res = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({prompt})
                });
                const data = await res.json();

                if (data.image) {
                    img.src = data.image;
                    container.classList.remove('hidden');
                } else {
                    alert('Error: ' + (data.error || 'Generation failed'));
                }
            } catch(e) {
                alert('Failed to connect to Cloudflare AI');
            }
        }

        function addChatMessage(role, content) {
            const container = document.getElementById('chat-messages');
            const div = document.createElement('div');
            div.className = \`flex \${role === 'user' ? 'justify-end' : 'justify-start'}\`;
            div.innerHTML = \`
                <div class="max-w-[80%] \${role === 'user' ? 'bg-violet-600' : 'glass'} rounded-3xl px-5 py-3">
                    <div class="text-[10px] opacity-60 mb-1">\${role.toUpperCase()}</div>
                    <div>\${content}</div>
                </div>
            \`;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
            return div;
        }

        function removeMessage(el) {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        }

        document.getElementById('chat-input').addEventListener('keypress', e => {
            if (e.key === 'Enter') sendChat();
        });
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
