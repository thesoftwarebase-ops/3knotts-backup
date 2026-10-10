import EnquiryForm from "@/components/home/EnquiryForm";
import CtaBand from "@/components/ui/CtaBand";
import { site } from "@/data/site";

export const metadata = {
  title: site.sections.enquire.heading,
  description: site.sections.enquire.intro
};

export default function EnquirePage() {
  return (
    <div className="pt-10 sm:pt-14">
      <EnquiryForm />
      <CtaBand />
    </div>
  );
}
