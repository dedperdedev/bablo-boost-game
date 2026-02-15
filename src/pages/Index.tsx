import { useState, useEffect, useCallback, useRef } from "react";
import {
  getUser, getWallet, setWalletBalance, getActiveCycle, setActiveCycle,
  getEvents, addEvent, generateFakeEvent,
  type ActiveCycle, type GameEvent,
} from "@/lib/game-store";
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
  const [confetti, setConfetti] = useState(false);
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
    const planName = plan === "safe" ? "Скучный сейф" : "Турбо-мешок";
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
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 pb-8">
      <Confetti active={confetti} />

      {/* Disclaimer */}
      <div className="bg-secondary/20 border-2 border-secondary/50 rounded-xl px-3 py-2 mt-3 text-center">
        <p className="text-[11px] font-black text-foreground">
          ⚠️ ПАРОДИЯ. Виртуальные токены. 0 реальных денег.
        </p>
      </div>

      {/* Header */}
      <header className="text-center mt-4 mb-6">
        <h1 className="text-4xl font-black text-primary text-glow tracking-tight">
          💰 КНОПКА БАБЛО
        </h1>
        <p className="text-xs text-muted-foreground font-bold mt-1">
          нажми и почувствуй себя инвестором (на 24 часа)
        </p>
        <span className="inline-block mt-1.5 text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-black border border-primary/30">
          Только игра 🎮
        </span>
      </header>

      {/* Main button */}
      <div className="flex justify-center mb-6">
        <BabloButton cycle={cycle} onPress={() => setModalOpen(true)} onClaim={handleClaim} />
      </div>

      {/* Deposits display */}
      <div className="mb-4">
        <DepositsDisplay cycle={cycle} balance={balance} />
      </div>

      {/* Chat button */}
      <div className="mb-4">
        <ChatButton />
      </div>

      {/* Referral block */}
      <ReferralBlock referralCode={referralCode} />

      {/* Modal */}
      <DepositModal open={modalOpen} onClose={() => setModalOpen(false)} balance={balance} onConfirm={handleDeposit} />
    </div>
  );
};

export default Index;
