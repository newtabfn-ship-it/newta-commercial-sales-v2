import "dotenv/config";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { slugify } from "@/lib/slugify";

async function run() {
  await connectDB();

  const equipment = await Equipment.find();

  for (const item of equipment) {
    if (!item.slug) {
      item.slug = `${slugify(item.title)}-${slugify(
  item.referenceNumber
)}`;

      await item.save();

      console.log(`Added slug: ${item.slug}`);
    }
  }

  console.log("Done");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});