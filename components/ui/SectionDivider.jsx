import { site } from "@/data/site";

// The studio's floral partition, held small between two gold hairlines.
// It is the signature motif, so it appears once per heading — never as
// a page-wide band.
export default function SectionDivider({ align = "left", className = "" }) {
  const centered = align === "center";
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-4 ${centered ? "justify-center" : "justify-start"} ${className}`}
    >
      <span className={`h-px bg-gradient-to-r from-transparent to-frame/50 ${centered ? "w-16 sm:w-28" : "w-10 sm:w-14"}`} />
      <img
        src={site.divider}
        alt=""
        draggable={false}
        loading="lazy"
        className="h-auto w-60 shrink-0 select-none sm:w-80 lg:w-[26rem]"
      />
      <span className={`h-px bg-gradient-to-l from-transparent to-frame/50 ${centered ? "w-16 sm:w-28" : "w-10 sm:w-14"}`} />
    </div>
  );
}
