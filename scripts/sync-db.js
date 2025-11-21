#!/usr/bin/env node

/**
 * Database Sync Script
 * 
 * This script syncs the database schema with Prisma schema using `prisma db push`.
 * Run this after schema changes to update your database.
 * 
 * Usage:
 *   node scripts/sync-db.js
 *   DATABASE_URL=your_production_url node scripts/sync-db.js
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('🔄 Syncing database schema with Prisma...\n')

try {
  // Run prisma db push
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      // Allow non-interactive mode
      PRISMA_SKIP_POSTINSTALL_GENERATE: 'false'
    }
  })
  
  console.log('\n✅ Database schema synced successfully!')
  
  // Regenerate Prisma client
  console.log('\n🔄 Regenerating Prisma client...')
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  })
  
  console.log('\n✅ Prisma client regenerated!')
  console.log('\n🎉 Database sync complete!')
  
} catch (error) {
  console.error('\n❌ Error syncing database:', error.message)
  process.exit(1)
}

