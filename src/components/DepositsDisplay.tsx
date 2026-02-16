import { ActiveCycle, formatTimeRemaining, getCurrentDisplayed, isCycleComplete, getCycleProgress } from "@/lib/game-store";
import { useEffect, useState } from "react";
import { PlanCard } from "@/components/PlanCard";

const ACCENT_SAFE = "#FFC400";
const ACCENT_TURBO = "#FF3D8D";

interface Props {
  cycle: ActiveCycle | null;
  balance: number;
  onClaim?: () => void;
  onOpenDeposit?: (plan: "safe" | "turbo") => void;
}

export function DepositsDisplay({ cycle, balance, onClaim, onOpenDeposit }: Props) {
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

  const placeholderBody = <span className="text-xs" style={{ color: "var(--subtle)" }}>—</span>;

  const renderSafeBody = () => {
    if (activePlan !== "Дырявый носок") return placeholderBody;
    if (isComplete) {
      return <p className="text-sm font-bold" style={{ color: "var(--muted-rgba)" }}>✅ Готово!</p>;
    }
    return (
      <>
        <p className="text-sm font-extrabold tabular-nums" style={{ color: ACCENT_SAFE }}>
          {currentValue.toFixed(1)}
        </p>
        <div className="progress-track w-full">
          <div
            className="progress-fill"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 70%), ${ACCENT_SAFE}`,
            }}
          />
        </div>
        <p className="text-xs font-semibold tabular-nums" style={{ color: "var(--subtle)" }}>
          ⏱ {timeStr}
        </p>
      </>
    );
  };

  const renderTurboBody = () => {
    if (activePlan !== "Турбо-мешок") return placeholderBody;
    if (isComplete) {
      return <p className="text-sm font-bold" style={{ color: "var(--muted-rgba)" }}>✅ Готово!</p>;
    }
    return (
      <>
        <p className="text-sm font-extrabold tabular-nums" style={{ color: ACCENT_TURBO }}>
          {currentValue.toFixed(1)}
        </p>
        <div className="progress-track w-full">
          <div
            className="progress-fill"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 70%), ${ACCENT_TURBO}`,
            }}
          />
        </div>
        <p className="text-xs font-semibold tabular-nums" style={{ color: "var(--subtle)" }}>
          ⏱ {timeStr}
        </p>
      </>
    );
  };

  return (
    <div className="card-game overflow-visible">
      <h3 className="mb-1 text-center text-lg font-bold" style={{ color: "var(--text)" }}>
        💰 Мои бабосики
      </h3>

      {isComplete && (
        <p className="mb-3 text-center text-accent font-black text-lg">✅ Бабло готово! Забирай!</p>
      )}

      {/* Balance */}
      <div
        className="mb-6 rounded-bablo-md border py-4 text-center"
        style={{
          borderColor: "var(--stroke)",
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-4xl font-extrabold tabular-nums" style={{ color: "var(--text)" }}>
          {balance.toFixed(0)}
        </p>
        <button
          type="button"
          onClick={cycle && isComplete ? onClaim : undefined}
          disabled={!cycle || !isComplete}
          className="cta-claim mx-auto mt-3 flex items-center justify-center gap-2 rounded-full border-0 px-6 py-2.5 text-sm font-bold disabled:cursor-not-allowed"
          style={{
            background: cycle && isComplete
              ? `linear-gradient(180deg, hsl(${152} ${72}% ${48}%), hsl(152 72% 38%))`
              : undefined,
            color: "#fff",
          }}
        >
          <span className="text-base leading-none">💰</span>
          <span>Забрать бабло</span>
        </button>
      </div>

      {/* Two plan cards */}
      <div className="grid grid-cols-2 gap-4">
        <PlanCard
          kind="safe"
          title="ДЫРЯВЫЙ НОСОК"
          icon="🧦"
          rate="3%"
          badge="Засунуть в носок"
          isSelected={activePlan === "Дырявый носок"}
          isLocked={false}
          lockedLabel="СКОРО"
          accentColor={ACCENT_SAFE}
          body={renderSafeBody()}
          onDepositClick={onOpenDeposit ? () => onOpenDeposit("safe") : undefined}
        />
        <PlanCard
          kind="turbo"
          title="ТУРБО-МЕШОК"
          icon="🚀"
          rate="21%"
          badge="Положить в мешок"
          isSelected={activePlan === "Турбо-мешок"}
          isLocked={false}
          lockedLabel="СКОРО"
          accentColor={ACCENT_TURBO}
          body={renderTurboBody()}
          onDepositClick={onOpenDeposit ? () => onOpenDeposit("turbo") : undefined}
        />
      </div>
    </div>
  );
}
