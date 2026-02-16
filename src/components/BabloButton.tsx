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
    <div className="flex flex-col items-center">
      {/* Главная кнопка: увеличенный размер, ободок по размеру картинки */}
      {isActive && isComplete ? (
        <button
          type="button"
          onClick={onClaim}
          className="block w-[min(22rem,88vw)] h-[min(22rem,88vw)] rounded-full overflow-visible border-0 p-0 cursor-pointer
            active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
            animate-bablo-pulse-claim"
        >
          <img src={`${import.meta.env.BASE_URL}button1.png`} alt="Забрать бабло" className="w-full h-full object-contain pointer-events-none animate-bablo-pulse-claim-glow" />
        </button>
      ) : (
        <button
          type="button"
          onClick={canStart ? onPress : undefined}
          disabled={!canStart}
          className={`block w-[min(22rem,88vw)] h-[min(22rem,88vw)] rounded-full overflow-visible border-0 p-0
            transition-transform active:scale-95
            ${canStart ? "cursor-pointer animate-bablo-pulse" : "cursor-not-allowed opacity-70"}`}
        >
          <img src={`${import.meta.env.BASE_URL}button1.png`} alt="Бабло" className={`w-full h-full object-contain pointer-events-none ${canStart ? "animate-bablo-pulse-glow" : ""}`} />
        </button>
      )}

      {/* Подпись сразу под кнопкой */}
      <p className="mt-1 text-sm text-muted-foreground font-bold flex items-center justify-center gap-1.5">
        жми и богатей <span className="inline-block text-2xl animate-float-fast" aria-hidden>👆</span>
      </p>

      {/* Status */}
      <div className="mt-4 text-center">
        {isActive && !isComplete && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-primary font-black">💸 Бабло растёт…</p>
            <p className="text-2xl font-black text-glow text-foreground tabular-nums">
              {currentValue.toFixed(1)} TON
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
