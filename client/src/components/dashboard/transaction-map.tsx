import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

// Fix Leaflet default marker icons issue
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function TransactionMap() {
  const { locationData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-semibold text-gray-700">Transaction Volume</span>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-semibold text-gray-700">
          Transaction Volume
        </span>
        <span className="text-xs text-gray-400">Last 30 days</span>
      </div>
      <div className="flex-1 aspect-map relative rounded-lg overflow-hidden">
        <MapContainer
          center={[12.8797, 121.7740]} // Center of the Philippines
          zoom={6}
          className="h-full w-full"
          style={{ background: '#f8fafc' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {locationData?.map(location => (
            <CircleMarker
              key={location.location}
              center={[location.coordinates[1], location.coordinates[0]]} // lat, lng
              radius={Math.max(8, Math.sqrt(location.transactions) * 0.8)}
              fillOpacity={0.7}
              color="#2563eb"
              fillColor="#3b82f6"
              stroke={true}
              weight={2}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent={false}>
                <div className="text-center">
                  <div className="font-semibold">{location.location}</div>
                  <div className="text-sm">{location.transactions.toLocaleString()} transactions</div>
                  <div className="text-xs text-gray-600">₱{(location.revenue / 1000000).toFixed(1)}M revenue</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}