// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import PlayerLookupWidget from "../components/widgets/PlayerLookupWidget";
import PlayerStatsWidget from "../components/widgets/PlayerStatsWidget";
import PlayerKCWidget from "../components/widgets/PlayerKCWidget";
import ProfileEditorModal from "../components/dashboard/ProfileEditorModal";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  let playerData: any = null;
  const rsn = session.user.defaultRSN;

  if (rsn) {
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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
    } catch (err) {
      console.error("Error fetching hiscores:", err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 p-6 space-y-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-4 flex justify-between items-center">
        Welcome, {session.user.username}!
        <ProfileEditorModal user={session.user} />
      </h1>

      {/* Info card */}
      <div className="bg-gray-900 rounded-xl p-4">
        <p>You are successfully signed in.</p>
        <p className="mt-2">
          Your user id is: <span className="font-mono">{session.user.id}</span>
        </p>
      </div>

      {/* Player Lookup */}
      <div className="bg-gray-900 rounded-xl p-4">
        <PlayerLookupWidget />
      </div>

      {/* Stats + KC */}
      {playerData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <PlayerStatsWidget data={playerData} />
          <PlayerKCWidget activities={playerData.activities} />
        </div>
      ) : (
        <p className="text-gray-400">
          {rsn
            ? "Could not load your RuneScape stats."
            : "No default RuneScape name set on your profile yet."}
        </p>
      )}
    </div>
  );
}
