"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type StatsData = {
  total: number;
  incomplete: number;
  byCampus: { name: string; value: number }[];
  byStatus: { name: string; value: number }[];
  byProgram: { name: string; value: number }[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function ChartsSection() {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data)
    return (
      <div className="rounded-xl bg-white shadow p-6 h-64 flex items-center justify-center text-gray-600">
        Loading charts...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Campus Distribution */}
      <div className="rounded-xl bg-white shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Files by Campus</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byCampus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Files" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Application Status */}
      <div className="rounded-xl bg-white shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Files Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.byStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.byStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
