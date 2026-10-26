import "@fontsource/cinzel/latin-600.css";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-600.css";
import "./globals.css";

import SiteLoader from "@/components/ui/SiteLoader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import BusyOverlay from "@/components/ui/BusyOverlay";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { site } from "@/data/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.meta.title,
    template: `%s | ${site.name}`
  },
  description: site.meta.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.meta.ogTitle,
    description: site.meta.ogDescription,
    url: site.homeHref,
    images: [{ url: site.logo, width: 512, height: 512, alt: site.logoAlt }]
  },
  icons: {
    icon: site.logo
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  slogan: site.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.addressParts.street,
    addressLocality: site.addressParts.locality,
    postalCode: site.addressParts.postal,
    addressRegion: site.addressParts.region,
    addressCountry: site.addressParts.country
  },
  sameAs: [site.instagram],
  url: site.url,
  image: site.logo
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: site.faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a }
  }))
};

export default function RootLayout({ children }) {
  // Escape < so admin-managed copy can never break out of the JSON-LD blocks.
  const safe = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");
  return (
    <html lang={site.lang}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safe(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safe(faqJsonLd) }} />
        <a
          href={`#${site.anchors.main}`}
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-brand focus:px-5 focus:py-2 focus:text-noir"
        >
          {site.a11y.skip}
        </a>
        <Suspense fallback={null}>
          <SiteLoader />
          <SmoothScroll />
        </Suspense>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#2A0B10",
              color: "#F6F1E7",
              border: "1px solid rgba(210,174,144,0.35)",
              borderRadius: "4px"
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
