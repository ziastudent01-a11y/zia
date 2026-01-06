"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Plus, Edit } from "lucide-react";

type Campus = {
    id: string;
    code: string;
    name: string;
    city: string;
    _count?: { students: number };
};

export default function CampusesTable() {
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/campuses")
            .then((res) => res.json())
            .then((data) => {
                setCampuses(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading campuses...</div>;

    return (
        <div className="bg-white rounded-xl shadow border">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Building2 size={18} />
                    Campuses Directory
                </h3>
                <Link
                    href="/dashboard/campuses/add"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus size={16} />
                    Add Campus
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Code</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">City</th>
                            <th className="px-6 py-4">Students</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {campuses.map((campus) => (
                            <tr key={campus.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-sm text-blue-400 font-medium">{campus.code}</td>
                                <td className="px-6 py-4 font-medium text-blue-800">{campus.name}</td>
                                <td className="px-6 py-4 text-gray-500">{campus.city}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                        {campus._count?.students || 0} Students
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/dashboard/campuses/${campus.id}/edit`}
                                        className="inline-flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
