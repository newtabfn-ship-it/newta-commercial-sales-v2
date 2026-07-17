import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

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
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const updatedEquipment = await Equipment.findByIdAndUpdate(
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
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update equipment." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    await equipment.save();

    return NextResponse.json({
      success: true,
      equipment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update equipment status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const equipment = await Equipment.findByIdAndDelete(id);

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
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete equipment." },
      { status: 500 }
    );
  }
}