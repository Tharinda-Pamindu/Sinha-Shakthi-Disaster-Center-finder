import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateDistance } from '@/lib/geo-utils'

// GET: Fetch all disaster centers or search by location
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') || '50' // Default 50km radius
    const limit = searchParams.get('limit') || '100'

    const centers = await prisma.disasterCenter.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
    })

    // If location provided, calculate distances and filter by radius
    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      const maxRadius = parseFloat(radius)

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
        .filter((center) => center.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance)

      return NextResponse.json({
        success: true,
        data: centersWithDistance,
        count: centersWithDistance.length,
      })
    }

    return NextResponse.json({
      success: true,
      data: centers,
      count: centers.length,
    })
  } catch (error) {
    console.error('Error fetching disaster centers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch disaster centers' },
      { status: 500 }
    )
  }
}

// POST: Create a new disaster center
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      address,
      description,
      latitude,
      longitude,
      capacity,
      contactPhone,
      contactEmail,
      facilities,
    } = body

    // Validation
    if (!name || !address || !latitude || !longitude) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, address, latitude, and longitude are required',
        },
        { status: 400 }
      )
    }

    const disasterCenter = await prisma.disasterCenter.create({
      data: {
        name,
        address,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        capacity: capacity ? parseInt(capacity) : null,
        contactPhone,
        contactEmail,
        facilities: facilities || [],
        isActive: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: disasterCenter,
        message: 'Disaster center created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating disaster center:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create disaster center' },
      { status: 500 }
    )
  }
}
