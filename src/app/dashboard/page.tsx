// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import PlayerLookupWidget from "../components/widgets/PlayerLookupWidget";
import PlayerStatsWidget from "../components/widgets/PlayerStatsWidget";
import PlayerKCWidget from "../components/widgets/PlayerKCWidget";
import ProfileEditorModal from "../components/dashboard/ProfileEditorModal";
import PlayerActivityWidget, { ActivityItem } from "../components/widgets/PlayerActivityWidget";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  let playerData: any = null;
  let activityItems: ActivityItem[] = [];
  const rsn = session.user.defaultRSN;

  if (rsn) {
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

      // fetch OSRS stats (existing endpoint)
      const res = await fetch(`${base}/api/osrs/${encodeURIComponent(rsn)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const main = json?.modes?.main;
        if (main && main.overall && typeof main.overall.level === "number") {
          playerData = {
            username: json.username,
            overall: main.overall,
            skills: main.skills,
            activities: main.activities,
          };
        }
      }

      // fetch Wise Old Man activity
    const womRes = await fetch(`${base}/api/wom/${encodeURIComponent(rsn)}`, {
      cache: "no-store",
    });
    if (womRes.ok) {
      const json = await womRes.json();
      console.log("WOM API raw response:", JSON.stringify(json, null, 2)); // DEBUG WOM - make sure this populates

      if (Array.isArray(json.items)) {
        activityItems = json.items.map((d: any, i: number): ActivityItem => ({
          id: d.id ?? i,
          type: d.type ?? d.period ?? "misc",
          metric: d.metric ?? "unknown",
          value: d.gained ?? d.kills ?? null,
          createdAt: d.createdAt ?? new Date().toISOString(),
        }));
      }
    }
    } catch (err) {
      console.error("Error fetching player data:", err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 p-6 space-y-8 text-osrs-text-primary bg-osrs-black min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4 flex justify-between items-center text-osrs-gold">
        Welcome, {session.user.username}!
        <ProfileEditorModal user={session.user} />
      </h1>

      {/* Info card */}
      <div className="bg-osrs-stone border border-osrs-border rounded-xl p-4 shadow-lg">
        <p>You are successfully signed in.</p>
        <p className="mt-2">
          Your user id is:{" "}
          <span className="font-mono text-osrs-gold">{session.user.id}</span>
        </p>
      </div>

      {/* Player Lookup */}
      <div className="bg-osrs-stone border border-osrs-border rounded-xl p-4 shadow-lg">
        <PlayerLookupWidget />
      </div>

      {/* Stats + KC + Activity */}
      {playerData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left side: stats + activity stacked */}
          <div className="space-y-6">
            <PlayerStatsWidget data={playerData} />
            <PlayerActivityWidget items={activityItems} />
          </div>

          {/* Right side: KC */}
          <PlayerKCWidget activities={playerData.activities} />
        </div>
      ) : (
        <p className="text-osrs-text-secondary">
          {rsn
            ? "Could not load your RuneScape stats."
            : "No default RuneScape name set on your profile yet."}
        </p>
      )}
    </div>
  );
}

