"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const campusSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    city: z.string().min(1, "City is required"),
    latitude: z.number({ required_error: "Latitude is required" }),
    longitude: z.number({ required_error: "Longitude is required" }),
    address: z.string().optional(),
});

type CampusFormValues = z.infer<typeof campusSchema>;

type AddCampusFormProps = {
    initialData?: CampusFormValues & { id: string };
};

export default function AddCampusForm({ initialData }: AddCampusFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const isEditing = !!initialData;

    const form = useForm<CampusFormValues>({
        resolver: zodResolver(campusSchema),
        defaultValues: initialData || {
            code: "",
            name: "",
            city: "",
            latitude: 0,
            longitude: 0,
            address: "",
        },
    });

    const onSubmit = async (data: CampusFormValues) => {
        setError("");
        try {
            const url = isEditing
                ? `/api/campuses/${initialData.id}`
                : "/api/campuses";

            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save campus");

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6">{isEditing ? "Edit Campus" : "Add New Campus"}</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Campus Code</label>
                        <input
                            {...form.register("code")}
                            className="w-full border rounded p-2"
                            placeholder="e.g. LHR-01"
                        />
                        {form.formState.errors.code && (
                            <span className="text-red-500 text-xs">{form.formState.errors.code.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">City</label>
                        <input
                            {...form.register("city")}
                            className="w-full border rounded p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Campus Name</label>
                    <input
                        {...form.register("name")}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            {...form.register("latitude", { valueAsNumber: true })}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            {...form.register("longitude", { valueAsNumber: true })}
                            className="w-full border rounded p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Address (Optional)</label>
                    <textarea
                        {...form.register("address")}
                        className="w-full border rounded p-2"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update Campus" : "Add Campus"}
                </button>
            </form>
        </div>
    );
}
