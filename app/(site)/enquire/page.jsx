import EnquiryForm from "@/components/home/EnquiryForm";
import CtaBand from "@/components/ui/CtaBand";
import { site } from "@/data/site";
import { getContactGmail } from "@/lib/email";

export const metadata = {
  title: site.sections.enquire.heading,
  description: site.sections.enquire.intro
};

// `revalidate` lets a freshly saved business Gmail address appear on
// the contact panel within a minute of saving it in the dashboard.
export const revalidate = 60;

export default async function EnquirePage() {
  const contactEmail = await getContactGmail();
  return (
    <div className="pt-10 sm:pt-14">
      <EnquiryForm contactEmail={contactEmail} />
      <CtaBand />
    </div>
  );
}
