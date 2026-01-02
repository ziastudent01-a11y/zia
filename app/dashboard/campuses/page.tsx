import CampusesTable from "@/components/dashboard/CampusesTable";

export default function CampusesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Campuses</h1>
            <CampusesTable />
        </div>
    );
}
