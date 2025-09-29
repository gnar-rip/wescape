"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlayerLookupWidget() {
  const [name, setName] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    router.push(`/profile/${encodeURIComponent(name.trim())}`);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter OSRS username"
            className="
            rounded-md
            px-4 py-2
            bg-gray-800
            text-white
            placeholder-gray-400
            border border-gray-600
            focus:outline-none focus:ring-2 focus:ring-osrsGold
            "
        />
        <button
            type="submit"
            className="
            bg-white
            text-black
            font-semibold
            px-4 py-2
            rounded-md
            hover:bg-yellow-400
            focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
            Search
        </button>
      </form>
    </div>
  );
}
