import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ChatWidget from "@/components/layout/ChatWidget";
import { site, getWaNumber } from "@/data/site";
import { getServices, getContent, getSettings } from "@/lib/content";

// Marketing chrome: nav, footer and floating button live here,
// so private routes like /login render bare.
export default async function SiteLayout({ children }) {
  const [services, clients, settings, chatbot] = await Promise.all([
    getServices(),
    getContent("clients"),
    getSettings(),
    getContent("chatbot")
  ]);
  const navLinks = clients.visible === false
    ? site.nav.filter((l) => l.href !== "/clients")
    : site.nav;
  // Public-safe slice of the chatbot config: no apiKey, no model, no
  // knowledge paragraph - the server holds those and speaks for the bot.
  // Service titles come straight from the Services tab in the dashboard,
  // so a Service-list question always offers the live list.
  const chatPublic = chatbot.enabled
    ? {
        welcome: chatbot.welcomeMessage,
        questions: chatbot.questions.map((q) => ({ text: q.text, type: q.type || "text" })),
        services: services.map((s) => s.title),
        askEnabled: Boolean(chatbot.apiKey && chatbot.chatParagraph)
      }
    : null;
  return (
    <>
      {/* Site canvas — burgundy and antique-gold washes over ivory, a
          whisper of blueprint grid and a soft vignette. Fixed behind
          everything so every section shares one continuous, slowly
          drifting field. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-noir">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(140,109,42,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(140,109,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(140,109,42,0.06)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(ellipse_at_50%_28%,black,transparent_82%)]" />
        <div className="ambient-drift absolute -left-[18vw] -top-[22vh] h-[62vh] w-[62vw] rounded-full bg-[radial-gradient(circle,rgba(126,37,48,0.05),transparent_62%)] blur-[110px]" />
        <div className="ambient-drift-slow absolute -right-[16vw] top-[46vh] h-[58vh] w-[54vw] rounded-full bg-[radial-gradient(circle,rgba(166,124,0,0.06),transparent_65%)] blur-[120px]" />
        <div className="ambient-drift absolute left-[30vw] top-[60vh] h-[50vh] w-[48vw] rounded-full bg-[radial-gradient(circle,rgba(126,37,48,0.035),transparent_60%)] blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.035] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22120%22%20viewBox%3D%220%200%20120%20120%22%3E%3Cpath%20d%3D%22M60%2020c0%2022-18%2040-40%2040%2022%200%2040%2018%2040%2040%200-22%2018-40%2040-40-22%200-40-18-40-40z%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2260%22%20r%3D%228%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%220.4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:120px_120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_38%,rgba(126,37,48,0.10)_100%)]" />
      </div>
      <Navbar navLinks={navLinks} />
      <main id={site.anchors.main}>{children}</main>
      <Footer services={services} settings={settings} />
      <FloatingWhatsApp settings={settings} />
      <ChatWidget chat={chatPublic} waNumber={settings.whatsappNumber || getWaNumber()} />
    </>
  );
}
