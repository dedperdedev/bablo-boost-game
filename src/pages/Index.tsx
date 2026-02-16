import { useState, useEffect, useCallback, useRef } from "react";
import {
  getUser, getWallet, setWalletBalance, getActiveCycle, setActiveCycle,
  getEvents, addEvent, generateFakeEvent, isCycleComplete, skipCycle24h, speedUpCycleByMinute,
  type ActiveCycle, type GameEvent,
} from "@/lib/game-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BabloButton } from "@/components/BabloButton";
import { DepositModal } from "@/components/DepositModal";
import { DepositsDisplay } from "@/components/DepositsDisplay";
import { ChatButton } from "@/components/ChatButton";
import { ReferralBlock } from "@/components/ReferralBlock";
import { Confetti } from "@/components/Confetti";

const Index = () => {
  const [user] = useState(getUser);
  const [balance, setBalance] = useState(() => getWallet().balance);
  const [cycle, setCycle] = useState<ActiveCycle | null>(getActiveCycle);
  const [events, setEvents] = useState<GameEvent[]>(getEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialDepositPlan, setInitialDepositPlan] = useState<"safe" | "turbo" | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [speedUpAdOpen, setSpeedUpAdOpen] = useState(false);
  const fakeTimerRef = useRef<ReturnType<typeof setInterval>>();

  const refreshBalance = useCallback(() => {
    setBalance(getWallet().balance);
  }, []);

  useEffect(() => {
    const addFake = () => {
      const fake = generateFakeEvent();
      addEvent(fake);
      setEvents(getEvents());
    };
    for (let i = 0; i < 5; i++) addFake();
    fakeTimerRef.current = setInterval(addFake, 2000 + Math.random() * 3000);
    return () => clearInterval(fakeTimerRef.current);
  }, []);

  useEffect(() => {
    const c = getActiveCycle();
    if (c) setCycle(c);
  }, []);

  const handleDeposit = (plan: "safe" | "turbo", amount: number) => {
    const rate = plan === "safe" ? 0.03 : 0.21;
    const planName = plan === "safe" ? "Дырявый носок" : "Турбо-мешок";
    const now = Date.now();
    const newCycle: ActiveCycle = {
      planName, planRate: rate, amount, startAt: now,
      endAt: now + 24 * 60 * 60 * 1000, payoutTotal: amount + amount * rate, claimed: false,
    };
    setWalletBalance(balance - amount);
    setBalance(balance - amount);
    setActiveCycle(newCycle);
    setCycle(newCycle);
    const ev: GameEvent = { type: "deposit", nickname: user.nickname, planName, amount, timestamp: now };
    addEvent(ev);
    setEvents(getEvents());
    setModalOpen(false);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  };

  const handleClaim = () => {
    if (!cycle) return;
    const payout = cycle.payoutTotal;
    setWalletBalance(balance + payout);
    setBalance(balance + payout);
    const ev: GameEvent = {
      type: "withdraw", nickname: user.nickname, planName: cycle.planName,
      amount: Math.round(payout * 100) / 100, timestamp: Date.now(),
    };
    addEvent(ev);
    setEvents(getEvents());
    setActiveCycle(null);
    setCycle(null);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  };

  const referralCode = user.id.slice(0, 6).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-5 pt-6 pb-8">
      <Confetti active={confetti} />

      {/* Main button */}
      <div className="flex flex-col items-center mt-6 mb-6">
        <BabloButton
          cycle={cycle}
          onPress={() => setModalOpen(true)}
          onClaim={handleClaim}
          onSpeedUpClick={() => setSpeedUpAdOpen(true)}
        />
      </div>

      {/* Dev: пропустить 24ч */}
      {import.meta.env.DEV && cycle && !isCycleComplete(cycle) && (
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            onClick={() => {
              skipCycle24h();
              setCycle(getActiveCycle());
            }}
            className="rounded-lg border border-amber-500/70 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-200"
          >
            ⏩ Пропустить 24ч
          </button>
        </div>
      )}

      {/* Deposits display */}
      <div className="mb-4">
        <DepositsDisplay
          cycle={cycle}
          balance={balance}
          onClaim={handleClaim}
          onOpenDeposit={(plan) => {
            setInitialDepositPlan(plan);
            setModalOpen(true);
          }}
        />
      </div>

      {/* Chat button */}
      <div className="mb-4">
        <ChatButton />
      </div>

      {/* Referral block */}
      <ReferralBlock referralCode={referralCode} />

      {/* Реклама: ускорить на минуту */}
      <Dialog
        open={speedUpAdOpen}
        onOpenChange={(open) => {
          if (!open) {
            speedUpCycleByMinute();
            setCycle(getActiveCycle());
            setSpeedUpAdOpen(false);
          }
        }}
      >
        <DialogContent className="card-game max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center font-black text-lg">
              📺 Реклама
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground font-bold mb-4">
              Посмотри рекламу — процесс ускорится на 1 минуту!
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              (Здесь могла быть ваша реклама)
            </p>
            <button
              type="button"
              onClick={() => {
                speedUpCycleByMinute();
                setCycle(getActiveCycle());
                setSpeedUpAdOpen(false);
              }}
              className="w-full rounded-xl bg-primary text-primary-foreground font-black py-3 px-4"
            >
              Закрыть — минус 1 мин
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal */}
      <DepositModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setInitialDepositPlan(null);
        }}
        balance={balance}
        onConfirm={handleDeposit}
        initialPlan={initialDepositPlan ?? undefined}
      />
    </div>
  );
};

export default Index;
