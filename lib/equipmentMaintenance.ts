import { requireDatabaseWritesAllowed, DatabaseWritesPausedError } from "./databaseWritePause";
export function requireEquipmentWritesAllowed(configuration: unknown = process.env.NEWTA_EQUIPMENT_WRITES_PAUSED) {
  requireDatabaseWritesAllowed();
  if (configuration === undefined || configuration === "false") return;
  throw new DatabaseWritesPausedError();
}
