'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Volume2, Maximize, PictureInPicture, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const agents = [
  'Creative Writer',
  'Code Crafter',
  'Artist Agent',
  'Music Maker',
  'Video Visionary',
  'Prompt Pilot'
];

const modes = [
  { name: 'Text', icon: '✍️' },
  { name: 'Image', icon: '🖼️' },
  { name: 'Audio', icon: '🎵' },
  { name: 'Video', icon: '🎥' }
];

const statuses = [
  { label: 'Processing', color: 'bg-yellow-400' },
  { label: 'Ready', color: 'bg-green-400' },
  { label: 'Generating', color: 'bg-purple-500' }
];

export default function EpicTechAIAgent() {
  const [activeAgent, setActiveAgent] = useState('Video Visionary');
  const [activeMode, setActiveMode] = useState('Video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState(2); // Generating by default
  const [progress, setProgress] = useState(65);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Simple canvas waveform animator
  useEffect(() => {
    const canvas = waveformRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 280;
    canvas.height = 120;

    let phase = 0;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#a855f7';

      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 3) {
        const y = canvas.height / 2 + Math.sin((x + phase) * 0.03) * 35 * (1 + Math.sin(phase * 0.1) * 0.3);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();

      // Glow layers
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 4) {
        const y = canvas.height / 2 + Math.sin((x + phase * 1.2) * 0.025) * 28;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 4;
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="glass border-b border-purple-500/30 h-14 flex items-center px-8 z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-cyan-400 rounded flex items-center justify-center text-xs font-bold">ET</div>
          <div>
            <h1 className="text-xl font-semibold tracking-tighter neon-purple">Epic Tech AI Agent™️</h1>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-6 py-1 rounded-full border border-cyan-400/30 text-xs tracking-[3px] font-mono text-cyan-400 neon-cyan">
            LIVE AGENT HUB • RAILWAY
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="px-4 py-1.5 rounded-full glass text-purple-400 text-xs font-medium cursor-pointer hover:bg-purple-500/10 transition-colors">RAILWAY</div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">BP</div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] relative">
        {/* Left Sidebar - Agents */}
        <div className="w-60 glass border-r border-purple-500/20 flex flex-col p-4 z-40">
          <div className="uppercase text-xs tracking-widest text-purple-400/70 mb-4 pl-2">AGENTS</div>
          
          <div className="space-y-1 flex-1">
            {agents.map((agent) => (
              <motion.button
                key={agent}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveAgent(agent)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all group flex items-center gap-3 text-sm ${
                  activeAgent === agent 
                    ? 'bg-purple-500/10 border border-purple-500/50 text-white shadow-[0_0_15px_-3px] shadow-purple-500' 
                    : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                }`}
                data-text={agent}
              >
                <div className={`w-2 h-2 rounded-full ${activeAgent === agent ? 'bg-purple-500 animate-pulse' : 'bg-zinc-500 group-hover:bg-cyan-400'}`} />
                {agent}
              </motion.button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 mt-auto">
            <div className="text-[10px] text-zinc-500 text-center">v0.1 • RAILWAY</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
          {/* Cinematic Media Player */}
          <div className="flex-1 glass rounded-3xl overflow-hidden border border-purple-500/30 relative group shadow-2xl" style={{ minHeight: '380px' }}>
            <div className="absolute inset-0 bg-black/60 z-10" />
            
            {/* Video/Player Area */}
            <div className="relative h-full flex items-center justify-center bg-zinc-950 overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover opacity-90"
                loop
                muted
                poster="https://picsum.photos/id/1015/1920/1080"
              >
                <source src="https://assets.mixkit.co/videos/preview/754/754-small.mp4" type="video/mp4" />
              </video>
              
              {/* Neon Frame Overlay */}
              <div className="absolute inset-0 border-2 border-purple-500/40 pointer-events-none rounded-3xl" />
              
              {/* Glitch accents */}
              <div className="absolute top-6 left-6 px-3 py-1 bg-black/70 text-cyan-400 text-xs font-mono tracking-widest flex items-center gap-2 border-l-2 border-cyan-400">
                APX / HERO
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              
              {/* Custom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 z-20">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors neon-purple"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </motion.button>
                  
                  <div className="flex-1 h-1 bg-white/20 rounded-full relative cursor-pointer group-hover:bg-white/30">
                    <div className="absolute left-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-magenta-500 rounded-full" style={{width: `${progress}%`}} />
                    <div className="absolute -top-1 left-[65%] w-3 h-3 bg-white rounded-full shadow-lg shadow-purple-500" />
                  </div>
                  
                  <div className="flex items-center gap-5 text-zinc-400">
                    <Volume2 size={18} />
                    <Maximize size={18} />
                    <PictureInPicture size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area Overlay */}
            <div className="absolute top-6 right-6 z-30">
              <label className="glass px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm cursor-pointer border border-purple-400/30 hover:border-purple-400 transition-all active:scale-95">
                <Upload size={16} />
                UPLOAD MEDIA
                <input type="file" multiple accept="video/*,audio/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="absolute bottom-20 left-6 z-30 glass p-3 rounded-2xl max-w-[220px]">
                <div className="text-xs text-purple-400 mb-2">UPLOADED</div>
                {uploadedFiles.slice(0, 3).map((file, i) => (
                  <div key={i} className="text-xs py-1 px-2 bg-black/40 rounded mb-1 truncate">{file}</div>
                ))}
              </div>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex justify-center gap-3 z-30">
            {modes.map((mode) => (
              <motion.button
                key={mode.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveMode(mode.name)}
                className={`px-8 py-3 rounded-3xl flex items-center gap-3 text-sm font-medium transition-all glass-border ${
                  activeMode === mode.name 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_25px_-5px] shadow-purple-500 scale-105' 
                    : 'hover:bg-white/5'
                }`}
              >
                <span>{mode.icon}</span>
                {mode.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Your Generation */}
        <div className="w-80 glass border-l border-purple-500/20 p-6 flex flex-col z-40">
          <div className="flex justify-between items-center mb-6">
            <div className="uppercase text-xs tracking-[2px] text-purple-400">YOUR GENERATION</div>
            <div className="text-2xl">🎨</div>
          </div>

          {/* Waveform Visualizer */}
          <div className="glass rounded-3xl p-4 mb-8 relative">
            <div className="text-xs text-cyan-400 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />Aipu ot
            </div>
            <canvas ref={waveformRef} className="waveform w-full" />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <div>10</div><div>000</div><div>200</div><div>300</div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-6">
            <div>
              <div className="text-xs tracking-widest text-purple-400 mb-4">STATUS</div>
              {statuses.map((status, index) => (
                <motion.div 
                  key={status.label}
                  whileHover={{ x: 6 }}
                  onClick={() => setCurrentStatus(index)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 cursor-pointer transition-all ${currentStatus === index ? 'bg-white/10 border-l-4 border-purple-500' : 'hover:bg-white/5'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${status.color} ${currentStatus === index && status.label === 'Generating' ? 'animate-pulse' : ''}`} />
                  <span className="text-sm">{status.label}</span>
                  {currentStatus === index && status.label === 'Generating' && (
                    <div className="ml-auto text-purple-400 text-xs font-mono animate-pulse">LIVE</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress Steps */}
            <div>
              <div className="text-xs tracking-widest text-purple-400 mb-4">PROGRESS</div>
              <div className="flex gap-3">
                {[1,2,3,4].map((step) => (
                  <div key={step} className={`flex-1 h-2 rounded-full transition-all ${step * 25 <= progress ? 'bg-gradient-to-r from-purple-500 to-cyan-400' : 'bg-white/10'}`} />
                ))}
              </div>
              <div className="text-right text-xs text-purple-400/70 mt-1 font-mono">{progress}%</div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <div className="glass p-4 rounded-2xl text-center text-xs leading-relaxed border border-white/10">
              Generation will appear here in realtime.<br /> Powered by fal.ai + Inngest.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Prompt Bar */}
      <div className="absolute bottom-0 left-60 right-80 h-24 glass border-t border-purple-500/30 flex items-center px-8 z-50">
        <div className="flex-1 max-w-3xl">
          <div className="flex gap-2 mb-3">
            {['Cyberpunk city at dusk', 'Neon samurai battle', 'Floating holographic UI', 'Synthwave race'].map((template, i) => (
              <div key={i} onClick={() => {}} className="text-[10px] px-4 py-1 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-colors border border-white/10">
                {template}
              </div>
            ))}
          </div>
          
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Describe your vision for this media..." 
              className="flex-1 bg-black/60 border border-purple-500/30 focus:border-purple-400 rounded-3xl px-8 py-4 text-lg placeholder:text-zinc-500 focus:outline-none neon-purple"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-3 px-10 py-3.5 bg-gradient-to-r from-purple-600 to-magenta-600 rounded-3xl font-medium tracking-wider text-sm shadow-xl shadow-purple-500/50 hover:shadow-purple-500 transition-all"
            >
              GENERATE
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating upload hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-zinc-500 font-mono flex items-center gap-2 bg-black/70 px-5 py-2 rounded-3xl border border-white/10">
        DROP MP3 / MP4 ANYWHERE • SUPPORTS MULTIPLE FILES
      </div>
    </div>
  );
}
