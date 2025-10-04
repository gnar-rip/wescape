// src/components/widgets/PlayerKCWidget.tsx
"use client";

import React, { useState } from "react";
import { bossIcons } from "@/lib/bossIcons";

export type Activity = {
  type: "clue" | "minigame" | "boss";
  name: string;
  rank: number;
  score: number;
};

export default function PlayerKCWidget({ activities }: { activities: Activity[] }) {
  const [activeTab, setActiveTab] = useState<"boss" | "minigame" | "clue">("boss");

  // Group activities by type
  const grouped = {
    boss: activities.filter((a) => a.type === "boss"),
    minigame: activities.filter((a) => a.type === "minigame"),
    clue: activities.filter((a) => a.type === "clue"),
  };

  const tabs: { key: "boss" | "minigame" | "clue"; label: string }[] = [
    { key: "boss", label: "Bosses" },
    { key: "minigame", label: "Minigames" },
    { key: "clue", label: "Clues" },
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-4 text-gray-100 space-y-4">
      <h2 className="text-2xl font-bold text-osrsGold">Kill Counts</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`pb-2 ${
              activeTab === t.key
                ? "text-osrsGold border-b-2 border-osrsGold"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {grouped[activeTab].map((a, i) => (
          <div key={i} className="flex flex-col items-center text-xs">
            {bossIcons[a.name] && (
              <img
                src={bossIcons[a.name]}
                alt={a.name}
                className="w-8 h-8 mb-1"
                loading="lazy"
              />
            )}
            <span className="truncate text-center">{a.name}</span>
            <span className="text-osrsGold">{a.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

