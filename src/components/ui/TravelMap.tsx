"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { visitedCities, type City } from "@/data/travel";

const cartoApiKey = process.env.NEXT_PUBLIC_CARTO_BASEMAP_KEY?.trim();

function getMarkerIcon(city: City) {
  const size = city.current ? 16 : city.country !== "China" && city.country !== "Japan" ? 12 : 10;
  const color = city.current ? "#da702c" : city.country !== "China" && city.country !== "Japan" ? "#3aa99f" : "#8e8881";
  return L.divIcon({
    className: `travel-marker${city.current ? " travel-marker-current" : ""}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fffcf0;box-shadow:0 0 0 3px ${color}22,0 2px 7px #00000025"></span>`,
  });
}

export default function TravelMap() {
  return (
    <>
      <MapContainer
        center={[20, 80]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom={false}
        zoomControl={true}
        worldCopyJump={true}
        className="travel-map h-[400px] sm:h-[500px] w-full z-0"
        style={{ background: "#efece0" }}
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
              <div className="text-center">
                <p className="font-semibold text-sm text-foreground">
                  {city.name}
                </p>
                <p className="text-xs text-muted">{city.country}</p>
                {city.current && (
                  <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-accent/10 text-accent">
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
