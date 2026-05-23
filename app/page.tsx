'use client';

import { useState } from 'react';
import { Play, Bot, Sparkles, Zap, Image as ImageIcon, MessageSquare, Upload } from 'lucide-react';
import { generateImage } from './actions/fal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'chat' | 'media'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Chat states
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Epic Tech AI Agent™️. What are we creating today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');

    const result = await generateImage(prompt);
    
    if (result.success && result.imageUrl) {
      setGeneratedImage(result.imageUrl);
    } else {
      setError(result.error || 'Generation failed');
    }
    setIsGenerating(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chatMessages }),
      });

      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, connection error. Try again." 
      }]);
    }
    setIsChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-white/10 p-6 flex flex-col bg-black/40">
          <div className="flex items-center gap-3 mb-12">
            <Sparkles className="w-9 h-9 text-purple-400" />
            <h1 className="text-3xl font-bold">Epic Tech AI Agent™️</h1>
          </div>

          <h2 className="uppercase text-xs tracking-widest text-white/50 mb-4">AGENT TEMPLATES</h2>
          <div className="space-y-2">
            {['Video Visionary', 'Artist Agent', 'Prompt Pilot', 'Cyber Director'].map(name => (
              <div key={name} className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-white/10 cursor-pointer">
                <Bot className="w-5 h-5 text-purple-400" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="h-16 border-b border-white/10 flex items-center px-8 bg-black/40">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">● LIVE</span>
              <span className="font-semibold tracking-widest">AGENT HUB • RAILWAY</span>
            </div>
            <div className="ml-auto flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" /> Credits: 248
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-black/30">
            {[
              { id: 'generate', label: 'Generate', icon: ImageIcon },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'media', label: 'Media', icon: Play },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
                  activeTab === tab.id ? 'border-b-2 border-purple-500 text-purple-400' : 'text-white/60 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-8">
            {activeTab === 'generate' && (
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video bg-zinc-950 rounded-3xl border border-white/10 mb-8 flex items-center justify-center overflow-hidden">
                  {generatedImage ? (
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white/20 text-8xl">🎥</div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your cinematic vision..."
                    className="w-full bg-white/5 border border-white/20 rounded-3xl px-8 py-6 text-lg focus:border-purple-500 outline-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 px-10 py-3 rounded-2xl font-semibold disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </button>
                </div>
                {error && <p className="text-red-400 mt-3">{error}</p>}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="max-w-3xl mx-auto h-full flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-5 rounded-3xl ${msg.role === 'user' ? 'bg-purple-600' : 'bg-white/10'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && <div className="text-purple-400">Thinking...</div>}
                </div>

                <div className="flex gap-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Talk to Epic Tech AI..."
                    className="flex-1 bg-white/5 border border-white/20 rounded-3xl px-6 py-4 focus:border-purple-500 outline-none"
                  />
                  <button onClick={sendChatMessage} className="bg-purple-600 px-8 rounded-3xl font-semibold">Send</button>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="text-center text-white/50 py-20">
                Media Player - Coming in next update
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
