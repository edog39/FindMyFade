import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const barberId = params.id

    // Find barber profile by ID
    const barberProfile = await prisma.barberProfile.findUnique({
      where: {
        id: barberId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            verified: true,
          },
        },
        services: true,
        specialties: {
          include: {
            specialty: true,
          },
        },
        portfolioItems: true,
        reviews: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    if (!barberProfile) {
      return NextResponse.json(
        { error: 'Barber not found' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedBarber = {
      id: barberProfile.id,
      name: `${barberProfile.user.firstName} ${barberProfile.user.lastName}`,
      shopName: barberProfile.shopName,
      bio: barberProfile.bio,
      rating: barberProfile.averageRating,
      totalReviews: barberProfile.totalReviews,
      verified: barberProfile.user.verified,
      yearsExperience: barberProfile.yearsExperience,
      totalClients: barberProfile.totalReviews * 10, // Estimate
      profileImage: barberProfile.profileImage || 'https://via.placeholder.com/200x200?text=Barber',
      coverImage: barberProfile.coverImage || 'https://via.placeholder.com/800x400?text=Cover',
      location: {
        address: barberProfile.address,
        city: barberProfile.city,
        state: barberProfile.state,
        zipCode: barberProfile.zipCode,
      },
      contact: {
        phone: barberProfile.user.phone,
        instagram: barberProfile.instagram,
        website: barberProfile.website,
      },
      pricing: barberProfile.pricing,
      businessHours: barberProfile.businessHours,
      services: barberProfile.services.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description || `Professional ${s.name.toLowerCase()} service`,
        price: s.price,
        duration: s.duration,
        popular: s.isPopular || false,
      })),
      specialties: barberProfile.specialties.map((s: any) => s.specialty.name),
      portfolio: barberProfile.portfolioItems.map((p: any) => ({
        id: p.id,
        type: p.type,
        url: p.url,
        caption: p.caption,
        thumbnail: p.thumbnail || p.url,
      })),
      reviews: barberProfile.reviews.map((r: any) => ({
        id: r.id,
        customerName: `${r.client.firstName} ${r.client.lastName.charAt(0)}.`,
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        comment: r.comment,
        verified: r.isVerified,
      })),
    }

    return NextResponse.json({ barber: formattedBarber })
  } catch (error) {
    console.error('Get barber error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch barber' },
      { status: 500 }
    )
  }
}

