"use client";

import dynamic from "next/dynamic";

const CampusMap = dynamic(() => import("./CampusMap"), {
    ssr: false,
    loading: () => (
        <div className="h-64 md:h-96 w-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
            Loading Map...
        </div>
    ),
});

export default function MapWrapper() {
    return <CampusMap />;
}
