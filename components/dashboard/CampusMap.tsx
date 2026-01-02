"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

type Campus = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type CampusWithCount = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  _count?: { students: number };
};

export default function CampusMap() {
  const [campuses, setCampuses] = useState<CampusWithCount[]>([]);

  useEffect(() => {
    fetch("/api/campuses")
      .then((res) => res.json())
      .then(setCampuses);
  }, []);

  return (
    <div className="h-100 rounded-xl overflow-hidden shadow">
      <MapContainer center={[30.3753, 69.3451]} zoom={6} className="h-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {campuses.map((campus) => (
          <Marker key={campus.id} position={[campus.latitude, campus.longitude]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{campus.name}</h3>
                <p className="text-gray-600">{campus.city}</p>
                <div className="mt-2 text-sm font-medium text-blue-600">
                  Total Students: {campus._count?.students || 0}
                </div>
                <div className="mt-2 border-t pt-2">
                  <a href={`/dashboard/campuses/${campus.id}/edit`} className="text-xs text-gray-500 hover:text-blue-600 underline">
                    Edit Campus
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
