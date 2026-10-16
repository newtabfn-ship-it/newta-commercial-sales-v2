import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { databasePauseStatus } from "@/lib/databaseWritePause";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const id = (session?.user as { id?: unknown } | undefined)?.id;
    if (typeof id !== "string" || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers });
    }
    await connectDB();
    const account = await User.findById(id).select("_id role active disabled").lean();
    if (!account || String(account._id) !== id || account.role !== "admin" || account.active !== true ||
        (account.disabled !== undefined && account.disabled !== false)) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers });
    }
    return NextResponse.json(databasePauseStatus(), { headers });
  } catch {
    return NextResponse.json({ code: "STATUS_UNAVAILABLE" }, { status: 503, headers });
  }
}
