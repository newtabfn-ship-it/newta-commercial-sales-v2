import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import EnquiryForm from "../components/EnquiryForm";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function ContactPage({
  searchParams,
}: Props) {
  const { id } = await searchParams;

  let equipment = null;

  if (id) {
    await connectDB();

    equipment = await Equipment.findById(id).lean();
  }
  return (
    <>
      <Navbar />

      {/* Hero */}

      <section className="bg-[#0B2F24] pt-44 pb-20 text-white">
        <div className="mx-auto max-w-7xl px-6">

          <span className="rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
            NEWTA Commercial Sales
          </span>

          <h1 className="mt-8 text-5xl font-extrabold">
            Enquire About Equipment
          </h1>

          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Complete the enquiry form below and one of our consultants
            will contact you shortly.
          </p>

        </div>
      </section>

     {/* Form */}

<section className="mx-auto max-w-4xl px-6 py-20">
  <div className="rounded-2xl bg-white p-10 shadow-xl">

    <h2 className="mb-8 text-3xl font-bold text-[#0B2F24]">
      Equipment Enquiry
    </h2>

    <EnquiryForm
      equipment={
        equipment
          ? {
              _id: equipment._id.toString(),
              title: equipment.title,
              referenceNumber: equipment.referenceNumber,
              status: equipment.status,
            }
          : null
      }
    />

  </div>
</section>

      <Footer />
    </>
  );
}