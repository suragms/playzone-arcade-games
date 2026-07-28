import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, RotateCcw, Trophy, Gamepad2, Volume2, VolumeX } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { ParticleEffect, useParticles, FloatingScore, ScreenFlash } from "@/components/Particles";

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const navigate = useNavigate();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("snake-high-score");
    return saved ? parseInt(saved) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [levelUpEffect, setLevelUpEffect] = useState(false);
  const [floatingScores, setFloatingScores] = useState<{ id: number; x: number; y: number; score: number }[]>([]);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const { particles, emit, onComplete } = useParticles();

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.setEnabled(newState);
  };

  const spawnFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 10 });
    setDirection("RIGHT");
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setSpeed(INITIAL_SPEED);
    sounds.buttonClick();
  };

  const startGame = () => {
    resetGame();
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };

        switch (direction) {
          case "UP": head.y -= 1; break;
          case "DOWN": head.y += 1; break;
          case "LEFT": head.x -= 1; break;
          case "RIGHT": head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          sounds.snakeGameOver();
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snake-high-score", score.toString());
          }
          return prev;
        }

        // Self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          sounds.snakeGameOver();
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snake-high-score", score.toString());
          }
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          sounds.snakeEat();
          
          // Emit particles at food location
          const foodPixelX = food.x * CELL_SIZE;
          const foodPixelY = food.y * CELL_SIZE;
          emit(foodPixelX, foodPixelY, 15, {
            colors: ["#ef4444", "#f97316", "#fbbf24"],
            spread: 80,
          });
          
          // Floating score
          setFloatingScores((prev) => [
            ...prev,
            { id: Date.now(), x: foodPixelX, y: foodPixelY, score: 10 },
          ]);
          
          spawnFood();
          // Speed up every 50 points
          if (newScore % 50 === 0 && speed > 60) {
            setSpeed((s) => s - 10);
            sounds.snakeLevelUp();
            setLevelUpEffect(true);
            setTimeout(() => setLevelUpEffect(false), 500);
          }
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, direction, food, speed, score, highScore, spawnFood, emit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };

      const newDir = keyMap[e.key];
      if (!newDir) return;

      e.preventDefault();
      setDirection((prev) => {
        const opposites: Record<Direction, Direction> = {
          UP: "DOWN",
          DOWN: "UP",
          LEFT: "RIGHT",
          RIGHT: "LEFT",
        };
        return opposites[newDir] === prev ? prev : newDir;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  // Clean up floating scores
  useEffect(() => {
    if (floatingScores.length > 0) {
      const timer = setTimeout(() => {
        setFloatingScores((prev) => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [floatingScores]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50 relative overflow-hidden">
      {/* Particle Effects */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <ParticleEffect particles={particles} onComplete={onComplete} />
      </div>
      
      {/* Floating Scores */}
      {floatingScores.map((fs) => (
        <FloatingScore key={fs.id} score={fs.score} x={fs.x + 100} y={fs.y + 100} color="#10b981" />
      ))}
      
      {/* Level Up Flash */}
      <AnimatePresence>
        {levelUpEffect && <ScreenFlash color="#10b981" duration={300} />}
      </AnimatePresence>

      {/* Header */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">Snake Classic</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg hover:bg-emerald-100 transition-colors"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-xl">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-700">{score}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-xl">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-amber-700">Best: {highScore}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-800 mb-2"
          >
            🐍 Snake Classic
          </motion.h1>
          <p className="text-slate-500">Use arrow keys or WASD to control the snake</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-emerald-200 relative"
          >
            <div
              className="relative bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl overflow-hidden"
              style={{
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
              }}
            >
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full border-t border-emerald-300" style={{ top: i * CELL_SIZE }} />
                ))}
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full border-l border-emerald-300" style={{ left: i * CELL_SIZE }} />
                ))}
              </div>

              {/* Food with glow effect */}
              <div
                className="absolute rounded-full shadow-lg animate-pulse"
                style={{
                  left: food.x * CELL_SIZE + 2,
                  top: food.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                  background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                  boxShadow: "0 0 12px rgba(239, 68, 68, 0.6), 0 0 24px rgba(249, 115, 22, 0.4)",
                }}
              />

              {/* Snake */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`absolute rounded-md transition-all duration-75 ${
                    index === 0
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md"
                      : "bg-emerald-400"
                  }`}
                  style={{
                    left: segment.x * CELL_SIZE + 1,
                    top: segment.y * CELL_SIZE + 1,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    opacity: 1 - index * 0.03,
                    boxShadow: index === 0 ? "0 0 8px rgba(16, 185, 129, 0.5)" : "none",
                  }}
                />
              ))}

              {/* Game Over Overlay */}
              {isGameOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl"
                >
                  <div className="text-white text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-5xl mb-4"
                    >
                      💀
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                    <p className="text-white/80 mb-6">Score: {score}</p>
                    <button
                      onClick={resetGame}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Play Again
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Start Screen */}
              {!isPlaying && !isGameOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl"
                >
                  <div className="text-white text-center">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      🐍
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-2">Snake Classic</h2>
                    <p className="text-white/80 mb-6 text-sm">Eat food, grow longer, don't hit the walls!</p>
                    <button
                      onClick={startGame}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      Start Game
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200 w-full lg:w-72"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">How to Play</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-sm">⬆️</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Arrow Keys / WASD</p>
                  <p className="text-xs text-slate-500">Move the snake</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-sm">🍎</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Eat Food</p>
                  <p className="text-xs text-slate-500">+10 points each</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-sm">⚡</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Speed Increases</p>
                  <p className="text-xs text-slate-500">Every 50 points</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Controls</h4>
              <div className="grid grid-cols-3 gap-2 max-w-[140px] mx-auto">
                <div />
                <button
                  onClick={() => setDirection("UP")}
                  className="w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-lg transition-colors"
                >
                  ⬆️
                </button>
                <div />
                <button
                  onClick={() => setDirection("LEFT")}
                  className="w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-lg transition-colors"
                >
                  ⬅️
                </button>
                <button
                  onClick={() => setDirection("DOWN")}
                  className="w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-lg transition-colors"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => setDirection("RIGHT")}
                  className="w-10 h-10 bg-slate-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-lg transition-colors"
                >
                  ➡️
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Sound Effects</h4>
              <p className="text-xs text-slate-500">
                {soundEnabled ? "🔊 Sounds enabled" : "🔇 Sounds muted"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
