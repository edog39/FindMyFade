import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔥 API: Received signup request:', { 
      email: body.email, 
      userType: body.userType,
      hasShopName: !!body.shopName,
      hasAddress: !!body.address,
      hasExperience: !!body.experience
    })
    
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

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !userType) {
      console.log('❌ API: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, phone, password, or userType' },
        { status: 400 }
      )
    }

    // Validate barber-specific fields
    if (userType === 'barber') {
      if (!shopName || !address || !experience) {
        console.log('❌ API: Missing barber-specific fields:', { shopName, address, experience })
        return NextResponse.json(
          { error: 'Barber accounts require: shopName, address, and experience' },
          { status: 400 }
        )
      }
    }

    console.log('✅ API: All fields validated')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ API: User already exists with email:', email)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    console.log('✅ API: Email is available')

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('✅ API: Password hashed')

    // Create user
    console.log('📝 API: Creating user in database...')
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

    console.log('✅ API: User created successfully!', {
      userId: user.id,
      userType: user.userType,
      barberProfileId: user.barberProfile?.id
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
    console.error('❌ API: Signup error:', error)
    // Return detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        error: 'Failed to create account', 
        details: errorMessage,
        hint: 'Check server logs for more information'
      },
      { status: 500 }
    )
  }
}

