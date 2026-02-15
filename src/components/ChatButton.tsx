import { MessageCircle } from "lucide-react";

export function ChatButton() {
  return (
    <button
      onClick={() => window.open("https://t.me/bablo_chat", "_blank")}
      className="w-full card-game p-3.5 flex items-center justify-center gap-2
        font-black text-foreground text-base hover:border-primary 
        active:scale-95 transition-all"
    >
      <MessageCircle size={22} className="text-primary" />
      <span className="text-lg">💬 НАШ ЧАТ</span>
    </button>
  );
}
