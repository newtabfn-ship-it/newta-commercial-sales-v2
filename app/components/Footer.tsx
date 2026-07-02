export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-3xl font-bold text-[#D4AF37]">
            NEWTA
          </h2>

          <p className="text-gray-400 mt-2">
            Commercial Sales
          </p>

          <p className="text-gray-500 mt-6">
            South Africa's trusted marketplace for quality construction,
            mining, agricultural and commercial equipment.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Equipment</li>
            <li>Sold</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">
            Categories
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Excavators</li>
            <li>Loaders</li>
            <li>Dozers</li>
            <li>Trucks</li>
            <li>Mining Equipment</li>
          </ul>
        </div>

        <div>
         <div>
  <h3 className="font-bold mb-4">
    Contact
  </h3>

  <p className="text-gray-400">
    NEWTA Commercial Sales
  </p>

  <p className="text-gray-400 mt-2">
    South Africa
  </p>

  <p className="text-gray-400 mt-2">
    newtabfn@gmail.com
  </p>

  <p className="text-gray-400 mt-2">
    +27 61 015 6516
  </p>
</div>
      </div>

</div>
      <div className="border-t border-zinc-700 mt-12 pt-8 text-center text-gray-500">
        © 2011 NEWTA Commercial Sales. All Rights Reserved.
      </div>
    </footer>
  );
}