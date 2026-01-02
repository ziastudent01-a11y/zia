"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { exportToExcel } from "@/lib/excel/exportExcel";
import { Download, FileText, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

type Student = {
  id: string;
  studentName: string;
  fileNumber: string;
  campus: { name: string };
  programName: string;
  applicationStatus: string;
  gender: string;
  phonePrimary?: string;
};

export default function StudentsTable() {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    fetch(`/api/students?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [searchParams, page]);

  // Handle Export
  const handleExport = () => {
    const dataToExport = students.map((s) => ({
      "File No": s.fileNumber,
      "Name": s.studentName,
      "Campus": s.campus.name,
      "Program": s.programName,
      "Status": s.applicationStatus,
      "Gender": s.gender,
      "Phone": s.phonePrimary || "N/A",
    }));
    exportToExcel(dataToExport, "student_directory");
  };

  return (
    <div className="bg-white rounded-xl shadow border">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
        <h3 className="font-semibold text-gray-700">Student Directory</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border rounded hover:bg-gray-50 text-gray-600"
          >
            <Download size={16} />
            Export
          </button>
          <Link
            href="/dashboard/students/add"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Student
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">File #</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Campus</th>
              <th className="px-6 py-4">Program</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  No students found matching filters.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {student.fileNumber}
                  </td>
                  <td className="px-6 py-4">{student.studentName}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {student.campus.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {student.programName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${student.applicationStatus === "FILE_COMPLETE"
                          ? "bg-green-100 text-green-800"
                          : student.applicationStatus === "FILE_INCOMPLETE"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {student.applicationStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link
                      href={`/dashboard/students/${student.id}/edit`}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </Link>
                    {/* More actions can go here */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Basic Pagination */}
      <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
        <span>
          Showing {Math.min((page - 1) * limit + 1, total)} to{" "}
          {Math.min(page * limit, total)} of {total} students
        </span>
        <div className="flex gap-2">
          <Link
            href={{
              query: {
                ...Object.fromEntries(searchParams.entries()),
                page: Math.max(1, page - 1),
              },
            }}
            className={`px-3 py-1 border rounded hover:bg-gray-50 ${page <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
          >
            Previous
          </Link>
          <Link
            href={{
              query: {
                ...Object.fromEntries(searchParams.entries()),
                page: page + 1,
              },
            }}
            className={`px-3 py-1 border rounded hover:bg-gray-50 ${page * limit >= total ? "pointer-events-none opacity-50" : ""
              }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
