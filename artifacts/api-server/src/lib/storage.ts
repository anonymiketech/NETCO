import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const useSupabase = Boolean(supabaseUrl && serviceRoleKey);

// Local fallback directory — persists on Replit disk
const LOCAL_DIR = path.resolve(process.cwd(), "uploads");
if (!useSupabase) {
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
  console.warn("⚠️  Supabase storage not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) — using local disk storage at ./uploads/");
} else {
  console.log("[v0] Supabase storage configured and enabled");
}

export const BUCKET = "vpn-configs";

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

async function ensureBucket() {
  const admin = getSupabaseAdmin();
  try {
    const { data: buckets, error: listError } = await admin.storage.listBuckets();
    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      const { error: createError } = await admin.storage.createBucket(BUCKET, { public: false });
      if (createError) {
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }
      console.log(`[v0] Created Supabase storage bucket: ${BUCKET}`);
    }
  } catch (err) {
    console.error("[v0] Bucket ensure error:", err);
    throw err;
  }
}

export async function uploadConfigFile(
  buffer: Buffer,
  originalName: string,
): Promise<{ filename: string; originalName: string; fileSize: number; fileUrl: string | null }> {
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${randomUUID()}${ext}`;
  let fileUrl: string | null = null;

  try {
    if (useSupabase) {
      console.log("[v0] Uploading to Supabase:", { filename, size: buffer.byteLength });
      await ensureBucket();
      const { data, error } = await getSupabaseAdmin()
        .storage.from(BUCKET)
        .upload(filename, buffer, {
          contentType: "application/octet-stream",
          upsert: false,
        });
      if (error) {
        throw new Error(`Storage upload failed: ${error.message}`);
      }
      // Generate public URL for the uploaded file
      const { data: publicUrlData } = getSupabaseAdmin()
        .storage.from(BUCKET)
        .getPublicUrl(filename);
      fileUrl = publicUrlData.publicUrl;
      console.log("[v0] Successfully uploaded to Supabase:", { filename, fileUrl });
    } else {
      // Local disk fallback
      console.log("[v0] Uploading to local disk:", { filename, size: buffer.byteLength });
      const dest = path.join(LOCAL_DIR, filename);
      await fs.promises.writeFile(dest, buffer);
      console.log("[v0] Successfully uploaded to local disk:", filename);
    }
  } catch (err) {
    console.error("[v0] Upload error:", { originalName, filename, error: err });
    throw err;
  }

  return { filename, originalName, fileSize: buffer.byteLength, fileUrl };
}

export async function downloadConfigFile(filename: string): Promise<Buffer> {
  if (useSupabase) {
    const { data, error } = await getSupabaseAdmin()
      .storage.from(BUCKET)
      .download(filename);
    if (error) throw new Error(`Storage download failed: ${error.message}`);
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    const src = path.join(LOCAL_DIR, filename);
    return fs.promises.readFile(src);
  }
}

export async function deleteConfigFile(filename: string): Promise<void> {
  if (useSupabase) {
    await getSupabaseAdmin().storage.from(BUCKET).remove([filename]);
  } else {
    const src = path.join(LOCAL_DIR, filename);
    await fs.promises.unlink(src).catch(() => {});
  }
}
