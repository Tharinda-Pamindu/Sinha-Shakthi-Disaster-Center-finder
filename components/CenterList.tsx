'use client'

import React from 'react'
import { DisasterCenterWithDistance } from '@/types'

interface CenterListProps {
  centers: DisasterCenterWithDistance[]
  onCenterClick?: (center: DisasterCenterWithDistance) => void
}

export default function CenterList({ centers, onCenterClick }: CenterListProps) {
  if (centers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No disaster centers found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {centers.map((center) => (
        <div
          key={center.id}
          onClick={() => onCenterClick?.(center)}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800">{center.name}</h3>
            {center.distance !== undefined && (
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {center.distance} km
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">{center.address}</p>

          {center.description && (
            <p className="text-sm text-gray-700 mb-3">{center.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            {center.capacity && (
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Capacity:</span>
                <span className="ml-1">{center.capacity}</span>
              </div>
            )}
            {center.contactPhone && (
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Phone:</span>
                <span className="ml-1">{center.contactPhone}</span>
              </div>
            )}
          </div>

          {center.facilities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {center.facilities.map((facility, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {facility}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
