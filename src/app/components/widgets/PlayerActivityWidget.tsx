// src/app/components/widgets/PlayerActivityWidget.tsx
"use client";

import React from "react";

export type ActivityItem = {
  id?: string | number;
  type?: string;        // "boss" | "minigame" | "skill"
  metric: string;       // "Agility", "Vorkath", etc.
  value?: number | null;
  createdAt?: string | Date | null;
};

function formatMetric(metric: string) {
  return metric.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function PlayerActivityWidget({ items }: { items: ActivityItem[] }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div className="p-6 bg-osrs-stone border border-osrs-border rounded-xl text-osrs-text-primary shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-osrs-gold">Recent Activity</h2>

      {list.length === 0 ? (
        <p className="text-osrs-text-secondary">No recent activity.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((a, i) => {
            const key = a.id ?? `${a.metric}-${i}`;
            const val =
              typeof a.value === "number" && Number.isFinite(a.value)
                ? `+${a.value.toLocaleString()}`
                : "—";

            const dateStr = a?.createdAt
              ? new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
              : "";

            return (
              <li
                key={key}
                className="flex justify-between items-center border-b border-osrs-border pb-2"
              >
                <div>
                  <span className="font-semibold">{formatMetric(a.metric)}</span>{" "}
                  {a.type ? (
                    <span className="text-sm text-osrs-text-secondary">({a.type})</span>
                  ) : null}
                </div>
                <div className="text-right">
                  <span className="text-osrs-gold">{val}</span>{" "}
                  {dateStr && <span className="text-osrs-text-secondary">({dateStr})</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}