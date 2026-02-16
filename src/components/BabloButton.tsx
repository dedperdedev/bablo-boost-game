import { ActiveCycle, isCycleComplete, formatTimeRemaining, getCurrentDisplayed } from "@/lib/game-store";
import { useEffect, useRef, useState } from "react";

const GROWTH_FLOAT_EMOJIS = ["💵", "💰", "✨"];

const MILESTONES: { at: number; label: string }[] = [
  { at: 25, label: "25%!" },
  { at: 50, label: "Половина!" },
  { at: 75, label: "Почти готово!" },
];

const GROWTH_PHRASES = [
  "💸 Бабло растёт…",
  "А процентики-то капают…",
  "А баблишко-то растёт…",
  "💰 Копеечка к копеечке…",
  "Деньги делают деньги…",
  "⏳ Жди да не скучай…",
  "Процент капает, душа поёт…",
  "🪙 Золото зреет…",
  "Считай минуты — считай бабки…",
  "Терпение и труд бабло принесут…",
  "🚀 Деньги летят к тебе…",
  "Не сплю — бабло коплю…",
  "Капает не дождь — капает профит…",
  "💎 Из труса в мажора за 24ч…",
  "Сейф тикает — кошелёк толстеет…",
  "Пока ты ждёшь — процент растёт…",
  "🤑 Жадность — двигатель прогресса…",
  "Бабло не спит, бабло работает…",
  "Скоро мешок — уже не мелочь…",
  "Тик-так, тик-так — капает бабло так…",
  "🔥 Деньги любят терпеливых…",
  "Процент на процент — и вот тебе миллион…",
  "🐷 Хрюкай от счастья через сутки…",
];

interface Props {
  cycle: ActiveCycle | null;
  onPress: () => void;
  onClaim: () => void;
  onSpeedUpClick?: () => void;
}

export function BabloButton({ cycle, onPress, onClaim, onSpeedUpClick }: Props) {
  const [timeStr, setTimeStr] = useState("00:00:00");
  const [currentValue, setCurrentValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [growthPhraseIndex, setGrowthPhraseIndex] = useState(0);
  const lastMilestoneRef = useRef(0);

  const isActive = cycle && !cycle.claimed;
  const isComplete = cycle ? isCycleComplete(cycle) : false;
  const canStart = !isActive;

  useEffect(() => {
    if (!isActive) {
      lastMilestoneRef.current = 0;
      setMilestone(null);
      return;
    }
    const phraseIv = setInterval(() => {
      setGrowthPhraseIndex((i) => (i + 1) % GROWTH_PHRASES.length);
    }, 7500);
    const iv = setInterval(() => {
      if (!cycle) return;
      setTimeStr(formatTimeRemaining(cycle));
      setCurrentValue(getCurrentDisplayed(cycle));
      const p = Math.min(1, (Date.now() - cycle.startAt) / (cycle.endAt - cycle.startAt));
      setProgress(p);
      const pct = Math.floor(p * 100);
      for (const { at, label: _ } of MILESTONES) {
        if (pct >= at && lastMilestoneRef.current < at) {
          lastMilestoneRef.current = at;
          setMilestone(at);
          setTimeout(() => setMilestone(null), 2200);
          break;
        }
      }
    }, 100);
    return () => {
      clearInterval(iv);
      clearInterval(phraseIv);
    };
  }, [cycle, isActive]);

  const showButtonAndCaption = canStart || (isActive && isComplete);

  return (
    <div className="flex w-full flex-col items-center">
      {/* Кнопка и подпись — только когда можно нажать или готово забирать */}
      {showButtonAndCaption && (
        <>
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
          <p className="mt-1 text-xl text-muted-foreground font-black flex items-center justify-center gap-1.5">
            жми и богатей <span className="inline-block text-3xl animate-float-fast" aria-hidden>👆</span>
          </p>
        </>
      )}

      {/* Пока бабло растёт: только таймер и растущий баланс — на всю ширину */}
      {isActive && !isComplete && (
        <div
          className="growth-block-shimmer relative w-full overflow-hidden rounded-bablo-lg border-2 px-6 py-6 text-center"
          style={{
            borderColor: "rgba(255,255,255,0.18)",
            background: "linear-gradient(180deg, hsl(210 65% 58%) 0%, hsl(var(--card-surface)) 25%, hsl(210 68% 52%) 100%)",
            boxShadow: "var(--shadow), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Мини-конфетти на фоне */}
          {GROWTH_FLOAT_EMOJIS.map((emoji, i) => (
            <span
              key={i}
              className="absolute pointer-events-none animate-growth-float text-2xl"
              style={{
                left: `${15 + i * 30}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.8}s`,
                zIndex: 0,
              }}
              aria-hidden
            >
              {emoji}
            </span>
          ))}

          {/* Веха прогресса */}
          {milestone !== null && (
            <div
              className="absolute left-1/2 top-3 -translate-x-1/2 z-10 rounded-full px-4 py-1.5 text-sm font-black animate-ticker-slide"
              style={{
                background: "rgba(255, 196, 0, 0.9)",
                color: "hsl(210 85% 15%)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
              }}
            >
              {MILESTONES.find((m) => m.at === milestone)?.label ?? ""}
            </div>
          )}

          <div className="relative z-[1]">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--muted-rgba)" }}>
              {GROWTH_PHRASES[growthPhraseIndex]}
            </p>
            <p
              key={Math.floor(currentValue)}
              className="text-5xl font-extrabold tabular-nums mb-4 tracking-tight leading-none animate-growth-tick"
              style={{ color: "var(--text)", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
            >
              {currentValue.toFixed(1)} <span className="text-2xl font-bold opacity-90 align-middle">TON</span>
            </p>
            <div className="h-3 w-full rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progress * 100}%`,
                  background: "linear-gradient(90deg, #FFC400 0%, hsl(45 100% 55%) 50%, #FFC400 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              />
            </div>
            <p className="text-base font-bold tabular-nums tracking-wide mb-3" style={{ color: "var(--subtle)" }}>
              ⏱ {timeStr}
            </p>
            {onSpeedUpClick && (
              <button
                type="button"
                onClick={onSpeedUpClick}
                className="rounded-full border-2 px-4 py-2 text-sm font-bold transition-all active:scale-95"
                style={{
                  borderColor: "rgba(255,255,255,0.35)",
                  background: "rgba(255,255,255,0.12)",
                  color: "var(--text)",
                }}
              >
                ⚡ Ускорить
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
