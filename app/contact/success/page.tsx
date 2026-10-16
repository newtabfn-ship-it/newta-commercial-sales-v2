import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SuccessPage() {
  return (
    <>
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-32 text-center">

        <div className="rounded-2xl bg-white p-12 shadow-xl">

          <div className="text-6xl">
            ✉️
          </div>

          <h1 className="mt-6 text-4xl font-bold text-[#0B2F24]">
            Contact NEWTA
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Please use our enquiry form. It will confirm when your enquiry has been saved.
          </p>

          <Link
            href="/contact"
            className="mt-10 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B2F24]"
          >
            Open Enquiry Form
          </Link>

        </div>

      </section>

      <Footer />
    </>
  );
}
