import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when location changes
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
}

function NearbyHospitals() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(pos);
          searchNearbyHospitals(pos);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    }
  }, []);

  const searchNearbyHospitals = async (location) => {
    try {
      // Using Overpass API to fetch hospitals
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:5000,${location.lat},${location.lng});
          way["amenity"="hospital"](around:5000,${location.lat},${location.lng});
          relation["amenity"="hospital"](around:5000,${location.lat},${location.lng});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      
      const data = await response.json();
      const hospitalData = data.elements.map(element => ({
        id: element.id,
        name: element.tags.name || 'Unnamed Hospital',
        lat: element.lat,
        lng: element.lon,
        address: element.tags['addr:street'] ? `${element.tags['addr:street']} ${element.tags['addr:housenumber'] || ''}` : 'Address not available',
        phone: element.tags.phone || null
      }));
      
      setHospitals(hospitalData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setIsLoading(false);
    }
  };

  const getDirections = (hospital) => {
    if (currentPosition) {
      const url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${currentPosition.lat},${currentPosition.lng};${hospital.lat},${hospital.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nearby Hospitals</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-[600px] relative">
            {currentPosition && (
              <MapContainer
                center={[currentPosition.lat, currentPosition.lng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg shadow-md"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap position={[currentPosition.lat, currentPosition.lng]} />
                
                <Marker
                  position={[currentPosition.lat, currentPosition.lng]}
                  icon={currentLocationIcon}
                >
                  <Popup>You are here</Popup>
                </Marker>

                {hospitals.map((hospital) => (
                  <Marker
                    key={hospital.id}
                    position={[hospital.lat, hospital.lng]}
                    icon={hospitalIcon}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <h3 className="font-semibold">{hospital.name}</h3>
                        <p className="text-sm text-gray-600">{hospital.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold mb-2">{hospital.name}</h3>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  {hospital.address}
                </p>
                <div className="flex gap-2 mt-4">
                  {hospital.phone && (
                    <a
                      href={`tel:${hospital.phone}`}
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                    >
                      <Phone size={16} />
                      Call
                    </a>
                  )}
                  <button
                    onClick={() => getDirections(hospital)}
                    className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    <Navigation size={16} />
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NearbyHospitals;