'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Bot, Sparkles, Zap, Image as ImageIcon, MessageSquare, Upload, Pause, SkipBack, SkipForward, Trash2, Volume2 } from 'lucide-react';
import { generateImage } from './actions/fal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'chat' | 'media'>('generate');

  // Generate
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Epic Tech AI Agent™️. What cinematic creation shall we work on today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>("");

  // Media Player (unchanged - abbreviated here)
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ... (keep all your media functions: handleFileUpload, playMedia, etc.)

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);
    setCurrentProvider("");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chatMessages }),
      });

      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setCurrentProvider(data.provider || "Unknown");
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Sparkles className="w-11 h-11 text-purple-400" />
            <h1 className="text-4xl font-bold">Epic Tech AI Agent™️</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-emerald-400">● LIVE</span>
            <span className="bg-white/10 px-4 py-1.5 rounded-full">Multi-Provider AI</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-10">
          {[
            { id: 'generate', label: 'Generate', icon: ImageIcon },
            { id: 'chat', label: 'Chat Agent', icon: MessageSquare },
            { id: 'media', label: 'Media Player', icon: Play },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-5 text-xl font-medium flex items-center justify-center gap-3 ${
                activeTab === tab.id ? 'border-b-4 border-purple-500 text-white' : 'text-white/60 hover:text-white'
              }`}>
              <tab.icon className="w-6 h-6" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 min-h-[65vh]">
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[58vh] flex flex-col">
              {/* Provider Status */}
              {currentProvider && (
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 bg-white/10 text-xs px-4 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    Using <strong>{currentProvider}</strong>
                  </span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-5 rounded-3xl ${msg.role === 'user' ? 'bg-purple-600' : 'bg-white/10'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-5 rounded-3xl">
                      Thinking<span className="animate-pulse">...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-4">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Describe a cinematic scene..."
                  className="flex-1 bg-white/5 border border-white/20 rounded-3xl px-8 py-5 focus:border-purple-500 outline-none"
                />
                <button 
                  onClick={sendChatMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-purple-600 px-12 rounded-3xl font-semibold hover:bg-purple-500 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Other tabs (generate & media) remain the same */}
        </div>
      </div>
    </div>
  );
}
