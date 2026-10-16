import { NextResponse } from "next/server";
import { admitDatabaseMutation } from "@/lib/databaseWritePause";

import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { requireEnquiryWritesAllowed, enquiryWriteFailure } from "@/lib/enquiryMaintenance";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const enquiry = await Enquiry.findById(id);

  if (!enquiry) {
    return NextResponse.json(
      { error: "Enquiry not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(enquiry);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let release: (() => void) | undefined;
  try {
    release = admitDatabaseMutation();
    requireEnquiryWritesAllowed();
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    requireEnquiryWritesAllowed();
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    return enquiryWriteFailure(error, "The enquiry update could not be confirmed. Please try again shortly.",
      "The enquiry was not updated because updates are temporarily paused. Please try again shortly.");
  }
  finally { release?.(); }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let release: (() => void) | undefined;
  try {
    release = admitDatabaseMutation();
    requireEnquiryWritesAllowed();
    await connectDB();

    const { id } = await params;

    requireEnquiryWritesAllowed();
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return enquiryWriteFailure(error, "The enquiry deletion could not be confirmed. Please try again shortly.",
      "The enquiry was not deleted because updates are temporarily paused. Please try again shortly.");
  }
  finally { release?.(); }
}
