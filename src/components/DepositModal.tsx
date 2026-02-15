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
      setError("Минимум 1 токен, жадина!");
      return;
    }
    if (num > balance) {
      setError("Недостаточно токенов. Иди нажми реальность. 😤");
      return;
    }
    setError("");
    onConfirm(plan, num);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-2 border-primary max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-primary font-black text-xl text-center">
            💼 Куда занести токены?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Plan cards */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPlan("safe")}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                plan === "safe"
                  ? "border-primary bg-muted"
                  : "border-border bg-card hover:border-muted-foreground"
              }`}
            >
              <div className="text-2xl mb-1">🔒</div>
              <div className="font-black text-sm text-foreground">СКУЧНЫЙ СЕЙФ</div>
              <div className="text-primary font-bold text-lg">3%/день</div>
              <span className="text-[10px] bg-muted-foreground/20 text-muted-foreground px-1.5 py-0.5 rounded-full font-bold">
                для трусов
              </span>
            </button>

            <button
              onClick={() => setPlan("turbo")}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                plan === "turbo"
                  ? "border-secondary bg-muted"
                  : "border-border bg-card hover:border-muted-foreground"
              }`}
            >
              <div className="text-2xl mb-1">🚀</div>
              <div className="font-black text-sm text-foreground">ТУРБО-МЕШОК</div>
              <div className="text-secondary font-bold text-lg">21%/день</div>
              <div className="flex gap-1 flex-wrap">
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
              Сколько токенов заносим?
            </label>
            <input
              type="number"
              min={1}
              max={balance}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              placeholder={`Баланс: ${balance.toFixed(0)}`}
              className="w-full bg-input border-2 border-border rounded-lg px-3 py-2 text-foreground font-bold
                text-lg focus:border-primary focus:outline-none transition-colors"
            />
            {error && (
              <p className="text-secondary text-xs font-bold mt-1">⚠️ {error}</p>
            )}
          </div>

          {/* Preview */}
          {num > 0 && (
            <div className="bg-muted rounded-lg p-2 text-center">
              <p className="text-xs text-muted-foreground font-bold">Через 24ч:</p>
              <p className="font-black text-foreground">
                {num.toFixed(0)} → <span className="text-primary">{payout.toFixed(1)}</span> токенов
              </p>
            </div>
          )}

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            className="w-full bg-primary text-primary-foreground font-black text-lg py-3 rounded-lg
              hover:brightness-110 active:scale-95 transition-all border-2 border-gold"
          >
            🚀 ЗАПУСТИТЬ БАБЛО
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
