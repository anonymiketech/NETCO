import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const useSupabase = Boolean(supabaseUrl && serviceRoleKey);

// Local fallback directory — persists on Replit disk
const LOCAL_DIR = path.resolve(process.cwd(), "uploads");
if (!useSupabase) {
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
  console.warn("Supabase storage not configured — using local disk storage at ./uploads/");
}

export const BUCKET = "config-files";

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

async function ensureBucket() {
  const admin = getSupabaseAdmin();
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await admin.storage.createBucket(BUCKET, { public: false });
  }
}

export async function uploadConfigFile(
  buffer: Buffer,
  originalName: string,
): Promise<{ filename: string; originalName: string; fileSize: number }> {
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${randomUUID()}${ext}`;

  if (useSupabase) {
    await ensureBucket();
    const { error } = await getSupabaseAdmin()
      .storage.from(BUCKET)
      .upload(filename, buffer, {
        contentType: "application/octet-stream",
        upsert: false,
      });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);
  } else {
    // Local disk fallback
    const dest = path.join(LOCAL_DIR, filename);
    await fs.promises.writeFile(dest, buffer);
  }

  return { filename, originalName, fileSize: buffer.byteLength };
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
