import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  shape: "circle" | "square" | "star";
}

interface ParticleEffectProps {
  particles: Particle[];
  onComplete: (id: number) => void;
}

const COLORS = [
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#ffffff", // white
];

function generateParticles(
  x: number,
  y: number,
  count: number,
  options?: {
    colors?: string[];
    spread?: number;
    shapes?: ("circle" | "square" | "star")[];
  }
): Particle[] {
  const { colors = COLORS, spread = 100, shapes = ["circle", "square", "star"] } = options || {};
  
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const velocity = 2 + Math.random() * 4;
    
    return {
      id: Date.now() + i,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      velocityX: Math.cos(angle) * velocity * (spread / 100),
      velocityY: Math.sin(angle) * velocity * (spread / 100) - 2,
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  });
}

function ParticleElement({ particle }: { particle: Particle }) {
  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-sm",
    star: "rounded-none rotate-45",
  };

  return (
    <motion.div
      initial={{
        x: particle.x,
        y: particle.y,
        scale: 1,
        opacity: 1,
        rotate: particle.rotation,
      }}
      animate={{
        x: particle.x + particle.velocityX * 50,
        y: particle.y + particle.velocityY * 50 + 100,
        scale: 0,
        opacity: 0,
        rotate: particle.rotation + 180,
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`absolute pointer-events-none ${shapeClasses[particle.shape]}`}
      style={{
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
        boxShadow: `0 0 ${particle.size}px ${particle.color}`,
      }}
    />
  );
}

export function ParticleEffect({ particles, onComplete }: ParticleEffectProps) {
  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          particle={particle}
        />
      ))}
    </AnimatePresence>
  );
}

// Hook for easy particle effects usage
export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const emit = useCallback(
    (
      x: number,
      y: number,
      count: number = 20,
      options?: {
        colors?: string[];
        spread?: number;
        shapes?: ("circle" | "square" | "star")[];
      }
    ) => {
      const newParticles = generateParticles(x, y, count, options);
      setParticles((prev) => [...prev, ...newParticles]);
    },
    []
  );

  const clear = useCallback(() => {
    setParticles([]);
  }, []);

  const onComplete = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Auto-clear old particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(Math.max(0, prev.length - 50)));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [particles.length]);

  return { particles, emit, clear, onComplete };
}

// Explosion effect component
export function Explosion({
  x,
  y,
  colors,
  onComplete,
}: {
  x: number;
  y: number;
  colors?: string[];
  onComplete: () => void;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = generateParticles(x, y, 30, {
      colors,
      spread: 150,
      shapes: ["circle", "square"],
    });
    setParticles(newParticles);

    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [x, y, colors, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <ParticleEffect particles={particles} onComplete={() => {}} />
    </div>
  );
}

// Combo effect component
export function ComboEffect({
  combo,
  x,
  y,
}: {
  combo: number;
  x: number;
  y: number;
}) {
  const colors =
    combo >= 5
      ? ["#fbbf24", "#f59e0b", "#d97706"]
      : combo >= 3
      ? ["#8b5cf6", "#a78bfa", "#c4b5fd"]
      : ["#06b6d4", "#22d3ee", "#67e8f9"];

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.5, y: 0 }}
      animate={{ opacity: 0, scale: 1.5, y: -50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <div
        className="text-3xl font-extrabold text-center"
        style={{
          background: `linear-gradient(135deg, ${colors.join(", ")})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "none",
          filter: `drop-shadow(0 0 10px ${colors[0]})`,
        }}
      >
        {combo}x COMBO!
      </div>
    </motion.div>
  );
}

// Screen flash effect
export function ScreenFlash({
  color = "#ffffff",
  duration = 150,
}: {
  color?: string;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0 }}
      transition={{ duration: duration / 1000 }}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ backgroundColor: color }}
    />
  );
}

// Floating score text
export function FloatingScore({
  score,
  x,
  y,
  color = "#8b5cf6",
}: {
  score: number;
  x: number;
  y: number;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.8 }}
      animate={{ opacity: 0, y: -60, scale: 1.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed pointer-events-none z-50 font-bold text-xl"
      style={{
        left: x,
        top: y,
        color,
        textShadow: `0 0 10px ${color}`,
      }}
    >
      +{score}
    </motion.div>
  );
}
