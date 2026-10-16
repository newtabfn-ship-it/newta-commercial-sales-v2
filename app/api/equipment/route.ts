import { admitDatabaseMutation, requireDatabaseWritesAllowed, DatabaseWritesPausedError, markDatabaseWriteOutcomeUnknown } from "@/lib/databaseWritePause";
import { requireEquipmentAdmin, EquipmentAuthorizationError } from "@/lib/equipmentWriteAuth";
import { requireEquipmentWritesAllowed } from "@/lib/equipmentMaintenance";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { createEquipmentSlug } from "@/lib/slugify";

export async function GET() {
  try {
    await connectDB();

    const equipment = await Equipment.find()
  .sort({ createdAt: -1 })
  .lean();
  
    return NextResponse.json(equipment);
  } catch {
    console.error("Equipment request failed.");

    return NextResponse.json(
      {
        error:
          "Failed to load equipment.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let release: (() => void) | undefined;
  try {
    release = admitDatabaseMutation();
    await requireEquipmentAdmin();
    await connectDB();

    const body = await request.json();

   const slug = createEquipmentSlug(
  body.title,
  body.referenceNumber
);

    requireDatabaseWritesAllowed();
    requireEquipmentWritesAllowed();
const equipment = await Equipment.create({
  ...body,
  slug,
});

    return NextResponse.json(equipment, {
      status: 201,
    });

  } catch (error) {
    if (error instanceof DatabaseWritesPausedError) return NextResponse.json({ error: error.message }, { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
    if (error instanceof EquipmentAuthorizationError) return NextResponse.json({ error: "Unauthorized." }, { status: error.status });
    markDatabaseWriteOutcomeUnknown();
    console.error("Equipment request failed.");

    return NextResponse.json(
      {
        error:
          "Failed to create equipment.",
      },
      {
        status: 500,
      }
    );
  } finally { release?.(); }
}

