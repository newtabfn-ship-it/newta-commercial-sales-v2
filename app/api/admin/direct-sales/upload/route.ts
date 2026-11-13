import { randomUUID } from "node:crypto";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { privateJson, readBody } from "@/lib/directSalesApi";
import cloudinary from "@/lib/cloudinary";

const maxImageBytes = 3 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  const contentType = request.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("multipart/form-data;")) return privateJson({ error: "Select a photo to upload." }, 400);
  const body = await readBody(request, maxImageBytes + 65536);
  if (!body) return privateJson({ error: "Photo must be at most 3 MiB." }, 413);
  try {
    const file = (await new Response(body, { headers: { "Content-Type": contentType } }).formData()).get("file");
    if (!(file instanceof File) || !file.size || file.size > maxImageBytes ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return privateJson({ error: "Select a JPEG, PNG or WebP photo of at most 3 MiB." }, 400);
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const validImage = file.type === "image/jpeg" ? bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
      : file.type === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    if (!validImage) return privateJson({ error: "The file does not match its declared image format." }, 400);
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        public_id: `newta/direct-sales/${randomUUID()}`,
        resource_type: "image",
        overwrite: false,
      }, (error, data) => {
        if (error || !data) reject(new Error("Upload failed"));
        else resolve(data);
      }).end(bytes);
    });
    return privateJson({ url: result.secure_url, publicId: result.public_id });
  } catch {
    return privateJson({ error: "Could not upload the photo." }, 503);
  }
}
