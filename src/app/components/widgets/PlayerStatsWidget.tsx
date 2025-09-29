// src/components/widgets/PlayerStatsWidget.tsx
import React from "react";

export type Skill = {
  name: string;
  rank: number;
  level: number;
  xp: number;
};

export type Activity = {
  type: "clue" | "minigame" | "boss"; // ✅ include type
  name: string;
  rank: number;
  score: number;                     // ✅ renamed from count → score
};

export type PlayerData = {
  username: string;
  overall: Skill;
  skills: Skill[];
  activities: Activity[];
};

export default function PlayerStatsWidget({ data }: { data: PlayerData }) {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold text-osrsGold">
        {data.username}&rsquo;s Stats
      </h1>

      <div className="bg-gray-900 rounded-xl p-4 text-gray-100">
        <p className="text-xl">
          <span className="font-semibold">Total Level:</span>{" "}
          {data.overall.level}
        </p>
        <p>
          <span className="font-semibold">Total XP:</span>{" "}
          {data.overall.xp.toLocaleString()}
        </p>
      </div>

      {/* --- Skills Table --- */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-1">Skill</th>
            <th className="py-1">Level</th>
            <th className="py-1">XP</th>
          </tr>
        </thead>
        <tbody>
          {data.skills.slice(1).map((s, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td className="py-1">{s.name}</td>
              <td className="py-1">{s.level}</td>
              <td className="py-1">{s.xp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Minigames & Boss Kills --- */}
      <h2 className="text-2xl font-bold mt-8 text-osrsGold">
        Minigames & Boss Kills
      </h2>

      <table className="w-full text-left border-collapse mt-2">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-1">Name</th>
            <th className="py-1">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.activities.map((a, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td className="py-1">{a.name}</td>
              <td className="py-1">
                {typeof a.score === "number" ? a.score.toLocaleString() : "0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

