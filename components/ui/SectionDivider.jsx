import { site } from "@/data/site";

// Floral partition marking the beginning of each section:
// a gold rule, the artwork, a gold rule.
// align: "left" (default) or "center".
export default function SectionDivider({ align = "left", className = "" }) {
  const centered = align === "center";
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-4 ${centered ? "justify-center" : "justify-start"} ${className}`}
    >
      <span className={`h-px bg-gradient-to-r from-transparent to-gold/80 ${centered ? "w-16 sm:w-28" : "w-10"}`} />
      <img
        src={site.divider}
        alt=""
        draggable={false}
        loading="lazy"
        className="h-auto w-44 select-none sm:w-52"
      />
      <span className={`h-px bg-gradient-to-l from-transparent to-gold/80 ${centered ? "w-16 sm:w-28" : "w-10"}`} />
    </div>
  );
}
