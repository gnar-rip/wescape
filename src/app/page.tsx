import PlayerLookupWidget from "./components/widgets/PlayerLookupWidget";
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-osrsGold">WeScape</h1>
      <p className="text-gray-300">Track your Old School RuneScape stats</p>
      <PlayerLookupWidget />
      </div>
    </main>
  );
}
