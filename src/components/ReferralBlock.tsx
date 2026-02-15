import { useState } from "react";
import { Copy, Check, Users } from "lucide-react";

const LEVELS = [
  { level: 1, percent: 10, emoji: "🥇", label: "1-я линия", color: "text-primary" },
  { level: 2, percent: 3, emoji: "🥈", label: "2-я линия", color: "text-muted-foreground" },
  { level: 3, percent: 1, emoji: "🥉", label: "3-я линия", color: "text-muted-foreground" },
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
    <div className="bg-card border-2 border-border rounded-xl p-4">
      <h3 className="font-black text-secondary text-lg mb-3 flex items-center gap-2">
        <Users size={20} /> 🔥 Лента жадности
      </h3>
      <p className="text-xs text-muted-foreground font-bold mb-3">
        Приглашай друзей — получай % от их депозитов! 💰
      </p>

      {/* Referral link */}
      <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-4">
        <span className="text-xs text-muted-foreground font-bold flex-1 truncate font-mono">
          bablo.app/ref/{referralCode}
        </span>
        <button
          onClick={copyCode}
          className="text-primary hover:brightness-125 transition-all shrink-0"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      {copied && (
        <p className="text-xs text-accent font-bold text-center -mt-3 mb-3">✅ Ссылка скопирована!</p>
      )}

      {/* Levels */}
      <div className="flex flex-col gap-2">
        {LEVELS.map((lvl) => (
          <div
            key={lvl.level}
            className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2.5 border border-border"
          >
            <span className="text-2xl">{lvl.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground">{lvl.label}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                Рефералы уровня {lvl.level}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-black ${lvl.color}`}>{lvl.percent}%</p>
              <p className="text-[10px] text-muted-foreground font-bold">от депозитов</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-muted/50 rounded-lg p-2 text-center border border-border">
          <p className="text-lg font-black text-foreground">0</p>
          <p className="text-[10px] text-muted-foreground font-bold">Рефералов</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center border border-border">
          <p className="text-lg font-black text-primary">0</p>
          <p className="text-[10px] text-muted-foreground font-bold">Заработано</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center border border-border">
          <p className="text-lg font-black text-accent">3 ур.</p>
          <p className="text-[10px] text-muted-foreground font-bold">Глубина</p>
        </div>
      </div>
    </div>
  );
}
