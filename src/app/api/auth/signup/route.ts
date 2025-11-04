import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      userType,
      preferences,
      shopName,
      experience,
      specialties,
      address,
      bio
    } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        firstName,
        lastName,
        userType: userType.toUpperCase() as 'CLIENT' | 'BARBER',
        preferences: preferences || [],
        walletBalance: userType === 'client' ? 100.0 : 0.0, // Give clients $100 starting balance
        loyaltyPoints: userType === 'client' ? 100 : 0,
        ...(userType === 'barber' && {
          barberProfile: {
            create: {
              shopName: shopName || `${firstName}'s Barber Shop`,
              bio: bio || 'Professional barber',
              yearsExperience: experience ? parseInt(experience.split('-')[0]) : 1,
              address: address || '',
              city: 'Your City',
              state: 'Your State',
              zipCode: '00000',
              instagram: '',
              website: '',
              pricing: '$$',
              businessHours: {
                monday: { enabled: true, start: '09:00', end: '18:00' },
                tuesday: { enabled: true, start: '09:00', end: '18:00' },
                wednesday: { enabled: true, start: '09:00', end: '18:00' },
                thursday: { enabled: true, start: '09:00', end: '18:00' },
                friday: { enabled: true, start: '09:00', end: '18:00' },
                saturday: { enabled: true, start: '09:00', end: '17:00' },
                sunday: { enabled: false, start: '', end: '' }
              },
              services: {
                create: [
                  { name: 'Haircut', price: 30, duration: 30 },
                  { name: 'Haircut + Beard', price: 45, duration: 45 },
                  { name: 'Kids Cut', price: 25, duration: 25 }
                ]
              },
              ...(specialties && specialties.length > 0 && {
                specialties: {
                  create: specialties.map((spec: string) => ({
                    specialty: {
                      connectOrCreate: {
                        where: { name: spec },
                        create: { name: spec }
                      }
                    }
                  }))
                }
              })
            }
          }
        })
      },
      include: {
        barberProfile: {
          include: {
            specialties: {
              include: {
                specialty: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        barberProfileId: user.barberProfile?.id
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

