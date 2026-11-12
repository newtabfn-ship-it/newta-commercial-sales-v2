import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EquipmentNotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-44">
        <h1 className="text-4xl font-bold text-[#0B2F24]">Listing Not Found</h1>
        <p className="mt-4">This asset may have been removed.</p>
        <Link href="/equipment" className="mt-6 inline-block font-semibold underline">
          Back to Equipment
        </Link>
      </main>
      <Footer />
    </>
  );
}
