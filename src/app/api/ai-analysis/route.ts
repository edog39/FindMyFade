import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST - Save AI face analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      faceShape,
      faceShapeScore,
      facialFeatures,
      recommendedStyles,
      matchedBarbers,
      photoHash,
      imageMetadata,
      processingTime
    } = body

    console.log('🤖 Saving AI analysis:', { faceShape, userId: userId || 'anonymous' })

    // Save analysis to database
    const analysis = await prisma.faceAnalysis.create({
      data: {
        userId: userId || null,
        faceShape,
        faceShapeScore: parseFloat(faceShapeScore),
        facialFeatures,
        recommendedStyles,
        matchedBarbers: matchedBarbers || null,
        photoHash: photoHash || null,
        imageMetadata: imageMetadata || null,
        processingTime: processingTime || null,
        modelVersion: 'v1.0'
      }
    })

    console.log('✅ AI analysis saved:', analysis.id)

    return NextResponse.json({
      message: 'Analysis saved successfully',
      analysisId: analysis.id
    })
  } catch (error) {
    console.error('❌ Save AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to save analysis', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

// GET - Fetch historical analyses for learning
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const faceShape = searchParams.get('faceShape')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    console.log('🔍 Fetching AI analyses for learning:', { faceShape, userId, limit })

    // Build query
    const where: any = {}
    if (faceShape) where.faceShape = faceShape
    if (userId) where.userId = userId

    // Fetch analyses
    const analyses = await prisma.faceAnalysis.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      select: {
        id: true,
        faceShape: true,
        faceShapeScore: true,
        facialFeatures: true,
        recommendedStyles: true,
        userFeedback: true,
        selectedStyle: true,
        bookedBarber: true,
        createdAt: true
      }
    })

    console.log('✅ Found', analyses.length, 'historical analyses')

    // Calculate statistics for learning
    const stats = {
      total: analyses.length,
      avgConfidence: analyses.reduce((sum, a) => sum + a.faceShapeScore, 0) / analyses.length || 0,
      mostCommonFeedback: null, // Could calculate most common feedback
      popularStyles: null // Could calculate which styles are most selected
    }

    return NextResponse.json({
      analyses,
      stats,
      learningData: {
        sampleSize: analyses.length,
        canImprove: analyses.length >= 10, // Need at least 10 samples to improve
        confidenceLevel: stats.avgConfidence
      }
    })
  } catch (error) {
    console.error('❌ Fetch AI analyses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}

// PATCH - Update analysis with feedback
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysisId, userFeedback, selectedStyle, bookedBarber } = body

    if (!analysisId) {
      return NextResponse.json(
        { error: 'analysisId is required' },
        { status: 400 }
      )
    }

    console.log('📝 Updating AI analysis with feedback:', analysisId)

    const updateData: any = {}
    if (userFeedback !== undefined) updateData.userFeedback = userFeedback
    if (selectedStyle) updateData.selectedStyle = selectedStyle
    if (bookedBarber) updateData.bookedBarber = bookedBarber

    const updated = await prisma.faceAnalysis.update({
      where: { id: analysisId },
      data: updateData
    })

    console.log('✅ AI analysis updated with feedback')

    return NextResponse.json({
      message: 'Feedback recorded successfully',
      analysis: updated
    })
  } catch (error) {
    console.error('❌ Update AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to update analysis' },
      { status: 500 }
    )
  }
}

