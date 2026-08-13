import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function main() {
  const { default: connectDB } = await import("../lib/mongodb");
  const { default: Equipment } = await import("../models/Equipment");

  await connectDB();
  
type Classification = {
  category: string;
  subcategory: string;
};

function classifyEquipment(
  title: string,
  oldCategory: string
): Classification | null {
  const text = `${title} ${oldCategory}`.toLowerCase();

  // Already using the new structure
  if (
    [
      "commercial vehicles",
      "machinery & plant",
      "trailers",
    ].includes(oldCategory.toLowerCase())
  ) {
    return null;
  }

  // COMMERCIAL VEHICLES

  if (
    text.includes("cement mixer") ||
    text.includes("concrete mixer")
  ) {
    return {
      category: "Commercial Vehicles",
      subcategory: "Cement Mixer Trucks",
    };
  }

  if (
    text.includes("water tanker") ||
    text.includes("water truck") ||
    text.includes("tanker")
  ) {
    return {
      category: "Commercial Vehicles",
      subcategory: "Tanker / Water Trucks",
    };
  }

  if (
    text.includes("crane truck") ||
    text.includes("truck crane")
  ) {
    return {
      category: "Commercial Vehicles",
      subcategory: "Crane Trucks",
    };
  }

  if (
    text.includes("truck tractor") ||
    text.includes("prime mover") ||
    text.includes("tractor unit")
  ) {
    return {
      category: "Commercial Vehicles",
      subcategory: "Truck Tractors",
    };
  }

  if (
    oldCategory === "Truck" ||
    text.includes(" truck") ||
    text.endsWith("truck")
  ) {
    return {
      category: "Commercial Vehicles",
      subcategory: "Trucks",
    };
  }

  if (
    oldCategory === "Bakkie" ||
    text.includes("bakkie") ||
    text.includes("pickup")
  ) {
    return {
      category: "Commercial Vehicles",
      subcategory: "Bakkies",
    };
  }

  if (
    oldCategory === "Bus" ||
    text.includes(" bus")
  ) {
    return {
      category: "Commercial Vehicles",
      subcategory: "Buses",
    };
  }

  // TRAILERS

  if (
    text.includes("side tipper") ||
    text.includes("side-tipper")
  ) {
    return {
      category: "Trailers",
      subcategory: "Side Tipper Trailers",
    };
  }

  if (
    oldCategory === "Trailer" ||
    text.includes("trailer")
  ) {
    return {
      category: "Trailers",
      subcategory: "Trailers",
    };
  }

  // MACHINERY & PLANT

  if (
    text.includes("excavator") ||
    text.includes("digger")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Excavators",
    };
  }

  if (
    text.includes("crusher") ||
    text.includes("screening plant") ||
    text.includes("screen plant") ||
    text.includes("jaw crusher") ||
    text.includes("cone crusher")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Mobile Crushers",
    };
  }

  if (
    oldCategory === "Mining Equipment" ||
    text.includes("mining")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Mining Equipment",
    };
  }

  if (
    oldCategory === "Agricultural Equipment" ||
    text.includes("tractor") ||
    text.includes("agricultural") ||
    text.includes("farm equipment")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Agricultural Equipment",
    };
  }

  if (
    oldCategory === "Forklift" ||
    text.includes("forklift")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Forklifts",
    };
  }

  if (
    oldCategory === "Compressor" ||
    text.includes("compressor")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Compressors",
    };
  }

  if (
    text.includes("crane") ||
    text.includes("mobile crane")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Cranes",
    };
  }

  if (
    oldCategory === "Plant Equipment" ||
    text.includes("plant")
  ) {
    return {
      category: "Machinery & Plant",
      subcategory: "Plant Equipment",
    };
  }

  // Anything uncertain is deliberately left alone.
  return null;
}

  const equipment = await Equipment.find().sort({
    createdAt: 1,
  });

  console.log("");

  console.log("==========================================");
  console.log("NEWTA EQUIPMENT CATEGORY CLASSIFICATION");
  console.log("==========================================");
  console.log(`Total listings found: ${equipment.length}`);
  console.log("");

  let updated = 0;
  let skipped = 0;

  for (const item of equipment) {
    const title = item.title ?? "";
    const oldCategory = item.category ?? "";
    const existingSubcategory = item.subcategory ?? "";

    // Do not touch listings already classified.
    if (existingSubcategory.trim()) {
      console.log(
        `SKIP   ${item.referenceNumber} | ${title} | already has subcategory: ${existingSubcategory}`
      );

      skipped++;
      continue;
    }

    const classification = classifyEquipment(
      title,
      oldCategory
    );

    if (!classification) {
      console.log(
        `REVIEW ${item.referenceNumber} | ${title} | current category: ${oldCategory}`
      );

      skipped++;
      continue;
    }

    item.category = classification.category;
    item.subcategory = classification.subcategory;

    await item.save();

    console.log(
      `UPDATE ${item.referenceNumber} | ${title}`
    );

    console.log(
      `       ${oldCategory} → ${classification.category} / ${classification.subcategory}`
    );

    updated++;
  }

  console.log("");
  console.log("==========================================");
  console.log("RESULT");
  console.log("==========================================");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped / needs review: ${skipped}`);
  console.log(`Total checked: ${equipment.length}`);
  console.log("==========================================");
  console.log("");
}

main()
  .then(() => {
    console.log("Classification complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("");
    console.error("Classification failed:");
    console.error(error);
    process.exit(1);
  });