'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Bot, Sparkles, Zap, Image as ImageIcon, MessageSquare, Upload, Pause, SkipBack, SkipForward, Trash2, Volume2 } from 'lucide-react';
import { generateImage } from './actions/fal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'chat' | 'media'>('generate');

  // Generate Tab
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Chat Tab
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Epic Tech AI Agent™️. What cinematic creation shall we work on today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Media Player
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Media Effects
  useEffect(() => {
    const saved = localStorage.getItem('epicMediaFiles');
    if (saved) setMediaFiles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('epicMediaFiles', JSON.stringify(mediaFiles));
  }, [mediaFiles]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const updateProgress = () => {
      if (media.duration) {
        setProgress((media.currentTime / media.duration) * 100);
        setCurrentTime(media.currentTime);
        setDuration(media.duration);
      }
    };

    media.addEventListener('timeupdate', updateProgress);
    media.addEventListener('ended', handleNext);

    return () => {
      media.removeEventListener('timeupdate', updateProgress);
      media.removeEventListener('ended', handleNext);
    };
  }, [currentMediaIndex]);

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
        content: "Sorry, connection issue. Please try again." 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Media Functions
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map(file => ({
      file, url: URL.createObjectURL(file), name: file.name, type: file.type, size: file.size,
    }));
    setMediaFiles(prev => [...prev, ...newFiles]);
  };

  const deleteMedia = (index: number) => {
    const updated = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updated);
    if (index === currentMediaIndex && updated.length > 0) setCurrentMediaIndex(0);
  };

  const playMedia = (index: number) => {
    setCurrentMediaIndex(index);
    setIsPlaying(true);
    setTimeout(() => mediaRef.current?.play(), 100);
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    isPlaying ? mediaRef.current.pause() : mediaRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (mediaFiles.length === 0) return;
    const next = (currentMediaIndex + 1) % mediaFiles.length;
    setCurrentMediaIndex(next);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (mediaFiles.length === 0) return;
    const prev = (currentMediaIndex - 1 + mediaFiles.length) % mediaFiles.length;
    setCurrentMediaIndex(prev);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Sparkles className="w-11 h-11 text-purple-400" />
            <h1 className="text-4xl font-bold">Epic Tech AI Agent™️</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400">● LIVE</span>
            <span className="bg-white/10 px-5 py-2 rounded-full text-sm">Cloudflare + Groq Backup</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-10">
          {[
            { id: 'generate', label: 'Generate', icon: ImageIcon },
            { id: 'chat', label: 'Chat Agent', icon: MessageSquare },
            { id: 'media', label: 'Media Player', icon: Play },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-5 text-xl font-medium flex items-center justify-center gap-3 transition-all ${
                activeTab === tab.id ? 'border-b-4 border-purple-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 min-h-[65vh]">
          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div className="max-w-4xl mx-auto text-center">
              <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 mb-10">
                {generatedImage ? (
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-8xl text-white/10">🎬</div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A cyberpunk samurai walking through neon Tokyo rain..."
                  className="w-full bg-white/5 border border-white/20 rounded-3xl px-8 py-7 text-xl focus:border-purple-500 outline-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 px-12 py-4 rounded-2xl font-bold disabled:opacity-60"
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
              {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[55vh] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-5 rounded-3xl ${msg.role === 'user' ? 'bg-purple-600' : 'bg-white/10'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && <div className="text-purple-400">Thinking with backup brain...</div>}
              </div>

              <div className="flex gap-4">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Describe a scene or ask anything..."
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

          {/* Media Player Tab */}
          {activeTab === 'media' && (
            <div className="max-w-5xl mx-auto">
              {/* Upload Area */}
              <label 
                onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer border-2 border-dashed border-white/30 hover:border-purple-400 rounded-3xl p-12 flex flex-col items-center mb-10"
              >
                <Upload className="w-16 h-16 mb-4 text-purple-400" />
                <p className="text-2xl">Drop your videos or music here</p>
                <input ref={fileInputRef} type="file" multiple accept="audio/*,video/*" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
              </label>

              {/* Media Player + Library */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Library */}
                <div className="lg:col-span-4 bg-white/5 rounded-3xl p-6">
                  <h3 className="font-semibold mb-6">Your Library ({mediaFiles.length})</h3>
                  {/* Library list code here (same as before) */}
                </div>

                {/* Player */}
                <div className="lg:col-span-8 bg-black rounded-3xl p-8">
                  {/* Full player code (same as previous version) */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
