// src/components/widgets/PlayerStatsWidget.tsx
import React from "react";
import { skillIconMap } from "@/lib/skillIcons";

export type Skill = {
  name: string;
  rank: number;
  level: number;
  xp: number;
};

export type PlayerData = {
  username: string;
  overall: Skill;
  skills: Skill[];
};

export default function PlayerStatsWidget({ data }: { data: PlayerData }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-gray-100 space-y-4">
      <h2 className="text-2xl font-bold text-osrsGold">Skills</h2>

      <div className="flex justify-between text-sm">
        <p>
          <span className="font-semibold">Total Level:</span>{" "}
          {data.overall.level}
        </p>
        <p>
          <span className="font-semibold">Total XP:</span>{" "}
          {data.overall.xp.toLocaleString()}
        </p>
      </div>

      {/* Grid of skill icons */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {data.skills.slice(1).map((s, i) => {
          const icon = skillIconMap[s.name.toLowerCase()];
          return (
            <div key={i} className="flex flex-col items-center text-xs">
              {icon ? (
                <img
                  src={icon}
                  alt={s.name}
                  className="w-8 h-8 mb-1"
                  loading="lazy"
                />
              ) : (
                <span>{s.name}</span>
              )}
              <span>{s.level}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
