import { site } from "@/data/site";
import SectionHeading from "../ui/SectionHeading";

// FAQ — hairline rows rather than cards. The plus turns into a cross, and
// the answer opens on a grid-rows transition (no JS, no layout jump).
export default function Faq({ items }) {
  const t = site.faq;
  const list = items ?? t.items;

  return (
    <section aria-labelledby="faq-heading" className="relative border-b border-frame/10 py-14 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_70%_-30%,rgba(252,204,48,0.03),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-48 w-[40%] bg-[radial-gradient(ellipse_at_0%_100%,rgba(232,80,64,0.025),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading id="faq-heading" heading={t.heading} intro={t.intro} divider={false} />

        <div className="mt-8 border-t border-frame/15">
          {list.map((item, i) => (
            <details key={item.q} name="faq" className="group relative border-b border-frame/15">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-gradient-to-b from-brand to-transparent transition-transform duration-500 group-open:scale-y-100"
              />
              <summary className="flex cursor-pointer list-none items-center gap-5 px-1 py-6 transition-colors duration-300 [&::-webkit-details-marker]:hidden sm:gap-6 sm:py-7">
                <span className="font-heading text-[10px] leading-none tracking-[0.2em] text-frame/45 transition-colors duration-300 group-hover:text-brand group-open:text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-heading text-[13px] leading-[1.5] text-paper transition-colors duration-300 group-hover:text-brand sm:text-[15px]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center border border-frame/25 text-base leading-none text-frame transition-all duration-500 group-hover:border-brand/60 group-hover:text-brand group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-noir"
                >
                  +
                </span>
              </summary>

              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="max-w-2xl px-1 pb-7 pl-[2.1rem] text-[13px] leading-[1.95] text-paper/55 sm:pl-[2.6rem] sm:text-[14px]">
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
