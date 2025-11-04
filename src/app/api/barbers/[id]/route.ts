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

    // Generate availability for next 14 days based on business hours
    const generateAvailability = () => {
      const availability = []
      const today = new Date()
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        const dateStr = date.toISOString().split('T')[0]
        
        const dayHours = (barberProfile.businessHours as any)[dayName]
        
        if (dayHours && dayHours.enabled) {
          // Generate time slots
          const slots = []
          const startHour = parseInt(dayHours.start.split(':')[0])
          const endHour = parseInt(dayHours.end.split(':')[0])
          
          for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`)
            slots.push(`${hour.toString().padStart(2, '0')}:30`)
          }
          
          availability.push({
            date: dateStr,
            day: dayName,
            slots: slots
          })
        }
      }
      
      return availability
    }
    
    // Format the response
    const formattedBarber = {
      id: barberProfile.id,
      userId: barberProfile.user.id, // Add barber's user ID for bookings
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
      hours: barberProfile.businessHours, // Alias for compatibility
      availability: generateAvailability(), // Generate time slots from business hours
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

