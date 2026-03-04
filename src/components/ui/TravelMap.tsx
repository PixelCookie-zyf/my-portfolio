"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { visitedCities, type City } from "@/data/travel";

function getMarkerIcon(city: City) {
  if (city.current) {
    return L.divIcon({
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#f97316;box-shadow:0 0 14px #f97316,0 0 28px #f9731640;animation:mapPulse 2s ease-in-out infinite;"></div>`,
    });
  }
  if (city.country !== "China" && city.country !== "Japan") {
    return L.divIcon({
      className: "",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      html: `<div style="width:12px;height:12px;border-radius:50%;background:#8b5cf6;box-shadow:0 0 10px #8b5cf6,0 0 20px #8b5cf640;animation:mapPulse 2.5s ease-in-out infinite;"></div>`,
    });
  }
  return L.divIcon({
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    html: `<div style="width:10px;height:10px;border-radius:50%;background:#64748b;box-shadow:0 0 8px #64748b80;animation:mapPulse 3s ease-in-out infinite;"></div>`,
  });
}

export default function TravelMap() {
  return (
    <>
      <style>{`
        @keyframes mapPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        }
        .leaflet-popup-tip {
          box-shadow: none !important;
        }
      `}</style>
      <MapContainer
        center={[20, 80]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom={false}
        zoomControl={true}
        worldCopyJump={true}
        className="h-[400px] sm:h-[500px] w-full rounded-2xl z-0"
        style={{ background: "#f1f5f9" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {visitedCities.map((city) => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={getMarkerIcon(city)}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-900">
                  {city.name}
                </p>
                <p className="text-xs text-gray-500">{city.country}</p>
                {city.current && (
                  <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-600">
                    Current
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
