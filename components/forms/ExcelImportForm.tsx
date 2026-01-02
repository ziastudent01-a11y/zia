"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function ExcelImportForm() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        setMessage("");

        try {
            const res = await fetch("/api/excel-import", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Upload failed");

            setMessage(`Success! Imported ${json.count} students. Warnings: ${json.warnings?.length || 0}`);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-4">Import Students via Excel</h3>

            <div className="mb-6 flex justify-end">
                <a
                    href="/template.xlsx"
                    download="student_template.xlsx"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Download Template
                </a>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:bg-gray-50 transition">
                <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload .xlsx</span>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>
            {uploading && <p className="mt-4 text-blue-600">Uploading...</p>}
            {message && <p className="mt-4 text-sm font-medium">{message}</p>}
        </div>
    );
}
