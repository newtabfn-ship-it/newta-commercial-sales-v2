import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const { default: connectDB } = await import("../lib/mongodb");
  const { default: Equipment } = await import("../models/Equipment");

  await connectDB();

  const result = await Equipment.updateMany(
    {
      referenceNumber: {
        $in: [
          "Newta 2026-0016",
          "Newta 2026-0018",
        ],
      },
    },
    {
      $set: {
        category: "Commercial Vehicles",
        subcategory: "Crane Trucks",
      },
    }
  );

  console.log("Crane truck classifications updated.");
  console.log(`Matched: ${result.matchedCount}`);
  console.log(`Modified: ${result.modifiedCount}`);

  process.exit(0);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});