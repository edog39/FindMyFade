import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Fetch appointments for a user (client or barber)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching appointments for:', { userId, userType })

    let appointments

    if (userType === 'barber') {
      // Get appointments where this user is the barber
      appointments = await prisma.booking.findMany({
        where: {
          barberId: userId
        },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true
            }
          },
          barber: {
            select: {
              barberProfile: {
                select: {
                  id: true,
                  shopName: true
                }
              }
            }
          }
        },
        orderBy: {
          startTime: 'asc'
        }
      })
    } else {
      // Get appointments where this user is the client
      appointments = await prisma.booking.findMany({
        where: {
          clientId: userId
        },
        include: {
          barber: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              barberProfile: {
                select: {
                  id: true,
                  shopName: true,
                  address: true,
                  city: true,
                  state: true
                }
              }
            }
          }
        },
        orderBy: {
          startTime: 'asc'
        }
      })
    }

    console.log('✅ Found', appointments.length, 'appointments')

    // Format appointments
    const formattedAppointments = appointments.map((apt: any) => {
      // Extract service and prepaid status from notes
      // Format: "[PREPAID] Service: Haircut\nOptional notes"
      const isPrepaidFromNotes = apt.notes?.startsWith('[PREPAID]') || false
      const serviceMatch = apt.notes?.match(/Service: (.+?)(?:\n|$)/)
      const extractedService = serviceMatch ? serviceMatch[1] : 'Haircut'
      const cleanNotes = apt.notes?.replace(/^\[(PREPAID|PAY_LATER)\] Service: .+?\n?/, '') || ''
      
      return {
        id: apt.id,
        barberId: apt.barber.barberProfile?.id || apt.barberId,
        barberName: userType === 'barber' 
          ? `${apt.client.firstName} ${apt.client.lastName}` 
          : `${apt.barber.firstName} ${apt.barber.lastName}`,
        shopName: apt.barber.barberProfile?.shopName || 'Barbershop',
        service: extractedService,
        date: apt.startTime.toISOString().split('T')[0], // Extract date from startTime
        time: apt.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // Extract time from startTime
        price: apt.totalPrice,
        status: apt.status,
        prepaid: isPrepaidFromNotes,
        notes: cleanNotes,
        createdAt: apt.createdAt,
        // Client info (for barbers)
        ...(userType === 'barber' && {
          clientName: `${apt.client.firstName} ${apt.client.lastName}`,
          clientPhone: apt.client.phone,
          clientEmail: apt.client.email
        }),
        // Location info (for clients)
        ...(userType === 'client' && apt.barber.barberProfile && {
          location: {
            address: apt.barber.barberProfile.address,
            city: apt.barber.barberProfile.city,
            state: apt.barber.barberProfile.state
          }
        })
      }
    })

    return NextResponse.json({ appointments: formattedAppointments })
  } catch (error) {
    console.error('❌ Get appointments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      barberId,
      barberProfileId,
      service,
      date,
      time,
      totalPrice,
      isPrepaid,
      notes
    } = body

    console.log('📝 Creating appointment:', { clientId, barberProfileId, service, date, time })

    // Validate required fields
    if (!clientId || !barberId || !barberProfileId || !service || !date || !time || totalPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create DateTime from date and time strings
    const [hours, minutes] = time.split(':').map(Number)
    const appointmentDate = new Date(date)
    appointmentDate.setHours(0, 0, 0, 0) // Set to start of day
    
    const startDateTime = new Date(date)
    startDateTime.setHours(hours, minutes, 0, 0)
    
    // Assume 30-minute appointment duration (can be customized later)
    const endDateTime = new Date(startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + 30)

    // Create appointment (store isPrepaid in notes until schema is updated)
    const prepaidNote = isPrepaid ? '[PREPAID] ' : '[PAY_LATER] '
    const appointment = await prisma.booking.create({
      data: {
        clientId,
        barberId,
        appointmentDate: appointmentDate,
        startTime: startDateTime,
        endTime: endDateTime,
        totalPrice: parseFloat(totalPrice),
        status: 'CONFIRMED',
        notes: `${prepaidNote}Service: ${service}${notes ? '\n' + notes : ''}` // Store service and payment method in notes
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        barber: {
          select: {
            barberProfile: {
              select: {
                id: true,
                shopName: true
              }
            }
          }
        }
      }
    })

    console.log('✅ Appointment created:', appointment.id)

    // Extract service and prepaid from notes
    const isPrepaidFromNotes = appointment.notes?.startsWith('[PREPAID]') || false
    const serviceMatch = appointment.notes?.match(/Service: (.+?)(?:\n|$)/)
    const extractedService = serviceMatch ? serviceMatch[1] : service

    return NextResponse.json({
      message: 'Appointment created successfully',
      appointment: {
        id: appointment.id,
        barberId: appointment.barber.barberProfile?.id,
        shopName: appointment.barber.barberProfile?.shopName || 'Barbershop',
        clientName: `${appointment.client.firstName} ${appointment.client.lastName}`,
        service: extractedService,
        date: appointment.startTime.toISOString().split('T')[0],
        time: appointment.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        price: appointment.totalPrice,
        status: appointment.status,
        prepaid: isPrepaidFromNotes
      }
    })
  } catch (error) {
    console.error('❌ Create appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PATCH - Update appointment status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, status, service } = body

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'appointmentId is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (service) updateData.service = service

    const appointment = await prisma.booking.update({
      where: { id: appointmentId },
      data: updateData
    })

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment
    })
  } catch (error) {
    console.error('❌ Update appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

