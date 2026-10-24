import Reveal from "./Reveal";
import SectionDivider from "./SectionDivider";

// Shared section heading: floral motif, Cinzel caps title, Montserrat intro.
// `as` lets a page use it for its single h1. `tone` is accepted for
// backwards compatibility — every public section now sits on black.
export default function SectionHeading({
  id,
  heading,
  intro,
  center = true,
  divider = true,
  as: Tag = "h2"
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      {divider ? (
        <div className={`flex ${center ? "justify-center" : "justify-start"}`}>
          <SectionDivider align={center ? "center" : "left"} />
        </div>
      ) : null}

      <Tag
        id={id}
        className={`${divider ? "mt-7" : ""} font-heading text-[clamp(1.75rem,4.2vw,2.75rem)] leading-[1.14] text-paper`}
      >
        {heading}
      </Tag>

      {intro ? (
        <p
          className={`mt-5 max-w-xl text-[14px] font-normal leading-[1.9] text-paper/60 sm:text-[15px] ${
            center ? "mx-auto" : ""
          }`}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
