import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const LEVELS = [
  { level: 1, percent: 10, emoji: "🥇", label: "1-й уровень", desc: "Прямые рефералы" },
  { level: 2, percent: 3, emoji: "🥈", label: "2-й уровень", desc: "Рефералы рефералов" },
  { level: 3, percent: 1, emoji: "🥉", label: "3-й уровень", desc: "Глубокий уровень" },
];

// Мок рефералов по уровням (в реальном приложении — из бэкенда)
const MOCK_REFERRALS: Record<number, { nickname: string; earned: number }[]> = {
  1: [
    { nickname: "СейфовыйЕнот", earned: 150 },
    { nickname: "ТурбоКабан", earned: 420 },
    { nickname: "БаблоБосс", earned: 89 },
  ],
  2: [
    { nickname: "МешокМечты", earned: 45 },
    { nickname: "КрипроДядя", earned: 12 },
  ],
  3: [
    { nickname: "ЖадныйХомяк", earned: 5 },
  ],
};

interface Props {
  referralCode: string;
}

export function ReferralBlock({ referralCode }: Props) {
  const [copied, setCopied] = useState(false);
  const [openLevel, setOpenLevel] = useState<number | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(`https://bablo.app/ref/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleLevel = (level: number) => {
    setOpenLevel((prev) => (prev === level ? null : level));
  };

  return (
    <div className="card-game p-4">
      <h3 className="font-black text-foreground text-lg mb-1 text-center">
        🔥 Уровни жадности
      </h3>
      <p className="text-xs text-muted-foreground font-bold mb-3 text-center">
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

      {/* Levels — клик открывает список рефералов с суммой заработка */}
      <div className="flex flex-col gap-2 mb-3">
        {LEVELS.map((lvl) => {
          const list = MOCK_REFERRALS[lvl.level] ?? [];
          const totalEarned = list.reduce((sum, r) => sum + r.earned, 0);
          const isOpen = openLevel === lvl.level;
          return (
            <div key={lvl.level}>
              <button
                type="button"
                onClick={() => toggleLevel(lvl.level)}
                className="w-full flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-3 border-2 border-border/40
                  hover:border-primary/50 transition-colors text-left"
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
                {isOpen ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
              </button>
              {isOpen && (
                <div className="mt-1 ml-2 pl-3 border-l-2 border-primary/30 space-y-2 py-2">
                  {list.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-bold">Пока никого</p>
                  ) : (
                    list.map((ref, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-foreground">{ref.nickname}</span>
                        <span className="font-black text-primary">+{ref.earned}</span>
                      </div>
                    ))
                  )}
                  {list.length > 0 && (
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-border/50">
                      <span className="font-black text-foreground">Итого</span>
                      <span className="font-black text-primary">{totalEarned}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted/30 rounded-xl p-2.5 text-center border border-border/30">
          <p className="text-xl font-black text-foreground">0</p>
          <p className="text-[10px] text-muted-foreground font-bold">Рефералов</p>
        </div>
        <div className="bg-muted/30 rounded-xl p-2.5 text-center border border-border/30">
          <p className="text-xl font-black text-primary">0</p>
          <p className="text-[10px] text-muted-foreground font-bold">Заработано</p>
        </div>
      </div>
    </div>
  );
}
