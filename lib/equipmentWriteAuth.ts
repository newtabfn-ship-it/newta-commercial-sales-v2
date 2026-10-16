import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import connectDB from "./mongodb";
import User from "../models/User";
import { isActiveAdmin, isAdminId } from "./adminAuthorization";
import { requireEquipmentWritesAllowed } from "./equipmentMaintenance";
export class EquipmentAuthorizationError extends Error {
  constructor(public readonly status: number) { super("Unauthorized."); }
}
export async function requireEquipmentAdmin() {
  requireEquipmentWritesAllowed();
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: unknown } | undefined)?.id;
  const expiry = session?.expires;
  if (!isAdminId(id) || (expiry !== undefined && (typeof expiry !== "string" ||
    !Number.isFinite(Date.parse(expiry)) || Date.parse(expiry) <= Date.now()))) throw new EquipmentAuthorizationError(401);
  await connectDB();
  const account = await User.findById(id).select("_id role active disabled").lean();
  if (!account || String(account._id) !== id) throw new EquipmentAuthorizationError(401);
  if (!isActiveAdmin(account)) throw new EquipmentAuthorizationError(403);
}
