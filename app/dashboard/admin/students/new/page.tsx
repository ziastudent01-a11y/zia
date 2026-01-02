"use client";

import { useState } from "react";

export default function NewStudentPage() {
  const [form, setForm] = useState<any>({});

  async function submit() {
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Add Student</h1>

      <input
        className="input"
        placeholder="Student Name"
        onChange={(e) => setForm({ ...form, studentName: e.target.value })}
      />

      <input
        className="input"
        placeholder="CNIC"
        onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
      />

      <input
        className="input"
        placeholder="File Number"
        onChange={(e) => setForm({ ...form, fileNumber: e.target.value })}
      />

      <button onClick={submit} className="btn-primary mt-4">
        Save Student
      </button>
    </div>
  );
}
