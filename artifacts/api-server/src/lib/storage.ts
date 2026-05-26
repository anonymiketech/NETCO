import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import path from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  console.warn("Supabase storage: missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — file uploads/downloads will be unavailable");
}

export const BUCKET = "config-files";

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase credentials not configured. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export async function ensureBucket() {
  const admin = getSupabaseAdmin();
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await admin.storage.createBucket(BUCKET, { public: false });
  }
}

export async function uploadConfigFile(
  buffer: Buffer,
  originalName: string
): Promise<{ filename: string; originalName: string; fileSize: number }> {
  const admin = getSupabaseAdmin();
  await ensureBucket();
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${randomUUID()}${ext}`;
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return { filename, originalName, fileSize: buffer.byteLength };
}

export async function downloadConfigFile(filename: string): Promise<Buffer> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .download(filename);
  if (error) throw new Error(`Storage download failed: ${error.message}`);
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function deleteConfigFile(filename: string): Promise<void> {
  const admin = getSupabaseAdmin();
  await admin.storage.from(BUCKET).remove([filename]);
}
