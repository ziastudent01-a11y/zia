import StudentEntryForm from "@/components/forms/StudentEntryForm";

export default function AddStudentPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Add New Student</h1>
            <StudentEntryForm />
        </div>
    );
}
