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
      <Navbar navLinks={navLinks} />
      <main id={site.anchors.main}>{children}</main>
      <Footer services={services} />
      <FloatingWhatsApp />
    </>
  );
}
