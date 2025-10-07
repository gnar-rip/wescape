// src/app/api/wom/[rsn]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ rsn: string }> }
) {
  const { rsn } = await params;

  try {
    const url = `https://api.wiseoldman.net/v2/players/${encodeURIComponent(
      rsn
    )}/gained?period=week`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from WOM" },
        { status: res.status }
      );
    }

    const json = await res.json();
    const root = json.data || {}; // ✅ data is nested inside .data

    const items: any[] = [];

    // Skills
    if (root.skills) {
      for (const [metric, gains] of Object.entries<any>(root.skills)) {
        const gained = gains.experience?.gained ?? 0;
        if (gained > 0) {
          items.push({
            id: `skill-${metric}`,
            type: "skill",
            metric,
            value: gained,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Bosses
    if (root.bosses) {
      for (const [metric, gains] of Object.entries<any>(root.bosses)) {
        const gained = gains.kills?.gained ?? 0;
        if (gained > 0) {
          items.push({
            id: `boss-${metric}`,
            type: "boss",
            metric,
            value: gained,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Activities (clues, LMS, etc.)
    if (root.activities) {
      for (const [metric, gains] of Object.entries<any>(root.activities)) {
        const gained = gains.score?.gained ?? 0;
        if (gained > 0) {
          items.push({
            id: `activity-${metric}`,
            type: "activity",
            metric,
            value: gained,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Error fetching WOM activity:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}






