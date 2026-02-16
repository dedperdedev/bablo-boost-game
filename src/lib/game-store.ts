// Game state management with localStorage persistence

export interface UserData {
  id: string;
  nickname: string;
  fakeWalletAddress: string;
}

export interface WalletData {
  balance: number;
}

export interface ActiveCycle {
  planName: string;
  planRate: number;
  amount: number;
  startAt: number;
  endAt: number;
  payoutTotal: number;
  claimed: boolean;
}

export interface GameEvent {
  type: "deposit" | "withdraw";
  nickname: string;
  planName: string;
  amount: number;
  timestamp: number;
}

const STORAGE_KEYS = {
  user: "bablo_user",
  wallet: "bablo_wallet",
  cycle: "bablo_cycle",
  events: "bablo_events",
};

const FUNNY_NICKNAMES = [
  "БатяНаДепозите", "СейфовыйЕнот", "ТурбоКабан", "КрипроДядя",
  "МешокМечты", "БаблоБосс", "ЖадныйХомяк", "ДепозитныйЛис",
  "МажорНаМинималке", "СкамМастер", "ИнвесторОтБога", "ТокенТрус",
  "ПрофитДруг", "ПроцентныйВолк", "КэшКороль", "ДеньгоЁж",
  "МемныйБанкир", "СейфоЛюб", "ТурбоЛох", "БаблоЛапа",
  "КубышкаМен", "МонетныйДжин", "ПроцентоМан", "ТокенТигр",
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function generateWalletAddress(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `BABLO-${seg()}-${seg()}`;
}

export function getRandomNickname(): string {
  return FUNNY_NICKNAMES[Math.floor(Math.random() * FUNNY_NICKNAMES.length)];
}

export function getUser(): UserData {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (raw) return JSON.parse(raw);
  const user: UserData = {
    id: generateId(),
    nickname: getRandomNickname(),
    fakeWalletAddress: generateWalletAddress(),
  };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

export function getWallet(): WalletData {
  const raw = localStorage.getItem(STORAGE_KEYS.wallet);
  if (raw) return JSON.parse(raw);
  const wallet: WalletData = { balance: 1000 };
  localStorage.setItem(STORAGE_KEYS.wallet, JSON.stringify(wallet));
  return wallet;
}

export function setWalletBalance(balance: number) {
  const wallet: WalletData = { balance: Math.round(balance * 100) / 100 };
  localStorage.setItem(STORAGE_KEYS.wallet, JSON.stringify(wallet));
}

export function getActiveCycle(): ActiveCycle | null {
  const raw = localStorage.getItem(STORAGE_KEYS.cycle);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function setActiveCycle(cycle: ActiveCycle | null) {
  if (cycle) {
    localStorage.setItem(STORAGE_KEYS.cycle, JSON.stringify(cycle));
  } else {
    localStorage.removeItem(STORAGE_KEYS.cycle);
  }
}

export function getEvents(): GameEvent[] {
  const raw = localStorage.getItem(STORAGE_KEYS.events);
  if (raw) return JSON.parse(raw);
  return [];
}

export function addEvent(event: GameEvent) {
  const events = getEvents();
  events.unshift(event);
  // Keep last 50
  if (events.length > 50) events.length = 50;
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

export function getCycleProgress(cycle: ActiveCycle): number {
  const now = Date.now();
  const progress = (now - cycle.startAt) / (cycle.endAt - cycle.startAt);
  return Math.min(Math.max(progress, 0), 1);
}

export function getCurrentDisplayed(cycle: ActiveCycle): number {
  const progress = getCycleProgress(cycle);
  return cycle.amount + (cycle.payoutTotal - cycle.amount) * progress;
}

export function isCycleComplete(cycle: ActiveCycle): boolean {
  return Date.now() >= cycle.endAt;
}

/** Для дева: сразу завершить активный цикл (пропустить 24ч) */
export function skipCycle24h(): void {
  const cycle = getActiveCycle();
  if (!cycle || cycle.claimed) return;
  const now = Date.now();
  setActiveCycle({ ...cycle, endAt: now });
}

/** Ускорить цикл на 1 минуту (после просмотра рекламы) */
export function speedUpCycleByMinute(): void {
  const cycle = getActiveCycle();
  if (!cycle || cycle.claimed) return;
  const now = Date.now();
  const newEndAt = Math.max(now, cycle.endAt - 60 * 1000);
  setActiveCycle({ ...cycle, endAt: newEndAt });
}

export function formatTimeRemaining(cycle: ActiveCycle): string {
  const remaining = Math.max(0, cycle.endAt - Date.now());
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function generateFakeEvent(): GameEvent {
  const isDeposit = Math.random() > 0.4;
  const plans = [
    { name: "Скучный сейф", rate: 0.03 },
    { name: "Турбо-мешок", rate: 0.21 },
  ];
  const plan = plans[Math.floor(Math.random() * plans.length)];
  const amount = isDeposit
    ? Math.floor(Math.random() * 5000) + 50
    : Math.floor(Math.random() * 6000) + 100;

  return {
    type: isDeposit ? "deposit" : "withdraw",
    nickname: getRandomNickname(),
    planName: plan.name,
    amount,
    timestamp: Date.now(),
  };
}
