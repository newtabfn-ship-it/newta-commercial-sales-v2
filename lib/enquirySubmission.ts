// Shared customer messages; no server configuration or personal data is exposed.
export const ENQUIRY_PAUSED_MESSAGE =
  "Your enquiry was not submitted because we are carrying out brief maintenance. Please keep this page open and try again shortly.";
export const ENQUIRY_UNCONFIRMED_MESSAGE =
  "We could not confirm that your enquiry was saved. Your details are still on this page. Please try again shortly. If you already received a confirmation, please avoid submitting it again.";

export async function submitEnquiry(
  payload: Record<string, unknown>,
  send: typeof fetch = fetch
): Promise<{ saved: boolean; message?: string }> {
  try {
    const response = await send("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (response.ok && result?.saved === true) return { saved: true };
    // Only the fixed, trusted maintenance contract states definitively "not submitted".
    if (response.status === 503 && result?.code === "ENQUIRY_WRITES_PAUSED") {
      return { saved: false, message: ENQUIRY_PAUSED_MESSAGE };
    }
  } catch {
    // A lost response can follow a successful write: never claim it definitely failed.
  }
  return { saved: false, message: ENQUIRY_UNCONFIRMED_MESSAGE };
}
