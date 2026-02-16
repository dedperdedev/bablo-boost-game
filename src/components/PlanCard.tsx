import { Lock } from "lucide-react";

export type PlanKind = "safe" | "turbo";

interface PlanCardProps {
  kind: PlanKind;
  title: string;
  icon: string;
  rate: string;
  badge: string;
  isSelected: boolean;
  isLocked: boolean;
  lockedLabel?: string;
  body: React.ReactNode;
  accentColor: string;
  onDepositClick?: () => void;
}

export function PlanCard({
  kind,
  title,
  icon,
  rate,
  badge,
  isSelected,
  isLocked,
  lockedLabel = "СКОРО",
  body,
  accentColor,
  onDepositClick,
}: PlanCardProps) {
  const glowColor = kind === "safe" ? "255, 196, 0" : "255, 61, 141";
  const ringAlpha = "0.25";
  const glowAlpha = "0.2";

  return (
    <div
      className={[
        "plan-card flex min-h-[220px] flex-col rounded-bablo-lg",
        isSelected && "plan-card--selected",
        isLocked && "plan-card--locked",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        isSelected
          ? {
              // @ts-expect-error CSS custom properties
              "--plan-accent-ring": `rgba(${glowColor}, ${ringAlpha})`,
              "--plan-accent-glow": `rgba(${glowColor}, ${glowAlpha})`,
              "--plan-accent-border": accentColor,
              "--plan-accent-bg": `rgba(${glowColor}, 0.3)`,
            }
          : undefined
      }
    >
      <div className="plan-card__content relative flex min-h-0 flex-1 flex-col p-4">
        {/* A) Header: icon + title */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl" aria-hidden>
            {icon}
          </span>
          <h4 className="text-center text-[15px] font-bold leading-tight tracking-tight whitespace-nowrap" style={{ color: "var(--text)" }}>
            {title}
          </h4>
        </div>

        <div className="plan-card__divider my-3" />

        {/* B) Rate */}
        <p
          className="text-center text-[52px] font-extrabold tabular-nums leading-none"
          style={{ color: accentColor }}
        >
          {rate}
        </p>

        {/* C) Кнопка занести */}
        <div className="mt-2 w-full">
          {onDepositClick ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDepositClick(); }}
              className="block w-full text-center text-xs font-black py-2 rounded-lg border-0 cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity"
              style={{
                background: accentColor,
                color: "#fff",
              }}
            >
              {badge}
            </button>
          ) : (
            <span
              className="block w-full text-center text-xs font-black py-2 rounded-lg"
              style={{
                background: accentColor,
                color: "#fff",
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="plan-card__divider my-3" />

        {/* D) Body: sum, progress, timer or "Готово!" */}
        <div className="flex flex-1 flex-col justify-end gap-2 text-center">
          {body}
        </div>
      </div>

      {isLocked && (
        <div className="plan-card__overlay">
          <Lock className="h-8 w-8" style={{ color: "var(--text)" }} aria-hidden />
          <span className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text)" }}>
            {lockedLabel}
          </span>
          <span className="text-xs" style={{ color: "var(--muted-rgba)" }}>
            Пока недоступно
          </span>
        </div>
      )}
    </div>
  );
}
