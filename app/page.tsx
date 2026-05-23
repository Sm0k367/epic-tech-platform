'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Bot, Sparkles, Zap, Image as ImageIcon, MessageSquare, Upload, Pause, SkipBack, SkipForward, Trash2, Volume2 } from 'lucide-react';
import { generateImage } from './actions/fal';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'chat' | 'media'>('generate');

  // Chat
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

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('epicMediaFiles');
    if (saved) {
      setMediaFiles(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('epicMediaFiles', JSON.stringify(mediaFiles));
  }, [mediaFiles]);

  // Media controls
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const updateProgress = () => {
      setProgress((media.currentTime / media.duration) * 100);
      setCurrentTime(media.currentTime);
      setDuration(media.duration);
    };

    media.addEventListener('timeupdate', updateProgress);
    media.addEventListener('ended', handleNext);

    return () => {
      media.removeEventListener('timeupdate', updateProgress);
      media.removeEventListener('ended', handleNext);
    };
  }, [currentMediaIndex]);

  const handleGenerate = async () => { /* ... same as before ... */ };

  const sendChatMessage = async () => { /* ... same as before ... */ };

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
    } else if (updated.length === 0) {
      setCurrentMediaIndex(0);
      setIsPlaying(false);
    }
  };

  const playMedia = (index: number) => {
    setCurrentMediaIndex(index);
    setIsPlaying(true);
    
    setTimeout(() => {
      if (mediaRef.current) {
        mediaRef.current.play();
      }
    }, 100);
  };

  const togglePlay = () => {
    if (!mediaRef.current || mediaFiles.length === 0) return;
    
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (mediaRef.current) mediaRef.current.volume = newVolume;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Sidebar - unchanged */}
      {/* ... your existing sidebar ... */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - unchanged */}
        {/* ... */}

        {/* Tabs - unchanged */}
        {/* ... */}

        {/* GENERATE TAB - unchanged */}
        {/* ... */}

        {/* CHAT TAB - unchanged */}
        {/* ... */}

        {/* ==================== IMPROVED MEDIA PLAYER ==================== */}
        {activeTab === 'media' && (
          <div className="flex-1 p-8 flex flex-col">
            <div className="mb-8">
              <label 
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer border-2 border-dashed border-white/30 hover:border-purple-400 rounded-3xl p-12 flex flex-col items-center justify-center transition-all"
              >
                <Upload className="w-12 h-12 mb-4 text-purple-400" />
                <p className="text-xl font-medium">Drop MP3, MP4, or MOV files here</p>
                <p className="text-white/50 mt-2">or click to browse</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept="audio/*,video/*" 
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden" 
                />
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1">
              {/* Library */}
              <div className="lg:col-span-2 bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg">Your Library ({mediaFiles.length})</h3>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                  >
                    <Upload className="w-4 h-4" /> Add
                  </button>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                  {mediaFiles.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-white/40">
                      No media yet. Upload something cinematic.
                    </div>
                  ) : (
                    mediaFiles.map((media, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => playMedia(index)}
                        className={`group p-4 rounded-2xl cursor-pointer flex items-center gap-4 transition-all ${
                          currentMediaIndex === index ? 'bg-purple-600/20 border border-purple-500' : 'hover:bg-white/10'
                        }`}
                      >
                        <div className="text-3xl flex-shrink-0">
                          {media.type.startsWith('video') ? '🎬' : '🎵'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{media.name}</p>
                          <p className="text-xs text-white/50">
                            {(media.size / (1024*1024)).toFixed(1)} MB
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMedia(index); }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Player */}
              <div className="lg:col-span-3 bg-zinc-950 rounded-3xl border border-white/10 p-8 flex flex-col">
                {mediaFiles.length > 0 ? (
                  <>
                    <div className="flex-1 flex items-center justify-center bg-black/50 rounded-2xl overflow-hidden mb-8">
                      {mediaFiles[currentMediaIndex].type.startsWith('video') ? (
                        <video 
                          ref={mediaRef as any}
                          src={mediaFiles[currentMediaIndex].url} 
                          className="max-h-[420px] w-full"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />
                      ) : (
                        <div className="text-center py-20">
                          <div className="text-8xl mb-6">🎵</div>
                          <audio 
                            ref={mediaRef as any}
                            src={mediaFiles[currentMediaIndex].url}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-center mb-6 truncate">
                        {mediaFiles[currentMediaIndex].name}
                      </p>

                      {/* Progress */}
                      <div className="mb-6">
                        <input
                          type="range"
                          value={progress}
                          onChange={handleSeek}
                          className="w-full accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-white/50 mt-1">
                          <span>{Math.floor(currentTime)}s</span>
                          <span>{Math.floor(duration)}s</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-6">
                        <button onClick={handlePrev} className="text-white/70 hover:text-white">
                          <SkipBack className="w-8 h-8" />
                        </button>

                        <button 
                          onClick={togglePlay}
                          className="bg-purple-600 hover:bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95"
                        >
                          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-0.5" />}
                        </button>

                        <button onClick={handleNext} className="text-white/70 hover:text-white">
                          <SkipForward className="w-8 h-8" />
                        </button>

                        {/* Volume */}
                        <div className="flex items-center gap-3 ml-8">
                          <Volume2 className="w-5 h-5 text-white/70" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 accent-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-white/40 text-center">
                    Upload media to start your personal cinematic player
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
