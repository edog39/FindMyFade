// Test database connection
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n')
  console.log('Environment:', process.env.NODE_ENV || 'development')
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
  
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL
    const dbType = url.includes('neon.tech') ? '🌐 Neon Cloud' : url.includes('.db') ? '💾 SQLite Local' : '🗄️ PostgreSQL'
    console.log('Database type:', dbType)
    console.log('URL starts with:', url.substring(0, 20) + '...\n')
  } else {
    console.log('❌ DATABASE_URL is not set!\n')
    process.exit(1)
  }

  try {
    console.log('📡 Attempting to connect...')
    await prisma.$connect()
    console.log('✅ Connected successfully!\n')

    console.log('🔍 Testing queries...')
    
    // Test 1: Count users
    const userCount = await prisma.user.count()
    console.log('✅ Users in database:', userCount)

    // Test 2: Count barbers
    const barberCount = await prisma.barberProfile.count()
    console.log('✅ Barbers in database:', barberCount)

    // Test 3: Get a user
    const firstUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        firstName: true,
        userType: true
      }
    })
    if (firstUser) {
      console.log('✅ Sample user:', firstUser.firstName, `(${firstUser.userType})`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('🎉 DATABASE CONNECTION: SUCCESSFUL')
    console.log('='.repeat(50))
    console.log('\n✅ Your database is working correctly!')
    console.log('✅ All queries executed successfully')
    console.log('✅ Ready for production\n')

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION FAILED')
    console.error('='.repeat(50))
    console.error('\nError:', error.message)
    console.error('\nPossible issues:')
    console.error('  1. DATABASE_URL is incorrect')
    console.error('  2. Database is offline or suspended')
    console.error('  3. Network/firewall blocking connection')
    console.error('  4. Prisma client needs regeneration')
    console.error('\nTry these fixes:')
    console.error('  • Visit console.neon.tech and verify database is active')
    console.error('  • Check DATABASE_URL is correct in .env')
    console.error('  • Run: ./fix-database.sh')
    console.error('  • Check your network connection\n')
    
    await prisma.$disconnect()
    process.exit(1)
  }
}

testConnection()

