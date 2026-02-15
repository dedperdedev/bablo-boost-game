import { ActiveCycle, isCycleComplete, formatTimeRemaining, getCurrentDisplayed } from "@/lib/game-store";
import { useEffect, useState } from "react";

interface Props {
  cycle: ActiveCycle | null;
  onPress: () => void;
  onClaim: () => void;
}

export function BabloButton({ cycle, onPress, onClaim }: Props) {
  const [timeStr, setTimeStr] = useState("00:00:00");
  const [currentValue, setCurrentValue] = useState(0);
  const [progress, setProgress] = useState(0);

  const isActive = cycle && !cycle.claimed;
  const isComplete = cycle ? isCycleComplete(cycle) : false;
  const canStart = !isActive;

  useEffect(() => {
    if (!isActive) return;
    const iv = setInterval(() => {
      if (!cycle) return;
      setTimeStr(formatTimeRemaining(cycle));
      setCurrentValue(getCurrentDisplayed(cycle));
      const p = Math.min(1, (Date.now() - cycle.startAt) / (cycle.endAt - cycle.startAt));
      setProgress(p);
    }, 100);
    return () => clearInterval(iv);
  }, [cycle, isActive]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main button */}
      {isActive && isComplete ? (
        <button
          onClick={onClaim}
          className="w-44 h-44 rounded-full bg-accent text-accent-foreground font-nunito font-black text-xl
            border-4 border-primary box-glow-green
            active:scale-95 transition-transform shadow-2xl"
        >
          💰 ЗАБРАТЬ<br/>БАБЛО
        </button>
      ) : (
        <button
          onClick={canStart ? onPress : undefined}
          disabled={!canStart}
          className={`w-44 h-44 rounded-full font-nunito font-black text-2xl
            border-4 transition-all active:scale-95 shadow-2xl
            ${canStart
              ? "bg-secondary text-secondary-foreground border-primary animate-bablo-pulse cursor-pointer"
              : "bg-muted text-muted-foreground border-border cursor-not-allowed"
            }`}
        >
          {canStart ? "БАБЛО" : "💸"}
        </button>
      )}

      {/* Status */}
      <div className="text-center">
        {!isActive && (
          <p className="text-primary font-black text-lg text-glow">🚀 Готово к запуску</p>
        )}
        {isActive && !isComplete && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-primary font-black">💸 Бабло растёт…</p>
            <p className="text-2xl font-black text-glow text-foreground tabular-nums">
              {currentValue.toFixed(1)} токенов
            </p>
            <p className="text-muted-foreground text-sm font-bold tabular-nums">⏱ {timeStr}</p>
            {/* Progress bar */}
            <div className="w-48 h-3 bg-muted/50 rounded-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}
        {isActive && isComplete && (
          <p className="text-accent font-black text-lg text-glow">✅ Бабло готово! Забирай!</p>
        )}
      </div>
    </div>
  );
}
