import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Commercial Vehicles, Machinery, Plant & Industrial Assets for Sale | NEWTA Commercial Sales",

  description:
    "NEWTA Commercial Sales specialises in commercial vehicles, bakkies, trucks, trailers, machinery, plant, industrial equipment, spares and business assets through private treaty sales across South Africa. Based in Bloemfontein and serving clients nationwide.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "Commercial Vehicles, Machinery & Industrial Assets | NEWTA Commercial Sales",

    description:
      "Commercial vehicles, trucks, bakkies, machinery, plant, spares and business assets available across South Africa.",

    url: "https://newtacommercialsales.com",

    images: ["/og-image.png"],
  },
};

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyChoose from "./components/WhyChoose";
import About from "./components/About";
import Services from "./components/Services";
import CallToAction from "./components/CallToAction";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyChoose />
      <About />
      <Services />
      <CallToAction />
      <Contact />
      <Footer />
    </>
  );
}
