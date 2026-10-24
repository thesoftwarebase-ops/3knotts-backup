import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { site } from "@/data/site";
import { getServices, getContent } from "@/lib/content";

// Marketing chrome: nav, footer and floating button live here,
// so private routes like /login render bare.
export default async function SiteLayout({ children }) {
  const [services, clients] = await Promise.all([getServices(), getContent("clients")]);
  const navLinks = clients.visible === false
    ? site.nav.filter((l) => l.href !== "/clients")
    : site.nav;
  return (
    <>
      {/* Site canvas — ember and gold washes over pure black, a whisper of
          blueprint grid and a vignette. Fixed behind everything so every
          section shares one continuous, slowly drifting field. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-noir">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(210,174,144,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(210,174,144,0.028)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(ellipse_at_50%_28%,black,transparent_82%)]" />
        <div className="ambient-drift absolute -left-[18vw] -top-[22vh] h-[62vh] w-[62vw] rounded-full bg-[radial-gradient(circle,rgba(232,80,64,0.05),transparent_62%)] blur-[110px]" />
        <div className="ambient-drift-slow absolute -right-[16vw] top-[46vh] h-[58vh] w-[54vw] rounded-full bg-[radial-gradient(circle,rgba(252,204,48,0.03),transparent_65%)] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_38%,rgba(0,0,0,0.72)_100%)]" />
      </div>
      <Navbar navLinks={navLinks} />
      <main id={site.anchors.main}>{children}</main>
      <Footer services={services} />
      <FloatingWhatsApp />
    </>
  );
}
