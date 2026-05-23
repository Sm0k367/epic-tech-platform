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
  const [currentProvider, setCurrentProvider] = useState<string>("");

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

  // Load/Save Media
  useEffect(() => {
    const saved = localStorage.getItem('epicMediaFiles');
    if (saved) setMediaFiles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('epicMediaFiles', JSON.stringify(mediaFiles));
  }, [mediaFiles]);

  // Media Progress
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

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
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
          <div className="flex items-center gap-3 text-sm">
            <span className="text-emerald-400">● LIVE</span>
            <span className="bg-white/10 px-4 py-1.5 rounded-full">Cloudflare + Groq + HF</span>
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

        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 min-h-[65vh]">
          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div className="max-w-4xl mx-auto text-center">
              <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 mb-10 flex items-center justify-center">
                {generatedImage ? (
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                ) : isGenerating ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Generating cinematic image...</p>
                  </div>
                ) : (
                  <div className="text-8xl text-white/10">🎬</div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A cyberpunk samurai walking through neon Tokyo rain at night..."
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
            <div className="max-w-4xl mx-auto h-[58vh] flex flex-col">
              {currentProvider && (
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 bg-white/10 text-xs px-4 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    Using <strong>{currentProvider}</strong>
                  </span>
                </div>
              )}

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
                  placeholder="Describe a cinematic scene or ask anything..."
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
            <div className="max-w-6xl mx-auto">
              <label
                onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer border-2 border-dashed border-white/30 hover:border-purple-400 rounded-3xl p-12 flex flex-col items-center justify-center mb-10 transition-all"
              >
                <Upload className="w-16 h-16 mb-4 text-purple-400" />
                <p className="text-2xl font-medium">Drop videos or music here</p>
                <p className="text-white/50 mt-2">MP4, MOV, MP3 supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="audio/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Library */}
                <div className="lg:col-span-4 bg-white/5 rounded-3xl p-6 border border-white/10">
                  <h3 className="font-semibold mb-6">Library ({mediaFiles.length})</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {mediaFiles.length === 0 ? (
                      <p className="text-white/40 text-center py-20">No files uploaded yet</p>
                    ) : (
                      mediaFiles.map((media, i) => (
                        <div
                          key={i}
                          onClick={() => playMedia(i)}
                          className={`p-4 rounded-2xl flex gap-4 items-center cursor-pointer hover:bg-white/10 transition-all ${currentMediaIndex === i ? 'bg-purple-600/20 border border-purple-500' : ''}`}
                        >
                          <span className="text-3xl">{media.type.startsWith('video') ? '🎬' : '🎵'}</span>
                          <div className="flex-1 truncate text-sm">{media.name}</div>
                          <button onClick={(e) => { e.stopPropagation(); deleteMedia(i); }} className="text-red-400 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Player */}
                <div className="lg:col-span-8 bg-black rounded-3xl p-8 border border-white/10 flex flex-col">
                  {mediaFiles.length > 0 ? (
                    <>
                      <div className="flex-1 flex items-center justify-center bg-zinc-950 rounded-2xl mb-8 overflow-hidden min-h-[400px]">
                        {mediaFiles[currentMediaIndex].type.startsWith('video') ? (
                          <video
                            ref={mediaRef as any}
                            src={mediaFiles[currentMediaIndex].url}
                            className="max-h-[420px] w-full rounded-xl"
                            controls
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                          />
                        ) : (
                          <audio
                            ref={mediaRef as any}
                            src={mediaFiles[currentMediaIndex].url}
                            controls
                            className="w-full max-w-2xl"
                          />
                        )}
                      </div>

                      <p className="text-center font-medium mb-6 px-4 truncate">
                        {mediaFiles[currentMediaIndex].name}
                      </p>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-white/40 text-xl">
                      Upload media files to start playing
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
