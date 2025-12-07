"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Navigation, ChevronDown, ChevronUp } from "lucide-react";

// Dynamically import map component (only on client side)
const LocationMap = dynamic(
  () => import("@/components/households/location-map").then((mod) => mod.LocationMap),
  { ssr: false }
);

interface LocationFilters {
  lat: number;
  lng: number;
  distance: number;
}

interface LocationFilterProps {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
}

export function LocationFilter({ filters, onFiltersChange }: LocationFilterProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [customLat, setCustomLat] = useState(filters.lat.toString());
  const [customLng, setCustomLng] = useState(filters.lng.toString());
  const [customDistance, setCustomDistance] = useState(filters.distance.toString());
  const [showMap, setShowMap] = useState(false);

  const getUserLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newFilters = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          distance: filters.distance,
        };
        onFiltersChange(newFilters);
        setCustomLat(position.coords.latitude.toString());
        setCustomLng(position.coords.longitude.toString());
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Using default location.");
        setIsGettingLocation(false);
      }
    );
  };

  const handleCustomSearch = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    const distance = parseFloat(customDistance);

    if (isNaN(lat) || isNaN(lng) || isNaN(distance)) {
      alert("Please enter valid numbers for location and distance");
      return;
    }

    onFiltersChange({ lat, lng, distance });
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setCustomLat(lat.toString());
    setCustomLng(lng.toString());
    onFiltersChange({
      lat,
      lng,
      distance: filters.distance,
    });
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#013370]" />
            Search Location
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Use your location, enter custom coordinates, or click on the map to find nearby items
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {showMap ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide Map
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show Map
              </>
            )}
          </Button>
          <Button
            onClick={getUserLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="border-[#013370] text-[#013370] hover:bg-[#013370] hover:text-white"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Use My Location
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <Input
            type="number"
            step="any"
            value={customLat}
            onChange={(e) => setCustomLat(e.target.value)}
            placeholder="Enter latitude"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <Input
            type="number"
            step="any"
            value={customLng}
            onChange={(e) => setCustomLng(e.target.value)}
            placeholder="Enter longitude"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radius (km)
          </label>
          <Input
            type="number"
            value={customDistance}
            onChange={(e) => setCustomDistance(e.target.value)}
            placeholder="Enter distance"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleCustomSearch}
            className="w-full bg-[#013370] hover:bg-[#012a5c]"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <strong>Current search:</strong> {filters.lat.toFixed(4)}°, {filters.lng.toFixed(4)}° within {filters.distance}km
      </div>

      {/* Interactive Map */}
      {showMap && (
        <div className="mt-6 animate-in slide-in-from-top duration-300">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Click on the map to select a location
          </h4>
          <LocationMap
            lat={filters.lat}
            lng={filters.lng}
            distance={filters.distance}
            onLocationSelect={handleMapLocationSelect}
          />
        </div>
      )}
    </div>
  );
}
