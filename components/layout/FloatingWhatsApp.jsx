import { site, getWaNumber, floatingAriaLabel } from "@/data/site";

export default function FloatingWhatsApp() {
  const waNumber = getWaNumber();
  const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(site.whatsappGreeting)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={floatingAriaLabel}
      className="group fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center border border-whatsapp/50 bg-noir/80 text-whatsapp shadow-[0_18px_40px_-18px_rgba(37,211,102,0.65)] backdrop-blur-md transition-all duration-500 hover:border-whatsapp hover:bg-whatsapp hover:text-noir sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
    >
      <span
        aria-hidden="true"
        className="absolute -inset-1 -z-10 border border-whatsapp/15 transition-all duration-500 group-hover:-inset-1.5 group-hover:border-whatsapp/30"
      />
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 transition-transform duration-500 group-hover:scale-110 sm:h-6 sm:w-6">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.5-.9.9-1.1 2.2-.2 3.9a11.6 11.6 0 0 0 4.5 4.2c1.7.8 2.4.9 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2Z" />
      </svg>
    </a>
  );
}
