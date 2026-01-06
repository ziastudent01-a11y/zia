import CampusesTable from "@/components/dashboard/CampusesTable";

export default function CampusesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-700">Manage Campuses</h1>
            <CampusesTable />
        </div>
    );
}
