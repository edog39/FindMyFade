'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface HealthCheck {
  status: string
  database: string
  environment: string
  hasDatabase: boolean
  databaseType?: string
  stats?: {
    users: number
    barbers: number
  }
  error?: string
  timestamp: string
}

export default function SetupCheckPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVercel, setIsVercel] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
      setIsVercel(window.location.hostname.includes('vercel.app'))
    } catch (error) {
      setHealth({
        status: 'error',
        database: 'unknown',
        environment: 'unknown',
        hasDatabase: false,
        error: error instanceof Error ? error.message : 'Failed to fetch',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const StatusIcon = ({ status }: { status: boolean | undefined }) => {
    if (status === undefined) return <AlertCircle className="w-6 h-6 text-yellow-500" />
    return status ? (
      <CheckCircle className="w-6 h-6 text-green-500" />
    ) : (
      <XCircle className="w-6 h-6 text-red-500" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-white mb-2">
            🔧 Setup Check
          </h1>
          <p className="text-primary-300">
            Verify your FindMyFade configuration
          </p>
        </div>

        {/* Health Check Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-xl text-white">System Status</h2>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="flex items-center space-x-2 bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading && !health ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500 mx-auto mb-4"></div>
              <p className="text-primary-300">Checking system health...</p>
            </div>
          ) : health ? (
            <div className="space-y-4">
              {/* Overall Status */}
              <div className="flex items-center space-x-3 p-4 bg-primary-700/50 rounded-lg">
                <StatusIcon status={health.status === 'healthy'} />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Overall Status</h3>
                  <p className="text-primary-300 text-sm">
                    {health.status === 'healthy' ? '✅ All systems operational' : '❌ Issues detected'}
                  </p>
                </div>
              </div>

              {/* Database Connection */}
              <div className="flex items-center space-x-3 p-4 bg-primary-700/50 rounded-lg">
                <StatusIcon status={health.database === 'connected'} />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Database Connection</h3>
                  <p className="text-primary-300 text-sm">
                    {health.database === 'connected' 
                      ? `✅ Connected to ${health.databaseType || 'database'}` 
                      : '❌ Not connected'}
                  </p>
                  {health.error && (
                    <p className="text-red-400 text-xs mt-1">Error: {health.error}</p>
                  )}
                </div>
              </div>

              {/* Database URL Check */}
              <div className="flex items-center space-x-3 p-4 bg-primary-700/50 rounded-lg">
                <StatusIcon status={health.hasDatabase} />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">DATABASE_URL Configured</h3>
                  <p className="text-primary-300 text-sm">
                    {health.hasDatabase 
                      ? '✅ Environment variable is set' 
                      : '❌ DATABASE_URL not found'}
                  </p>
                </div>
              </div>

              {/* Environment */}
              <div className="flex items-center space-x-3 p-4 bg-primary-700/50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Environment</h3>
                  <p className="text-primary-300 text-sm">
                    Running in: <span className="text-accent-400">{health.environment}</span>
                    {isVercel && <span className="ml-2 text-accent-400">(Vercel Deployment)</span>}
                  </p>
                </div>
              </div>

              {/* Stats */}
              {health.stats && (
                <div className="flex items-center space-x-3 p-4 bg-primary-700/50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Database Stats</h3>
                    <p className="text-primary-300 text-sm">
                      {health.stats.users} users • {health.stats.barbers} barbers
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Issues & Solutions */}
        {health && health.status !== 'healthy' && (
          <div className="card mb-6 bg-red-500/10 border-2 border-red-500/30">
            <h2 className="font-semibold text-xl text-white mb-4 flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <span>Issues Detected</span>
            </h2>

            {!health.hasDatabase && (
              <div className="mb-6 p-4 bg-red-500/20 rounded-lg">
                <h3 className="font-semibold text-white mb-2">❌ DATABASE_URL Not Set</h3>
                <p className="text-primary-300 text-sm mb-3">
                  Your database connection string is missing.
                </p>
                
                {isVercel ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-white font-medium">To fix on Vercel:</p>
                    <ol className="list-decimal list-inside space-y-1 text-primary-300">
                      <li>Go to your Vercel project dashboard</li>
                      <li>Click Settings → Environment Variables</li>
                      <li>Add: <code className="bg-primary-900 px-2 py-1 rounded">DATABASE_URL</code></li>
                      <li>Paste your Neon database URL</li>
                      <li>Save and redeploy</li>
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-white font-medium">To fix locally:</p>
                    <ol className="list-decimal list-inside space-y-1 text-primary-300">
                      <li>Create a <code className="bg-primary-900 px-2 py-1 rounded">.env</code> file in your project root</li>
                      <li>Add: <code className="bg-primary-900 px-2 py-1 rounded">DATABASE_URL="your-neon-url"</code></li>
                      <li>Get URL from console.neon.tech</li>
                      <li>Restart your dev server</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {health.hasDatabase && health.database !== 'connected' && (
              <div className="mb-6 p-4 bg-red-500/20 rounded-lg">
                <h3 className="font-semibold text-white mb-2">❌ Database Connection Failed</h3>
                <p className="text-primary-300 text-sm mb-3">
                  Can't connect to the database.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-white font-medium">Possible solutions:</p>
                  <ul className="list-disc list-inside space-y-1 text-primary-300">
                    <li>Verify DATABASE_URL is correct</li>
                    <li>Check if database is online (console.neon.tech)</li>
                    <li>Run: <code className="bg-primary-900 px-2 py-1 rounded">npx prisma db push</code></li>
                    <li>Check firewall/network settings</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Setup Guide */}
        <div className="card">
          <h2 className="font-semibold text-xl text-white mb-4">📚 Setup Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="https://console.neon.tech"
              target="_blank"
              className="flex items-center justify-between p-4 bg-primary-700/50 hover:bg-primary-700 rounded-lg transition-colors group"
            >
              <div>
                <h3 className="font-semibold text-white mb-1">Neon Console</h3>
                <p className="text-primary-300 text-sm">Get your DATABASE_URL</p>
              </div>
              <ExternalLink className="w-5 h-5 text-primary-400 group-hover:text-accent-400" />
            </Link>

            <Link
              href="https://vercel.com/dashboard"
              target="_blank"
              className="flex items-center justify-between p-4 bg-primary-700/50 hover:bg-primary-700 rounded-lg transition-colors group"
            >
              <div>
                <h3 className="font-semibold text-white mb-1">Vercel Dashboard</h3>
                <p className="text-primary-300 text-sm">Configure environment variables</p>
              </div>
              <ExternalLink className="w-5 h-5 text-primary-400 group-hover:text-accent-400" />
            </Link>
          </div>

          <div className="mt-6 p-4 bg-accent-500/10 border border-accent-500/30 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🔑 Quick Setup</h3>
            <ol className="list-decimal list-inside space-y-2 text-primary-300 text-sm">
              <li>Get your Neon database URL from <a href="https://console.neon.tech" target="_blank" className="text-accent-400 hover:underline">console.neon.tech</a></li>
              <li>Add it to Vercel: Settings → Environment Variables → DATABASE_URL</li>
              <li>Redeploy your app or wait for auto-deploy</li>
              <li>Refresh this page to verify</li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
          {health?.status === 'healthy' && (
            <>
              <Link href="/signup" className="btn-secondary">
                Create Account
              </Link>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
            </>
          )}
          <Link href="/clear-cache" className="btn-secondary">
            Clear Cache
          </Link>
        </div>

        {/* Timestamp */}
        {health && (
          <p className="text-center text-primary-500 text-xs mt-6">
            Last checked: {new Date(health.timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

