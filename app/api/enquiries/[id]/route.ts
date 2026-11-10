import { NextResponse } from "next/server";

import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import Enquiry from "@/models/Enquiry";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

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
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;

    const body = await request.json();

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
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update enquiry." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;

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
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete enquiry." },
      { status: 500 }
    );
  }
}