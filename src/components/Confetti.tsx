import { useEffect, useState } from "react";

const MONEY_EMOJIS = ["💵", "💰", "🤑", "💸", "🪙", "💎", "💴", "💶", "💷", "🪙", "✨", "⭐"];

const PARTICLE_COUNT = 120;

interface Particle {
  id: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
  tx: string; // translate X (vw)
  ty: string; // translate Y (vh)
}

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const ps: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 70 + Math.random() * 60; // 70–130 vw
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      return {
        id: i,
        emoji: MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)],
        delay: Math.random() * 0.4,
        duration: 2.5 + Math.random() * 1.5, // 2.5–4 s
        size: 2 + Math.random() * 2.5,
        tx: `${tx}vw`,
        ty: `${ty}vh`,
      };
    });
    setParticles(ps);
    const t = setTimeout(() => setParticles([]), 5500);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 animate-confetti-burst"
          style={{
            fontSize: `${p.size}rem`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--confetti-tx" as string]: p.tx,
            ["--confetti-ty" as string]: p.ty,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
