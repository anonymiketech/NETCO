import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import path from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  console.warn("Supabase storage: missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export const BUCKET = "config-files";

export async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

export async function uploadConfigFile(
  buffer: Buffer,
  originalName: string
): Promise<{ filename: string; originalName: string; fileSize: number }> {
  await ensureBucket();
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${randomUUID()}${ext}`;
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return { filename, originalName, fileSize: buffer.byteLength };
}

export async function downloadConfigFile(filename: string): Promise<Buffer> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .download(filename);
  if (error) throw new Error(`Storage download failed: ${error.message}`);
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function deleteConfigFile(filename: string): Promise<void> {
  await supabaseAdmin.storage.from(BUCKET).remove([filename]);
}
