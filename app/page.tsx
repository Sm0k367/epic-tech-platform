'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Bot, Sparkles, Zap, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { generateImage } from './actions/fal';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'chat' | 'media'>('generate');

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: "Hello! I'm Epic Tech AI Agent. What would you like to create today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);

    const result = await generateImage(prompt);

    if (result.success && result.imageUrl) {
      setGeneratedImage(result.imageUrl);
    } else {
      setError(result.error || 'Generation failed');
    }

    setIsGenerating(false);
  };

  // Real Chat using Server Action
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chatMessages }),
      });

      const data = await response.json();

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || "Sorry, I couldn't respond right now." 
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting. Please try again." 
      }]);
    }

    setIsChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Sidebar - same as before */}
      <div className="w-72 border-r border-white/10 p-6 glass flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <Sparkles className="w-9 h-9 text-purple-400" />
          <h1 className="text-3xl font-bold neon-purple">Epic Tech AI Agent™️</h1>
        </div>

        <h2 className="uppercase text-xs tracking-widest text-white/50 mb-4">AGENT TEMPLATES</h2>
        <div className="space-y-2 flex-1">
          {['Video Visionary', 'Artist Agent', 'Prompt Pilot', 'Cyber Director', 'Story Weaver'].map((name) => (
            <div key={name} className="flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-all">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-white/10 flex items-center px-8 glass">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">● LIVE</span>
            <span className="font-semibold tracking-widest">AGENT HUB • RAILWAY</span>
          </div>
          <div className="ml-auto flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" /> Credits: 248
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-2xl"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'generate', label: 'Generate', icon: <ImageIcon /> },
            { id: 'chat', label: 'Chat Agent', icon: <MessageSquare /> },
            { id: 'media', label: 'Media Player', icon: <Play /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
                activeTab === tab.id ? 'border-b-2 border-purple-400 text-purple-400' : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="flex-1 p-8 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <motion.div className="w-full max-w-6xl aspect-video bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative">
                {generatedImage ? (
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                ) : isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-2xl font-medium">Generating...</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[160px] text-white/10">▶️</div>
                )}
              </motion.div>
            </div>

            <div className="mt-8">
              {error && <p className="text-red-400 text-center mb-4">{error}</p>}
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision..."
                  className="w-full bg-white/10 border border-white/30 focus:border-purple-400 rounded-3xl px-8 py-7 text-xl outline-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold px-14 py-5 rounded-3xl flex items-center gap-3 hover:brightness-110 disabled:opacity-60"
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                  <Play className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col p-8">
            <div className="flex-1 overflow-y-auto space-y-6 mb-6">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-5 rounded-3xl ${
                    msg.role === 'user' ? 'bg-purple-600' : 'bg-white/10'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && <div className="text-purple-400">Thinking...</div>}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Talk to your AI Agent..."
                className="flex-1 bg-white/10 border border-white/30 rounded-3xl px-6 py-4 outline-none focus:border-purple-400"
              />
              <button 
                onClick={sendChatMessage}
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-purple-600 px-10 rounded-3xl font-semibold hover:bg-purple-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Media Player Tab */}
        {activeTab === 'media' && (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <Play className="w-24 h-24 mx-auto text-white/20 mb-6" />
              <h3 className="text-3xl mb-3">Media Player</h3>
              <p className="text-white/60">Your generated videos and audio will play here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
