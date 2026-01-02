"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Upload, Menu, X } from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/students", label: "Students", icon: Users },
    { href: "/dashboard/campuses", label: "Campuses", icon: Building2 },
    { href: "/dashboard/import", label: "Import Excel", icon: Upload },
];

export default function SideNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20">
                <h1 className="text-xl font-bold text-blue-600">Student Data Analyzer</h1>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 border rounded">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 bg-white border-r w-64 p-4 z-40 transform transition-transform duration-200 ease-in-out
                md:translate-x-0 md:static md:min-h-screen
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="mb-8 px-4 hidden md:block">
                    <h1 className="text-xl font-bold text-blue-600">Student Data Analyzer</h1>
                </div>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
