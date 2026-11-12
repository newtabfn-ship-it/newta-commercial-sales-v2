import { NextResponse } from "next/server";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { createEquipmentSlug } from "@/lib/slugify";
import { equipmentPublication, equipmentWriteFields, validateEquipmentClassification } from "@/lib/equipmentPublishing";

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
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
    await connectDB();

    const { id } = await params;

    const body = equipmentWriteFields(await request.json().catch(() => null));
    if (!body || ["title", "referenceNumber", "price"].some((key) =>
      Object.hasOwn(body, key) && (typeof body[key] !== "string" || !String(body[key]).trim())
    ) || (Object.hasOwn(body, "status") && body.status !== "Available" && body.status !== "Sold")) {
      return NextResponse.json({ error: "Enter valid equipment details." }, { status: 400 });
    }
    const existing = await Equipment.findById(id).lean();
    if (!existing) return NextResponse.json({ error: "Equipment not found." }, { status: 404 });

    const classification = {
      category: Object.hasOwn(body, "category") ? body.category : existing.category,
      subcategory: Object.hasOwn(body, "subcategory") ? body.subcategory : existing.subcategory,
      trailerType: Object.hasOwn(body, "trailerType") ? body.trailerType : existing.trailerType,
    };
    const error = validateEquipmentClassification(classification, existing);
    if (error) return NextResponse.json({ error }, { status: 400 });

    if (!existing.slug) {
      const slug = createEquipmentSlug(String(body.title ?? existing.title), String(body.referenceNumber ?? existing.referenceNumber));
      if (!/[a-z0-9]/.test(slug)) return NextResponse.json({ error: "Title or reference must produce a valid URL." }, { status: 400 });
      body.slug = slug;
    }

    const updatedEquipment =
      await Equipment.findOneAndUpdate(
        {
          _id: id,
          category: existing.category,
          subcategory: existing.subcategory ?? null,
          trailerType: existing.trailerType ?? null,
          slug: existing.slug ?? null,
        },
        { $set: body },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedEquipment) {
      return NextResponse.json(
        { error: "The listing changed while you were editing. Reload it and try again." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ...updatedEquipment.toObject(),
      publication: equipmentPublication(updatedEquipment),
    });
  } catch (error) {
    console.error(error);
    if ((error as { code?: number })?.code === 11000) {
      return NextResponse.json({ error: "The reference or listing URL already exists." }, { status: 409 });
    }

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
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json().catch(() => null);
    const status = body?.status;
    if (status !== "Available" && status !== "Sold") {
      return NextResponse.json({ error: "Select Available or Sold." }, { status: 400 });
    }

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found." },
        { status: 404 }
      );
    }

    equipment.status = status;

    if (status === "Available" && !equipment.slug) {
      return NextResponse.json(
        { error: "Edit and save this listing to generate its public URL before marking it available." },
        { status: 400 }
      );
    }

    await equipment.save();

    return NextResponse.json({
      success: true,
      equipment,
      publication: equipmentPublication(equipment),
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
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;

  try {
    await connectDB();

    const { id } = await params;

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
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete equipment." },
      { status: 500 }
    );
  }
}
