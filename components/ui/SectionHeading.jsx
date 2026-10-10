import Reveal from "./Reveal";
import SectionDivider from "./SectionDivider";

// Shared section heading: floral partition, Dancing Script title, intro — centered.
export default function SectionHeading({ id, heading, intro, tone = "dark", center = true, divider = true }) {
  const headingCls = tone === "light" ? "text-gold-soft" : "text-plum";
  const introCls = tone === "light" ? "text-ivory/85" : "text-ink/80";
  return (
    <Reveal>
      {divider ? <SectionDivider align={center ? "center" : "left"} /> : null}
      <h2 id={id} className={`mt-4 font-tagline text-4xl font-bold sm:text-5xl ${headingCls} ${center ? "text-center" : ""}`}>
        {heading}
      </h2>
      {intro ? <p className={`mt-3 max-w-2xl text-base leading-relaxed ${introCls} ${center ? "mx-auto text-center" : ""}`}>{intro}</p> : null}
    </Reveal>
  );
}
