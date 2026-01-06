"use client";

import { useEffect, useState } from "react";

type Kpis = {
  totalStudents: number;
  fileComplete: number;
  fileIncomplete: number;
  fileSubmitted: number;
  returned: number;
  activeCampuses: number;
};

export default function KpiCards() {
  const [data, setData] = useState<Kpis | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/kpis")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  const cards = [
    { label: "Total Files (Registration)", value: data.totalStudents },
    { label: "Active Campuses", value: data.activeCampuses },
    { label: "Files Complete", value: data.fileComplete },
    { label: "Files Incomplete", value: data.fileIncomplete },
    { label: "Files Submitted", value: data.fileSubmitted },
    { label: "Files Returned", value: data.returned },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl bg-white shadow p-4 border"
        >
          <p className="text-xl text-gray-700 font-medium">{c.label}</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
