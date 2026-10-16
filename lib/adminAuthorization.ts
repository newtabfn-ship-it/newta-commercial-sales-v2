// Explicit stored values only: missing fields must not inherit schema defaults.
export function isAdminId(value: unknown): value is string {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
}

export function isActiveAdmin(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const account = value as { role?: unknown; active?: unknown; disabled?: unknown };
  return account.role === "admin" && account.active === true &&
    (account.disabled === undefined || account.disabled === false);
}
