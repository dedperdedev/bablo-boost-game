import { useEffect, useState } from "react";

const MONEY_EMOJIS = ["💵", "💰", "🤑", "💸", "🪙", "💎"];

interface Particle {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
}

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const ps: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random(),
    }));
    setParticles(ps);
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-2xl animate-money-rain"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
