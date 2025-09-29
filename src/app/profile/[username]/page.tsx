import PlayerStatsWidget, { PlayerData } from "../../components/widgets/PlayerStatsWidget";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const res = await fetch(
    `${base}/api/osrs/${encodeURIComponent(username)}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    return (
      <div className="p-8 text-red-500">
        Could not load data for {username}.
      </div>
    );
  }

  // The API now returns: { username, modes: { main: {...}, ironman: {...}, ... } }
  const apiResponse: { username: string; modes: Record<string, PlayerData> } =
    await res.json();

  const availableModes = Object.keys(apiResponse.modes);
  // Prefer "main" if it exists, otherwise use the first available mode
  const defaultMode = availableModes.includes("main")
    ? "main"
    : availableModes[0];

  const modeData = apiResponse.modes[defaultMode];

  // Pass a flat PlayerData object to the widget (username + the selected mode’s data)
  const playerData: PlayerData = {
    username: apiResponse.username,
    overall: modeData.overall,
    skills: modeData.skills,
    activities: modeData.activities,
  };

  return <PlayerStatsWidget data={playerData} />;
}
