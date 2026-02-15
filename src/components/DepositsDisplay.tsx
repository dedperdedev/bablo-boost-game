import { ActiveCycle, formatTimeRemaining, getCurrentDisplayed, isCycleComplete, getCycleProgress } from "@/lib/game-store";
import { useEffect, useState } from "react";

interface Props {
  cycle: ActiveCycle | null;
  balance: number;
}

export function DepositsDisplay({ cycle, balance }: Props) {
  const [timeStr, setTimeStr] = useState("00:00:00");
  const [currentValue, setCurrentValue] = useState(0);
  const [progress, setProgress] = useState(0);

  const activePlan = cycle?.planName;
  const isComplete = cycle ? isCycleComplete(cycle) : false;

  useEffect(() => {
    if (!cycle || cycle.claimed) return;
    const iv = setInterval(() => {
      setTimeStr(formatTimeRemaining(cycle));
      setCurrentValue(getCurrentDisplayed(cycle));
      setProgress(getCycleProgress(cycle));
    }, 100);
    return () => clearInterval(iv);
  }, [cycle]);

  return (
    <div className="card-game p-4">
      <h3 className="font-black text-foreground text-lg mb-3">📊 Мои депозиты</h3>

      {/* Balance */}
      <div className="text-center mb-4 bg-muted/30 rounded-xl py-3 border border-border/30">
        <p className="text-4xl font-black text-glow text-primary tabular-nums">
          {balance.toFixed(0)}
        </p>
        <p className="text-xs text-muted-foreground font-bold">виртуальных токенов 💰</p>
      </div>

      {/* Two plan cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* СКУЧНЫЙ СЕЙФ */}
        <div className={`rounded-xl border-3 p-3 transition-all ${
          activePlan === "Скучный сейф"
            ? "border-primary bg-primary/15 box-glow"
            : "border-border/40 bg-muted/20 opacity-50"
        }`}>
          <div className="text-4xl text-center mb-1 animate-float">🔒</div>
          <p className="font-black text-xs text-center text-foreground">СКУЧНЫЙ СЕЙФ</p>
          <p className="text-primary font-black text-center text-xl">3%</p>
          <span className="block text-center text-[9px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full font-bold mt-1">
            для трусов
          </span>
          {activePlan === "Скучный сейф" && !isComplete && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-primary font-black text-center tabular-nums">
                {currentValue.toFixed(1)}
              </p>
              <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center tabular-nums">⏱ {timeStr}</p>
            </div>
          )}
          {activePlan === "Скучный сейф" && isComplete && (
            <p className="text-xs text-accent font-black text-center mt-2">✅ Готово!</p>
          )}
        </div>

        {/* ТУРБО-МЕШОК */}
        <div className={`rounded-xl border-3 p-3 transition-all ${
          activePlan === "Турбо-мешок"
            ? "border-secondary bg-secondary/15 box-glow-red"
            : "border-border/40 bg-muted/20 opacity-50"
        }`}>
          <div className="text-4xl text-center mb-1 animate-float" style={{ animationDelay: "500ms" }}>🚀</div>
          <p className="font-black text-xs text-center text-foreground">ТУРБО-МЕШОК</p>
          <p className="text-secondary font-black text-center text-xl">21%</p>
          <div className="flex gap-1 justify-center mt-1 flex-wrap">
            <span className="text-[9px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full font-bold">
              мем-режим
            </span>
          </div>
          {activePlan === "Турбо-мешок" && !isComplete && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-secondary font-black text-center tabular-nums">
                {currentValue.toFixed(1)}
              </p>
              <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center tabular-nums">⏱ {timeStr}</p>
            </div>
          )}
          {activePlan === "Турбо-мешок" && isComplete && (
            <p className="text-xs text-accent font-black text-center mt-2">✅ Готово!</p>
          )}
        </div>
      </div>
    </div>
  );
}
