import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

const CACHE_DIR =
  process.env.ITEM_ICON_CACHE_DIR ||
  path.join(process.cwd(), "public", "assets", "items");

function isValidId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // ignore if already exists
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
  }

  const localPath = path.join(CACHE_DIR, `${id}.png`);
  const localUrl = `/assets/items/${id}.png`;

  // 1) Serve from local cache if present
  if (await fileExists(localPath)) {
    const file = await fs.readFile(localPath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // 2) Otherwise fetch from RuneLite CDN once, persist, then serve
  const upstream = `https://static.runelite.net/cache/item/icon/${id}.png`;
  const res = await fetch(upstream);

  if (!res.ok) {
    // optional: serve placeholder if it exists
    const placeholderPath = path.join(CACHE_DIR, "placeholder.png");
    if (await fileExists(placeholderPath)) {
      const placeholder = await fs.readFile(placeholderPath);
      return new NextResponse(new Uint8Array(placeholder), {
        headers: { "Content-Type": "image/png" },
      });
    }
    return NextResponse.json({ error: "Icon not found" }, { status: 404 });
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("image/png")) {
    return NextResponse.json(
      { error: "Unexpected content type" },
      { status: 502 }
    );
  }

  // Read and persist
  const arrayBuf = await res.arrayBuffer();
  await ensureDir(CACHE_DIR);
  try {
    await fs.writeFile(localPath, Buffer.from(arrayBuf));
  } catch {
    // fail silently if write fails
  }

  return new NextResponse(new Uint8Array(arrayBuf), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-WeScape-Local-Path": localUrl,
    },
  });
}
