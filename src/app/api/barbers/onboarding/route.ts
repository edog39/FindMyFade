import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Calculate onboarding completion percentage
function calculateCompletion(quizData: any): number {
  const fields = [
    // Basic Identity (20%)
    quizData.shopType, // 5%
    quizData.licenseNumber, // Optional but counts if provided - 5%
    
    // Specialties (25%)
    quizData.specialties && Array.isArray(quizData.specialties) && quizData.specialties.length > 0, // 25%
    
    // Vibe Profile (20%)
    quizData.conversationStyle, // 10%
    quizData.vibeType, // 10%
    
    // Availability (15%)
    quizData.typicalHours, // 15%
    
    // Pricing (10%)
    quizData.baseCutPrice, // 10%
    
    // Consent & Incentives (10%)
    quizData.agreeQuickResponse !== undefined, // 5%
    quizData.optInFeatured !== undefined, // 5%
  ]
  
  const totalFields = fields.length
  const completedFields = fields.filter(Boolean).length
  
  return Math.round((completedFields / totalFields) * 100) / 100 // Return as 0.0 - 1.0
}

// POST - Submit onboarding quiz data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      // Basic Identity & Licensing
      shopType,
      licenseNumber,
      licenseUpload,
      
      // Specialties with Confidence
      specialties,
      
      // Vibe Profile
      conversationStyle,
      vibeType,
      comfortableTopics,
      preferredClientTypes,
      
      // Availability
      typicalHours,
      travelWilling,
      campusGigs,
      
      // Pricing
      baseCutPrice,
      beardAddOnPrice,
      packageDeals,
      studentDiscount,
      
      // Consent & Incentives
      agreeQuickResponse,
      quickResponseHours,
      optInFeatured,
      optInCampusLeads,
      optInPromotions,
    } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Find barber profile by userId
    const barberProfile = await prisma.barberProfile.findUnique({
      where: { userId }
    })

    if (!barberProfile) {
      return NextResponse.json(
        { error: 'Barber profile not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const quizData = {
      shopType: shopType || barberProfile.shopType,
      licenseNumber: licenseNumber || barberProfile.licenseNumber,
      licenseUpload: licenseUpload || barberProfile.licenseUpload,
      specialtiesWithConfidence: specialties || barberProfile.specialtiesWithConfidence,
      conversationStyle: conversationStyle || barberProfile.conversationStyle,
      vibeType: vibeType || barberProfile.vibeType,
      comfortableTopics: comfortableTopics || barberProfile.comfortableTopics,
      preferredClientTypes: preferredClientTypes || barberProfile.preferredClientTypes,
      typicalHours: typicalHours || barberProfile.typicalHours,
      travelWilling: travelWilling !== undefined ? travelWilling : barberProfile.travelWilling,
      campusGigs: campusGigs !== undefined ? campusGigs : barberProfile.campusGigs,
      baseCutPrice: baseCutPrice !== undefined ? baseCutPrice : barberProfile.baseCutPrice,
      beardAddOnPrice: beardAddOnPrice !== undefined ? beardAddOnPrice : barberProfile.beardAddOnPrice,
      packageDeals: packageDeals || barberProfile.packageDeals,
      studentDiscount: studentDiscount !== undefined ? studentDiscount : barberProfile.studentDiscount,
      agreeQuickResponse: agreeQuickResponse !== undefined ? agreeQuickResponse : barberProfile.agreeQuickResponse,
      quickResponseHours: quickResponseHours || barberProfile.quickResponseHours,
      optInFeatured: optInFeatured !== undefined ? optInFeatured : barberProfile.optInFeatured,
      optInCampusLeads: optInCampusLeads !== undefined ? optInCampusLeads : barberProfile.optInCampusLeads,
      optInPromotions: optInPromotions !== undefined ? optInPromotions : barberProfile.optInPromotions,
    }

    // Calculate completion percentage
    const completion = calculateCompletion(quizData)
    const isComplete = completion >= 0.7 // 70% minimum

    // Set featured placement if opted in and completed (30-60 days free)
    const featuredUntil = optInFeatured && isComplete
      ? new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // 30 days from now
      : barberProfile.featuredUntil

    // Update barber profile
    const updated = await prisma.barberProfile.update({
      where: { userId },
      data: {
        ...quizData,
        onboardingCompletion: completion,
        onboardingQuizData: body, // Store raw quiz data
        isOnboardingComplete: isComplete,
        hasVerifiedVibe: isComplete, // Grant "Verified Vibe" badge if complete
        isListed: isComplete, // Only list if >= 70% complete
        featuredUntil,
      }
    })

    console.log(`✅ Onboarding quiz updated for barber ${userId}: ${(completion * 100).toFixed(0)}% complete`)

    return NextResponse.json({
      message: 'Onboarding quiz saved successfully',
      completion: completion,
      isComplete: isComplete,
      isListed: isComplete,
      hasVerifiedVibe: isComplete,
      featuredUntil: featuredUntil?.toISOString(),
    })
  } catch (error) {
    console.error('❌ Save onboarding quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to save onboarding quiz', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

// GET - Get onboarding status and quiz data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.url.split('?')[1] || ''
    const params = new URLSearchParams(searchParams)
    const userId = params.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const barberProfile = await prisma.barberProfile.findUnique({
      where: { userId },
      select: {
        onboardingCompletion: true,
        isOnboardingComplete: true,
        hasVerifiedVibe: true,
        isListed: true,
        featuredUntil: true,
        onboardingQuizData: true,
        // Return saved quiz data fields
        shopType: true,
        licenseNumber: true,
        specialtiesWithConfidence: true,
        conversationStyle: true,
        vibeType: true,
        comfortableTopics: true,
        preferredClientTypes: true,
        typicalHours: true,
        travelWilling: true,
        campusGigs: true,
        baseCutPrice: true,
        beardAddOnPrice: true,
        packageDeals: true,
        studentDiscount: true,
        agreeQuickResponse: true,
        quickResponseHours: true,
        optInFeatured: true,
        optInCampusLeads: true,
        optInPromotions: true,
      }
    })

    if (!barberProfile) {
      return NextResponse.json(
        { error: 'Barber profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      completion: barberProfile.onboardingCompletion,
      isComplete: barberProfile.isOnboardingComplete,
      hasVerifiedVibe: barberProfile.hasVerifiedVibe,
      isListed: barberProfile.isListed,
      featuredUntil: barberProfile.featuredUntil?.toISOString(),
      quizData: {
        shopType: barberProfile.shopType,
        licenseNumber: barberProfile.licenseNumber,
        specialties: barberProfile.specialtiesWithConfidence,
        conversationStyle: barberProfile.conversationStyle,
        vibeType: barberProfile.vibeType,
        comfortableTopics: barberProfile.comfortableTopics,
        preferredClientTypes: barberProfile.preferredClientTypes,
        typicalHours: barberProfile.typicalHours,
        travelWilling: barberProfile.travelWilling,
        campusGigs: barberProfile.campusGigs,
        baseCutPrice: barberProfile.baseCutPrice,
        beardAddOnPrice: barberProfile.beardAddOnPrice,
        packageDeals: barberProfile.packageDeals,
        studentDiscount: barberProfile.studentDiscount,
        agreeQuickResponse: barberProfile.agreeQuickResponse,
        quickResponseHours: barberProfile.quickResponseHours,
        optInFeatured: barberProfile.optInFeatured,
        optInCampusLeads: barberProfile.optInCampusLeads,
        optInPromotions: barberProfile.optInPromotions,
      }
    })
  } catch (error) {
    console.error('❌ Get onboarding status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' },
      { status: 500 }
    )
  }
}

// PATCH - Update specific onboarding fields (for partial updates)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updateFields } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const barberProfile = await prisma.barberProfile.findUnique({
      where: { userId }
    })

    if (!barberProfile) {
      return NextResponse.json(
        { error: 'Barber profile not found' },
        { status: 404 }
      )
    }

    // Merge with existing data
    const updatedData = {
      ...updateFields,
      onboardingQuizData: {
        ...(barberProfile.onboardingQuizData as any || {}),
        ...updateFields
      }
    }

    // Recalculate completion
    const completion = calculateCompletion({
      ...barberProfile,
      ...updatedData
    })

    const isComplete = completion >= 0.7

    const updated = await prisma.barberProfile.update({
      where: { userId },
      data: {
        ...updatedData,
        onboardingCompletion: completion,
        isOnboardingComplete: isComplete,
        hasVerifiedVibe: isComplete,
        isListed: isComplete,
      }
    })

    return NextResponse.json({
      message: 'Onboarding quiz updated',
      completion: completion,
      isComplete: isComplete,
    })
  } catch (error) {
    console.error('❌ Update onboarding quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to update onboarding quiz' },
      { status: 500 }
    )
  }
}

