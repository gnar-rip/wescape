// src/components/widgets/PlayerActivityWidget.tsx
import React from "react";

export type Activity = {
  id: number;
  playerId: number;
  type: string; // e.g., "boss", "skill", "clue"
  metric: string; // e.g., "Vorkath", "Attack"
  value: number;
  createdAt: string; // timestamp
};

export default function PlayerActivityWidget({ activities }: { activities: Activity[] }) {
  return (
    <div className="p-6 bg-gray-900 rounded-xl text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-osrsGold">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-gray-400">No recent activity logged.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((a) => (
            <li
              key={a.id}
              className="flex justify-between items-center border-b border-gray-800 pb-2"
            >
              <div>
                <span className="font-semibold capitalize">{a.metric}</span>{" "}
                <span className="text-sm text-gray-400">({a.type})</span>
              </div>
              <div>
                +{a.value.toLocaleString()}{" "}
                <span className="text-gray-400">({new Date(a.createdAt).toLocaleDateString()})</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
