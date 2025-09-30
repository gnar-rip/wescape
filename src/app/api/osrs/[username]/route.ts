import { NextResponse } from "next/server";
import { getStatsByGamemode, FORMATTED_BOSS_NAMES } from "osrs-json-hiscores";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // --- Debug logs ---
  console.log("Raw username param:", JSON.stringify(username));

  // Clean and validate the RuneScape name
  const cleanName = username
    .trim()
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ");

  console.log("Cleaned username:", JSON.stringify(cleanName));

  const validPattern = /^[A-Za-z0-9 _-]{1,12}$/;
  const isValid = validPattern.test(cleanName);
  console.log("Regex test result:", isValid);

  if (!isValid) {
    console.warn("Username failed validation:", JSON.stringify(cleanName));
    return NextResponse.json(
      { error: "Invalid RuneScape name. Use only letters, numbers, spaces, _ or -, max 12 chars." },
      { status: 400 }
    );
  }

  // -------- Helper to format stats for each mode --------
  function formatMode(modeData: any) {
    if (!modeData?.skills) return null;

    const SKILL_ORDER: (keyof typeof modeData.skills)[] = [
      "overall","attack","defence","strength","hitpoints","ranged","prayer","magic",
      "cooking","woodcutting","fletching","fishing","firemaking","crafting","smithing",
      "mining","herblore","agility","thieving","slayer","farming","runecraft","hunter","construction"
    ];

    const skills = SKILL_ORDER.map(k => {
      const s = modeData.skills?.[k] ?? {};
      const keyStr = k as string;
      return {
        name: keyStr.charAt(0).toUpperCase() +
              keyStr.slice(1).replace("hitpoints","Hitpoints"),
        level: Number((s as any).level) || 0,
        xp:    Number((s as any).xp)    || 0,
        rank:  Number((s as any).rank)  || 0,
      };
    });

    const overall = skills[0];

    type Activity = { type: "clue"|"minigame"|"boss"; name: string; rank: number; score: number };
    const activities: Activity[] = [];

    for (const [label, value] of Object.entries(modeData.clues ?? {})) {
      const entry = value as any;
      if (!entry) continue;
      const rank  = Number(entry.rank)  || 0;
      const score = Number(entry.score) || 0;
      if (rank > 0 || score > 0) {
        activities.push({
          type: "clue",
          name: (label as string).replace(/Clues?$/,"Clues"),
          rank,
          score
        });
      }
    }

    const minigameKeys = [
      "leaguePoints","pvpArena","lastManStanding",
      "soulWarsZeal","riftsClosed","colosseumGlory","collectionsLogged",
      "rogueBH","hunterBH","rogueBHV2","hunterBHV2"
    ];
    for (const k of minigameKeys) {
      const entry = (modeData as any)[k];
      if (!entry) continue;
      const rank  = Number(entry.rank)  || 0;
      const score = Number(entry.score) || 0;
      if (rank > 0 || score > 0) {
        const label = (k as string)
          .replace(/([A-Z])/g," $1")
          .replace(/^./, c => c.toUpperCase())
          .replace("Bh","Bounty Hunter");
        activities.push({ type: "minigame", name: label, rank, score });
      }
    }

    for (const [key, value] of Object.entries(modeData.bosses ?? {})) {
      const entry = value as any;
      if (!entry) continue;
      const rank  = Number(entry.rank)  || 0;
      const score = Number(entry.score) || 0;
      if (rank > 0 || score > 0) {
        const pretty = (FORMATTED_BOSS_NAMES as any)[key as string] ?? key;
        activities.push({ type: "boss", name: pretty, rank, score });
      }
    }

    return { overall, skills, activities };
  }

  try {
    const modes = ["main","ironman","hardcore","ultimate"] as const;
    const modeResults: Record<string, any> = {};

    for (const mode of modes) {
      try {
        const stats = await getStatsByGamemode(cleanName, mode);
        const formatted = formatMode(stats); // <- use stats directly
        if (formatted) modeResults[mode] = formatted;
      } catch {
        // ignore if that mode has no hiscores
      }
    }

    if (Object.keys(modeResults).length === 0) {
      console.warn("No hiscore data found for:", JSON.stringify(cleanName));
      return NextResponse.json(
        { error: `No hiscore data found for ${cleanName}` },
        { status: 404 }
      );
    }

    console.log("Returning stats for:", JSON.stringify(cleanName));
    return NextResponse.json({ username: cleanName, modes: modeResults }, { status: 200 });
  } catch (err) {
    console.error("Error in hiscores lookup:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
