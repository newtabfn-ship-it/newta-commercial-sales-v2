import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function requireEnquiryAdmin(
  findAdmin?: (id: string) => Promise<{ role?: unknown; active?: unknown } | null>,
): Promise<NextResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const id = (session.user as { id?: unknown } | undefined)?.id;
    if (typeof id !== "string" || !/^[0-9a-f]{24}$/i.test(id)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    let admin: { role?: unknown; active?: unknown } | null;
    if (findAdmin) {
      admin = await findAdmin(id);
    } else {
      await connectDB();
      admin = await User.findOne({ _id: id }).select("role active").lean<{ role?: unknown; active?: unknown }>();
    }
    if (admin?.role !== "admin" || admin.active !== true) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return null;
  } catch {
    console.error("Failed to verify enquiry administrator.");
    return NextResponse.json(
      { error: "Failed to verify administrator access." },
      { status: 500 }
    );
  }
}
