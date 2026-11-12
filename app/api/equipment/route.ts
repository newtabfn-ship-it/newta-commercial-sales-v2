import { NextResponse } from "next/server";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { createEquipmentSlug } from "@/lib/slugify";
import { equipmentPublication, equipmentWriteFields, validateEquipmentClassification } from "@/lib/equipmentPublishing";

export async function GET() {
  try {
    await connectDB();

    const equipment = await Equipment.find()
  .sort({ createdAt: -1 })
  .lean();
  
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
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
    await connectDB();

    const body = equipmentWriteFields(await request.json().catch(() => null));
    if (!body || typeof body.title !== "string" || !body.title.trim() ||
      typeof body.referenceNumber !== "string" || !body.referenceNumber.trim() ||
      typeof body.price !== "string" || !body.price.trim() ||
      (body.status !== undefined && body.status !== "Available" && body.status !== "Sold")) {
      return NextResponse.json({ error: "Enter a valid title, reference, price and status." }, { status: 400 });
    }
    const error = validateEquipmentClassification(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

   const slug = createEquipmentSlug(
  body.title,
  body.referenceNumber
);
    if (!slug || !/[a-z0-9]/.test(slug)) {
      return NextResponse.json({ error: "Title or reference must produce a valid URL." }, { status: 400 });
    }

const equipment = await Equipment.create({
  ...body,
  slug,
});

    return NextResponse.json({ ...equipment.toObject(), publication: equipmentPublication(equipment) }, {
      status: 201,
    });

  } catch (error) {
    console.error(error);
    if ((error as { code?: number })?.code === 11000) {
      return NextResponse.json({ error: "The reference or listing URL already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create equipment." }, { status: 500 });
  }
}

