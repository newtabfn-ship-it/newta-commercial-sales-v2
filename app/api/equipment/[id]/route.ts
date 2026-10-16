import { admitDatabaseMutation, requireDatabaseWritesAllowed, DatabaseWritesPausedError, markDatabaseWriteOutcomeUnknown } from "@/lib/databaseWritePause";
import { requireEquipmentAdmin, EquipmentAuthorizationError } from "@/lib/equipmentWriteAuth";
import { requireEquipmentWritesAllowed } from "@/lib/equipmentMaintenance";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { createEquipmentSlug } from "@/lib/slugify";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const equipment = await Equipment.findById(id);

  if (!equipment) {
    return NextResponse.json(
      { error: "Equipment not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(equipment);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let release: (() => void) | undefined;
  try {
    release = admitDatabaseMutation();
    await requireEquipmentAdmin();
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    if (body.title) {
      body.slug = createEquipmentSlug(
        body.title,
        body.referenceNumber
      );
    }

    requireDatabaseWritesAllowed();
    requireEquipmentWritesAllowed();
    const updatedEquipment =
      await Equipment.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedEquipment) {
      return NextResponse.json(
        { error: "Equipment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEquipment);
  } catch (error) {
    if (error instanceof DatabaseWritesPausedError) return NextResponse.json({ error: error.message }, { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
    if (error instanceof EquipmentAuthorizationError) return NextResponse.json({ error: "Unauthorized." }, { status: error.status });
    markDatabaseWriteOutcomeUnknown();
    console.error("Equipment request failed.");

    return NextResponse.json(
      { error: "Failed to update equipment." },
      { status: 500 }
    );
  } finally { release?.(); }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let release: (() => void) | undefined;
  try {
    release = admitDatabaseMutation();
    await requireEquipmentAdmin();
    await connectDB();

    const { id } = await params;

    const { status } = await request.json();

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found." },
        { status: 404 }
      );
    }

    equipment.status = status;

    requireDatabaseWritesAllowed();
    requireEquipmentWritesAllowed();
    await equipment.save();

    return NextResponse.json({
      success: true,
      equipment,
    });
  } catch (error) {
    if (error instanceof DatabaseWritesPausedError) return NextResponse.json({ error: error.message }, { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
    if (error instanceof EquipmentAuthorizationError) return NextResponse.json({ error: "Unauthorized." }, { status: error.status });
    markDatabaseWriteOutcomeUnknown();
    console.error("Equipment request failed.");

    return NextResponse.json(
      { error: "Failed to update equipment status." },
      { status: 500 }
    );
  } finally { release?.(); }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let release: (() => void) | undefined;
  try {
    release = admitDatabaseMutation();
    await requireEquipmentAdmin();
    await connectDB();

    const { id } = await params;

    requireDatabaseWritesAllowed();
    requireEquipmentWritesAllowed();
    const equipment =
      await Equipment.findByIdAndDelete(id);

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Equipment deleted successfully.",
    });
  } catch (error) {
    if (error instanceof DatabaseWritesPausedError) return NextResponse.json({ error: error.message }, { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
    if (error instanceof EquipmentAuthorizationError) return NextResponse.json({ error: "Unauthorized." }, { status: error.status });
    markDatabaseWriteOutcomeUnknown();
    console.error("Equipment request failed.");

    return NextResponse.json(
      { error: "Failed to delete equipment." },
      { status: 500 }
    );
  } finally { release?.(); }
}
