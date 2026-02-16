export function ChatButton() {
  return (
    <button
      onClick={() => window.open("https://t.me/bablo_chat", "_blank")}
      className="w-full card-game p-3.5 flex items-center justify-center
        font-black text-foreground text-base hover:border-primary 
        active:scale-95 transition-all"
    >
      <span className="text-lg">💬 НАШ ЧАТ</span>
    </button>
  );
}
