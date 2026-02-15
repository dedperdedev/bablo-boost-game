import { useState, useEffect, useCallback, useRef } from "react";
import {
  getUser, getWallet, setWalletBalance, getActiveCycle, setActiveCycle,
  getEvents, addEvent, generateFakeEvent, isCycleComplete,
  type ActiveCycle, type GameEvent,
} from "@/lib/game-store";
import { BabloButton } from "@/components/BabloButton";
import { DepositModal } from "@/components/DepositModal";
import { VirtualWallet } from "@/components/VirtualWallet";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Confetti } from "@/components/Confetti";

const Index = () => {
  const [user] = useState(getUser);
  const [balance, setBalance] = useState(() => getWallet().balance);
  const [cycle, setCycle] = useState<ActiveCycle | null>(getActiveCycle);
  const [events, setEvents] = useState<GameEvent[]>(getEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const fakeTimerRef = useRef<ReturnType<typeof setInterval>>();

  // Sync balance
  const refreshBalance = useCallback(() => {
    setBalance(getWallet().balance);
  }, []);

  // Fake events generator
  useEffect(() => {
    const addFake = () => {
      const fake = generateFakeEvent();
      addEvent(fake);
      setEvents(getEvents());
    };
    // Add a few initial fake events
    for (let i = 0; i < 5; i++) addFake();
    fakeTimerRef.current = setInterval(addFake, 2000 + Math.random() * 3000);
    return () => clearInterval(fakeTimerRef.current);
  }, []);

  // Refresh cycle from storage on mount
  useEffect(() => {
    const c = getActiveCycle();
    if (c) setCycle(c);
  }, []);

  const handleDeposit = (plan: "safe" | "turbo", amount: number) => {
    const rate = plan === "safe" ? 0.03 : 0.21;
    const planName = plan === "safe" ? "Скучный сейф" : "Турбо-мешок";
    const now = Date.now();
    const newCycle: ActiveCycle = {
      planName,
      planRate: rate,
      amount,
      startAt: now,
      endAt: now + 24 * 60 * 60 * 1000,
      payoutTotal: amount + amount * rate,
      claimed: false,
    };

    // Deduct from balance
    setWalletBalance(balance - amount);
    setBalance(balance - amount);
    setActiveCycle(newCycle);
    setCycle(newCycle);

    // Log event
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

    // Add to balance
    setWalletBalance(balance + payout);
    setBalance(balance + payout);

    // Log event
    const ev: GameEvent = {
      type: "withdraw", nickname: user.nickname, planName: cycle.planName,
      amount: Math.round(payout * 100) / 100, timestamp: Date.now(),
    };
    addEvent(ev);
    setEvents(getEvents());

    // Clear cycle
    setActiveCycle(null);
    setCycle(null);

    // Celebrate
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto px-4 pb-8">
      <Confetti active={confetti} />

      {/* Disclaimer */}
      <div className="bg-secondary/20 border border-secondary rounded-lg px-3 py-1.5 mt-3 text-center">
        <p className="text-[11px] font-bold text-secondary">
          ⚠️ ПАРОДИЯ. Виртуальные токены. 0 реальных денег.
        </p>
      </div>

      {/* Header */}
      <header className="text-center mt-4 mb-6">
        <h1 className="text-3xl font-black text-primary text-glow tracking-tight">
          💰 КНОПКА БАБЛО
        </h1>
        <p className="text-xs text-muted-foreground font-bold mt-1">
          нажми и почувствуй себя инвестором (на 24 часа)
        </p>
        <span className="inline-block mt-1 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
          Только игра 🎮
        </span>
      </header>

      {/* Main button */}
      <div className="flex justify-center mb-6">
        <BabloButton
          cycle={cycle}
          onPress={() => setModalOpen(true)}
          onClaim={handleClaim}
        />
      </div>

      {/* Wallet */}
      <div className="mb-4">
        <VirtualWallet user={user} balance={balance} events={events} />
      </div>

      {/* Activity feed */}
      <ActivityFeed events={events} />

      {/* Modal */}
      <DepositModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        balance={balance}
        onConfirm={handleDeposit}
      />
    </div>
  );
};

export default Index;
