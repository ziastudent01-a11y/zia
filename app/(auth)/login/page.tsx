"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Calculator, Database } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Student Mgr Login</h1>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-900">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full border rounded-md p-2 text-slate-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-900">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full border rounded-md p-2 text-slate-900"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center text-slate-600 text-xs">
                    Try: admin / admin123
                </div>
            </div>

            <div className="absolute bottom-4 flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-mono tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Professor Dr. Zia Qadri</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span>HR & Chartered</span>
                </div>
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>Data Scientist</span>
                </div>
            </div>
        </div>
    );
}
