'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  Grid,
  List,
  Navigation,
  Clock,
  DollarSign,
  Heart,
  Share2,
  Phone,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { usBarbers, getNearbyBarbers } from '@/data/barbers'
import { useSearchParams, useRouter } from 'next/navigation'

// Use real US barbers data
const allBarbers = usBarbers.map(barber => ({
  id: barber.id,
  name: barber.shopName,
  rating: barber.rating,
  reviews: barber.reviews,
  distance: barber.distance || Math.random() * 10,
  image: barber.image,
  specialties: barber.specialties,
  price: barber.price,
  nextAvailable: barber.nextAvailable,
  address: `${barber.address}, ${barber.city}, ${barber.state}`,
  phone: barber.phone,
  verified: barber.verified,
  promoted: barber.promoted,
  city: barber.city,
  state: barber.state
}))

const mockBarbers_OLD = [
  {
    id: 1,
    name: "Mike's Premium Cuts",
    rating: 4.9,
    reviews: 127,
    distance: 0.3,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Beard Trim", "Classic Cuts"],
    price: "$25-45",
    nextAvailable: "Today 2:30 PM",
    address: "123 Main St, Downtown",
    phone: "(555) 123-4567",
    verified: true,
    promoted: true
  },
  {
    id: 2,
    name: "FreshCut Barbershop",
    rating: 4.8,
    reviews: 89,
    distance: 0.7,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Fades", "Hair Design", "Straight Razor"],
    price: "$20-40",
    nextAvailable: "Tomorrow 10:00 AM",
    address: "456 Oak Ave, Midtown",
    phone: "(555) 987-6543",
    verified: true,
    promoted: false
  },
  {
    id: 3,
    name: "The Gentleman's Den",
    rating: 4.7,
    reviews: 203,
    distance: 1.2,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Hot Towel Shave", "Mustache Styling"],
    price: "$30-55",
    nextAvailable: "Today 4:15 PM",
    address: "789 Pine St, Old Town",
    phone: "(555) 456-7890",
    verified: true,
    promoted: false
  },
  {
    id: 4,
    name: "Urban Edge Barbers",
    rating: 4.6,
    reviews: 156,
    distance: 1.8,
    image: "/api/placeholder/300/200",
    specialties: ["Creative Cuts", "Color", "Styling"],
    price: "$22-42",
    nextAvailable: "Today 6:00 PM",
    address: "321 Elm St, Arts District",
    phone: "(555) 789-0123",
    verified: false,
    promoted: false
  }
]

export default function DiscoverPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const nearbyMode = searchParams?.get('nearby') === 'true'
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('distance')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [availableToday, setAvailableToday] = useState(false)
  const [displayBarbers, setDisplayBarbers] = useState(allBarbers)
  const [combinedBarbers, setCombinedBarbers] = useState(allBarbers)
  const [clientPreferences, setClientPreferences] = useState<string[]>([])
  const [matchedBarbersOnly, setMatchedBarbersOnly] = useState(true)

  const specialties = ["Fade", "Beard Trim", "Classic Cuts", "Modern Fades", "Hair Design", "Straight Razor", "Hot Towel Shave", "Mustache Styling", "Creative Cuts", "Color", "Styling"]

  // Load user-created barbers and combine with default barbers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userCreatedBarbers = JSON.parse(localStorage.getItem('userCreatedBarbers') || '[]')
      const formattedUserBarbers = userCreatedBarbers.map((barber: any) => ({
        id: barber.id,
        name: barber.shopName,
        rating: barber.rating,
        reviews: barber.reviews,
        distance: barber.distance,
        image: barber.image,
        specialties: barber.specialties,
        price: barber.price,
        nextAvailable: barber.nextAvailable || 'Available',
        address: barber.address,
        phone: barber.phone,
        verified: barber.verified,
        promoted: barber.promoted,
        city: barber.city,
        state: barber.state
      }))
      
      // Combine user-created barbers with default ones (user barbers first)
      const combined = [...formattedUserBarbers, ...allBarbers]
      setCombinedBarbers(combined)
      setDisplayBarbers(combined)
      
      // Load client preferences
      const userProfile = localStorage.getItem('userProfile')
      if (userProfile) {
        const profile = JSON.parse(userProfile)
        if (profile.preferences && profile.preferences.length > 0) {
          setClientPreferences(profile.preferences)
        }
      }
    }
  }, [])

  // Load nearby barbers if in nearby mode
  useEffect(() => {
    if (nearbyMode) {
      // Get user-created barbers
      const userCreatedBarbers = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('userCreatedBarbers') || '[]')
        : []
      
      const formattedUserBarbers = userCreatedBarbers.map((barber: any) => ({
        id: barber.id,
        name: barber.shopName,
        rating: barber.rating,
        reviews: barber.reviews,
        distance: barber.distance,
        image: barber.image,
        specialties: barber.specialties,
        price: barber.price,
        nextAvailable: barber.nextAvailable || 'Available',
        address: barber.address,
        phone: barber.phone,
        verified: barber.verified,
        promoted: barber.promoted,
        city: barber.city,
        state: barber.state
      }))
      
      const nearby = getNearbyBarbers(20).map(barber => ({
        id: barber.id,
        name: barber.shopName,
        rating: barber.rating,
        reviews: barber.reviews,
        distance: barber.distance || 0,
        image: barber.image,
        specialties: barber.specialties,
        price: barber.price,
        nextAvailable: barber.nextAvailable,
        address: `${barber.address}, ${barber.city}, ${barber.state}`,
        phone: barber.phone,
        verified: barber.verified,
        promoted: barber.promoted,
        city: barber.city,
        state: barber.state
      }))
      
      // Combine user barbers with nearby (user barbers first)
      setDisplayBarbers([...formattedUserBarbers, ...nearby])
      setSortBy('distance')
    }
  }, [nearbyMode])

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  const filteredBarbers = displayBarbers.filter(barber => {
    const matchesSearch = barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         barber.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         barber.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         barber.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         barber.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesVerified = !onlyVerified || barber.verified
    const matchesAvailable = !availableToday || barber.nextAvailable.includes('Today')
    const matchesSpecialties = selectedSpecialties.length === 0 || 
                              selectedSpecialties.some(s => barber.specialties.includes(s))
    
    // Match client preferences with barber specialties
    const matchesPreferences = !matchedBarbersOnly || clientPreferences.length === 0 ||
                              clientPreferences.some(pref => 
                                barber.specialties.some(spec => 
                                  spec.toLowerCase().includes(pref.toLowerCase()) ||
                                  pref.toLowerCase().includes(spec.toLowerCase()) ||
                                  // Match "Low Fades" with "Fade", "Mid Fades" with "Modern Fades", etc.
                                  (pref.includes('Fade') && spec.toLowerCase().includes('fade')) ||
                                  (pref.includes('Taper') && spec.toLowerCase().includes('taper')) ||
                                  (pref.toLowerCase().includes('line') && spec.toLowerCase().includes('edge')) ||
                                  (pref.toLowerCase().includes('beard') && spec.toLowerCase().includes('beard'))
                                )
                              )
    
    return matchesSearch && matchesVerified && matchesAvailable && matchesSpecialties && matchesPreferences
  })

  const sortedBarbers = [...filteredBarbers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price':
        return parseInt(a.price.split('-')[0].replace('$', '')) - parseInt(b.price.split('-')[0].replace('$', ''))
      case 'reviews':
        return b.reviews - a.reviews
      default: // distance
        return a.distance - b.distance
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-2">
                {nearbyMode ? '📍 Barbers Near You' : 'Discover Barbers'}
              </h1>
              <p className="text-primary-300 mb-2">
                {nearbyMode ? 'Top-rated barbers in your area' : 'Find the perfect barber anywhere in the US'}
              </p>
              {clientPreferences.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs text-primary-400 font-medium">Your Preferences:</span>
                  {clientPreferences.map((pref, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-500/20 text-accent-400 border border-accent-500/30"
                    >
                      {pref}
                    </span>
                  ))}
                  <button
                    onClick={() => setMatchedBarbersOnly(!matchedBarbersOnly)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      matchedBarbersOnly
                        ? 'bg-accent-500/30 text-accent-300 border border-accent-500/50'
                        : 'bg-primary-700/50 text-primary-400 border border-primary-600'
                    }`}
                  >
                    {matchedBarbersOnly ? '✓ Matched Only' : 'Show All'}
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => router.back()} 
              className="text-accent-500 hover:text-accent-400 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="text"
                placeholder="Search barbers, styles, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-primary-800/50 backdrop-blur-sm border border-primary-600 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-primary-800/50 backdrop-blur-sm border border-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700/50 transition-all duration-200"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-primary-800/50 backdrop-blur-sm border border-primary-600 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="reviews">Sort by Reviews</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-accent-500 text-black' : 'bg-primary-800/50 text-primary-300'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-accent-500 text-black' : 'bg-primary-800/50 text-primary-300'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">Specialties</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {specialties.map(specialty => (
                        <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSpecialties.includes(specialty)}
                            onChange={() => handleSpecialtyToggle(specialty)}
                            className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                          />
                          <span className="text-primary-300 text-sm">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onlyVerified}
                          onChange={(e) => setOnlyVerified(e.target.checked)}
                          className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                        />
                        <span className="text-primary-300 text-sm">Verified barbers only</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={availableToday}
                          onChange={(e) => setAvailableToday(e.target.checked)}
                          className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                        />
                        <span className="text-primary-300 text-sm">Available today</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-accent-500"
                      />
                      <div className="flex justify-between text-primary-300 text-sm">
                        <span>$0</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white">
            {sortedBarbers.length} barbers found
          </h2>
          <div className="flex items-center space-x-2 text-primary-300">
            <Navigation size={16} />
            <span>Downtown Area</span>
          </div>
        </div>

        {/* Barber Cards */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {sortedBarbers.map(barber => (
            <div key={barber.id} className={`card group hover:scale-105 transition-all duration-200 ${barber.promoted ? 'ring-2 ring-accent-500' : ''}`}>
              {barber.promoted && (
                <div className="bg-accent-500 text-black text-xs font-semibold px-2 py-1 rounded-full mb-3 inline-block">
                  PROMOTED
                </div>
              )}
              
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-primary-700 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-primary-300">Barber Photo</span>
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
                    <Heart size={16} className="text-white" />
                  </button>
                  <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
                    <Share2 size={16} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between mb-2">
                <Link href={`/barber/${barber.id}`} className="flex-1">
                  <h3 className="font-semibold text-white text-lg group-hover:text-accent-500 transition-colors cursor-pointer">
                    {barber.name}
                  </h3>
                </Link>
                {barber.verified && (
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                  <span className="text-white font-medium">{barber.rating}</span>
                  <span className="text-primary-400">({barber.reviews})</span>
                </div>
                <span className="text-primary-400">•</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  <span className="text-primary-400">{barber.distance.toFixed(1)} mi</span>
                </div>
              </div>

              <p className="text-primary-300 text-sm mb-3">{barber.address}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {barber.specialties.slice(0, 3).map(specialty => (
                  <span key={specialty} className="bg-primary-700 text-primary-300 text-xs px-2 py-1 rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-accent-500" />
                  <span className="text-white font-medium">{barber.price}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm">{barber.nextAvailable}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/barber/${barber.id}`} className="flex-1 btn-primary text-center">
                  View Profile
                </Link>
                <button className="flex items-center space-x-1 bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Phone size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {sortedBarbers.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn-secondary">
              Load More Barbers
            </button>
          </div>
        )}

        {/* No Results */}
        {sortedBarbers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-primary-400" />
            </div>
            <h3 className="font-semibold text-white text-xl mb-2">No barbers found</h3>
            <p className="text-primary-300 mb-6">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setSelectedSpecialties([])
                setOnlyVerified(false)
                setAvailableToday(false)
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
