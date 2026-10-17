"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { visitedCities, type City } from "@/data/travel";

const cartoApiKey = process.env.NEXT_PUBLIC_CARTO_BASEMAP_KEY?.trim();

function getMarkerIcon(city: City) {
  const size = city.current ? 13 : 8;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:var(--accent);outline:2px solid var(--background);box-shadow:0 0 0 ${city.current ? 6 : 0}px color-mix(in srgb, var(--accent) 22%, transparent)"></span>`,
  });
}

export default function TravelMap() {
  return (
    <MapContainer
      center={[20, 80]}
      zoom={2}
      minZoom={2}
      maxZoom={10}
      scrollWheelZoom={false}
      worldCopyJump
      className="travel-map z-0 h-[340px] w-full md:h-[420px]"
      style={{ background: "var(--surface)" }}
    >
      <TileLayer
        attribution={cartoApiKey
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
        url={cartoApiKey
          ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(cartoApiKey)}`
          : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
        detectRetina={!cartoApiKey}
        maxZoom={19}
      />
      {visitedCities.map((city) => (
        <Marker
          key={city.name}
          title={`${city.name}, ${city.country}`}
          alt={`${city.name}, ${city.country}`}
          position={[city.lat, city.lng]}
          icon={getMarkerIcon(city)}
        >
          <Popup>
            <p className="text-sm font-medium">{city.name}</p>
            <p className="text-xs text-muted">
              {city.country}
              {city.current && " · current"}
            </p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
