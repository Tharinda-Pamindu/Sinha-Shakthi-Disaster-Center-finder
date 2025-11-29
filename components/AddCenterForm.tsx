'use client'

import React, { useState } from 'react'
import { CreateDisasterCenterInput } from '@/types'

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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude *
          </label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude *
          </label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

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
