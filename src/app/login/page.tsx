'use client'

import { useState } from 'react'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronLeft,
  LogIn,
  User,
  Scissors
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      // Save to localStorage for session management
      const userProfile = {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        phone: data.user.phone,
        userType: data.user.userType.toLowerCase(),
        accountType: data.user.userType.toLowerCase(),
        preferences: data.user.preferences || [],
        barberProfileId: data.user.barberProfile?.id,
        walletBalance: data.user.walletBalance || 100,
        loyaltyPoints: data.user.loyaltyPoints || 100
      }

      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userType', data.user.userType.toLowerCase())
      
      // Initialize wallet data if not exists
      if (!localStorage.getItem('walletData')) {
        const walletData = {
          balance: data.user.walletBalance || 100.00,
          points: data.user.loyaltyPoints || 100
        }
        localStorage.setItem('walletData', JSON.stringify(walletData))
      }

      setIsLoading(false)

      // Show success and redirect
      alert(`Welcome back, ${data.user.firstName}! 🎉`)

      // Redirect based on user type
    setTimeout(() => {
        if (data.user.userType === 'BARBER') {
          router.push('/barber-dashboard')
        } else {
          router.push('/')
        }
      }, 100)
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (type: 'client' | 'barber') => {
    // Create a demo profile
    const demoProfile = type === 'client' ? {
      firstName: 'Demo',
      lastName: 'Client',
      email: 'demo.client@findmyfade.com',
      phone: '555-DEMO-001',
      password: 'demo123',
      userType: 'client',
      accountType: 'client',
      gender: 'male',
      createdAt: new Date().toISOString()
    } : {
      firstName: 'Demo',
      lastName: 'Barber',
      email: 'demo.barber@findmyfade.com',
      phone: '555-DEMO-002',
      password: 'demo123',
      userType: 'barber',
      accountType: 'barber',
      shopName: 'Demo Barber Shop',
      experience: '5+ years',
      specialties: ['Fades', 'Tapers', 'Line-ups'],
      verified: true,
      createdAt: new Date().toISOString()
    }
    
    // Save demo profile
    localStorage.setItem('userProfile', JSON.stringify(demoProfile))
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userType', type)
    localStorage.setItem('hasVisitedBefore', 'true')
    
    // Initialize wallet for demo client
    if (type === 'client') {
      const walletData = {
        balance: 100.00,
        points: 250
      }
      localStorage.setItem('walletData', JSON.stringify(walletData))
    }
    
    alert(`🎉 Logged in as Demo ${type === 'client' ? 'Client' : 'Barber'}!`)
    
    // Redirect based on type
    if (type === 'barber') {
      router.push('/barber-dashboard')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center space-x-2 mb-6 text-primary-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">F</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">FindMyFade</span>
          </div>
          
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-primary-300">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input w-full pl-10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="input w-full pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-primary-400 hover:text-primary-300" />
                ) : (
                  <Eye className="h-5 w-5 text-primary-400 hover:text-primary-300" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                />
                <span className="text-primary-300 text-sm">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-accent-500 hover:text-accent-400 text-sm font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-primary-800 text-primary-400">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-primary-600 rounded-lg bg-primary-800 hover:bg-primary-700 text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-primary-600 rounded-lg bg-primary-800 hover:bg-primary-700 text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Twitter
              </button>
            </div>
          </form>
        </div>

        {/* Quick Login Options */}
        <div className="mt-6">
          <p className="text-primary-400 text-sm text-center mb-4">Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleDemoLogin('client')}
              className="flex items-center justify-center space-x-2 bg-primary-800/50 border border-primary-600 px-4 py-3 rounded-lg hover:bg-primary-700/50 hover:border-accent-500 transition-all group"
            >
              <User size={16} className="text-accent-500 group-hover:scale-110 transition-transform" />
              <span className="text-white text-sm font-medium">Demo Client</span>
            </button>
            <button 
              onClick={() => handleDemoLogin('barber')}
              className="flex items-center justify-center space-x-2 bg-primary-800/50 border border-primary-600 px-4 py-3 rounded-lg hover:bg-primary-700/50 hover:border-accent-500 transition-all group"
            >
              <Scissors size={16} className="text-accent-500 group-hover:scale-110 transition-transform" />
              <span className="text-white text-sm font-medium">Demo Barber</span>
            </button>
          </div>
          <p className="text-primary-500 text-xs text-center mt-2">
            💡 Try the app instantly with pre-loaded demo accounts
          </p>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-primary-400 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-accent-500 hover:text-accent-400 font-medium">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="text-center mt-6">
          <p className="text-primary-500 text-xs">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-accent-500 hover:text-accent-400">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-accent-500 hover:text-accent-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
