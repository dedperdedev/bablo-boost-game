import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  balance: number;
  onConfirm: (plan: "safe" | "turbo", amount: number) => void;
}

export function DepositModal({ open, onClose, balance, onConfirm }: Props) {
  const [plan, setPlan] = useState<"safe" | "turbo">("turbo");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

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
              className={`p-3 rounded-xl border-3 text-left transition-all ${
                plan === "safe"
                  ? "border-primary bg-primary/15"
                  : "border-border/40 bg-muted/20 hover:border-muted-foreground"
              }`}
            >
              <div className="text-3xl mb-1 text-center">🔒</div>
              <div className="font-black text-sm text-foreground text-center">СКУЧНЫЙ СЕЙФ</div>
              <div className="text-primary font-black text-lg text-center">3%/день</div>
              <span className="block text-center text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full font-bold">
                для трусов
              </span>
            </button>

            <button
              onClick={() => setPlan("turbo")}
              className={`p-3 rounded-xl border-3 text-left transition-all ${
                plan === "turbo"
                  ? "border-secondary bg-secondary/15"
                  : "border-border/40 bg-muted/20 hover:border-muted-foreground"
              }`}
            >
              <div className="text-3xl mb-1 text-center">🚀</div>
              <div className="font-black text-sm text-foreground text-center">ТУРБО-МЕШОК</div>
              <div className="text-secondary font-black text-lg text-center">21%/день</div>
              <div className="flex gap-1 flex-wrap justify-center">
                <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full font-bold">
                  мем-режим
                </span>
                <span className="text-[10px] bg-neon-pink/20 text-neon-pink px-1.5 py-0.5 rounded-full font-bold">
                  кринж
                </span>
              </div>
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
              hover:brightness-110 active:scale-95 transition-all border-2 border-gold shadow-lg"
          >
            🚀 ЗАПУСТИТЬ БАБЛО
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
