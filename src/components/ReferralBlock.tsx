import { useState } from "react";
import { Copy, Check, Users } from "lucide-react";

const LEVELS = [
  { level: 1, percent: 10, emoji: "🥇", label: "1-я линия", desc: "Прямые рефералы" },
  { level: 2, percent: 3, emoji: "🥈", label: "2-я линия", desc: "Рефералы рефералов" },
  { level: 3, percent: 1, emoji: "🥉", label: "3-я линия", desc: "Глубокий уровень" },
];

interface Props {
  referralCode: string;
}

export function ReferralBlock({ referralCode }: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(`https://bablo.app/ref/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="card-game p-4">
      <h3 className="font-black text-foreground text-lg mb-1 flex items-center gap-2">
        <Users size={20} className="text-primary" /> 🔥 Лента жадности
      </h3>
      <p className="text-xs text-muted-foreground font-bold mb-3">
        Приглашай друзей — получай % от их депозитов! 💰
      </p>

      {/* Referral link */}
      <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 mb-3 border border-border/50">
        <span className="text-xs text-muted-foreground font-bold flex-1 truncate font-mono">
          bablo.app/ref/{referralCode}
        </span>
        <button
          onClick={copyCode}
          className="bg-primary text-primary-foreground rounded-lg px-2.5 py-1 text-xs font-black
            hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      {copied && (
        <p className="text-xs text-accent font-bold text-center -mt-2 mb-2">✅ Ссылка скопирована!</p>
      )}

      {/* Levels */}
      <div className="flex flex-col gap-2 mb-3">
        {LEVELS.map((lvl) => (
          <div
            key={lvl.level}
            className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-3 border-2 border-border/40
              hover:border-primary/50 transition-colors"
          >
            <span className="text-3xl animate-float" style={{ animationDelay: `${lvl.level * 200}ms` }}>
              {lvl.emoji}
            </span>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground">{lvl.label}</p>
              <p className="text-[10px] text-muted-foreground font-bold">{lvl.desc}</p>
            </div>
            <div className="bg-primary/20 rounded-xl px-3 py-1.5 text-center">
              <p className="text-xl font-black text-primary">{lvl.percent}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/30 rounded-xl p-2.5 text-center border border-border/30">
          <p className="text-xl font-black text-foreground">0</p>
          <p className="text-[10px] text-muted-foreground font-bold">Рефералов</p>
        </div>
        <div className="bg-muted/30 rounded-xl p-2.5 text-center border border-border/30">
          <p className="text-xl font-black text-primary">0</p>
          <p className="text-[10px] text-muted-foreground font-bold">Заработано</p>
        </div>
        <div className="bg-muted/30 rounded-xl p-2.5 text-center border border-border/30">
          <p className="text-xl font-black text-accent">3 ур.</p>
          <p className="text-[10px] text-muted-foreground font-bold">Глубина</p>
        </div>
      </div>
    </div>
  );
}
