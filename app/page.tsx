'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import AddCenterForm from '@/components/AddCenterForm'
import CenterList from '@/components/CenterList'
import { DisasterCenterWithDistance, CreateDisasterCenterInput, UserLocation } from '@/types'
import { getCurrentLocation } from '@/lib/geo-utils'
import axios from 'axios'

// Dynamically import MapComponent with no SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [centers, setCenters] = useState<DisasterCenterWithDistance[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMapLocation, setSelectedMapLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchRadius, setSearchRadius] = useState('5')
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
      setError(null)
      const location = await getCurrentLocation()
      setUserLocation(location)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get your location'
      // Log the actual error object for debugging, but show user-friendly message
      console.error('Location error:', err)
      setError(errorMessage)
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <img 
              src="/lion.png" 
              alt="Sinha Shakthi Logo" 
              className="h-16 w-16 object-contain"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">සිංහ ශක්ති | Sinha Shakthi</h1>
              <p className="text-sm mt-1">Disaster Center Finder - Locate and add disaster relief centers in your area</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 rounded mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-yellow-700 font-medium">
                  {error}
                </p>
                {error.includes('denied') || error.includes('permission') ? (
                  <div className="mt-2 text-xs text-yellow-600">
                    <p className="font-semibold mb-1">To enable location access:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Click the lock icon (🔒) or info icon (ℹ️) in your browser's address bar</li>
                      <li>Find "Location" in the permissions list</li>
                      <li>Change it to "Allow" or "Ask"</li>
                      <li>Refresh the page or click "Get My Location" again</li>
                    </ul>
                    <p className="mt-2 italic">You can still use the app by entering addresses manually or clicking on the map.</p>
                  </div>
                ) : null}
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 ml-3 text-yellow-400 hover:text-yellow-600"
                aria-label="Close notification"
                title="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
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
                <label htmlFor="searchDistance" className="text-sm font-medium text-gray-700">
                  Search Distance:
                </label>
                <select
                  id="searchDistance"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1">1 km</option>
                  <option value="2">2 km</option>
                  <option value="3">3 km</option>
                  <option value="4">4 km</option>
                  <option value="5">5 km</option>
                  <option value="6">6 km</option>
                  <option value="7">7 km</option>
                  <option value="8">8 km</option>
                  <option value="9">9 km</option>
                  <option value="10">10 km</option>
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
