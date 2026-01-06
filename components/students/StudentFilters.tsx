"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentFilters() {
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
        <div className="rounded-xl bg-white shadow p-4 border">
            <h3 className="font-semibold text-gray-700 mb-3">Search & Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by Name, File #, or ID..."
                    className="border rounded p-2 text-slate-900 placeholder:text-gray-500"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                />

                {/* Campus Filter */}
                <select
                    className="border rounded p-2 text-slate-900"
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

                {/* Program Filter */}
                <input
                    type="text"
                    placeholder="Filter by Program..."
                    className="border rounded p-2 text-slate-900 placeholder:text-gray-500"
                    value={filters.programName}
                    onChange={(e) => handleFilterChange("programName", e.target.value)}
                />

                {/* Application Status */}
                <select
                    className="border rounded p-2 text-slate-900"
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
                        router.replace("/dashboard/students");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}
