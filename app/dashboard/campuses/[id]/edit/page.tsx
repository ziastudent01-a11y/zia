import AddCampusForm from "@/components/forms/AddCampusForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Directly fetch data in server component since it's a server component
export default async function EditCampusPage({ params }: { params: { id: string } }) {
    const campus = await prisma.campus.findUnique({
        where: { id: params.id },
    });

    if (!campus) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Campus</h1>
            <AddCampusForm initialData={campus} />
        </div>
    );
}
