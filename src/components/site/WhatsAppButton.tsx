import whatsappIcon from "@/assets/whatsapp-gold.png.asset.json";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/251777775911?text=Hello%20MENOVO,%0A%0AI'm%20interested%20in%20your%20services."
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 h-16 w-16 grid place-items-center transition-transform duration-300 ease-out hover:scale-125 active:scale-110"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full blur-xl opacity-70 animate-glow-pulse"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.15 80 / 0.75), oklch(0.55 0.13 70 / 0.35) 55%, transparent 75%)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.9 0.16 85 / 0.9), transparent 70%)",
        }}
      />
      <img
        src={whatsappIcon.url}
        alt="WhatsApp"
        width={128}
        height={128}
        loading="lazy"
        className="relative h-16 w-16 drop-shadow-[0_6px_20px_oklch(0.76_0.14_75/0.55)] transition-transform duration-300 group-hover:rotate-[6deg]"
      />
    </a>
  );
}
