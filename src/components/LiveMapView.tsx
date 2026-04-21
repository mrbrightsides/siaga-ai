
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchFloods, fetchLiveReports, PetaBencanaReport } from '../services/petaBencanaService';
import { Loader2, AlertTriangle, Info, Bot } from 'lucide-react';
import { AgentAction } from '../services/aiAgentService';

// Fix for default marker icons in Leaflet with Webpack/Vite
const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const markerIconRetina = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const botIcon = L.divIcon({
  html: `<div class="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center shadow-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>`,
  className: 'custom-bot-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LiveMapViewProps {
  agentActions?: AgentAction[];
}

export default function LiveMapView({ agentActions = [] }: LiveMapViewProps) {
  const [floods, setFloods] = React.useState<any[]>([]);
  const [reports, setReports] = React.useState<PetaBencanaReport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const position: [number, number] = [-6.2088, 106.8456]; // Jakarta Center

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [floodData, reportData] = await Promise.all([
        fetchFloods(),
        fetchLiveReports()
      ]);
      setFloods(floodData);
      setReports(reportData);
      setLoading(false);
    }
    loadData();
    const interval = setInterval(loadData, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Sychronizing Geospatial Layers...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl">
      <MapContainer center={position} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%', background: '#020617' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Dark Map (CARTO)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="NASA Satellite (Live Daily)">
            <TileLayer
              attribution='&copy; <a href="https://earthdata.nasa.gov/gibs">NASA EOSDIS GIBS</a>'
              url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${new Date(Date.now() - 86400000).toISOString().split('T')[0]}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Flood Areas (Live)">
            <React.Fragment>
              {floods.map((flood, i) => {
                const isPolygon = flood.type === 'Polygon';
                // Simplified visualization for polygons (markers for now as PetaBencana returns complex geometries)
                const coords = (flood.coordinates && flood.coordinates[0]) || flood.coordinates;
                if (!coords) return null;
                
                return (
                  <Circle 
                    key={`flood-${i}`}
                    center={[coords[1], coords[0]]}
                    pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}
                    radius={500}
                  >
                    <Popup className="custom-popup">
                      <div className="p-1">
                        <h4 className="font-bold text-red-500 flex items-center gap-2">
                          <AlertTriangle size={14} /> Active Flood
                        </h4>
                        <p className="text-xs mt-1">Severity: {flood.properties?.severity || 'High'}</p>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}
            </React.Fragment>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Citizen Reports">
            <React.Fragment>
              {reports.map((report, i) => (
                <Marker key={`report-${i}`} position={[report.coordinates[1], report.coordinates[0]]}>
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-bold text-blue-500 flex items-center gap-2">
                        <Info size={14} /> Citizen Report
                      </h4>
                      <p className="text-xs mt-1 leading-tight">{report.properties.text}</p>
                      <p className="text-[10px] text-slate-500 mt-2">{new Date(report.properties.created_at).toLocaleString()}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="AI Missions (Autonomous)">
            <React.Fragment>
              {agentActions.map((log) => (
                <Marker key={log.id} position={log.location} icon={botIcon}>
                  <Popup>
                    <div className="p-1 max-w-[200px]">
                      <h4 className="font-bold text-indigo-500 flex items-center gap-2 mb-1">
                        <Bot size={14} /> AI Intervention
                      </h4>
                      <p className="text-[10px] font-bold text-slate-300 uppercase mb-1">{log.incidentType} - {log.severity}</p>
                      <p className="text-[10px] text-slate-400 mb-2 leading-snug">{log.analysis}</p>
                      <div className="flex flex-wrap gap-1">
                        {log.dispatchedActions.map((action, idx) => (
                          <span key={idx} className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] glass p-3 rounded-2xl pointer-events-none">
        <h5 className="text-[10px] font-mono text-slate-400 uppercase mb-2">Live Map Legend</h5>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60 border border-red-500" />
            <span className="text-[10px] text-slate-300">Flood Inundation Area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] text-slate-300">Active Citizen Report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_5px_rgba(79,70,229,0.5)] flex items-center justify-center">
               <Bot size={8} className="text-white" />
            </div>
            <span className="text-[10px] text-slate-300">Autonomous AI Intervention</span>
          </div>
        </div>
      </div>
    </div>
  );
}
