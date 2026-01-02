import KpiCards from "@/components/dashboard/KpiCards";
import MapWrapper from "@/components/dashboard/MapWrapper";
import ChartsSection from "@/components/dashboard/ChartsSection";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* KPIs */}
      <KpiCards />

      {/* Map */}
      <MapWrapper />

      {/* Charts */}
      <ChartsSection />
    </div>
  );
}
