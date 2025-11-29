import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateDistance } from '@/lib/geo-utils'

// GET: Find nearest disaster centers to a given location
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const limit = searchParams.get('limit') || '5'

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)

    const centers = await prisma.disasterCenter.findMany({
      where: {
        isActive: true,
      },
    })

    const centersWithDistance = centers
      .map((center) => ({
        ...center,
        distance: calculateDistance(
          userLat,
          userLng,
          center.latitude,
          center.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, parseInt(limit))

    return NextResponse.json({
      success: true,
      data: centersWithDistance,
      count: centersWithDistance.length,
      userLocation: {
        latitude: userLat,
        longitude: userLng,
      },
    })
  } catch (error) {
    console.error('Error finding nearest disaster centers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to find nearest disaster centers' },
      { status: 500 }
    )
  }
}
