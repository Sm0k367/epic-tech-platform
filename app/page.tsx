'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Bot, Sparkles, Zap, Image as ImageIcon } from 'lucide-react';
import { generateImage } from './actions/fal';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'image' | 'video' | 'audio' | 'text'>('image');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    const result = await generateImage(prompt);

    if (result.success && result.imageUrl) {
      setGeneratedImage(result.imageUrl);
    } else {
      alert('Generation failed: ' + (result.error || 'Unknown error'));
    }

    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 p-6 glass flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <Sparkles className="w-9 h-9 text-purple-400" />
          <h1 className="text-3xl font-bold neon-purple">Epic Tech AI Agent™️</h1>
        </div>

        <h2 className="uppercase text-xs tracking-widest text-white/40 mb-4">Agent Templates</h2>
        <div className="space-y-2 flex-1">
          {['Video Visionary', 'Artist Agent', 'Prompt Pilot', 'Cyber Director', 'Story Weaver'].map((name) => (
            <motion.div key={name} whileHover={{ x: 10 }} className="flex items-center gap-3 px-4 py-4 rounded-3xl hover:bg-white/10 cursor-pointer transition-all">
              <Bot className="w-5 h-5" />
              <span className="font-medium">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-white/10 flex items-center px-8 glass">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-xl">●</span>
            <span className="font-semibold tracking-widest">LIVE AGENT HUB • RAILWAY</span>
          </div>
          <div className="ml-auto flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" />
              <span>Credits: 248</span>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-2xl"></div>
          </div>
        </div>

        {/* Big Preview */}
        <div className="flex-1 p-8 flex items-center justify-center bg-black/60">
          <motion.div className="w-full max-w-6xl aspect-video bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative">
            {generatedImage ? (
              <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
            ) : isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-2xl font-medium">Generating with Flux Pro...</p>
                <p className="text-purple-400 mt-2">fal.ai • Real-time</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[160px] text-white/10">▶️</div>
            )}
          </motion.div>
        </div>

        {/* Prompt Area */}
        <div className="p-8 border-t border-white/10 glass">
          <div className="flex gap-3 mb-8">
            {[
              { id: 'image', icon: <ImageIcon className="w-5 h-5" />, label: 'Image' },
              { id: 'video', icon: '🎬', label: 'Video' },
              { id: 'audio', icon: '🎙️', label: 'Audio' },
              { id: 'text', icon: '📝', label: 'Text' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`flex-1 py-5 rounded-3xl font-semibold transition-all flex items-center justify-center gap-3 ${mode === m.id ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk samurai walking through neon Tokyo rain at night..."
              className="w-full bg-white/10 border border-white/30 focus:border-purple-400 rounded-3xl px-8 py-7 text-xl outline-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold px-12 py-5 rounded-3xl flex items-center gap-3 disabled:opacity-70"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
              <Play className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
