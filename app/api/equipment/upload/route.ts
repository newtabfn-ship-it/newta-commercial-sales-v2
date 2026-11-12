import { NextResponse } from "next/server";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "newta/equipment",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed." },
      { status: 500 }
    );
  }
}
