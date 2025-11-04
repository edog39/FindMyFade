#!/usr/bin/env node

/**
 * Database Verification Script
 * Confirms that FindMyFade is using the Neon cloud database
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyDatabase() {
  console.log('🔍 Verifying Database Connection...\n')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to database successfully!')
    
    // Get database info
    const result = await prisma.$queryRaw`SELECT current_database(), version();`
    console.log('\n📊 Database Info:')
    console.log(result)
    
    // Count users
    const userCount = await prisma.user.count()
    console.log(`\n👥 Total Users: ${userCount}`)
    
    // Count barbers
    const barberCount = await prisma.user.count({
      where: { userType: 'BARBER' }
    })
    console.log(`💈 Total Barbers: ${barberCount}`)
    
    // Count clients
    const clientCount = await prisma.user.count({
      where: { userType: 'CLIENT' }
    })
    console.log(`👤 Total Clients: ${clientCount}`)
    
    // Get recent barbers
    const recentBarbers = await prisma.user.findMany({
      where: { userType: 'BARBER' },
      include: {
        barberProfile: {
          select: {
            id: true,
            shopName: true,
            city: true,
            state: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    console.log('\n🆕 Recent Barbers:')
    recentBarbers.forEach((barber, idx) => {
      console.log(`  ${idx + 1}. ${barber.firstName} ${barber.lastName} - ${barber.barberProfile?.shopName}`)
      console.log(`     📍 ${barber.barberProfile?.city}, ${barber.barberProfile?.state}`)
      console.log(`     🆔 Profile ID: ${barber.barberProfile?.id}`)
      console.log(`     🔗 URL: /barber/${barber.barberProfile?.id}\n`)
    })
    
    // Check if using cloud database
    const dbUrl = process.env.DATABASE_URL || ''
    if (dbUrl.includes('neon.tech')) {
      console.log('✅ CONFIRMED: Using Neon Cloud Database (PostgreSQL)')
      console.log('🌍 This database is accessible globally!')
    } else if (dbUrl.includes('localhost') || dbUrl.includes('.db')) {
      console.log('⚠️  WARNING: Using local database')
      console.log('   This will NOT be accessible from other devices!')
    }
    
    console.log('\n✨ Verification Complete!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()

