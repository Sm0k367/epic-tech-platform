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
    { role: 'assistant', content: "Hello! I'm Epic Tech AI Agent™️. What are we creating today?" }
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

  // Load/Save media files
  useEffect(() => {
    const saved = localStorage.getItem('epicMediaFiles');
    if (saved) setMediaFiles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('epicMediaFiles', JSON.stringify(mediaFiles));
  }, [mediaFiles]);

  // Media event listeners
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

  const handleGenerate = async () => { /* same as before */ };

  const sendChatMessage = async () => { /* same as before */ };

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
    if (index === currentMediaIndex && updated.length > 0) {
      setCurrentMediaIndex(0);
    }
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
    const next = (currentMediaIndex + 1) % mediaFiles.length;
    setCurrentMediaIndex(next);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prev = (currentMediaIndex - 1 + mediaFiles.length) % mediaFiles.length;
    setCurrentMediaIndex(prev);
    setIsPlaying(true);
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
            {['Video Visionary', 'Artist Agent', 'Prompt Pilot', 'Cyber Director', 'Story Weaver'].map(name => (
              <div key={name} className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-white/10 cursor-pointer transition-all">
                <Bot className="w-5 h-5 text-purple-400" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-white/10 flex items-center px-8 bg-black/40">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">● LIVE</span>
              <span className="font-semibold tracking-widest">AGENT HUB • RAILWAY</span>
            </div>
            <div className="ml-auto flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" /> Credits: 248
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-black/30">
            {[
              { id: 'generate', label: 'Generate', icon: ImageIcon },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'media', label: 'Media Player', icon: Play },
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

          {/* Tab Contents */}
          <div className="flex-1 overflow-auto p-8">
            {activeTab === 'generate' && ( /* your generate code */ )}
            
            {activeTab === 'chat' && ( /* your chat code */ )}

            {/* ==================== FULL MEDIA PLAYER ==================== */}
            {activeTab === 'media' && (
              <div className="h-full flex flex-col">
                {/* Drag & Drop Upload */}
                <label 
                  onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                  onDragOver={(e) => e.preventDefault()}
                  className="cursor-pointer border-2 border-dashed border-white/30 hover:border-purple-400 rounded-3xl p-10 flex flex-col items-center justify-center mb-8 transition-all"
                >
                  <Upload className="w-12 h-12 mb-4 text-purple-400" />
                  <p className="text-xl">Drop videos or music here</p>
                  <p className="text-white/50">MP4, MOV, MP3 supported</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept="audio/*,video/*" 
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden" 
                  />
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1">
                  {/* Library */}
                  <div className="lg:col-span-2 bg-white/5 rounded-3xl p-6 border border-white/10">
                    <h3 className="font-semibold mb-4">Library ({mediaFiles.length})</h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {mediaFiles.length === 0 ? (
                        <p className="text-white/40 text-center py-20">No files yet</p>
                      ) : (
                        mediaFiles.map((media, i) => (
                          <div
                            key={i}
                            onClick={() => playMedia(i)}
                            className={`p-4 rounded-2xl cursor-pointer flex gap-4 items-center hover:bg-white/10 transition-all ${currentMediaIndex === i ? 'bg-purple-600/20' : ''}`}
                          >
                            <span className="text-2xl">{media.type.startsWith('video') ? '🎬' : '🎵'}</span>
                            <div className="flex-1 truncate">{media.name}</div>
                            <button onClick={(e) => { e.stopPropagation(); deleteMedia(i); }} className="text-red-400">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Player */}
                  <div className="lg:col-span-3 bg-zinc-950 rounded-3xl p-8 border border-white/10 flex flex-col">
                    {mediaFiles.length > 0 ? (
                      <>
                        <div className="flex-1 flex items-center justify-center bg-black rounded-2xl mb-8 overflow-hidden">
                          {mediaFiles[currentMediaIndex].type.startsWith('video') ? (
                            <video 
                              ref={mediaRef as any}
                              src={mediaFiles[currentMediaIndex].url}
                              className="max-h-[450px] w-full"
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                            />
                          ) : (
                            <audio ref={mediaRef as any} src={mediaFiles[currentMediaIndex].url} />
                          )}
                        </div>

                        <div className="text-center mb-6 font-medium">
                          {mediaFiles[currentMediaIndex].name}
                        </div>

                        {/* Progress Bar */}
                        <input
                          type="range"
                          value={progress}
                          onChange={(e) => {
                            const newTime = (Number(e.target.value) / 100) * duration;
                            if (mediaRef.current) mediaRef.current.currentTime = newTime;
                          }}
                          className="w-full accent-purple-500 mb-2"
                        />

                        <div className="flex justify-between text-xs text-white/50 mb-6">
                          <span>{Math.floor(currentTime)}s</span>
                          <span>{Math.floor(duration)}s</span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-8">
                          <button onClick={handlePrev}><SkipBack size={32} /></button>
                          <button 
                            onClick={togglePlay}
                            className="bg-purple-600 hover:bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center transition-all"
                          >
                            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                          </button>
                          <button onClick={handleNext}><SkipForward size={32} /></button>

                          <div className="flex items-center gap-3 ml-6">
                            <Volume2 size={20} />
                            <input
                              type="range"
                              min="0" max="1" step="0.01"
                              value={volume}
                              onChange={(e) => {
                                const vol = Number(e.target.value);
                                setVolume(vol);
                                if (mediaRef.current) mediaRef.current.volume = vol;
                              }}
                              className="w-28 accent-purple-500"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-white/40">
                        Upload files to start playing
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
