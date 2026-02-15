import { MessageCircle } from "lucide-react";

export function ChatButton() {
  return (
    <button
      onClick={() => window.open("https://t.me/bablo_chat", "_blank")}
      className="w-full bg-card border-2 border-border rounded-xl p-3 flex items-center justify-center gap-2
        font-black text-foreground text-base hover:border-primary hover:bg-primary/10 
        active:scale-95 transition-all"
    >
      <MessageCircle size={20} className="text-primary" />
      💬 НАШ ЧАТ
    </button>
  );
}
