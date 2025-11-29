'use client'

import { useState, useEffect } from 'react'
import MapComponent from '@/components/MapComponent'
import AddCenterForm from '@/components/AddCenterForm'
import CenterList from '@/components/CenterList'
import { DisasterCenterWithDistance, CreateDisasterCenterInput, UserLocation } from '@/types'
import { getCurrentLocation } from '@/lib/geo-utils'
import axios from 'axios'

export default function Home() {
  const [centers, setCenters] = useState<DisasterCenterWithDistance[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMapLocation, setSelectedMapLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchRadius, setSearchRadius] = useState('50')
  const [showNearestOnly, setShowNearestOnly] = useState(false)

  // Fetch all disaster centers
  const fetchCenters = async (location?: UserLocation) => {
    try {
      setLoading(true)
      setError(null)
      
      let url = '/api/disaster-centers'
      if (location) {
        url += `?lat=${location.latitude}&lng=${location.longitude}&radius=${searchRadius}`
      }

      const response = await axios.get(url)
      setCenters(response.data.data)
    } catch (err) {
      console.error('Error fetching centers:', err)
      setError('Failed to load disaster centers')
    } finally {
      setLoading(false)
    }
  }

  // Fetch nearest centers
  const fetchNearestCenters = async (location: UserLocation) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get('/api/disaster-centers/nearest', {
        params: {
          lat: location.latitude,
          lng: location.longitude,
          limit: 10,
        },
      })
      
      setCenters(response.data.data)
    } catch (err) {
      console.error('Error fetching nearest centers:', err)
      setError('Failed to load nearest disaster centers')
    } finally {
      setLoading(false)
    }
  }

  // Get user location on mount
  useEffect(() => {
    getUserLocation()
  }, [])

  // Refresh centers when user location or search radius changes
  useEffect(() => {
    if (userLocation) {
      if (showNearestOnly) {
        fetchNearestCenters(userLocation)
      } else {
        fetchCenters(userLocation)
      }
    } else {
      fetchCenters()
    }
  }, [userLocation, searchRadius, showNearestOnly])

  const getUserLocation = async () => {
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
    } catch (err) {
      console.error('Error getting user location:', err)
      // Still fetch centers without location
      fetchCenters()
    }
  }

  const handleAddCenter = async (data: CreateDisasterCenterInput) => {
    try {
      setLoading(true)
      setError(null)
      
      await axios.post('/api/disaster-centers', data)
      
      // Reset form and refresh centers
      setShowAddForm(false)
      setSelectedMapLocation(null)
      
      if (userLocation) {
        if (showNearestOnly) {
          fetchNearestCenters(userLocation)
        } else {
          fetchCenters(userLocation)
        }
      } else {
        fetchCenters()
      }
      
      alert('Disaster center added successfully!')
    } catch (err) {
      console.error('Error adding center:', err)
      setError('Failed to add disaster center')
      alert('Failed to add disaster center. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (showAddForm) {
      setSelectedMapLocation({ lat, lng })
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🚨 Disaster Center Finder</h1>
          <p className="text-sm mt-2">Locate and add disaster relief centers in your area</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                {showAddForm ? 'Cancel' : '+ Add Disaster Center'}
              </button>
              
              <button
                onClick={getUserLocation}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                disabled={loading}
              >
                📍 Get My Location
              </button>

              <button
                onClick={() => setShowNearestOnly(!showNearestOnly)}
                className={`px-6 py-2 rounded-md transition-colors font-medium ${
                  showNearestOnly
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {showNearestOnly ? '✓ Showing Nearest' : 'Show Nearest Only'}
              </button>
            </div>

            {!showNearestOnly && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Search Radius:
                </label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                  <option value="200">200 km</option>
                </select>
              </div>
            )}
          </div>

          {userLocation && (
            <div className="mt-3 text-sm text-gray-600">
              Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </div>
          )}
        </div>

        {/* Add Center Form */}
        {showAddForm && (
          <div className="mb-6">
            <AddCenterForm
              onSubmit={handleAddCenter}
              onCancel={() => {
                setShowAddForm(false)
                setSelectedMapLocation(null)
              }}
              initialLocation={selectedMapLocation}
            />
            <p className="text-sm text-gray-600 mt-2 text-center">
              💡 Click on the map to select a location for the new disaster center
            </p>
          </div>
        )}

        {/* Map and List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <MapComponent
                centers={centers}
                userLocation={userLocation}
                onMapClick={handleMapClick}
                selectedLocation={selectedMapLocation}
              />
            </div>
          </div>

          {/* Centers List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {showNearestOnly ? 'Nearest Centers' : 'All Centers'}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {loading ? 'Loading...' : `Found ${centers.length} disaster center(s)`}
              </p>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              <CenterList centers={centers} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
