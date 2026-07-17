import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

export async function GET() {
  try {
    await connectDB();

    const equipment = await Equipment.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load equipment.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const equipment = await Equipment.create(body);

    return NextResponse.json(equipment, {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

