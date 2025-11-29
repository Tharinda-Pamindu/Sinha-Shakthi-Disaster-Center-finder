import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch a specific disaster center
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const center = await prisma.disasterCenter.findUnique({
      where: {
        id: parseInt(params.id),
      },
    })

    if (!center) {
      return NextResponse.json(
        { success: false, error: 'Disaster center not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: center,
    })
  } catch (error) {
    console.error('Error fetching disaster center:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch disaster center' },
      { status: 500 }
    )
  }
}

// PUT: Update a disaster center
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isActive,
    } = body

    const updatedCenter = await prisma.disasterCenter.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(description !== undefined && { description }),
        ...(latitude && { latitude: parseFloat(latitude) }),
        ...(longitude && { longitude: parseFloat(longitude) }),
        ...(capacity !== undefined && { capacity: capacity ? parseInt(capacity) : null }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(facilities && { facilities }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedCenter,
      message: 'Disaster center updated successfully',
    })
  } catch (error) {
    console.error('Error updating disaster center:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update disaster center' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a disaster center
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.disasterCenter.delete({
      where: {
        id: parseInt(params.id),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Disaster center deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting disaster center:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete disaster center' },
      { status: 500 }
    )
  }
}
