// app/components/MapComponent.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  center: [number, number];
  position: [number, number] | null;
  onPositionChange: (position: [number, number]) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapComponent({
  center,
  position,
  onPositionChange,
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const icon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
    setMarkerIcon(icon);
  }, []);

  const currentPosition: [number, number] = position || center;

  if (!isMounted) {
    return (
      <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading map...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <MapContainer
        center={currentPosition}
        zoom={13}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        touchZoom={true}
        zoomControl={true}
        style={{ width: "100%", height: "300px", borderRadius: "12px", zIndex: 0 }}
        className="rounded-xl shadow-sm"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerIcon && (
          <Marker
            position={currentPosition}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const { lat, lng } = marker.getLatLng();
                onPositionChange([lat, lng]);
              },
            }}
          />
        )}
        <MapUpdater center={currentPosition} />
      </MapContainer>
    </motion.div>
  );
}