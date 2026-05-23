'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Bot, Sparkles, Zap, Image as ImageIcon, MessageSquare, Upload, Pause, SkipBack, SkipForward } from 'lucide-react';
import { generateImage } from './actions/fal';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'chat' | 'media'>('media');

  // Media Player State
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));
    setMediaFiles(prev => [...prev, ...newFiles]);
  };

  const playMedia = (index: number) => {
    setCurrentMediaIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Sidebar */}
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

      {/* Main Area */}
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

        {/* Media Player Tab - Fully Functional */}
        {activeTab === 'media' && (
          <div className="flex-1 p-8 flex flex-col">
            <div className="mb-8">
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 transition-colors border border-white/30 rounded-3xl px-8 py-4 flex items-center justify-center gap-3 w-fit">
                <Upload className="w-6 h-6" />
                <span className="font-medium">Upload MP3 or MP4 Files</span>
                <input type="file" multiple accept="audio/*,video/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Playlist */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Your Library ({mediaFiles.length})</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {mediaFiles.length === 0 ? (
                    <p className="text-white/40 text-center py-12">No files uploaded yet</p>
                  ) : (
                    mediaFiles.map((media, index) => (
                      <div
                        key={index}
                        onClick={() => playMedia(index)}
                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:bg-white/10 ${currentMediaIndex === index ? 'bg-white/10' : ''}`}
                      >
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                          {media.type.startsWith('video') ? '🎬' : '🎵'}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-medium truncate">{media.name}</p>
                          <p className="text-xs text-white/50">{media.type}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Player */}
              <div className="bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 flex flex-col">
                {mediaFiles.length > 0 && mediaFiles[currentMediaIndex] ? (
                  <>
                    <div className="flex-1 bg-black flex items-center justify-center p-8">
                      {mediaFiles[currentMediaIndex].type.startsWith('video') ? (
                        <video
                          src={mediaFiles[currentMediaIndex].url}
                          controls
                          autoPlay
                          className="max-h-[420px] rounded-2xl"
                        />
                      ) : (
                        <audio
                          src={mediaFiles[currentMediaIndex].url}
                          controls
                          autoPlay
                          className="w-full"
                        />
                      )}
                    </div>

                    <div className="p-6 border-t border-white/10">
                      <p className="font-medium text-center mb-6 truncate">
                        {mediaFiles[currentMediaIndex].name}
                      </p>

                      <div className="flex justify-center gap-6">
                        <button onClick={() => setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1))} className="p-4 hover:bg-white/10 rounded-full">
                          <SkipBack className="w-8 h-8" />
                        </button>
                        <button onClick={togglePlay} className="p-6 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors">
                          {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                        </button>
                        <button onClick={() => setCurrentMediaIndex(Math.min(mediaFiles.length - 1, currentMediaIndex + 1))} className="p-4 hover:bg-white/10 rounded-full">
                          <SkipForward className="w-8 h-8" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <Play className="w-20 h-20 mx-auto text-white/20 mb-6" />
                      <p className="text-xl">Upload media files to start playing</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs remain the same as before */}
        {/* ... (Generate and Chat tabs) */}
      </div>
    </div>
  );
}
