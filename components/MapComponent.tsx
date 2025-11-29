'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { DisasterCenterWithDistance } from '@/types'

interface MapComponentProps {
  centers: DisasterCenterWithDistance[]
  userLocation?: { latitude: number; longitude: number } | null
  onMapClick?: (lat: number, lng: number) => void
  selectedLocation?: { lat: number; lng: number } | null
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
}

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
}

export default function MapComponent({
  centers,
  userLocation,
  onMapClick,
  selectedLocation,
}: MapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedCenter, setSelectedCenter] = useState<DisasterCenterWithDistance | null>(null)
  const [center, setCenter] = useState(defaultCenter)

  useEffect(() => {
    if (userLocation) {
      setCenter({
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      })
    }
  }, [userLocation])

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && onMapClick) {
      onMapClick(e.latLng.lat(), e.latLng.lng())
    }
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={{
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
            title="Your Location"
          />
        )}

        {/* Selected Location Marker (for adding new center) */}
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
            title="Selected Location"
          />
        )}

        {/* Disaster Center Markers */}
        {centers.map((center) => (
          <Marker
            key={center.id}
            position={{
              lat: center.latitude,
              lng: center.longitude,
            }}
            onClick={() => setSelectedCenter(center)}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
            title={center.name}
          />
        ))}

        {/* Info Window for Selected Center */}
        {selectedCenter && (
          <InfoWindow
            position={{
              lat: selectedCenter.latitude,
              lng: selectedCenter.longitude,
            }}
            onCloseClick={() => setSelectedCenter(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-lg mb-2">{selectedCenter.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{selectedCenter.address}</p>
              {selectedCenter.description && (
                <p className="text-sm mb-2">{selectedCenter.description}</p>
              )}
              {selectedCenter.distance !== undefined && (
                <p className="text-sm font-semibold text-blue-600">
                  Distance: {selectedCenter.distance} km
                </p>
              )}
              {selectedCenter.capacity && (
                <p className="text-sm">Capacity: {selectedCenter.capacity}</p>
              )}
              {selectedCenter.contactPhone && (
                <p className="text-sm">Phone: {selectedCenter.contactPhone}</p>
              )}
              {selectedCenter.facilities.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">Facilities:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCenter.facilities.map((facility, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}
