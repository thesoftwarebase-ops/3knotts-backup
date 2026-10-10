import { site } from "@/data/site";

export const metadata = {
  title: site.dashboard.title,
  robots: { index: false, follow: false }
};

export default function DashboardLayout({ children }) {
  return children;
}
