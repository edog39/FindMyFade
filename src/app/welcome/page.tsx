'use client'

import { User, Users, Scissors } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // Mark as visited
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasVisitedBefore', 'true')
    }
  }, [])

  const handleContinueAsGuest = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="max-w-md w-full">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-accent-500/30">
              <span className="text-4xl">💈</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
              FindMyFade
            </h1>
            <p className="text-primary-300 text-lg">
              Your perfect haircut awaits
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-primary-800/90 to-primary-900/90 backdrop-blur-sm border border-primary-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Sign In */}
            <Link 
              href="/login"
              className="w-full btn-primary py-4 text-center flex items-center justify-center space-x-2 mb-4 text-lg"
            >
              <User size={20} />
              <span className="font-semibold">Sign In</span>
            </Link>

            {/* Sign Up */}
            <Link
              href="/signup"
              className="w-full btn-secondary py-4 text-center flex items-center justify-center space-x-2 mb-4 text-lg"
            >
              <span className="font-medium">Create Account</span>
            </Link>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-primary-700"></div>
              <span className="px-4 text-primary-400 text-sm font-medium">OR</span>
              <div className="flex-1 border-t border-primary-700"></div>
            </div>

            {/* Continue as Guest - Prominent */}
            <button
              onClick={handleContinueAsGuest}
              className="w-full bg-gradient-to-r from-primary-700/80 to-primary-600/80 hover:from-primary-600 hover:to-primary-500 border-2 border-primary-600 hover:border-accent-500/50 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg text-lg"
            >
              <Users size={20} />
              <span>Continue as Guest</span>
            </button>
            <p className="text-primary-400 text-xs text-center mt-3">
              Explore barbers and features without signing up
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 rounded-xl p-3 text-center">
              <div className="text-accent-500 font-bold text-2xl mb-1">150+</div>
              <div className="text-primary-400 text-[10px]">Top Barbers</div>
            </div>
            <div className="bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 rounded-xl p-3 text-center">
              <div className="text-accent-500 font-bold text-2xl mb-1">AI</div>
              <div className="text-primary-400 text-[10px]">Style Match</div>
            </div>
            <div className="bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 rounded-xl p-3 text-center">
              <div className="text-accent-500 font-bold text-2xl mb-1">1.5x</div>
              <div className="text-primary-400 text-[10px]">Rewards</div>
            </div>
            <div className="bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 rounded-xl p-3 text-center">
              <div className="text-accent-500 font-bold text-2xl mb-1">Free</div>
              <div className="text-primary-400 text-[10px]">To Start</div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-primary-500 text-xs mt-8">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

