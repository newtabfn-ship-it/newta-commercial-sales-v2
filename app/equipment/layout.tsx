import type { ReactNode } from "react";

// Catalogue pages read current inventory on each request.
export const dynamic = "force-dynamic";

export default function EquipmentLayout({ children }: { children: ReactNode }) {
  return children;
}
