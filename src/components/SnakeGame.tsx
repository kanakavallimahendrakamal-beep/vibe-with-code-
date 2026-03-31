import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const directionRef = useRef(direction);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Focus container on mount to capture keyboard events
  useEffect(() => {
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (!isPlaying && e.key === ' ') {
      startGame();
      return;
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, food, highScore]);

  return (
    <div 
      className="flex flex-col items-center outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={gameContainerRef}
    >
      {/* Score Board */}
      <div className="flex justify-between w-full max-w-[400px] mb-4 px-6 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-2xl backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-400/70 uppercase tracking-wider font-bold">Score</span>
          <span 
            className="text-5xl font-digital font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] leading-none glitch"
            data-text={score}
          >
            {score}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-fuchsia-500/70 uppercase tracking-wider font-bold flex items-center gap-1">
            <Trophy size={12} /> High Score
          </span>
          <span 
            className="text-5xl font-digital font-black text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] leading-none glitch"
            data-text={highScore}
          >
            {highScore}
          </span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative p-1.5 bg-gray-900 rounded-xl border border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <div 
          className="grid bg-gray-950/90 rounded-lg overflow-hidden border border-gray-800/50"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`
                  w-full h-full border-[0.5px] border-gray-800/30
                  ${isHead ? 'bg-cyan-300 shadow-[0_0_12px_#67e8f9,inset_0_0_6px_#fff] z-10 rounded-sm' : ''}
                  ${isSnake && !isHead ? 'bg-cyan-500/80 shadow-[0_0_8px_#06b6d4] rounded-sm scale-90' : ''}
                  ${isFood ? 'bg-fuchsia-500 shadow-[0_0_15px_#d946ef,inset_0_0_5px_#fff] rounded-full scale-75 animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
            {gameOver ? (
              <>
                <h2 className="text-5xl font-black text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest uppercase">Game Over</h2>
                <p className="text-gray-300 mb-8 font-mono text-lg">Final Score: <span className="text-cyan-400 font-bold">{score}</span></p>
                <button 
                  onClick={startGame}
                  className="flex items-center gap-2 px-8 py-3 bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 rounded-full font-bold uppercase tracking-wider hover:bg-cyan-400 hover:text-gray-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
                >
                  <RotateCcw size={18} /> Play Again
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={startGame}
                  className="flex items-center gap-3 px-10 py-4 bg-fuchsia-500/10 border-2 border-fuchsia-500 text-fuchsia-500 rounded-full font-black text-xl uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_35px_rgba(217,70,239,0.6)] group"
                >
                  <Play size={24} className="group-hover:scale-110 transition-transform" fill="currentColor" /> Start Game
                </button>
                <p className="mt-8 text-gray-400 text-sm font-mono flex items-center gap-2">
                  Use <kbd className="px-2 py-1 bg-gray-800 rounded text-cyan-400 border border-gray-700 shadow-[0_0_5px_rgba(34,211,238,0.2)]">Arrows</kbd> or <kbd className="px-2 py-1 bg-gray-800 rounded text-cyan-400 border border-gray-700 shadow-[0_0_5px_rgba(34,211,238,0.2)]">WASD</kbd> to move
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
