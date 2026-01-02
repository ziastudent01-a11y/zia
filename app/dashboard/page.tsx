import KpiCards from "@/components/dashboard/KpiCards";
import CampusMap from "@/components/dashboard/CampusMap";
import ChartsSection from "@/components/dashboard/ChartsSection";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* KPIs */}
      <KpiCards />

      {/* Map */}
      <CampusMap />

      {/* Charts */}
      <ChartsSection />
    </div>
  );
}
