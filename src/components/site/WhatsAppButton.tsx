export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/251946471234?text=Hello%20MENOVO,%0A%0AI'm%20interested%20in%20your%20services."
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 h-16 w-16 grid place-items-center transition-transform duration-300 ease-out hover:scale-110 active:scale-105"
    >
      {/* Gold glow matching the MENOVO WhatsApp button style. */}
      <span
        aria-hidden
        className="absolute inset-[-8px] rounded-full blur-xl opacity-75 animate-glow-pulse"
        style={{
          background:
            "radial-gradient(circle, oklch(0.84 0.15 82 / 0.75), oklch(0.58 0.13 70 / 0.35) 55%, transparent 75%)",
        }}
      />

      <span
        aria-hidden
        className="absolute inset-[-12px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.9 0.16 85 / 0.9), transparent 70%)",
        }}
      />

      {/* Self-contained gold/black WhatsApp mark — no Lovable asset URL. */}
      <svg
        viewBox="0 0 100 100"
        width="64"
        height="64"
        role="img"
        aria-label="WhatsApp"
        className="relative drop-shadow-[0_6px_20px_oklch(0.76_0.14_75/0.6)] transition-transform duration-300 group-hover:rotate-[4deg]"
      >
        <defs>
          <linearGradient id="menovo-wa-gold" x1="18" y1="8" x2="82" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe39a" />
            <stop offset="0.45" stopColor="#d99a2b" />
            <stop offset="1" stopColor="#8f5a08" />
          </linearGradient>
          <linearGradient id="menovo-wa-black" x1="20" y1="18" x2="75" y2="78" gradientUnits="userSpaceOnUse">
            <stop stopColor="#252525" />
            <stop offset="1" stopColor="#050505" />
          </linearGradient>
        </defs>

        {/* Speech bubble */}
        <path
          d="M50 8C27.9 8 10 25.4 10 47c0 7.8 2.4 15.1 6.6 21.1L12 88l20.4-5.4A40.3 40.3 0 0 0 50 86c22.1 0 40-17.4 40-39S72.1 8 50 8Z"
          fill="url(#menovo-wa-black)"
          stroke="url(#menovo-wa-gold)"
          strokeWidth="3.2"
        />
        <path
          d="M50 14c-18.6 0-33.7 14.7-33.7 32.8 0 6.6 2 12.7 5.5 17.8l-3 11.2 11.7-3.1A34 34 0 0 0 50 79.6c18.6 0 33.7-14.7 33.7-32.8S68.6 14 50 14Z"
          fill="none"
          stroke="#6f6f6f"
          strokeOpacity="0.42"
          strokeWidth="1.3"
        />

        {/* Phone handset */}
        <path
          d="M38.2 29.7c-1.2-2.6-2.3-2.7-3.4-2.7h-2.8c-1 0-2.6.4-3.6 1.6-1 1.2-3.8 3.7-3.8 9.1s3.9 10.5 4.4 11.2c.5.7 7.5 12 18.3 16.4 9 3.7 10.9 3 12.9 2.8 2-.2 6.5-2.7 7.4-5.3.9-2.6.9-4.8.6-5.3-.3-.5-1.1-.8-2.2-1.4-1.1-.6-6.5-3.2-7.5-3.6-1-.4-1.7-.6-2.4.6-.7 1.1-2.6 3.6-3.2 4.4-.6.8-1.2.9-2.3.3-1.1-.6-4.7-1.6-8.9-5.2-3.3-2.8-5.5-6.2-6.1-7.3-.6-1.1-.1-1.7.5-2.2.5-.5 1.1-1.2 1.6-1.8.5-.6.7-1.1 1.1-1.8.4-.7.2-1.3-.1-1.9-.3-.6-2.3-5.8-3-7.9Z"
          fill="url(#menovo-wa-gold)"
        />
      </svg>
    </a>
  );
}
