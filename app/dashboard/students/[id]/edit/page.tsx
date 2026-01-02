import { prisma } from "@/lib/prisma";
import StudentEntryForm from "@/components/forms/StudentEntryForm";
import { notFound } from "next/navigation";

interface PageProps {
    params: { id: string };
}
// Note: Next.js 15+ or latest 14 might require Params to be awaited or handled differently in generic functions,
// but for standard server components this usually works. If `params` is a Promise in newer Next, we await it.
// Assuming Next.js 14/15 based on "next": "16.0.10" (which implies unstable/canary or very new).
// Safest is to treat params as something we can access directly or await if it's a promise.
// In Next 15, page props params is a Promise.

export default async function EditStudentPage({ params }: any) {
    // Await params if it's a promise (Next 15 change)
    const { id } = await params;

    const student = await prisma.student.findUnique({
        where: { id },
    });

    if (!student) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Student</h1>
            <StudentEntryForm initialData={student as any} />
        </div>
    );
}
