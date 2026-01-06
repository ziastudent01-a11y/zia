"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Upload, Menu, X, LogOut, Home, GraduationCap, Calculator, Database } from "lucide-react";
import { signOut } from "next-auth/react";

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
                    <h1 className="text-xl font-bold text-blue-700">Student Data Analyzer</h1>
                </div>
                <nav className="space-y-2 flex flex-col h-full">
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-slate-700 hover:bg-gray-50 font-medium"
                                        }`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-auto border-t pt-4 space-y-2">
                        <Link
                            href="/"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            <Home size={20} />
                            Home
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>

                    <div className="pt-6 pb-2 px-2">
                        <div className="flex flex-row flex-wrap justify-center gap-3 text-[10px] text-slate-500 font-mono">
                            <div className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                <span>Professor Dr. Zia Qadri</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calculator className="w-3 h-3" />
                                <span>HR & Chartered</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                <span>Data Scientist</span>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
}
