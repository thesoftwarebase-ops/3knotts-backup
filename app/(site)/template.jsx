// Nested inside the (site) layout, so each public page enters while the
// navbar, footer and floating button stay put. Motion lives in globals.css
// and settles instantly for reduced-motion users.
export default function SiteTemplate({ children }) {
  return <div className="page-enter">{children}</div>;
}
