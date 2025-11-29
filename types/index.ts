export interface DisasterCenter {
  id: number
  name: string
  address: string
  description?: string | null
  latitude: number
  longitude: number
  capacity?: number | null
  contactPhone?: string | null
  contactEmail?: string | null
  facilities: string[]
  isActive: boolean
  userId?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateDisasterCenterInput {
  name: string
  address: string
  description?: string
  latitude: number
  longitude: number
  capacity?: number
  contactPhone?: string
  contactEmail?: string
  facilities?: string[]
}

export interface UserLocation {
  latitude: number
  longitude: number
}

export interface DisasterCenterWithDistance extends DisasterCenter {
  distance: number // in kilometers
}
