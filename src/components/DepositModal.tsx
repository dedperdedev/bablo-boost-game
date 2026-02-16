import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Подпись под полем суммы в зависимости от депозита (градация до 1000 TON) */
function getAmountLabel(amount: number): string {
  if (amount <= 0) return "";
  if (amount < 1) return "бомж";
  if (amount < 5) return "нищий";
  if (amount < 10) return "скромняга";
  if (amount < 20) return "эконом";
  if (amount < 50) return "нормально";
  if (amount < 100) return "уважаю";
  if (amount < 150) return "солидно";
  if (amount < 250) return "эскорт?";
  if (amount < 400) return "уважение";
  if (amount < 550) return "респект";
  if (amount < 700) return "мое уважение";
  if (amount < 850) return "низкий поклон";
  if (amount < 1000) return "шапку снимаю";
  return "мое почтение";
}

interface Props {
  open: boolean;
  onClose: () => void;
  balance: number;
  onConfirm: (plan: "safe" | "turbo", amount: number) => void;
  initialPlan?: "safe" | "turbo";
}

export function DepositModal({ open, onClose, balance, onConfirm, initialPlan }: Props) {
  const [plan, setPlan] = useState<"safe" | "turbo">("turbo");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initialPlan) {
      setPlan(initialPlan);
    }
  }, [open, initialPlan]);

  const rate = plan === "safe" ? 0.03 : 0.21;
  const num = parseFloat(amount) || 0;
  const payout = num + num * rate;

  const handleConfirm = () => {
    if (!num || num < 1) {
      setError("Минимум 1 TON, жадина!");
      return;
    }
    if (num > balance) {
      setError("Недостаточно TON. Иди нажми реальность. 😤");
      return;
    }
    setError("");
    onConfirm(plan, num);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="card-game max-w-sm mx-auto border-primary">
        <DialogHeader>
          <DialogTitle className="text-primary font-black text-xl text-center">
            💼 Куда занести TON?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Plan cards */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPlan("safe")}
              className={`p-3 rounded-xl border-[3px] text-left transition-all ${
                plan === "safe"
                  ? "border-primary bg-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-transparent shadow-[0_0_20px_hsl(var(--primary)_/_.4)]"
                  : "border-border/40 bg-muted/20 hover:border-muted-foreground"
              }`}
            >
              <div className="text-3xl mb-1 text-center">🧦</div>
              <div className="font-black text-sm text-foreground text-center">ДЫРЯВЫЙ НОСОК</div>
              <div className="text-primary font-black text-lg text-center">3%/день</div>
              <span className="mt-2 block w-full text-center text-xs font-black py-2 rounded-lg bg-primary text-primary-foreground">
                Засунуть в носок
              </span>
            </button>

            <button
              onClick={() => setPlan("turbo")}
              className={`p-3 rounded-xl border-[3px] text-left transition-all ${
                plan === "turbo"
                  ? "border-secondary bg-secondary/30 ring-2 ring-secondary ring-offset-2 ring-offset-transparent shadow-[0_0_20px_hsl(var(--secondary)_/_.4)]"
                  : "border-border/40 bg-muted/20 hover:border-muted-foreground"
              }`}
            >
              <div className="text-3xl mb-1 text-center">🚀</div>
              <div className="font-black text-sm text-foreground text-center">ТУРБО-МЕШОК</div>
              <div className="text-secondary font-black text-lg text-center">21%/день</div>
              <span className="mt-2 block w-full text-center text-xs font-black py-2 rounded-lg bg-secondary text-secondary-foreground">
                Положить в мешок
              </span>
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-sm font-bold text-muted-foreground mb-1 block">
              Сколько TON заносим?
            </label>
            <input
              type="number"
              min={1}
              max={balance}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              placeholder={`Баланс: ${balance.toFixed(0)}`}
              className="w-full bg-muted/50 border-2 border-border/50 rounded-xl px-3 py-2.5 text-foreground font-bold
                text-lg focus:border-primary focus:outline-none transition-colors"
            />
            {num > 0 && getAmountLabel(num) && (
              <p className="text-primary/90 text-sm font-black mt-1.5">
                {getAmountLabel(num)}
              </p>
            )}
            {error && (
              <p className="text-secondary text-xs font-bold mt-1">⚠️ {error}</p>
            )}
          </div>

          {/* Preview */}
          {num > 0 && (
            <div className="bg-muted/30 rounded-xl p-2.5 text-center border border-border/30">
              <p className="text-xs text-muted-foreground font-bold">Через 24ч:</p>
              <p className="font-black text-foreground text-lg">
                {num.toFixed(0)} → <span className="text-primary">{payout.toFixed(1)}</span> TON
              </p>
            </div>
          )}

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            className="w-full bg-primary text-primary-foreground font-black text-lg py-3.5 rounded-xl
              hover:brightness-110 active:scale-95 transition-all border-2 border-gold shadow-lg
              animate-bablo-pulse flex items-center justify-center gap-2"
          >
            <span className="inline-block text-xl animate-float-fast" aria-hidden>💸</span>
            ОТДАТЬ БАБЛО
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
