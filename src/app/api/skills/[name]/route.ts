import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { skillIcons } from "@/lib/skillIcons";

export const runtime = "nodejs";

const CACHE_DIR =
  process.env.SKILL_ICON_CACHE_DIR ||
  path.join(process.cwd(), "public", "assets", "skills");

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // already exists
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  const fileName = skillIcons[name.toLowerCase()];
  if (!fileName) {
    return NextResponse.json({ error: "Unknown skill" }, { status: 400 });
  }

  const localPath = path.join(CACHE_DIR, fileName);

  // ✅ Serve cached version if it exists
  if (await fileExists(localPath)) {
    const file = await fs.readFile(localPath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // ✅ Otherwise fetch from RuneLite CDN
  const upstream = `https://static.runelite.net/cache/skill/${fileName}`;
  const res = await fetch(upstream);

  if (!res.ok) {
    return NextResponse.json({ error: "Icon not found" }, { status: 404 });
  }

  const arrayBuf = await res.arrayBuffer();
  await ensureDir(CACHE_DIR);

  try {
    await fs.writeFile(localPath, Buffer.from(arrayBuf));
  } catch {
    // fail silently, still serve the fetched file
  }

  return new NextResponse(new Uint8Array(arrayBuf), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}


