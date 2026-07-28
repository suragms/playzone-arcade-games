import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, RotateCcw, Trophy, Gamepad2, Clock, Zap, Volume2, VolumeX } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { ParticleEffect, useParticles, ComboEffect, ScreenFlash } from "@/components/Particles";

type MoleState = "hidden" | "visible" | "whacked";

const GRID_COLS = 3;
const GRID_ROWS = 3;
const GAME_DURATION = 30;

export default function WhackAMoleGame() {
  const navigate = useNavigate();
  const [moles, setMoles] = useState<MoleState[]>(Array(9).fill("hidden"));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("whack-high-score");
    return saved ? parseInt(saved) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastWhacked, setLastWhacked] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [whackEffects, setWhackEffects] = useState<{ id: number; index: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { particles, emit, onComplete } = useParticles();
  const boardRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.setEnabled(newState);
  };

  const spawnMole = useCallback(() => {
    if (!isPlaying) return;
    
    const hiddenMoles = moles
      .map((m, i) => (m === "hidden" ? i : -1))
      .filter((i) => i !== -1);
    
    if (hiddenMoles.length === 0) return;
    
    const randomIndex = hiddenMoles[Math.floor(Math.random() * hiddenMoles.length)];
    
    setMoles((prev) => {
      const newMoles = [...prev];
      newMoles[randomIndex] = "visible";
      return newMoles;
    });
    
    sounds.molePopUp();

    // Hide mole after random time
    setTimeout(() => {
      setMoles((prev) => {
        const newMoles = [...prev];
        if (newMoles[randomIndex] === "visible") {
          newMoles[randomIndex] = "hidden";
          setStreak(0);
        }
        return newMoles;
      });
    }, 800 + Math.random() * 700);
  }, [isPlaying, moles]);

  const whackMole = (index: number) => {
    if (!isPlaying || moles[index] !== "visible") {
      if (isPlaying && moles[index] !== "visible") {
        sounds.moleMiss();
      }
      return;
    }

    setMoles((prev) => {
      const newMoles = [...prev];
      newMoles[index] = "whacked";
      return newMoles;
    });

    sounds.moleWhack();

    // Calculate points based on streak
    const basePoints = 10;
    const newStreak = streak + 1;
    const multiplier = Math.min(newStreak, 5);
    const points = basePoints * multiplier;

    setScore((s) => s + points);
    setStreak(newStreak);
    setCombo(multiplier);
    setLastWhacked(index);

    // Emit particles at whack location
    if (boardRef.current) {
      const moleRow = Math.floor(index / 3);
      const moleCol = index % 3;
      const x = moleCol * 112 + 56;
      const y = moleRow * 112 + 56;
      
      emit(x, y, 20, {
        colors: ["#8b5cf6", "#ec4899", "#f59e0b"],
        spread: 100,
      });
      
      // Add whack effect
      setWhackEffects((prev) => [...prev, { id: Date.now(), index }]);
      setTimeout(() => {
        setWhackEffects((prev) => prev.slice(1));
      }, 500);
    }

    // Play combo sound
    if (multiplier > 1) {
      sounds.comboSound(multiplier);
    }

    // Reset combo display after animation
    setTimeout(() => setCombo(0), 500);

    // Reset mole after animation
    setTimeout(() => {
      setMoles((prev) => {
        const newMoles = [...prev];
        newMoles[index] = "hidden";
        return newMoles;
      });
    }, 300);
  };

  const startGame = () => {
    setMoles(Array(9).fill("hidden"));
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setIsGameOver(false);
    setStreak(0);
    setCombo(0);
    sounds.buttonClick();
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    sounds.whackGameOver();
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("whack-high-score", score.toString());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (moleTimerRef.current) clearInterval(moleTimerRef.current);
  };

  // Game timer
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        if (prev <= 5) {
          sounds.whackTimeWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Mole spawning
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = Math.max(400, 1000 - score * 2);
    moleTimerRef.current = setInterval(spawnMole, spawnInterval);

    return () => {
      if (moleTimerRef.current) clearInterval(moleTimerRef.current);
    };
  }, [isPlaying, spawnMole, score]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMolePosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { x: col * 112 + 56, y: row * 112 + 56 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden">
      {/* Particle Effects */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <ParticleEffect particles={particles} onComplete={onComplete} />
      </div>
      
      {/* Combo Effects */}
      {combo > 1 && lastWhacked !== null && (
        <ComboEffect 
          combo={combo} 
          x={getMolePosition(lastWhacked).x + 100} 
          y={getMolePosition(lastWhacked).y + 150} 
        />
      )}
      
      {/* Time Warning Flash */}
      {timeLeft <= 5 && timeLeft > 0 && isPlaying && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse bg-red-500/10" />
      )}

      {/* Header */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-violet-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">Whack-a-Mole</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg hover:bg-violet-100 transition-colors"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-violet-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-xl">
              <Trophy className="w-4 h-4 text-violet-600" />
              <span className="font-bold text-violet-700">{score}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-xl">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className={`font-bold ${timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-amber-700"}`}>
                {formatTime(timeLeft)}
              </span>
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
            🔨 Whack-a-Mole
          </motion.h1>
          <p className="text-slate-500">Click or tap the moles as fast as you can!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-violet-200 relative"
          >
            {/* Combo indicator */}
            <AnimatePresence>
              {combo > 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1.2, y: -20 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-center mb-4"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full shadow-lg">
                    <Zap className="w-5 h-5" />
                    {combo}x Combo!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={boardRef} className="grid grid-cols-3 gap-4 relative">
              {moles.map((state, index) => (
                <motion.button
                  key={index}
                  onClick={() => whackMole(index)}
                  className={`relative w-28 h-28 rounded-2xl flex items-center justify-center text-6xl transition-all duration-100 ${
                    state === "visible"
                      ? "bg-gradient-to-br from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 scale-105 cursor-pointer shadow-lg"
                      : state === "whacked"
                      ? "bg-gradient-to-br from-red-200 to-red-300"
                      : "bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300"
                  }`}
                  whileTap={state === "visible" ? { scale: 0.95 } : {}}
                >
                  {/* Hole */}
                  <div className={`absolute bottom-2 w-20 h-6 rounded-full ${
                    state === "visible"
                      ? "bg-amber-800/30"
                      : "bg-amber-900/20"
                  }`} />
                  
                  {/* Whack Effect */}
                  <AnimatePresence>
                    {whackEffects.some((e) => e.index === index) && (
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="text-4xl">💥</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Mole */}
                  <AnimatePresence mode="wait">
                    {state === "visible" && (
                      <motion.div
                        initial={{ y: 30, opacity: 0, rotate: -10 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: 10 }}
                        transition={{ duration: 0.15, type: "spring" }}
                        className="relative z-10"
                      >
                        🐹
                      </motion.div>
                    )}
                    {state === "whacked" && (
                      <motion.div
                        initial={{ scale: 1.5, rotate: 0 }}
                        animate={{ scale: 0, rotate: 45 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 text-4xl"
                      >
                        💫
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* Game Over Overlay */}
            {isGameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl m-8"
              >
                <div className="text-white text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-6xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
                  <p className="text-xl text-white/90 mb-2">Score: {score}</p>
                  {score >= highScore && score > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-amber-300 font-semibold mb-4"
                    >
                      🎉 New High Score!
                    </motion.p>
                  )}
                  <button
                    onClick={startGame}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
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
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl m-8"
              >
                <div className="text-white text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🔨
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2">Whack-a-Mole</h2>
                  <p className="text-white/80 mb-2">Whack moles for points!</p>
                  <p className="text-white/60 text-sm mb-6">Build combos for bonus points!</p>
                  <button
                    onClick={startGame}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Start Game
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200 w-full lg:w-72"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">Game Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl">
                <span className="text-sm text-slate-600">Score</span>
                <span className="text-lg font-bold text-violet-600">{score}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="text-sm text-slate-600">High Score</span>
                <span className="text-lg font-bold text-amber-600">{highScore}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <span className="text-sm text-slate-600">Time Left</span>
                <span className={`text-lg font-bold ${timeLeft <= 5 ? "text-red-600" : "text-emerald-600"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl">
                <span className="text-sm text-slate-600">Streak</span>
                <span className="text-lg font-bold text-cyan-600">{streak}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Scoring</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Base: 10 points</p>
                <p>• 2x combo: 20 points</p>
                <p>• 3x combo: 30 points</p>
                <p>• Max 5x combo!</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">How to Play</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>🔨 Click moles when they pop up</li>
                <li>⚡ Build combos for more points</li>
                <li>⏰ You have 30 seconds</li>
                <li>🎯 Moles get faster as score increases</li>
              </ul>
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
