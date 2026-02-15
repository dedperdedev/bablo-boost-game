import { useState } from "react";
import { UserData, GameEvent } from "@/lib/game-store";
import { Copy, Check } from "lucide-react";

interface Props {
  user: UserData;
  balance: number;
  events: GameEvent[];
}

export function VirtualWallet({ user, balance, events }: Props) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(user.fakeWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const userEvents = events.filter(e => e.nickname === user.nickname).slice(0, 5);

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "только что";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}ч назад`;
    return `${Math.floor(diff / 86400000)}д назад`;
  };

  return (
    <div className="bg-card border-2 border-border rounded-xl p-4">
      <h3 className="font-black text-primary text-lg mb-3">💎 Мой виртуальный кошелёк</h3>

      {/* Balance */}
      <div className="text-center mb-3">
        <p className="text-4xl font-black text-glow text-foreground tabular-nums">
          {balance.toFixed(0)}
        </p>
        <p className="text-xs text-muted-foreground font-bold">виртуальных токенов</p>
      </div>

      {/* Wallet address */}
      <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-3">
        <span className="text-xs text-muted-foreground font-bold flex-1 truncate font-mono">
          {user.fakeWalletAddress}
        </span>
        <button
          onClick={copyAddress}
          className="text-primary hover:text-gold transition-colors shrink-0"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      {copied && (
        <p className="text-xs text-accent font-bold text-center -mt-2 mb-2">✅ Скопировано!</p>
      )}

      {/* Mini history */}
      {userEvents.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-bold mb-1.5">Последние операции:</p>
          <div className="flex flex-col gap-1">
            {userEvents.map((ev, i) => (
              <div key={i} className="flex justify-between text-xs bg-muted/50 rounded px-2 py-1">
                <span className="font-bold text-foreground">
                  {ev.type === "deposit" ? "📤 Депозит" : "📥 Выплата"}: {ev.amount.toFixed(0)}
                </span>
                <span className="text-muted-foreground">{timeAgo(ev.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
