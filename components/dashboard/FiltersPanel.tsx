"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FiltersPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);

  // Local state for inputs
  const [filters, setFilters] = useState({
    campusId: searchParams.get("campusId") || "",
    programName: searchParams.get("programName") || "",
    applicationStatus: searchParams.get("applicationStatus") || "",
    search: searchParams.get("search") || "",
  });

  // Fetch Campuses for dropdown
  useEffect(() => {
    fetch("/api/campuses")
      .then((res) => res.json())
      .then(setCampuses);
  }, []);

  // Update URL when filters change
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter change
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="rounded-xl bg-white shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Campus Filter */}
        <select
          className="border rounded p-2"
          value={filters.campusId}
          onChange={(e) => handleFilterChange("campusId", e.target.value)}
        >
          <option value="">All Campuses</option>
          {campuses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Name, File #, ID..."
          className="border rounded p-2"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

        {/* Program Filter */}
        <input
          type="text"
          placeholder="Filter by Program..."
          className="border rounded p-2"
          value={filters.programName}
          onChange={(e) => handleFilterChange("programName", e.target.value)}
        />

        {/* Application Status */}
        <select
          className="border rounded p-2"
          value={filters.applicationStatus}
          onChange={(e) => handleFilterChange("applicationStatus", e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="NOT_FILED">Not Filed</option>
          <option value="FILE_COMPLETE">File Complete</option>
          <option value="FILE_INCOMPLETE">File Incomplete</option>
          <option value="FILE_SUBMITTED">File Submitted</option>
          <option value="RETURNED">Returned</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setFilters({ campusId: "", programName: "", applicationStatus: "", search: "" });
            router.replace("/dashboard");
          }}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
