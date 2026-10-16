// Process-local admission and drain accounting. Never a fleet-wide attestation.
export class DatabaseWritesPausedError extends Error {
  constructor() { super("Database updates are temporarily paused. Please try again shortly."); }
}

type State = { active: number; uncertain: number; bootId?: string };
declare global { var newtaDatabaseWriteState: State | undefined; }
const state = globalThis.newtaDatabaseWriteState ??= { active: 0, uncertain: 0 };

// A rejected driver promise can follow a committed or still-running server write.
// Never clear this latch automatically or equate process restart with reconciliation.
export function markDatabaseWriteOutcomeUnknown() { state.uncertain++; }

export function databaseWriteMode(value: unknown = process.env.NEWTA_DATABASE_WRITES_PAUSED) {
  if (value === undefined || value === "false") return "OPEN";
  if (value === "true") return "PAUSED";
  return "INVALID";
}

export function requireDatabaseWritesAllowed() {
  if (databaseWriteMode() !== "OPEN") throw new DatabaseWritesPausedError();
}

// Admission and increment are synchronous: no await may occur between them.
// Hold the lease across the entire handler, including transaction callback retries.
export function admitDatabaseMutation(): () => void {
  requireDatabaseWritesAllowed();
  state.active++;
  let released = false;
  return () => { if (!released) { released = true; state.active--; } };
}

const label = (value: unknown): value is string =>
  typeof value === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(value);

export function databasePauseStatus() {
  state.bootId ??= globalThis.crypto?.randomUUID();
  const mode = databaseWriteMode();
  const pauseId = process.env.NEWTA_DATABASE_PAUSE_ID;
  const revision = process.env.NEWTA_APPLICATION_REVISION;
  const identityValid = label(state.bootId) && label(pauseId) && label(revision);
  return {
    scope: "PROCESS_ONLY" as const,
    instanceId: label(state.bootId) ? state.bootId : null,
    pauseId: label(pauseId) ? pauseId : null,
    revision: label(revision) ? revision : null,
    mode, activeMutations: state.active, uncertainMutations: state.uncertain, observedAt: Date.now(),
    locallyIdle: identityValid && mode === "PAUSED" && state.active === 0 && state.uncertain === 0,
    fleetDrain: "NOT_VERIFIED" as const,
    captureAuthorized: false as const,
  };
}

