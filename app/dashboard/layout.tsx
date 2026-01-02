import SideNav from "@/components/SideNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideNav />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
