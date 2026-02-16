import { GameEvent } from "@/lib/game-store";

interface Props {
  events: GameEvent[];
}

const EMOJIS = ["🐷", "🦊", "🐻", "🐸", "🐵", "🦝", "🐨", "🐯", "🐰", "🐮", "🐔", "🦄"];

function getEmoji(nickname: string) {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  return EMOJIS[Math.abs(hash) % EMOJIS.length];
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "только что";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
  return `${Math.floor(diff / 3600000)}ч назад`;
}

export function ActivityFeed({ events }: Props) {
  return (
    <div className="bg-card border-2 border-border rounded-xl p-4">
      <h3 className="font-black text-secondary text-lg mb-3 text-center">🔥 Лента жадности</h3>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {events.slice(0, 20).map((ev, i) => (
          <div
            key={`${ev.timestamp}-${i}`}
            className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 animate-ticker-slide"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-2xl shrink-0">{getEmoji(ev.nickname)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {ev.type === "deposit" ? (
                  <>
                    <span className="text-primary">{ev.nickname}</span> занёс{" "}
                    <span className="text-primary">{ev.amount}</span> в {ev.planName}
                  </>
                ) : (
                  <>
                    <span className="text-accent">{ev.nickname}</span> забрал{" "}
                    <span className="text-accent">{ev.amount}</span> TON 🎉
                  </>
                )}
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(ev.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
