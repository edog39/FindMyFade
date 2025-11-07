'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MapPin,
  Navigation,
  Search,
  Filter,
  Star,
  Clock,
  Locate,
  ChevronLeft,
  List,
  Layers,
  Phone,
  Calendar,
  Plus,
  Scissors,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MapBarber {
  id: number | string
  name: string
  barber: string
  rating: number
  reviews: number
  price: string
  distance: number
  coordinates: { lat: number; lng: number }
  address: string
  phone: string
  nextAvailable: string
  specialties: string[]
  verified: boolean
  open: boolean
  promoted: boolean
}

export default function MapPage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<number | string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showList, setShowList] = useState(false)
  const [searchRadius, setSearchRadius] = useState(5)
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance')
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain'>('default')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isRecentering, setIsRecentering] = useState(false)
  const [allMapBarbers, setAllMapBarbers] = useState<MapBarber[]>([])
  const [loading, setLoading] = useState(true)

  const mapRef = useRef<HTMLDivElement>(null)

  // US Location Database - Comprehensive coverage
  const LOCATIONS: Record<string, { lat: number; lng: number }> = {
    // Major Cities
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'San Diego': { lat: 32.7157, lng: -117.1611 },
    'New York City': { lat: 40.7128, lng: -74.0060 },
    'Brooklyn': { lat: 40.6782, lng: -73.9442 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Houston': { lat: 29.7604, lng: -95.3698 },
    'Phoenix': { lat: 33.4484, lng: -112.0740 },
    'Philadelphia': { lat: 39.9526, lng: -75.1652 },
    'Dallas': { lat: 32.7767, lng: -96.7970 },
    'Austin': { lat: 30.2672, lng: -97.7431 },
    'Miami': { lat: 25.7617, lng: -80.1918 },
    'Seattle': { lat: 47.6062, lng: -122.3321 },
    'Denver': { lat: 39.7392, lng: -104.9903 },
    'Boston': { lat: 42.3601, lng: -71.0589 },
    'Atlanta': { lat: 33.7490, lng: -84.3880 },
    'Las Vegas': { lat: 36.1699, lng: -115.1398 },
    'Portland': { lat: 45.5152, lng: -122.6784 },
    'Nashville': { lat: 36.1627, lng: -86.7816 },
    'Detroit': { lat: 42.3314, lng: -83.0458 },
    // States (Abbreviations)
    'CA': { lat: 36.7783, lng: -119.4179 },
    'TX': { lat: 31.9686, lng: -99.9018 },
    'FL': { lat: 27.6648, lng: -81.5158 },
    'NY': { lat: 40.7128, lng: -74.0060 },
    'IL': { lat: 40.6331, lng: -89.3985 },
    'PA': { lat: 41.2033, lng: -77.1945 },
    'OH': { lat: 40.4173, lng: -82.9071 },
    'GA': { lat: 32.1656, lng: -82.9001 },
    'MI': { lat: 44.3148, lng: -85.6024 },
    'NC': { lat: 35.7596, lng: -79.0193 },
    'TN': { lat: 35.5175, lng: -86.5804 },
    'AZ': { lat: 34.0489, lng: -111.0937 },
    'MA': { lat: 42.4072, lng: -71.3824 },
    'WA': { lat: 47.7511, lng: -120.7401 },
    'CO': { lat: 39.5501, lng: -105.7821 },
    'NV': { lat: 38.8026, lng: -116.4194 },
    'OR': { lat: 43.8041, lng: -120.5542 },
  }

  // Geocode city/state to coordinates
  const geocode = (city: any, state: any, index: number) => {
    const c = String(city || '').trim()
    const s = String(state || '').trim()
    const base = LOCATIONS[c] || LOCATIONS[s] || { lat: 37.7749, lng: -122.4194 }
    
    const offset = index * 0.015
    return {
      lat: base.lat + (Math.random() - 0.5) * 0.08 + offset * Math.cos(index),
      lng: base.lng + (Math.random() - 0.5) * 0.08 + offset * Math.sin(index)
    }
  }

  // Safe price parser
  const parsePrice = (price: string): number => {
    if (!price) return 0
    if (price.includes('-')) {
      const min = parseInt(price.split('-')[0].replace(/\$/g, '') || '0')
      return isNaN(min) ? 0 : min
    }
    return (price.match(/\$/g) || []).length * 25
  }

  // Load barbers from database ONLY
  useEffect(() => {
    const loadBarbers = async () => {
      try {
        setLoading(true)
        console.log('🗺️ Loading barbers from database...')
        
        const res = await fetch('/api/barbers', { cache: 'no-store' })
        
        if (!res.ok) {
          console.warn('⚠️ Database API returned error')
          setAllMapBarbers([])
          setLoading(false)
          return
        }
        
        const data = await res.json()
        const barbers = data.barbers || []
        console.log('✅ Loaded', barbers.length, 'barbers from database')
        
        // Format for map
        const formatted: MapBarber[] = barbers.map((b: any, idx: number) => ({
          id: b.id,
          name: b.shopName || b.name || 'Barber Shop',
          barber: b.barberName || b.name || 'Barber',
          rating: typeof b.rating === 'number' ? b.rating : 5.0,
          reviews: typeof b.reviews === 'number' ? b.reviews : 0,
          price: b.price || '$$',
          distance: typeof b.distance === 'number' ? b.distance : Math.random() * 5,
          coordinates: geocode(b.city, b.state, idx),
          address: b.address || [b.city, b.state].filter(Boolean).join(', ') || 'Location TBD',
          phone: b.phone || 'N/A',
          nextAvailable: b.nextAvailable || 'Call for availability',
          specialties: Array.isArray(b.specialties) ? b.specialties : [],
          verified: b.verified === true,
          open: b.open !== false,
          promoted: b.promoted === true,
        }))
        
        console.log('✅ Map ready with', formatted.length, 'barbers')
        setAllMapBarbers(formatted)
        setLoading(false)
      } catch (err) {
        console.error('❌ Error loading barbers:', err)
        setAllMapBarbers([])
        setLoading(false)
      }
    }
    
    loadBarbers()
  }, [])

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 37.7749, lng: -122.4194 })
      )
    } else {
      setUserLocation({ lat: 37.7749, lng: -122.4194 })
    }
  }, [])

  // Auto-adjust radius with zoom
  useEffect(() => {
    const radius = Math.round(25 - ((zoomLevel - 0.5) / 2.5) * 24)
    setSearchRadius(Math.max(1, Math.min(25, radius)))
  }, [zoomLevel])

  // Filter barbers
  const filteredBarbers = allMapBarbers.filter(barber => {
    if (onlyOpen && !barber.open) return false
    if (onlyVerified && !barber.verified) return false
    if (barber.distance > searchRadius) return false
    if (parsePrice(barber.price) > priceRange[1]) return false
    if (selectedSpecialties.length > 0 && !selectedSpecialties.some(s => barber.specialties.includes(s))) return false
    return true
  })

  // Sort barbers
  const sortedBarbers = [...filteredBarbers].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'price') return parsePrice(a.price) - parsePrice(b.price)
    return a.distance - b.distance
  })

  const specialties = ["Fade", "Beard Trim", "Classic Cuts", "Modern Fades", "Hair Design", "Straight Razor"]

  const handleSpecialtyToggle = (s: string) => {
    setSelectedSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleZoomIn = () => setZoomLevel(p => Math.min(p + 0.2, 3))
  const handleZoomOut = () => setZoomLevel(p => Math.max(p - 0.2, 0.5))
  
  const handleRecenter = () => {
    setIsRecentering(true)
    setMapPosition({ x: 0, y: 0 })
    setZoomLevel(1)
    setTimeout(() => setIsRecentering(false), 500)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setMapPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * -0.001
    setZoomLevel(p => Math.min(Math.max(p + delta, 0.5), 3))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-primary-300 text-lg">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-primary-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-primary-900/95 backdrop-blur-lg border-b border-primary-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="text-primary-300 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="font-display font-bold text-xl text-white">Map View</h1>
              <p className="text-primary-400 text-sm">
                <span className="text-accent-400 font-semibold">{sortedBarbers.length}</span> barber{sortedBarbers.length !== 1 ? 's' : ''} within <span className="text-accent-400 font-semibold">{searchRadius} mi</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowFilters(!showFilters)} className="p-2 bg-primary-800 hover:bg-primary-700 text-primary-300 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
            <button onClick={() => setShowList(!showList)} className={`p-2 rounded-lg transition-colors ${showList ? 'bg-accent-500 text-black' : 'bg-primary-800 hover:bg-primary-700 text-primary-300'}`}>
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search area, barber, or style..."
              className="w-full pl-10 pr-4 py-2 bg-primary-800 border border-primary-600 rounded-lg text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-full pt-32">
        <div 
          ref={mapRef} 
          className={`w-full h-full relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onWheel={handleWheel}
        >
          {/* Map Background */}
          <div 
            className={`absolute inset-0 ${isRecentering ? 'transition-all duration-500' : ''}`}
            style={{ transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoomLevel})` }}
          >
            {mapStyle === 'satellite' ? (
              <div className="w-[500vw] h-[500vh] absolute" style={{ left: '-200vw', top: '-200vh', backgroundColor: '#1a1a2e', backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(100, 150, 100, 0.3) 0%, transparent 50%)', backgroundSize: '800px 800px', backgroundRepeat: 'repeat' }} />
            ) : mapStyle === 'terrain' ? (
              <div className="w-[500vw] h-[500vh] absolute" style={{ left: '-200vw', top: '-200vh', backgroundColor: '#87ceeb', backgroundImage: 'radial-gradient(ellipse at 40% 50%, rgba(139, 195, 74, 0.8) 0%, transparent 60%)', backgroundSize: '1200px 1200px', backgroundRepeat: 'repeat' }} />
            ) : (
              <div className="w-[500vw] h-[500vh] absolute" style={{ left: '-200vw', top: '-200vh', backgroundColor: '#4a90e2', backgroundImage: 'radial-gradient(ellipse 500px 400px at 30% 40%, rgba(139, 195, 74, 0.9) 0%, transparent 70%)', backgroundSize: '1600px 1200px', backgroundRepeat: 'repeat' }} />
            )}
          </div>

          {/* Markers */}
          <div 
            className={`absolute inset-0 pointer-events-none ${isRecentering ? 'transition-all duration-500' : ''}`}
            style={{ transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoomLevel})` }}
          >
            {/* User Location */}
            {userLocation && (
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto" style={{ left: '50%', top: '50%' }}>
                <div className="w-full h-full bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Barber Markers */}
            {sortedBarbers.map((barber, index) => {
              const isSelected = selectedBarber === barber.id
              const angle = (index * 360 / Math.max(sortedBarbers.length, 1)) * Math.PI / 180
              const radius = 100 + (index * 30)
              const x = 50 + (Math.cos(angle) * radius * 0.3)
              const y = 50 + (Math.sin(angle) * radius * 0.2)
              
              return (
                <div
                  key={barber.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all pointer-events-auto ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}`}
                  style={{ left: `${Math.max(10, Math.min(90, x))}%`, top: `${Math.max(15, Math.min(85, y))}%` }}
                  onClick={() => setSelectedBarber(barber.id)}
                >
                  <div className="relative">
                    {/* Sparkle badge for all barbers */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white flex items-center justify-center z-10">
                      <span className="text-white text-[8px] font-bold">✨</span>
                    </div>
                    
                    {/* Marker */}
                    <div className="w-8 h-8 rounded-full border-2 border-green-400 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg flex items-center justify-center animate-pulse-slow">
                      <Scissors size={12} />
                    </div>
                    
                    {/* Popup */}
                    {isSelected && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-primary-800 border border-primary-600 rounded-lg shadow-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white text-sm">{barber.name}</h3>
                            <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">✨</span>
                          </div>
                          {barber.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2 text-xs">
                          <Star className="w-3 h-3 fill-accent-500 text-accent-500" />
                          <span className="text-white">{barber.rating}</span>
                          <span className="text-primary-400">({barber.reviews})</span>
                          <span className="text-primary-400">•</span>
                          <span className="text-primary-300">{barber.distance.toFixed(1)} mi</span>
                          <span className="text-primary-400">•</span>
                          <span className={barber.open ? 'text-green-400' : 'text-red-400'}>
                            {barber.open ? 'Open' : 'Closed'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1 mb-3 text-xs text-primary-300">
                          <MapPin size={10} />
                          <span>{barber.address}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link href={`/barber/${barber.id}`} className="flex-1 bg-accent-500 hover:bg-accent-600 text-black text-xs font-medium px-3 py-2 rounded transition-colors text-center">
                            View Profile
                          </Link>
                          <button className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded transition-colors">
                            <Phone size={12} />
                          </button>
                        </div>
                        
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                          <div className="border-4 border-transparent border-t-primary-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Map Style Toggle */}
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-primary-800/90 backdrop-blur-sm rounded-lg p-1 flex space-x-1">
            {[
              { key: 'default' as const, label: 'Map', icon: <Layers size={14} /> },
              { key: 'satellite' as const, label: 'Satellite', icon: <Target size={14} /> },
              { key: 'terrain' as const, label: 'Terrain', icon: <Navigation size={14} /> }
            ].map(style => (
              <button
                key={style.key}
                onClick={() => setMapStyle(style.key)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                  mapStyle === style.key ? 'bg-accent-500 text-black' : 'text-primary-300 hover:bg-primary-700'
                }`}
              >
                {style.icon}
                <span>{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 z-30">
          <div className="bg-primary-800/90 backdrop-blur-sm rounded-lg p-2 space-y-2">
            <button onClick={handleZoomIn} className="w-10 h-10 bg-primary-700 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center transition-colors">
              <Plus size={16} />
            </button>
            <button onClick={handleZoomOut} className="w-10 h-10 bg-primary-700 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center transition-colors">
              <span className="text-lg font-bold">−</span>
            </button>
            <button onClick={handleRecenter} className="w-10 h-10 bg-accent-500 hover:bg-accent-600 text-black rounded-lg flex items-center justify-center transition-colors">
              <Locate size={16} className={isRecentering ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Radius Indicator */}
        <div className="absolute bottom-4 left-4 z-30">
          <div className="bg-primary-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2 text-sm text-primary-300">
              <Target size={14} />
              <span>Radius: {searchRadius} mi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-32 left-4 right-4 z-50 bg-primary-800/95 backdrop-blur-lg border border-primary-700 rounded-xl p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-primary-400 hover:text-white text-2xl">×</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-primary-300 text-sm mb-2">Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="w-full bg-primary-700 border border-primary-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
              </select>
            </div>

            <div>
              <label className="block text-primary-300 text-sm mb-2">Max Price: ${priceRange[1]}</label>
              <input type="range" min="0" max="100" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-accent-500" />
            </div>

            <div>
              <label className="block text-primary-300 text-sm mb-2">Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500" />
                  <span className="text-primary-300 text-sm">Open now</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500" />
                  <span className="text-primary-300 text-sm">Verified only</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-primary-300 text-sm mb-2">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map(specialty => (
                <button
                  key={specialty}
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedSpecialties.includes(specialty) ? 'bg-accent-500 text-black' : 'bg-primary-700 text-primary-300 hover:bg-primary-600'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {showList && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-primary-900/95 backdrop-blur-lg border-t border-primary-700 max-h-80 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Nearby Barbers</h3>
                <p className="text-primary-400 text-sm">{sortedBarbers.length} barber{sortedBarbers.length !== 1 ? 's' : ''} found</p>
              </div>
              <button onClick={() => setShowList(false)} className="text-primary-400 hover:text-white text-2xl">×</button>
            </div>
            
            {sortedBarbers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white font-medium mb-2">No barbers found</p>
                <p className="text-primary-400 text-sm">Try adjusting your filters or zoom out</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedBarbers.map(barber => (
                  <div
                    key={barber.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedBarber === barber.id ? 'bg-accent-500/20 border border-accent-500' : 'bg-primary-800/50 hover:bg-primary-800'
                    }`}
                    onClick={() => { setSelectedBarber(barber.id); setShowList(false); }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-white">{barber.name}</h4>
                          {barber.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">✨</span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-accent-500 text-accent-500" />
                            <span className="text-white">{barber.rating}</span>
                            <span className="text-primary-400">({barber.reviews})</span>
                          </div>
                          <span className="text-primary-400">•</span>
                          <span className="text-primary-300">{barber.distance.toFixed(1)} mi</span>
                          <span className="text-primary-400">•</span>
                          <span className="text-accent-500">{barber.price}</span>
                        </div>
                      </div>
                      
                      <Link href={`/book/${barber.id}`} className="p-2 bg-accent-500 hover:bg-accent-600 text-black rounded-lg transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Calendar size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
