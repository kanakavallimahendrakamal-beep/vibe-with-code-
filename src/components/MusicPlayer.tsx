import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "AI Synthwave",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    color: "from-cyan-400 to-blue-500"
  },
  {
    id: 2,
    title: "Cybernetic Dreams",
    artist: "Neural Beats",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=empty-mind-118973.mp3",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    id: 3,
    title: "Digital Grid",
    artist: "Algorithm Audio",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=watr-fluid-10149.mp3",
    color: "from-lime-400 to-emerald-500"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group">
      {/* Neon Glow Background */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${currentTrack.color} transition-colors duration-1000`}></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        preload="metadata"
      />

      <div className="relative z-10 flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-lg ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <Music size={20} className="text-white drop-shadow-md" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white truncate max-w-[140px] tracking-wide">{currentTrack.title}</span>
            <span className="text-xs text-gray-400 truncate max-w-[140px] font-mono">{currentTrack.artist}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={handlePrev} className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isPlaying 
                ? 'bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.6)]' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          
          <button onClick={handleNext} className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>

          <div className="w-px h-6 bg-gray-700 mx-1"></div>

          <button onClick={toggleMute} className="text-gray-500 hover:text-gray-300 transition-colors">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden cursor-pointer relative">
        <div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentTrack.color} transition-all duration-100 ease-linear shadow-[0_0_10px_currentColor]`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
