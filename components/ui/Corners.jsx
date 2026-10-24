// Four hairline ticks that frame a block like a printed plate.
// Purely decorative; sits above its parent's background, below content.
export default function Corners({ className = "", size = "h-5 w-5", tone = "border-frame/30" }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-4 ${className}`}>
      <span className={`absolute left-0 top-0 ${size} border-l border-t ${tone}`} />
      <span className={`absolute right-0 top-0 ${size} border-r border-t ${tone}`} />
      <span className={`absolute bottom-0 left-0 ${size} border-b border-l ${tone}`} />
      <span className={`absolute bottom-0 right-0 ${size} border-b border-r ${tone}`} />
    </span>
  );
}
