import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const preferences = searchParams.get('preferences')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    // Get all barbers with their profiles
    const barbers = await prisma.user.findMany({
      where: {
        userType: 'BARBER',
        barberProfile: {
          isNot: null
        }
      },
      include: {
        barberProfile: {
          include: {
            specialties: {
              include: {
                specialty: true
              }
            },
            services: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Newest barbers first
      }
    })

    // Format barbers for frontend
    const formattedBarbers = barbers.map(barber => ({
      id: barber.barberProfile?.id || barber.id, // Use barberProfile ID for correct linking
      name: `${barber.firstName} ${barber.lastName}`,
      shopName: barber.barberProfile?.shopName || '',
      image: barber.barberProfile?.profileImage || barber.avatar || 'https://via.placeholder.com/400x300?text=Barber',
      rating: barber.barberProfile?.averageRating || 5.0,
      reviews: barber.barberProfile?.totalReviews || 0,
      distance: 0.1, // Will calculate based on user location later
      price: barber.barberProfile?.pricing || '$$',
      specialties: barber.barberProfile?.specialties.map(s => s.specialty.name) || [],
      verified: barber.verified,
      promoted: false,
      address: barber.barberProfile?.address || '',
      city: barber.barberProfile?.city || '',
      state: barber.barberProfile?.state || '',
      phone: barber.phone || '',
      instagram: barber.barberProfile?.instagram || '',
      bio: barber.barberProfile?.bio || '',
      yearsExperience: barber.barberProfile?.yearsExperience || 1,
      nextAvailable: 'Available',
      services: barber.barberProfile?.services.map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: `${s.duration} min`
      })) || [],
      availability: barber.barberProfile?.businessHours || {}
    }))

    return NextResponse.json({ barbers: formattedBarbers })
  } catch (error) {
    console.error('Get barbers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch barbers' },
      { status: 500 }
    )
  }
}

