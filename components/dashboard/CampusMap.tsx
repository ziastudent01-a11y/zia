"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

type CampusWithStats = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  stats: {
    total: number;
    fileComplete: number;
    fileSubmitted: number;
    returned: number;
    fileIncomplete: number;
    notFiled: number;
    active: number;
    completed: number;
    dropped: number;
  };
};

export default function CampusMap() {
  const [campuses, setCampuses] = useState<CampusWithStats[]>([]);
  const [zoomLevel, setZoomLevel] = useState(6);

  useEffect(() => {
    fetch("/api/campuses")
      .then((res) => res.json())
      .then(setCampuses);
  }, []);

  // Calculate generic marker size based on zoom
  const getMarkerSize = (zoom: number) => Math.max(20, zoom * 3.5);

  const CreateCustomIcon = (zoom: number, stats: any) => {
    const size = getMarkerSize(zoom);
    return L.divIcon({
      className: "custom-marker",
      html: `<div class="marker-pulse" style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
        border: 2px solid white;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 40%;
          height: 40%;
          background: white;
          border-radius: 50%;
        "></div>
        ${zoom > 6 ? `
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 999px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          ${stats.total}
        </div>
        ` : ''}
      </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  // Component to track zoom
  function ZoomHandler() {
    const map = useMapEvents({
      zoomend: () => {
        setZoomLevel(map.getZoom());
      },
    });
    return null;
  }

  return (
    <div className="h-100 rounded-xl overflow-hidden shadow relative z-0">
      <MapContainer center={[30.3753, 69.3451]} zoom={6} className="h-full z-0">
        <ZoomHandler />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {campuses.map((campus) => (
          <Marker
            key={campus.id}
            position={[campus.latitude, campus.longitude]}
            icon={CreateCustomIcon(zoomLevel, campus.stats)}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[240px]">
                <div className="border-b pb-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{campus.name}</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">{campus.city}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <span className="block text-xl font-bold text-blue-600">{campus.stats.total}</span>
                    <span className="text-xs text-blue-800">Total</span>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <span className="block text-xl font-bold text-green-600">{campus.stats.active}</span>
                    <span className="text-xs text-green-800">Active</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-700">
                  <div className="flex justify-between border-b border-dashed pb-1">
                    <span>File Complete</span>
                    <span className="font-semibold text-green-600">{campus.stats.fileComplete}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-1">
                    <span>Submitted</span>
                    <span className="font-semibold text-blue-600">{campus.stats.fileSubmitted}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-1">
                    <span>Returned</span>
                    <span className="font-semibold text-orange-600">{campus.stats.returned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incomplete</span>
                    <span className="font-semibold text-red-500">{campus.stats.fileIncomplete}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t text-center">
                  <a href={`/dashboard/campuses/${campus.id}/edit`} className="inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors">
                    Edit Campus Details
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
