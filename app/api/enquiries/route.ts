import { Resend } from "resend";

import { NextResponse } from "next/server";

import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import connectDB from "@/lib/mongodb";

import Enquiry from "@/models/Enquiry";

export async function GET() {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
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

    const recipient = process.env.NEWTA_ENQUIRY_ADMIN_EMAIL?.trim();
    const validRecipient = /^[a-z0-9_+%-]+(?:\.[a-z0-9_+%-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (!recipient || recipient.length > 254 || !validRecipient.test(recipient)) {
      console.warn("Enquiry saved; administrator notification recipient is missing or invalid.");
    } else {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: "NEWTA <enquiries@newtacommercialsales.com>",
          to: recipient,
          subject: "NEWTA - New Enquiry",
          text: "You have a new enquiry.\n\nPlease log in to the NEWTA Admin Portal.",
        });
        if (error) {
          console.warn("Enquiry saved; notification delivery was not confirmed.");
        }
      } catch {
        console.warn("Enquiry saved; notification delivery was not confirmed.");
      }
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