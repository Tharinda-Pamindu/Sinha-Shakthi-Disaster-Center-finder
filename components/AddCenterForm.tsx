'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CreateDisasterCenterInput } from '@/types'
import { getCurrentLocation } from '@/lib/geo-utils'

interface AddCenterFormProps {
  onSubmit: (data: CreateDisasterCenterInput) => void
  onCancel?: () => void
  initialLocation?: { lat: number; lng: number } | null
}

export default function AddCenterForm({
  onSubmit,
  onCancel,
  initialLocation,
}: AddCenterFormProps) {
  const [formData, setFormData] = useState<CreateDisasterCenterInput>({
    name: '',
    address: '',
    description: '',
    latitude: initialLocation?.lat || 0,
    longitude: initialLocation?.lng || 0,
    capacity: undefined,
    contactPhone: '',
    contactEmail: '',
    facilities: [],
  })

  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  const [autoGeocodeEnabled, setAutoGeocodeEnabled] = useState(true)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const availableFacilities = [
    'Shelter',
    'Medical',
    'Food',
    'Water',
    'Clothing',
    'Sanitation',
    'Communications',
    'Security',
  ]

  // Auto-geocode address when it changes (with debouncing)
  useEffect(() => {
    if (!autoGeocodeEnabled || !formData.address.trim()) {
      return
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer to geocode after 1.5 seconds of no typing
    debounceTimerRef.current = setTimeout(() => {
      geocodeAddress(formData.address)
    }, 1500)

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [formData.address, autoGeocodeEnabled])

  // Geocode function
  const geocodeAddress = async (address: string) => {
    if (!address.trim() || address.length < 10) {
      return // Don't geocode very short addresses
    }

    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || !google.maps || !google.maps.Geocoder) {
      setGeocodingError('Google Maps is still loading. Please try again in a moment.')
      return
    }

    setIsGeocodingLoading(true)
    setGeocodingError(null)

    try {
      const geocoder = new google.maps.Geocoder()
      const result = await geocoder.geocode({ address })

      if (result && result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat(),
          longitude: location.lng(),
        }))
        setGeocodingError(null)
      } else {
        setGeocodingError('Address not found. Please try a more specific address.')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to find location'
      setGeocodingError(`Geocoding failed: ${errorMessage}`)
    } finally {
      setIsGeocodingLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    )
  }

  // Manual geocode address to get coordinates
  const handleGeocodeAddress = async () => {
    if (!formData.address.trim()) {
      setGeocodingError('Please enter an address first')
      return
    }

    await geocodeAddress(formData.address)
  }

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsLocationLoading(true)
    setGeocodingError(null)

    try {
      const location = await getCurrentLocation()
      setFormData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }))
      alert(`✓ Current location set: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`)
    } catch (error) {
      console.error('Location error:', error)
      setGeocodingError('Failed to get current location. Please enable location access.')
    } finally {
      setIsLocationLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      facilities: selectedFacilities,
    })
  }

  React.useEffect(() => {
    if (initialLocation) {
      setFormData((prev) => ({
        ...prev,
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
      }))
    }
  }, [initialLocation])

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Add New Disaster Center
      </h2>

      {geocodingError && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {geocodingError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <label className="flex items-center text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={autoGeocodeEnabled}
              onChange={(e) => setAutoGeocodeEnabled(e.target.checked)}
              className="mr-1"
            />
            Auto-fetch coordinates
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter full address (e.g., 123 Main St, Colombo, Sri Lanka)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleGeocodeAddress}
            disabled={isGeocodingLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium whitespace-nowrap disabled:bg-gray-400"
          >
            {isGeocodingLoading ? '⏳ Finding...' : '🔍 Find Now'}
          </button>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            {autoGeocodeEnabled 
              ? '✓ Coordinates will auto-update as you type' 
              : 'Click "Find Now" to get coordinates'}
          </p>
          {isGeocodingLoading && (
            <p className="text-xs text-blue-600 animate-pulse">
              Fetching location...
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Enter description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Coordinates *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              required
              placeholder="e.g., 6.9271"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              required
              placeholder="e.g., 79.8612"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocationLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
          >
            {isLocationLoading ? '⏳ Getting...' : '📍 Use My Current Location'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 You can also click on the map to select a location
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity || ''}
            onChange={handleChange}
            min="0"
            placeholder="e.g., 500"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Email
        </label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="e.g., contact@center.org"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Facilities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availableFacilities.map((facility) => (
            <label
              key={facility}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility)}
                onChange={() => handleFacilityToggle(facility)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
        >
          Add Disaster Center
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
