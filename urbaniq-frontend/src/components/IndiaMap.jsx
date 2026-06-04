import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = 'http://localhost:5000/api';

export default function IndiaMap() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get(`${API_URL}/pins`);
        setPins(res.data);
      } catch (err) {
        console.error("Failed to fetch pins", err);
      }
    };
    fetchPins();
    
    // Simulate real-time fetch interval
    const interval = setInterval(fetchPins, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full lg:w-[380px] xl:w-[450px] lg:border-l border-b lg:border-b-0 border-surface-variant bg-surface p-4 md:p-6 flex flex-col order-1 lg:order-2 lg:h-full shrink-0">
      <header className="mb-6">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant">REGIONAL ANALYTICS // INDIA</h3>
        <h4 className="font-headline-sm text-headline-sm text-on-surface mt-1">Community Pins Map</h4>
      </header>
      
      <div className="relative bg-surface-dim border-technical overflow-hidden flex flex-col h-[250px] sm:h-[350px] lg:h-[400px] shrink-0 mb-6">
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 z-10" style={{ backgroundImage: 'radial-gradient(#909095 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
        
        <MapContainer center={[22.5937, 78.9629]} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer 
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
          />
          {pins.map(pin => (
            <Marker key={pin._id} position={[pin.lat, pin.lng]}>
              <Popup className="tactical-popup">
                <div className="bg-tactical border-technical p-1 -m-3 min-w-[150px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-error animate-pulse"></span>
                    <span className="font-label-caps text-[10px] tracking-wider text-on-surface uppercase">{pin.city}</span>
                  </div>
                  <p className="text-data-mono font-data-mono text-[11px] text-on-surface leading-tight capitalize">
                    {pin.problem_type}
                  </p>
                  <p className="text-data-mono font-data-mono text-[9px] text-error mt-2 opacity-80">REPORTED: {new Date(pin.created_at).toLocaleDateString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-col min-h-0 lg:flex-1">
        <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-3">
          <span className="font-label-caps text-label-caps text-on-tertiary-container">LIVE INCIDENTS</span>
          <span className="font-data-mono text-data-mono text-primary">{pins.length} ACTIVE</span>
        </div>
        <div className="overflow-y-auto custom-scrollbar space-y-2 pb-4 lg:flex-1 h-[200px] lg:h-auto">
          {pins.slice(0, 10).map((pin, i) => (
            <div key={pin._id || i} className="bg-surface-container p-3 border-l-2 border-error flex justify-between items-center group hover:bg-surface-container-high transition-colors">
              <div>
                <p className="font-label-caps text-label-caps uppercase text-on-surface">{pin.city}</p>
                <p className="text-data-mono font-data-mono text-[10px] text-on-surface-variant uppercase mt-0.5">{pin.problem_type?.replace(/\s+/g, '_')}</p>
              </div>
              <span className="material-symbols-outlined text-error text-[18px]">priority_high</span>
            </div>
          ))}
          {pins.length === 0 && (
            <div className="text-center font-data-mono text-on-surface-variant text-[11px] py-4">NO ACTIVE INCIDENTS</div>
          )}
        </div>
      </div>
    </section>
  );
}
