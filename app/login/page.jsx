import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";
import { site } from "@/data/site";

export const metadata = {
  title: site.adminLogin.title,
  robots: { index: false, follow: false }
};

const corners = [
  "left-0 top-0",
  "right-0 top-0 -scale-x-100",
  "bottom-0 left-0 -scale-y-100",
  "bottom-0 right-0 -scale-x-100 -scale-y-100"
];

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-clip bg-ivory px-4 py-28 sm:py-36">
      {corners.map((pos) => (
        <div
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute ${pos} w-44 opacity-25 sm:w-64 [mask-image:radial-gradient(closest-side,black_65%,transparent)]`}
        >
          <img src={site.flower} alt="" draggable={false} className="h-auto w-full select-none" />
        </div>
      ))}

      <div className="relative flex w-full max-w-sm flex-col items-center">
        <span className="inline-flex rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] ring-[3px] ring-gold ring-offset-4 ring-offset-ivory">
          <Image
            src={site.logo}
            alt={site.logoAlt}
            width={88}
            height={88}
            priority
            className="h-[88px] w-[88px] rounded-full object-cover"
          />
        </span>
        <p className="mt-4 text-center font-tagline text-2xl font-bold text-plum">
          {site.tagline}
        </p>
        <div className="mt-6 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
