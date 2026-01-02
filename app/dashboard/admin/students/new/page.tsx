"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [form, setForm] = useState({
    studentName: "",
    nationalId: "",
    fileNumber: "",
    campusId: "",
    programName: "",
    gender: "MALE",
    applicationStatus: "FILE_COMPLETE",
    courseStatus: "ENROLLED",
    isEligible: true,
  });

  useEffect(() => {
    // Fetch campuses for dropdown
    fetch("/api/campuses")
      .then((res) => res.json())
      .then((data) => setCampuses(data))
      .catch((err) => console.error("Failed to fetch campuses", err));
  }, []);

  async function submit() {
    // Basic Client-side Validation
    if (!form.studentName || !form.nationalId || !form.fileNumber || !form.campusId || !form.programName) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create student");
      }

      alert("Student created successfully!");
      router.push("/dashboard/students");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-border mt-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Add New Student</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Student Name *</label>
          <input
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Ali Khan"
            value={form.studentName}
            onChange={(e) => setForm({ ...form, studentName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">National ID / CNIC *</label>
          <input
            className="w-full p-2 border rounded-md"
            placeholder="e.g. 35202-..."
            value={form.nationalId}
            onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">File Number *</label>
          <input
            className="w-full p-2 border rounded-md"
            placeholder="e.g. F-2024-001"
            value={form.fileNumber}
            onChange={(e) => setForm({ ...form, fileNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Gender *</label>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        {/* Academic Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Campus *</label>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={form.campusId}
            onChange={(e) => setForm({ ...form, campusId: e.target.value })}
          >
            <option value="">Select Campus</option>
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Program Name *</label>
          <input
            className="w-full p-2 border rounded-md"
            placeholder="e.g. BS Computer Science"
            value={form.programName}
            onChange={(e) => setForm({ ...form, programName: e.target.value })}
          />
        </div>

        {/* Status Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Application Status</label>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={form.applicationStatus}
            onChange={(e) => setForm({ ...form, applicationStatus: e.target.value })}
          >
            <option value="FILE_COMPLETE">File Complete</option>
            <option value="FILE_SUBMITTED">File Submitted</option>
            <option value="FILE_INCOMPLETE">File Incomplete</option>
            <option value="NOT_FILED">Not Filed</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Course Status</label>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={form.courseStatus}
            onChange={(e) => setForm({ ...form, courseStatus: e.target.value })}
          >
            <option value="ENROLLED">Enrolled</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Student"}
        </button>
      </div>
    </div>
  );
}
