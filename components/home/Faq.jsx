import SectionHeading from "../ui/SectionHeading";
import { site } from "@/data/site";

export default function Faq({ items }) {
  const t = site.faq;
  const list = items ?? t.items;
  return (
    <section aria-labelledby="faq-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="faq-heading" heading={t.heading} intro={t.intro} tone="dark" center divider={false} />

        <div className="mt-10 flex flex-col gap-4">
          {list.map((item, i) => (
            <details
              key={item.q}
              name="faq"
              className="group relative overflow-hidden rounded-2xl border border-gold/50 bg-ivory transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:shadow-[0_18px_44px_-20px_rgba(11,59,60,0.45)] open:border-gold open:bg-white open:shadow-[0_18px_44px_-20px_rgba(11,59,60,0.45)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-4 left-0 w-[3px] origin-top scale-y-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-y-100 group-open:scale-y-100"
              />
              <summary className="flex cursor-pointer list-none items-center gap-4 rounded px-5 py-4 pl-6 [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="font-tagline text-xl font-bold text-plum/60 transition-colors group-hover:text-plum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-tagline text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-teal-bright">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold text-2xl leading-none text-plum transition-all duration-300 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold group-hover:text-ink group-open:rotate-135 group-open:bg-gold group-open:text-ink"
                >
                  +
                </span>
              </summary>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="max-w-2xl px-5 pb-5 pl-6 text-[15px] leading-relaxed text-ink/80">
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
