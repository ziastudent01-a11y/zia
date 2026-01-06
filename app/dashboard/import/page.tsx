import ExcelImportForm from "@/components/forms/ExcelImportForm";

export default function ImportPage() {
    return (
        <div className="max-w-xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Import Data</h1>
            <ExcelImportForm />

            <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">Instructions:</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Upload a .xlsx file containing student records.</li>
                    <li>Required columns: File Number, Student Name, Campus Code.</li>
                    <li>Ensure Campus Codes match existing campuses.</li>
                </ul>
            </div>
        </div>
    );
}
