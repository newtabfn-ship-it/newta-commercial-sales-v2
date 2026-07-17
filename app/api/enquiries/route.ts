import { Resend } from "resend";

import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Enquiry from "@/models/Enquiry";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await connectDB();

    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(enquiries);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load enquiries.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const enquiry = await Enquiry.create({
      equipmentId: body.equipmentId,
      equipmentTitle: body.equipmentTitle,
      referenceNumber: body.referenceNumber,

      name: body.name,
      company: body.company,
      phone: body.phone,
      email: body.email,
      province: body.province,
      message: body.message,

      status: "New",
    });

    try {
  await resend.emails.send({
    from: "NEWTA <onboarding@resend.dev>",
    to: "newtabfn@gmail.com",
    subject: "NEWTA - New Enquiry",
    text: "You have a new enquiry.\n\nPlease log in to the NEWTA Admin Portal.",
  });
} catch (emailError) {
  console.error("Failed to send notification email:", emailError);
}

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create enquiry.",
      },
      {
        status: 500,
      }
    );
  }
}