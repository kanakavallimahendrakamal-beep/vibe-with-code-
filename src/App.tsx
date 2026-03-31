import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center font-sans overflow-hidden selection:bg-cyan-500/30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-gray-950 to-gray-950 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 py-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          NEON SNAKE
        </h1>

        <div className="flex flex-col items-center gap-8 w-full">
          <SnakeGame />
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
