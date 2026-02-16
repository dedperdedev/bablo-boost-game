import { useEffect, useState } from "react";

const FLOAT_EMOJIS = ["💵", "💰", "✨", "💎", "🪙", "💸", "🤑", "💴", "💶", "💷", "⭐", "🌟", "💫", "🪙", "💵", "💰"];

const LOADING_DURATION_MS = 2500;

interface Props {
  onFinish: () => void;
}

export function LoadingScreen({ onFinish }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, LOADING_DURATION_MS);
    return () => clearTimeout(t);
  }, [onFinish]);

  if (!visible) return null;

  const base = import.meta.env.BASE_URL;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${base}bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "hsl(var(--bg))",
      }}
    >
      {/* Летающие эмодзи на фоне */}
      {FLOAT_EMOJIS.map((emoji, i) => (
        <span
          key={i}
          className="absolute pointer-events-none animate-growth-float text-3xl"
          style={{
            left: `${5 + (i * 11) % 88}%`,
            top: `${8 + (i * 13) % 82}%`,
            animationDelay: `${(i * 0.5) % 2}s`,
          }}
          aria-hidden
        >
          {emoji}
        </span>
      ))}

      {/* Пульсирующая кнопка Бабло */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="animate-bablo-pulse block w-[min(20rem,80vw)] h-[min(20rem,80vw)] rounded-full overflow-visible select-none pointer-events-none" style={{ maxWidth: "320px" }}>
          <img
            src={`${base}button1.png`}
            alt="Бабло"
            className="w-full h-full object-contain pointer-events-none animate-bablo-pulse-glow"
          />
        </div>
        <p className="mt-3 text-2xl font-black text-center" style={{ color: "var(--text)" }}>
          жми и богатей
        </p>
      </div>
    </div>
  );
}
