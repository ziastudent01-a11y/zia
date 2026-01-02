"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentFormData } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    initialData?: StudentFormData & { id: string };
}

export default function StudentEntryForm({ initialData }: Props) {
    const router = useRouter();
    const [campuses, setCampuses] = useState<{ id: string; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: initialData ? {
            ...initialData,
            dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth as any).toISOString().split('T')[0] : "",
        } as any : {
            gender: "MALE",
            guardianType: "SELF",
            applicationStatus: "NOT_FILED",
            courseStatus: "ENROLLED",
            isEligible: true,
            dateOfBirth: "",
        } as any,
    });

    useEffect(() => {
        fetch("/api/campuses")
            .then((res) => res.json())
            .then(setCampuses);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        setError("");
        try {
            const url = initialData ? `/api/students/${initialData.id}` : "/api/students";
            const method = initialData ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to create student");
            }

            // Redirect to dashboard on success
            router.push("/dashboard");
            router.refresh();
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold">New Student Entry</h2>

            {error && <div className="p-4 bg-red-50 text-red-500 rounded">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identity */}
                <div className="md:col-span-2 text-lg font-semibold border-b pb-2">Identity</div>
                <div>
                    <label className="block text-sm font-medium">File Number</label>
                    <input {...register("fileNumber")} className="w-full border p-2 rounded" />
                    {errors.fileNumber && <p className="text-red-500 text-sm">{errors.fileNumber.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">National ID</label>
                    <input {...register("nationalId")} className="w-full border p-2 rounded" />
                    {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Student Name</label>
                    <input {...register("studentName")} className="w-full border p-2 rounded" />
                    {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Date of Birth</label>
                    <input type="date" {...register("dateOfBirth")} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Gender</label>
                    <select {...register("gender")} className="w-full border p-2 rounded">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>

                {/* Campus */}
                <div className="md:col-span-2 text-lg font-semibold border-b pb-2 mt-4">Academic</div>
                <div>
                    <label className="block text-sm font-medium">Campus</label>
                    <select {...register("campusId")} className="w-full border p-2 rounded">
                        <option value="">Select Campus</option>
                        {campuses.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.campusId && <p className="text-red-500 text-sm">{errors.campusId.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Program Name</label>
                    <input {...register("programName")} className="w-full border p-2 rounded" />
                    {errors.programName && <p className="text-red-500 text-sm">{errors.programName.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Session</label>
                    <input {...register("session")} className="w-full border p-2 rounded" />
                </div>

                {/* Guardian */}
                <div className="md:col-span-2 text-lg font-semibold border-b pb-2 mt-4">Guardian / Employment</div>
                <div>
                    <label className="block text-sm font-medium">Guardian Type</label>
                    <select {...register("guardianType")} className="w-full border p-2 rounded">
                        <option value="SELF">Self</option>
                        <option value="PARENT">Parent</option>
                        <option value="GUARDIAN">Guardian</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Father Name</label>
                    <input {...register("fatherName")} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Factory Name</label>
                    <input {...register("factoryName")} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Designation</label>
                    <input {...register("designation")} className="w-full border p-2 rounded" />
                </div>

                {/* Status */}
                <div className="md:col-span-2 text-lg font-semibold border-b pb-2 mt-4">Status</div>
                <div>
                    <label className="block text-sm font-medium">Application Status</label>
                    <select {...register("applicationStatus")} className="w-full border p-2 rounded">
                        <option value="NOT_FILED">Not Filed</option>
                        <option value="FILE_COMPLETE">File Complete</option>
                        <option value="FILE_INCOMPLETE">File Incomplete</option>
                        <option value="FILE_SUBMITTED">File Submitted</option>
                        <option value="RETURNED">Returned</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Course Status</label>
                    <select {...register("courseStatus")} className="w-full border p-2 rounded">
                        <option value="ENROLLED">Enrolled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DROPPED">Dropped</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? "Creating..." : "Create Student"}
                </button>
            </div>
        </form>
    );
}
