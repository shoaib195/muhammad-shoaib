import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file" }, { status: 422 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "Only JPG, PNG, WEBP, GIF allowed" }, { status: 422 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Max file size is 6MB" }, { status: 422 });
  }

  const folder = String(form?.get("folder") || "general").replace(/[^a-z0-9-_]/gi, "") || "general";
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${extFor(file.type)}`;
  const pathname = `media/${folder}/${name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Production / Vercel: persist to Blob (server filesystem is ephemeral)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(pathname, buffer, {
        access: "public",
        contentType: file.type,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    } catch (err) {
      console.error("[upload] blob error", err);
      return NextResponse.json({ ok: false, error: "Cloud upload failed" }, { status: 502 });
    }
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Image storage not configured on Vercel. Create a Blob store in the Vercel dashboard and set BLOB_READ_WRITE_TOKEN.",
      },
      { status: 503 },
    );
  }

  // Local development: write into public/media (commit these files before deploy, or use Blob)
  const dir = path.join(process.cwd(), "public", "media", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return NextResponse.json({ ok: true, url: `/media/${folder}/${name}` });
}
