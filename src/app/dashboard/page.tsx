// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import PlayerLookupWidget from "../components/widgets/PlayerLookupWidget";
import PlayerStatsWidget from "../components/widgets/PlayerStatsWidget";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  console.log("Dashboard session:", session);

  let playerData: any = null;
  const rsn = session.user.defaultRSN;

  if (rsn) {
    try {
      // Use absolute URL for server-side fetch
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const res = await fetch(`${base}/api/osrs/${encodeURIComponent(rsn)}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        /**
         * Your API now returns:
         * {
         *   username: "name",
         *   modes: {
         *     main: {
         *       overall: {...},
         *       skills: [...],
         *       activities: [...]
         *     }
         *   }
         * }
         *
         * PlayerStatsWidget expects:
         * {
         *   username: "name",
         *   overall: {...},
         *   skills: [...],
         *   activities: [...]
         * }
         */
        const main = json?.modes?.main;
        if (main && main.overall && typeof main.overall.level === "number") {
          playerData = {
            username: json.username,
            overall: main.overall,
            skills: main.skills,
            activities: main.activities,
          };
        } else {
          console.warn("Unexpected hiscores response:", json);
        }
      } else {
        console.error("Hiscores fetch failed:", res.status);
      }
    } catch (err) {
      console.error("Error fetching hiscores:", err);
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-16 p-6 space-y-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session.user.username}!
      </h1>

      <div className="bg-gray-900 rounded-xl p-4">
        <p>You are successfully signed in.</p>
        <p className="mt-2">
          Your user id is: <span className="font-mono">{session.user.id}</span>
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl p-4">
        <PlayerLookupWidget />
      </div>

      {playerData ? (
        <div className="bg-gray-900 rounded-xl p-4 overflow-auto">
          <PlayerStatsWidget data={playerData} />
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


