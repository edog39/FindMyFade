'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, CheckCircle } from 'lucide-react'

export default function ClearCachePage() {
  const router = useRouter()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    // Clear all localStorage
    const itemsToRemove = [
      'userProfile',
      'isLoggedIn',
      'userType',
      'hasVisitedBefore',
      'walletData',
      'appointments',
      'rewards',
      'transactions',
      'uploadedContent',
      'availability',
      'myBarberId'
    ]

    // Remove each item
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item)
    })

    // Also clear everything just to be sure
    localStorage.clear()

    console.log('✅ LocalStorage cleared!')
    setCleared(true)
  }, [])

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card text-center">
          {!cleared ? (
            <>
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-accent-500 animate-bounce" />
              </div>
              <h1 className="font-display font-bold text-2xl text-white mb-2">
                Clearing Cache...
              </h1>
              <p className="text-primary-300">
                Please wait while we clear your browser data.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-display font-bold text-2xl text-white mb-2">
                Cache Cleared!
              </h1>
              <p className="text-primary-300 mb-6">
                All browser data has been cleared. You can now sign up or log in with a fresh start.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleGoHome}
                  className="btn-primary w-full"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="btn-secondary w-full"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="btn-secondary w-full"
                >
                  Login
                </button>
              </div>

              <div className="mt-6 p-4 bg-primary-700/50 rounded-lg">
                <p className="text-primary-300 text-sm mb-2">
                  <strong className="text-white">What was cleared:</strong>
                </p>
                <ul className="text-primary-400 text-xs space-y-1 text-left">
                  <li>✓ User profile data</li>
                  <li>✓ Login session</li>
                  <li>✓ Wallet information</li>
                  <li>✓ Appointments</li>
                  <li>✓ Rewards & transactions</li>
                  <li>✓ All cached data</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

