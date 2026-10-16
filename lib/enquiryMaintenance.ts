import { NextResponse } from "next/server";
import { ENQUIRY_PAUSED_MESSAGE } from "./enquirySubmission";
import { requireDatabaseWritesAllowed, DatabaseWritesPausedError, markDatabaseWriteOutcomeUnknown } from "./databaseWritePause";

export class EnquiryWritesPausedError extends Error {}

export function requireEnquiryWritesAllowed(
  configuration: unknown = process.env.NEWTA_ENQUIRY_WRITES_PAUSED
): void {
  requireDatabaseWritesAllowed();
  if (configuration === undefined || configuration === "false") return;
  // True and every malformed value fail closed. No client override or implicit queue.
  throw new EnquiryWritesPausedError();
}

export function enquiryWriteFailure(error: unknown, fallback: string, pausedMessage = ENQUIRY_PAUSED_MESSAGE) {
  if (error instanceof EnquiryWritesPausedError || error instanceof DatabaseWritesPausedError) {
    return NextResponse.json(
      { saved: false, code: "ENQUIRY_WRITES_PAUSED", error: pausedMessage },
      { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } }
    );
  }
  markDatabaseWriteOutcomeUnknown();
  return NextResponse.json(
    { code: "ENQUIRY_WRITE_UNCONFIRMED", error: fallback },
    { status: 500, headers: { "Cache-Control": "no-store" } }
  );
}
