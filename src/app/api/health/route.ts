import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // First, diagnose the DATABASE_URL issue
  const dbUrl = process.env.DATABASE_URL
  const diagnostics = {
    hasDatabaseUrl: !!dbUrl,
    urlLength: dbUrl?.length || 0,
    startsWithPostgresql: dbUrl?.startsWith('postgresql://') || false,
    startsWithPostgres: dbUrl?.startsWith('postgres://') || false,
    urlPreview: dbUrl ? dbUrl.substring(0, 25) + '...' : 'NOT SET',
    hasQuotes: dbUrl ? (dbUrl.startsWith('"') || dbUrl.startsWith("'")) : false,
  }
  
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try a simple query
    const userCount = await prisma.user.count()
    const barberCount = await prisma.barberProfile.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      databaseType: process.env.DATABASE_URL?.includes('neon.tech') ? 'Neon (Cloud)' : 'Local',
      stats: {
        users: userCount,
        barbers: barberCount
      },
      diagnostics,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
      diagnostics,
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

