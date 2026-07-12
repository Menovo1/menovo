import whatsappIcon from "@/assets/whatsapp-icon.png.asset.json";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/251946471234?text=Hello%20MENOVO,%0A%0AI'm%20interested%20in%20your%20services."
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 grid place-items-center animate-glow-pulse"
    >
      <img src={whatsappIcon.url} alt="WhatsApp" className="h-14 w-14" />
    </a>
  );
}
