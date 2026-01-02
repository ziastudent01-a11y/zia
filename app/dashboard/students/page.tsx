import Link from "next/link";
import { Plus } from "lucide-react";
import StudentsTable from "@/components/dashboard/StudentsTable";
import StudentFilters from "@/components/students/StudentFilters";

export const dynamic = 'force-dynamic';

export default function StudentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Students Directory</h1>
                <Link
                    href="/dashboard/students/add"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Student
                </Link>
            </div>

            <StudentFilters />
            <StudentsTable />
        </div>
    );
}
