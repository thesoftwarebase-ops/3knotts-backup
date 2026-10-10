import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { site } from "@/data/site";
import { getServices } from "@/lib/content";

// Marketing chrome: nav, footer and floating button live here,
// so private routes like /login render bare.
export default async function SiteLayout({ children }) {
  const services = await getServices();
  return (
    <>
      <Navbar />
      <main id={site.anchors.main}>{children}</main>
      <Footer services={services} />
      <FloatingWhatsApp />
    </>
  );
}
