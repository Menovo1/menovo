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
      <span
        role="img"
        aria-label="WhatsApp"
        className="relative h-16 w-16 grid place-items-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] transition-transform duration-300 group-hover:rotate-[6deg]"
      >
        <svg
          viewBox="0 0 32 32"
          width="42"
          height="42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M16 3.2a12.8 12.8 0 0 0-11 19.34L3.3 28.7l6.3-1.65A12.8 12.8 0 1 0 16 3.2Z"
          />
          <path
            fill="#25D366"
            d="M16 6.1a9.9 9.9 0 0 0-8.46 15.04l.39.62-.97 3.52 3.6-.94.6.36A9.9 9.9 0 1 0 16 6.1Z"
          />
          <path
            fill="white"
            d="M12.05 10.2c-.23-.5-.47-.51-.69-.52-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.84.4-.29.31-1.1 1.08-1.1 2.64s1.13 3.06 1.29 3.27c.16.21 2.18 3.5 5.4 4.77 2.67 1.05 3.21.84 3.79.79.58-.05 1.87-.76 2.13-1.49.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.37-.31-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.31-.81 1.03-.99 1.24-.18.21-.36.24-.66.08-.31-.16-1.3-.48-2.47-1.53-.91-.81-1.52-1.81-1.7-2.11-.18-.31-.02-.47.14-.62.14-.14.31-.36.47-.53.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.68-1.7-.96-2.33Z"
          />
        </svg>
      </span>
    </a>
  );
}
