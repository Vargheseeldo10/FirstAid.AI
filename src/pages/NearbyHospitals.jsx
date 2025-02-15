import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Navigation, AlertCircle } from 'lucide-react';
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

const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pharmacyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
}

function NearbyPlaces() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(30000); // Default radius: 10 km
  const [placeType, setPlaceType] = useState('hospital'); // Default place type: hospital

  const placeTypes = [
    { value: 'hospital', label: 'Hospitals', icon: hospitalIcon },
    { value: 'clinic', label: 'Clinics', icon: restaurantIcon },
    { value: 'pharmacy', label: 'Pharmacies', icon: pharmacyIcon },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location:', pos); // Debugging
          setCurrentPosition(pos);
          searchNearbyPlaces(pos, searchRadius, placeType);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services and refresh the page.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  }, []);

  const searchNearbyPlaces = async (location, radius, type) => {
    try {
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="${type}"](around:${radius},${location.lat},${location.lng});
          way["amenity"="${type}"](around:${radius},${location.lat},${location.lng});
          relation["amenity"="${type}"](around:${radius},${location.lat},${location.lng});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Overpass API response:', data); // Debugging
      
      if (!data || !data.elements) {
        throw new Error('Invalid data received from Overpass API');
      }

      const placeData = data.elements
        .filter(element => element.tags && element.lat && element.lon)
        .map(element => ({
          id: element.id,
          name: element.tags.name || `Unnamed ${type}`,
          lat: element.lat,
          lng: element.lon,
          address: element.tags['addr:street'] 
            ? `${element.tags['addr:street']} ${element.tags['addr:housenumber'] || ''}`
            : 'Address not available',
          phone: element.tags.phone || null
        }));
      
      setPlaces(placeData);
      
      if (placeData.length === 0) {
        setError(`No ${type}s found within ${radius / 1000} km. Try increasing the search radius.`);
      } else {
        setError(null); // Clear error if places are found
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setError(`Unable to fetch nearby ${type}s. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDirections = (place) => {
    if (currentPosition) {
      const url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${currentPosition.lat},${currentPosition.lng};${place.lat},${place.lng}`;
      window.open(url, '_blank');
    } else {
      setError('Unable to get your current location for directions.');
    }
  };

  const handleSearchRadiusChange = (event) => {
    const newRadius = Number(event.target.value);
    setSearchRadius(newRadius);
    if (currentPosition) {
      searchNearbyPlaces(currentPosition, newRadius, placeType);
    }
  };

  const handlePlaceTypeChange = (event) => {
    const newPlaceType = event.target.value;
    setPlaceType(newPlaceType);
    if (currentPosition) {
      searchNearbyPlaces(currentPosition, searchRadius, newPlaceType);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nearby Hospitals & Pharmacies</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="placeType" className="block text-sm font-medium text-gray-700">
            Place Type:
          </label>
          <select
            id="placeType"
            value={placeType}
            onChange={handlePlaceTypeChange}
            className="mt-1 block w-full p-2 border rounded"
          >
            {placeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="searchRadius" className="block text-sm font-medium text-gray-700">
            Search Radius (km):
          </label>
          <select
            id="searchRadius"
            value={searchRadius}
            onChange={handleSearchRadiusChange}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
            <option value={50000}>50 km</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-[600px] relative">
            {currentPosition && (
              <MapContainer
                key={`${currentPosition.lat}-${currentPosition.lng}`}
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

                {places.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={placeTypes.find((type) => type.value === placeType)?.icon || hospitalIcon}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <h3 className="font-semibold">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {places.length === 0 ? (
              <div className="text-center text-gray-500">
                No {placeType}s found in your area
              </div>
            ) : (
              places.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{place.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    {place.address}
                  </p>
                  <div className="flex gap-2 mt-4">
                    {place.phone && (
                      <a
                        href={`tel:${place.phone}`}
                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                        aria-label="Call place"
                      >
                        <Phone size={16} />
                        Call
                      </a>
                    )}
                    <button
                      onClick={() => getDirections(place)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                      aria-label="Get directions to place"
                    >
                      <Navigation size={16} />
                      Directions
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NearbyPlaces;