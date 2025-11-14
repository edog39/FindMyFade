'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Star, 
  Camera, 
  Calendar, 
  CreditCard,
  Users,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  Check,
  Scissors,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'location' | 'barber' | 'style'>('location')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userType, setUserType] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userProfile = localStorage.getItem('userProfile')
      
      // Check if user is logged in
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      
      if (userProfile && loggedIn) {
        const profile = JSON.parse(userProfile)
        
        // Allow barbers to access full site (no auto-redirect)
        // They can browse, use AI features, etc. AND access their dashboard
        setIsLoggedIn(true)
        // Get name from signup fields (firstName + lastName)
        const fullName = profile.firstName 
          ? `${profile.firstName} ${profile.lastName || ''}`.trim()
          : profile.name || profile.fullName || 'User'
        setUserName(fullName)
        setUserType(profile.userType || profile.accountType || 'client')
      }
    }
  }, [])

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false)
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    // Redirect to discover page with search parameters
    const params = new URLSearchParams()
    params.set('search', searchTerm)
    params.set('type', searchType)
    window.location.href = `/discover?${params.toString()}`
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Only remove login status, keep user profile for re-login
      localStorage.removeItem('isLoggedIn')
      // Don't delete userProfile - keep it so they can login again!
      setIsLoggedIn(false)
      setUserName('')
      setUserType('')
      setShowProfileMenu(false)
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary-900/95 via-primary-900/90 to-primary-900/95 backdrop-blur-xl border-b border-primary-700/50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/30 group-hover:shadow-accent-500/50 group-hover:scale-110 transition-all duration-300">
                  <span className="text-black font-bold text-xl">F</span>
                </div>
                <span className="font-display font-bold text-xl text-white group-hover:text-accent-400 transition-colors">FindMyFade</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-2">
                <Link href="/discover" className="relative text-primary-300 hover:text-white px-4 py-2 text-sm font-semibold transition-all duration-300 group">
                  <span className="relative z-10">Discover</span>
                  <div className="absolute inset-0 bg-accent-500/0 group-hover:bg-accent-500/10 rounded-lg transition-all duration-300"></div>
                </Link>
                <Link href="/map" className="relative text-primary-300 hover:text-white px-4 py-2 text-sm font-semibold transition-all duration-300 group">
                  <span className="relative z-10">Map</span>
                  <div className="absolute inset-0 bg-accent-500/0 group-hover:bg-accent-500/10 rounded-lg transition-all duration-300"></div>
                </Link>
                <Link href="/showcase" className="relative text-primary-300 hover:text-white px-4 py-2 text-sm font-semibold transition-all duration-300 group">
                  <span className="relative z-10">Showcase</span>
                  <div className="absolute inset-0 bg-accent-500/0 group-hover:bg-accent-500/10 rounded-lg transition-all duration-300"></div>
                </Link>
                <Link href="/ai-style" className="relative text-accent-400 hover:text-accent-300 px-4 py-2 text-sm font-bold transition-all duration-300 group">
                  <span className="relative z-10 flex items-center space-x-1">
                    <span>✨ AI Styles</span>
                  </span>
                  <div className="absolute inset-0 bg-accent-500/10 group-hover:bg-accent-500/20 rounded-lg transition-all duration-300 border border-accent-500/30 group-hover:border-accent-500/50"></div>
                </Link>
                <Link href="/wallet" className="relative text-primary-300 hover:text-white px-4 py-2 text-sm font-semibold transition-all duration-300 group">
                  <span className="relative z-10">Wallet</span>
                  <div className="absolute inset-0 bg-accent-500/0 group-hover:bg-accent-500/10 rounded-lg transition-all duration-300"></div>
                </Link>
                <Link href="/appointments" className="relative text-primary-300 hover:text-white px-4 py-2 text-sm font-semibold transition-all duration-300 group">
                  <span className="relative z-10">Appointments</span>
                  <div className="absolute inset-0 bg-accent-500/0 group-hover:bg-accent-500/10 rounded-lg transition-all duration-300"></div>
                </Link>
                {userType === 'barber' && (
                  <Link href="/barber-dashboard" className="relative text-accent-400 hover:text-accent-300 px-4 py-2 text-sm font-bold transition-all duration-300 group">
                    <span className="relative z-10 flex items-center space-x-1">
                      <span>💼 Dashboard</span>
                    </span>
                    <div className="absolute inset-0 bg-accent-500/10 group-hover:bg-accent-500/20 rounded-lg transition-all duration-300 border border-accent-500/30 group-hover:border-accent-500/50"></div>
                  </Link>
                )}
                
                {isLoggedIn ? (
                  <div className="relative profile-menu-container">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-primary-800/80 to-primary-700/80 hover:from-primary-700 hover:to-primary-600 border border-primary-600 hover:border-accent-500/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-accent-500/20"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-sm">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-semibold">{userName}</p>
                        <p className="text-accent-400 text-xs capitalize font-medium">{userType}</p>
                      </div>
                      <ChevronDown size={16} className="text-primary-400 group-hover:text-accent-400 transition-colors" />
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-primary-800 border border-primary-700 rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-accent-500/20 to-accent-600/20 p-3 border-b border-primary-700">
                          <p className="text-white font-semibold">{userName}</p>
                          <p className="text-primary-400 text-xs capitalize">{userType} Account</p>
                        </div>
                        <div className="py-2">
                          {userType === 'barber' && (
                            <Link 
                              href="/barber-dashboard"
                              className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-700 text-accent-400 hover:text-accent-300 transition-colors border-b border-primary-700/50"
                            >
                              <Scissors size={16} />
                              <span className="text-sm font-semibold">💼 My Dashboard</span>
                            </Link>
                          )}
                          <Link 
                            href="/appointments"
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-700 text-primary-300 hover:text-white transition-colors"
                          >
                            <Calendar size={16} />
                            <span className="text-sm">My Appointments</span>
                          </Link>
                          <Link 
                            href="/wallet"
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-700 text-primary-300 hover:text-white transition-colors"
                          >
                            <CreditCard size={16} />
                            <span className="text-sm">Wallet & Rewards</span>
                          </Link>
                          <Link 
                            href="/ai-style"
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-700 text-primary-300 hover:text-white transition-colors"
                          >
                            <Scissors size={16} />
                            <span className="text-sm">AI Style Match</span>
                          </Link>
                          <Link 
                            href="/feedback"
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-700 text-primary-300 hover:text-white transition-colors"
                          >
                            <Star size={16} />
                            <span className="text-sm">Send Feedback</span>
                          </Link>
                        </div>
                        <div className="border-t border-primary-700 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors w-full text-left"
                          >
                            <X size={16} />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                <Link href="/login" className="relative overflow-hidden bg-primary-800/50 hover:bg-primary-700 border border-primary-600 hover:border-accent-500/50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg group">
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 to-accent-500/0 group-hover:from-accent-500/10 group-hover:to-transparent transition-all duration-300"></div>
                </Link>
                <Link href="/signup" className="relative overflow-hidden bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-black font-bold px-8 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/50 hover:scale-105 active:scale-95">
                  <span className="relative z-10">Get Started</span>
                </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-900 border-t border-primary-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/discover" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                Discover
              </Link>
              <Link href="/map" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                Map
              </Link>
              <Link href="/showcase" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                Showcase
              </Link>
              <Link href="/ai-style" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                AI Styles
              </Link>
              <Link href="/wallet" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                Wallet
              </Link>
              <Link href="/appointments" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                My Appointments
              </Link>
              <Link href="/feedback" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                Feedback
              </Link>
              
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-4 border-t border-primary-700 mt-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{userName}</p>
                        <p className="text-primary-400 text-sm capitalize">{userType} Account</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {userType === 'barber' && (
                        <Link 
                          href="/barber-dashboard"
                          className="flex items-center space-x-3 bg-accent-500/20 hover:bg-accent-500/30 border border-accent-500/50 px-4 py-3 rounded-lg text-accent-400 hover:text-accent-300 transition-colors font-semibold"
                        >
                          <Scissors size={18} />
                          <span>💼 My Dashboard</span>
                        </Link>
                      )}
                      <Link 
                        href="/appointments"
                        className="flex items-center space-x-3 bg-primary-800 hover:bg-primary-700 px-4 py-3 rounded-lg text-primary-300 hover:text-white transition-colors"
                      >
                        <Calendar size={18} />
                        <span>My Appointments</span>
                      </Link>
                      <Link 
                        href="/wallet"
                        className="flex items-center space-x-3 bg-primary-800 hover:bg-primary-700 px-4 py-3 rounded-lg text-primary-300 hover:text-white transition-colors"
                      >
                        <CreditCard size={18} />
                        <span>Wallet & Rewards</span>
                      </Link>
                      <Link 
                        href="/ai-style"
                        className="flex items-center space-x-3 bg-primary-800 hover:bg-primary-700 px-4 py-3 rounded-lg text-primary-300 hover:text-white transition-colors"
                      >
                        <Scissors size={18} />
                        <span>AI Style Match</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 bg-red-500/10 hover:bg-red-500/20 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 transition-colors w-full text-left"
                      >
                        <X size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
              <Link href="/login" className="text-primary-300 hover:text-white block px-3 py-2 text-base font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary block text-center mx-3 my-2">
                Get Started
              </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-fade-in space-y-6">
              <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
                Find Your
                <span className="relative inline-block mx-3">
                  <span className="gradient-text animate-pulse-slow"> Perfect</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </span>
                <br />
                <span className="inline-block mt-2 relative">
                  Fade
                  <span className="absolute -inset-1 bg-accent-500/20 blur-2xl rounded-full"></span>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-300/90 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                Discover top-rated barbers near you, get AI-powered hairstyle recommendations, 
                and book your next cut with ease.
              </p>
              <div className="flex justify-center space-x-2 animate-slide-up">
                <div className="flex items-center space-x-2 bg-primary-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-700/50">
                  <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-primary-300">1000+ Verified Barbers</span>
                </div>
                <div className="flex items-center space-x-2 bg-primary-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-700/50">
                  <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-primary-300">AI-Powered Matching</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="animate-slide-up max-w-4xl mx-auto mb-12">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-primary-400 group-focus-within:text-accent-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search locations, barbers, or styles..."
                    className="w-full pl-14 pr-36 py-5 bg-primary-800/95 backdrop-blur-xl border-2 border-primary-600/80 focus:border-accent-500 rounded-2xl text-white text-lg placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all duration-300 shadow-xl shadow-black/30 focus:shadow-accent-500/20 hover:border-primary-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button 
                      type="submit" 
                      className="relative overflow-hidden bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 bg-[length:200%_100%] hover:bg-[position:100%] text-black font-bold px-8 py-3 rounded-xl transition-all duration-500 shadow-lg shadow-accent-500/40 hover:shadow-xl hover:shadow-accent-500/60 hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-5 mb-20 overflow-visible">
              <Link href="/discover?nearby=true" className="relative group overflow-hidden flex items-center space-x-3 bg-gradient-to-br from-primary-800/80 to-primary-700/60 backdrop-blur-xl border-2 border-primary-600 hover:border-accent-500/70 px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-accent-500/20 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/10 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <MapPin size={24} className="text-accent-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                <span className="font-bold text-lg text-white relative z-10">Near Me</span>
              </Link>
              <Link href="/ai-style" className="relative group overflow-visible flex items-center space-x-3 bg-gradient-to-br from-primary-800/80 to-primary-700/60 backdrop-blur-xl border-2 border-primary-600 hover:border-accent-500/70 px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-accent-500/20 hover:scale-105 active:scale-95">
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-400 via-yellow-400 to-accent-500 text-black text-xs px-3 py-1 rounded-full font-black shadow-xl animate-bounce z-30 whitespace-nowrap">
                  Try out!!
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 via-accent-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <Camera size={24} className="text-accent-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                <span className="font-bold text-lg text-white relative z-10">AI Style Match</span>
              </Link>
              <Link href="/discover?sort=rating" className="relative group overflow-hidden flex items-center space-x-3 bg-gradient-to-br from-primary-800/80 to-primary-700/60 backdrop-blur-xl border-2 border-primary-600 hover:border-accent-500/70 px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-accent-500/20 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/10 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Star size={24} className="text-accent-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10 fill-accent-400" />
                <span className="font-bold text-lg text-white relative z-10">Top Rated</span>
              </Link>
              <Link href="/appointments" className="relative group overflow-hidden flex items-center space-x-3 bg-gradient-to-br from-primary-800/80 to-primary-700/60 backdrop-blur-xl border-2 border-primary-600 hover:border-accent-500/70 px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-accent-500/20 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/10 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Calendar size={24} className="text-accent-400 group-hover:scale-125 transition-all duration-300 relative z-10" />
                <span className="font-bold text-lg text-white relative z-10">My Appointments</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="section-padding bg-gradient-to-br from-primary-950 via-primary-900 to-accent-950/30 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent-500/20 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-accent-500/30">
              <Camera size={16} />
              <span>Powered by AI</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
              Your Perfect Hairstyle,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-purple-400">
                Predicted by AI
              </span>
            </h2>
            <p className="text-xl text-primary-300 max-w-3xl mx-auto">
              Our advanced AI analyzes your face shape, features, and preferences to recommend hairstyles that will look amazing on you. See exactly how you'll look before you book.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: How It Works */}
            <div className="space-y-6">
              <div className="card bg-primary-800/50 backdrop-blur-sm border-l-4 border-accent-500">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-500 text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">Take a Quiz or Upload Photo</h3>
                    <p className="text-primary-300">
                      Answer a few questions about your style preferences, or upload a selfie for instant analysis. Your choice!
                    </p>
                  </div>
                </div>
              </div>

              <div className="card bg-primary-800/50 backdrop-blur-sm border-l-4 border-accent-500">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-500 text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">AI Analyzes Your Features</h3>
                    <p className="text-primary-300">
                      Our technology detects your face shape, analyzes your features, and matches you with styles that complement your unique look.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card bg-primary-800/50 backdrop-blur-sm border-l-4 border-accent-500">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-500 text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">See Before & After</h3>
                    <p className="text-primary-300">
                      Get personalized recommendations with before/after previews. Share them with your barber for perfect communication!
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/ai-style" className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-3 group">
                <span>Try AI Style Match</span>
                <Camera size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Right: Visual Demo */}
            <div className="relative">
              <div className="card bg-gradient-to-br from-primary-800 to-primary-900 p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <div className="bg-primary-700 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Camera size={40} className="text-primary-400 mb-2 mx-auto" />
                        <span className="text-primary-300 text-sm">Upload Photo</span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                      Before
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-accent-600/30 to-purple-600/30 border-2 border-accent-500/50 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Check size={24} className="text-black" />
                        </div>
                        <span className="text-accent-300 text-sm font-medium">Perfect Match!</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-accent-500 px-2 py-1 rounded text-black text-xs font-medium">
                      After
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold">Face Shape Detected:</h4>
                      <p className="text-accent-400 text-lg font-bold">Oval</p>
                    </div>
                    <div className="bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full text-sm font-medium">
                      95% Match
                    </div>
                  </div>
                  <div className="text-sm text-primary-300">
                    <p className="mb-2">✅ Recommended: Modern Fade, Textured Crop</p>
                    <p>🔥 Trending in your area</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-accent-400 to-accent-600 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                ⚡ Instant Results
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                🎯 98% Accuracy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-primary-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
              Why Choose FindMyFade?
            </h2>
            <p className="text-xl text-primary-300 max-w-2xl mx-auto">
              We&apos;ve revolutionized the way you find and book your perfect barber experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative card hover:border-accent-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <MapPin size={26} className="text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-3 group-hover:text-accent-400 transition-colors">Location-Based Discovery</h3>
              <p className="text-primary-300 leading-relaxed text-base">
                Find the best barbers in your area with our advanced location-based search and filtering system.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative card hover:border-accent-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Camera size={26} className="text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-3 group-hover:text-accent-400 transition-colors">AI Style Recommendations</h3>
              <p className="text-primary-300 leading-relaxed text-base">
                Upload your photo and get personalized hairstyle recommendations powered by advanced AI technology.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative card hover:border-accent-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Calendar size={26} className="text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-3 group-hover:text-accent-400 transition-colors">Easy Booking</h3>
              <p className="text-primary-300 leading-relaxed text-base">
                Book appointments instantly with real-time availability and calendar integration.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative card hover:border-accent-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <CreditCard size={26} className="text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-3 group-hover:text-accent-400 transition-colors">Prepay & Rewards</h3>
              <p className="text-primary-300 leading-relaxed text-base">
                Pay ahead for discounts and earn rewards points for future bookings and exclusive offers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative card hover:border-accent-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Users size={26} className="text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-3 group-hover:text-accent-400 transition-colors">Social Portfolios</h3>
              <p className="text-primary-300 leading-relaxed text-base">
                Browse barber portfolios with photos, videos, and client reviews to find your perfect match.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative card hover:border-accent-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <TrendingUp size={26} className="text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-3 group-hover:text-accent-400 transition-colors">Trending Styles</h3>
              <p className="text-primary-300 leading-relaxed text-base">
                Stay updated with the latest hairstyle trends and discover what&apos;s popular in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-accent-500 mb-2">10K+</div>
              <div className="text-primary-300 text-lg">Verified Barbers</div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-accent-500 mb-2">50K+</div>
              <div className="text-primary-300 text-lg">Happy Clients</div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-accent-500 mb-2">100K+</div>
              <div className="text-primary-300 text-lg">Bookings Made</div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-accent-500 mb-2">4.9</div>
              <div className="text-primary-300 text-lg">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-black mb-6">
            Ready to Find Your Perfect Fade?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Join thousands of satisfied clients who&apos;ve found their ideal barber through FindMyFade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-black text-white font-medium px-8 py-4 rounded-lg hover:bg-primary-800 transition-all duration-200 transform hover:scale-105">
              Get Started Free
            </Link>
            <Link href="/discover" className="bg-transparent border-2 border-black text-black font-medium px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-all duration-200">
              Explore Barbers
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-950 border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">F</span>
                </div>
                <span className="font-display font-bold text-xl text-white">FindMyFade</span>
              </div>
              <p className="text-primary-400 mb-4">
                Connecting clients with the best barbers for the perfect fade experience.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">For Clients</h3>
              <ul className="space-y-2 text-primary-400">
                <li><Link href="/discover" className="hover:text-white transition-colors">Find Barbers</Link></li>
                <li><Link href="/ai-style" className="hover:text-white transition-colors">AI Style Match</Link></li>
                <li><Link href="/appointments" className="hover:text-white transition-colors">My Appointments</Link></li>
                <li><Link href="/wallet" className="hover:text-white transition-colors">Wallet & Rewards</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">For Barbers</h3>
              <ul className="space-y-2 text-primary-400">
                <li><Link href="/signup?type=barber" className="hover:text-white transition-colors">Join Platform</Link></li>
                <li><Link href="/barber-dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/showcase" className="hover:text-white transition-colors">Showcase</Link></li>
                <li><Link href="/feedback" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-primary-400">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/feedback" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/clear-cache" className="hover:text-accent-400 transition-colors">🗑️ Clear Cache</Link></li>
                <li><Link href="/map" className="hover:text-white transition-colors">Explore Map</Link></li>
                <li><Link href="/discover" className="hover:text-white transition-colors">Browse All Barbers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-800 mt-8 pt-8 text-center">
            <p className="text-primary-400">
              &copy; 2025 FindMyFade. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
