import Link from "next/link";
import { ArrowRight, BarChart3, GraduationCap, Users, Calculator, Database, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-m mb-8 animate-fade-in text-gray-400">
          <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
          Superior Professional Academics Analytics Dashboard
        </div>

        {/* Hero Text */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight mb-4 animate-fade-in delay-100 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Empowering Education <br /> Through Data.
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 animate-fade-in delay-200 font-light">
          A next-generation analytics portal for Superior Professional Academy.
          Monitor performance, track admissions, and visualize success in real-time.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in delay-300">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium transition-all hover:bg-gray-200 hover:scale-105 active:scale-95"
          >
            Enter Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all blur-sm opacity-50" />
          </Link>
        </div>

        {/* Floating Stats Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto perspective-1000">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl text-left animate-float delay-100 transform transition hover:-translate-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-serif mb-1">24k+</h3>
            <p className="text-sm text-gray-400">Active Students</p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl text-left animate-float delay-200 transform transition hover:-translate-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-serif mb-1">95%</h3>
            <p className="text-sm text-gray-400">Graduation Rate</p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl text-left animate-float delay-300 transform transition hover:-translate-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-serif mb-1">12+</h3>
            <p className="text-sm text-gray-400">Campuses Monitored</p>
          </div>
        </div>
      </div>

      {/* Footer Element */}
      <div className="absolute bottom-4 flex flex-wrap justify-center gap-6 text-xs text-gray-400 font-mono tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          <span>Zia Qadri</span>
        </div>
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          <span>Fellow Chartered & Licentiate HR Personnel (FCIPD, UK)</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>Data Scientist</span>
        </div>
      </div>
    </div>
  );
}
