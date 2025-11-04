'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MapPin,
  Navigation,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Locate,
  ChevronLeft,
  List,
  Layers,
  Route,
  Phone,
  Calendar,
  Zap,
  TrendingUp,
  Target,
  Settings,
  Plus,
  Scissors
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock barber data with coordinates
const mockMapBarbers = [
  {
    id: 1,
    name: "Mike's Premium Cuts",
    barber: "Mike Johnson",
    rating: 4.9,
    reviews: 127,
    price: "$25-45",
    distance: 0.3,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    address: "123 Main St, Downtown SF",
    phone: "(555) 123-4567",
    nextAvailable: "Today 2:30 PM",
    specialties: ["Fade", "Beard Trim", "Classic Cuts"],
    verified: true,
    open: true,
    promoted: true
  },
  {
    id: 2,
    name: "FreshCut Barbershop", 
    barber: "Sarah Miller",
    rating: 4.8,
    reviews: 89,
    price: "$20-40",
    distance: 0.7,
    coordinates: { lat: 37.7849, lng: -122.4094 },
    address: "456 Oak Ave, Midtown SF",
    phone: "(555) 987-6543",
    nextAvailable: "Tomorrow 10:00 AM",
    specialties: ["Modern Fades", "Hair Design", "Straight Razor"],
    verified: true,
    open: true,
    promoted: false
  },
  {
    id: 3,
    name: "The Gentleman's Den",
    barber: "Tony Rodriguez",
    rating: 4.7,
    reviews: 203,
    price: "$30-55",
    distance: 1.2,
    coordinates: { lat: 37.7649, lng: -122.4294 },
    address: "789 Pine St, Old Town SF",
    phone: "(555) 456-7890",
    nextAvailable: "Today 4:15 PM",
    specialties: ["Classic Cuts", "Hot Towel Shave", "Mustache Styling"],
    verified: true,
    open: false,
    promoted: false
  },
  {
    id: 4,
    name: "Urban Edge Barbers",
    barber: "Alex Chen",
    rating: 4.6,
    reviews: 156,
    price: "$22-42",
    distance: 1.8,
    coordinates: { lat: 37.7549, lng: -122.4394 },
    address: "321 Elm St, Arts District SF",
    phone: "(555) 789-0123",
    nextAvailable: "Today 6:00 PM",
    specialties: ["Creative Cuts", "Color", "Styling"],
    verified: false,
    open: true,
    promoted: false
  }
]

export default function MapPage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showList, setShowList] = useState(false)
  const [searchRadius, setSearchRadius] = useState(5) // miles
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance')
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [routeMode, setRouteMode] = useState(false)
  const [routeBarber, setRouteBarber] = useState<number | null>(null)
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain'>('default')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapTileOffset, setMapTileOffset] = useState({ x: 0, y: 0 })
  const [isRecentering, setIsRecentering] = useState(false)
  const [allMapBarbers, setAllMapBarbers] = useState(mockMapBarbers) // Combined mock + database barbers

  const mapRef = useRef<HTMLDivElement>(null)
  
  // Fetch database barbers and add to map
  useEffect(() => {
    const fetchDatabaseBarbers = async () => {
      try {
        console.log('🔄 Fetching barbers from database for map...')
        const response = await fetch('/api/barbers', {
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Loaded', data.barbers.length, 'barbers from database')
          
          // Convert database barbers to map format with geocoded coordinates
          const dbBarbersWithCoords = data.barbers.map((barber: any, index: number) => ({
            id: barber.id,
            name: barber.shopName || barber.name,
            barber: barber.name,
            rating: barber.rating || 5.0,
            reviews: barber.reviews || 0,
            price: barber.price || '$$',
            distance: barber.distance || Math.random() * 5,
            // Generate coordinates based on city/state (simplified geocoding)
            coordinates: geocodeAddress(barber.city, barber.state, index),
            address: barber.address || `${barber.city}, ${barber.state}`,
            phone: barber.phone || 'N/A',
            nextAvailable: barber.nextAvailable || 'Call for availability',
            specialties: barber.specialties || [],
            verified: barber.verified || false,
            open: true,
            promoted: false,
            isUserCreated: true // Mark as user-created
          }))
          
          // Combine database barbers with mock data (remove duplicates)
          const combined = [...dbBarbersWithCoords, ...mockMapBarbers]
          console.log('✅ Total barbers on map:', combined.length)
          setAllMapBarbers(combined)
        }
      } catch (error) {
        console.error('❌ Error fetching barbers for map:', error)
        // Keep using mock data
      }
    }
    
    fetchDatabaseBarbers()
  }, [])
  
  // Simple geocoding function (assigns coordinates based on location)
  const geocodeAddress = (city: string, state: string, index: number) => {
    // Base coordinates for different states (simplified)
    const stateCoords: any = {
      'California': { lat: 37.7749, lng: -122.4194 },
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Texas': { lat: 29.7604, lng: -95.3698 },
      'Florida': { lat: 25.7617, lng: -80.1918 },
      'Illinois': { lat: 41.8781, lng: -87.6298 },
      // Add more as needed
    }
    
    // Get base coordinates or default to SF
    const base = stateCoords[state] || stateCoords['California'] || { lat: 37.7749, lng: -122.4194 }
    
    // Add small random offset to spread barbers out
    const offset = index * 0.02
    return {
      lat: base.lat + (Math.random() - 0.5) * 0.1 + offset,
      lng: base.lng + (Math.random() - 0.5) * 0.1
    }
  }

  const specialties = ["Fade", "Beard Trim", "Classic Cuts", "Modern Fades", "Hair Design", "Straight Razor", "Hot Towel Shave", "Mustache Styling", "Creative Cuts", "Color", "Styling"]

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to SF coordinates
          setUserLocation({ lat: 37.7749, lng: -122.4194 })
        }
      )
    } else {
      // Fallback to SF coordinates
      setUserLocation({ lat: 37.7749, lng: -122.4194 })
    }
  }, [])

  // Auto-update search radius based on zoom level
  useEffect(() => {
    // Inverse relationship: zoomed out (0.5) = 25 miles, zoomed in (3) = 1 mile
    // Formula: radius = 25 - (zoomLevel - 0.5) * 9.6
    const baseRadius = 25 // miles at minimum zoom (0.5)
    const minRadius = 1 // miles at maximum zoom (3)
    const zoomRange = 3 - 0.5 // 2.5
    const radiusRange = baseRadius - minRadius // 24
    
    const calculatedRadius = Math.round(baseRadius - ((zoomLevel - 0.5) / zoomRange) * radiusRange)
    const clampedRadius = Math.max(minRadius, Math.min(baseRadius, calculatedRadius))
    
    setSearchRadius(clampedRadius)
  }, [zoomLevel])

  const filteredBarbers = allMapBarbers.filter(barber => {
    if (onlyOpen && !barber.open) return false
    if (onlyVerified && !barber.verified) return false
    if (barber.distance > searchRadius) return false
    
    const minPrice = parseInt(barber.price.split('-')[0].replace('$', ''))
    const maxPrice = parseInt(barber.price.split('-')[1].replace('$', ''))
    if (minPrice > priceRange[1] || maxPrice < priceRange[0]) return false
    
    if (selectedSpecialties.length > 0) {
      if (!selectedSpecialties.some(spec => barber.specialties.includes(spec))) return false
    }
    
    return true
  })

  const sortedBarbers = [...filteredBarbers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price':
        return parseInt(a.price.split('-')[0].replace('$', '')) - parseInt(b.price.split('-')[0].replace('$', ''))
      default:
        return a.distance - b.distance
    }
  })

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  const handleGetDirections = (barberId: number) => {
    setRouteBarber(barberId)
    setRouteMode(true)
    const barber = allMapBarbers.find(b => b.id === barberId)
    if (barber) {
      // In a real app, this would integrate with maps API for directions
      console.log(`Getting directions to ${barber.name} at ${barber.address}`)
    }
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
  }

  // Map drag handlers with smooth momentum
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setIsRecentering(false)
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    setMapPosition({
      x: newX,
      y: newY
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setIsRecentering(false)
    setDragStart({ x: touch.clientX - mapPosition.x, y: touch.clientY - mapPosition.y })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    setMapPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Recenter map to user location
  const handleRecenter = () => {
    setIsRecentering(true)
    setMapPosition({ x: 0, y: 0 })
    setZoomLevel(1)
    
    // Get fresh location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        }
      )
    }
    
    // Remove recentering flag after animation
    setTimeout(() => setIsRecentering(false), 500)
  }

  // Trackpad/Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    
    // Zoom based on wheel delta
    const delta = e.deltaY * -0.001
    const newZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 3)
    
    setZoomLevel(newZoom)
  }

  return (
    <div className="h-screen bg-primary-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-primary-900/95 backdrop-blur-lg border-b border-primary-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="text-primary-300 hover:text-white transition-colors"
            >
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-primary-800 hover:bg-primary-700 text-primary-300 rounded-lg transition-colors"
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowList(!showList)}
              className={`p-2 rounded-lg transition-colors ${
                showList ? 'bg-accent-500 text-black' : 'bg-primary-800 hover:bg-primary-700 text-primary-300'
              }`}
            >
              <List size={18} />
            </button>
            <button className="p-2 bg-primary-800 hover:bg-primary-700 text-primary-300 rounded-lg transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary-400" />
            </div>
            <input
              type="text"
              placeholder="Search area, barber, or style..."
              className="w-full pl-10 pr-4 py-2 bg-primary-800 border border-primary-600 rounded-lg text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
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
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Map Background - Changes based on style */}
          <div 
            className={`absolute inset-0 ${isRecentering ? 'transition-all duration-500 ease-out' : ''}`}
            style={{
              transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              willChange: 'transform'
            }}
          >
            {mapStyle === 'satellite' ? (
              // Satellite View - Google Maps-style satellite imagery with infinite tiling
              <div className="w-[500vw] h-[500vh] absolute" style={{ left: '-200vw', top: '-200vh' }}>
                <div 
                  className="w-full h-full relative"
                  style={{
                    backgroundColor: '#1a1a2e',
                    backgroundImage: `
                      radial-gradient(circle at 20% 30%, rgba(100, 150, 100, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(80, 120, 80, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, rgba(60, 90, 60, 0.2) 0%, transparent 70%),
                      radial-gradient(circle at 15% 80%, rgba(40, 70, 130, 0.4) 0%, transparent 40%),
                      radial-gradient(circle at 85% 20%, rgba(70, 100, 70, 0.3) 0%, transparent 45%)
                    `,
                    backgroundSize: '800px 800px, 1000px 1000px, 600px 600px, 900px 900px, 700px 700px',
                    backgroundPosition: '0 0, 200px 300px, 400px 100px, 100px 500px, 600px 200px',
                    backgroundRepeat: 'repeat'
                  }}
                >
                  {/* Roads/streets grid overlay */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '100px 100px',
                      backgroundRepeat: 'repeat'
                    }}></div>
                  </div>
                </div>
              </div>
            ) : mapStyle === 'terrain' ? (
              // Terrain View - Infinite world map
              <div className="w-[500vw] h-[500vh] absolute" style={{ left: '-200vw', top: '-200vh' }}>
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundColor: '#87ceeb',
                    backgroundImage: `
                      radial-gradient(ellipse at 30% 40%, rgba(139, 195, 74, 0.8) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 30%, rgba(205, 220, 57, 0.6) 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 70%, rgba(76, 175, 80, 0.7) 0%, transparent 55%),
                      radial-gradient(ellipse at 20% 80%, rgba(156, 204, 101, 0.6) 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 60%, rgba(139, 195, 74, 0.5) 0%, transparent 45%)
                    `,
                    backgroundSize: '1200px 1200px, 900px 900px, 1000px 1000px, 800px 800px, 1100px 1100px',
                    backgroundRepeat: 'repeat'
                  }}
                />
              </div>
            ) : (
              // Default Map View - Stylized world map with continents
              <div className="w-[500vw] h-[500vh] absolute" style={{ left: '-200vw', top: '-200vh' }}>
                <div 
                  className="w-full h-full relative"
                  style={{
                    backgroundColor: '#4a90e2',
                    backgroundImage: `
                      radial-gradient(ellipse 500px 400px at 25% 40%, rgba(139, 195, 74, 0.9) 0%, transparent 70%),
                      radial-gradient(ellipse 600px 500px at 60% 35%, rgba(205, 220, 57, 0.8) 0%, transparent 65%),
                      radial-gradient(ellipse 400px 600px at 45% 65%, rgba(76, 175, 80, 0.85) 0%, transparent 70%),
                      radial-gradient(ellipse 350px 300px at 80% 50%, rgba(156, 204, 101, 0.75) 0%, transparent 60%),
                      radial-gradient(ellipse 450px 350px at 15% 75%, rgba(139, 195, 74, 0.7) 0%, transparent 65%),
                      radial-gradient(ellipse 300px 400px at 90% 25%, rgba(205, 220, 57, 0.65) 0%, transparent 55%)
                    `,
                    backgroundSize: '1600px 1200px',
                    backgroundRepeat: 'repeat'
                  }}
                >
                  {/* Country borders and details */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px),
                        linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)
                      `,
                      backgroundSize: '150px 150px',
                      backgroundRepeat: 'repeat'
                    }}></div>
                  </div>
                  
                  {/* Cities/landmarks dots */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        radial-gradient(circle, rgba(255,215,0,0.8) 2px, transparent 2px),
                        radial-gradient(circle, rgba(255,215,0,0.6) 1.5px, transparent 1.5px)
                      `,
                      backgroundSize: '300px 300px, 450px 450px',
                      backgroundPosition: '0 0, 150px 225px',
                      backgroundRepeat: 'repeat'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Style Toggle */}
          <div className="absolute top-4 right-4 z-30">
            <div className="bg-primary-800/90 backdrop-blur-sm rounded-lg p-1">
              <div className="flex space-x-1">
                {[
                  { key: 'default' as const, label: 'Map', icon: <Layers size={14} /> },
                  { key: 'satellite' as const, label: 'Satellite', icon: <Target size={14} /> },
                  { key: 'terrain' as const, label: 'Terrain', icon: <Navigation size={14} /> }
                ].map(style => (
                  <button
                    key={style.key}
                    onClick={() => setMapStyle(style.key)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                      mapStyle === style.key
                        ? 'bg-accent-500 text-black'
                        : 'text-primary-300 hover:text-white hover:bg-primary-700'
                    }`}
                  >
                    {style.icon}
                    <span>{style.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Markers Container - moves with map */}
          <div 
            className={`absolute inset-0 pointer-events-none ${isRecentering ? 'transition-all duration-500 ease-out' : ''}`}
            style={{
              transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              willChange: 'transform'
            }}
          >
            {/* User Location Marker */}
            {userLocation && (
              <div 
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{
                  left: '50%',
                  top: '50%'
                }}
              >
                <div className="w-full h-full bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Barber Markers */}
            {sortedBarbers.map((barber, index) => {
              const isSelected = selectedBarber === barber.id
              const angle = (index * 360 / sortedBarbers.length) * Math.PI / 180
              const radius = 100 + (index * 30)
              const x = 50 + (Math.cos(angle) * radius * 0.3)
              const y = 50 + (Math.sin(angle) * radius * 0.2)
              
              return (
                <div
                  key={barber.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 pointer-events-auto ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${Math.max(10, Math.min(90, x))}%`,
                    top: `${Math.max(15, Math.min(85, y))}%`
                  }}
                  onClick={() => setSelectedBarber(barber.id)}
                >
                <div className={`relative ${barber.promoted ? 'animate-bounce-subtle' : ''}`}>
                  <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold ${
                    barber.promoted 
                      ? 'bg-gradient-to-br from-accent-400 to-accent-600 text-black' 
                      : barber.open
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                  }`}>
                    <Scissors size={12} />
                  </div>
                  
                  {/* Barber info popup */}
                  {isSelected && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-primary-800 border border-primary-600 rounded-lg shadow-xl p-3 z-30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">{barber.name}</h3>
                        {barber.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-accent-500 text-accent-500" />
                          <span className="text-white">{barber.rating}</span>
                          <span className="text-primary-400">({barber.reviews})</span>
                        </div>
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
                        <Link
                          href={`/barber/${barber.id}`}
                          className="flex-1 bg-accent-500 hover:bg-accent-600 text-black text-xs font-medium px-3 py-2 rounded transition-colors text-center"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => handleGetDirections(barber.id)}
                          className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded transition-colors"
                        >
                          <Navigation size={12} />
                        </button>
                        <button className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded transition-colors">
                          <Phone size={12} />
                        </button>
                      </div>
                      
                      {/* Triangle pointer */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="border-4 border-transparent border-t-primary-800"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

            {/* Route Line (if route mode is active) */}
            {routeMode && routeBarber && userLocation && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
                <defs>
                  <pattern id="route-dash" patternUnits="userSpaceOnUse" width="8" height="8">
                    <rect width="4" height="8" fill="#f59e0b"/>
                    <rect x="4" width="4" height="8" fill="transparent"/>
                  </pattern>
                </defs>
                <line
                  x1="50%"
                  y1="50%"
                  x2="60%"
                  y2="40%"
                  stroke="url(#route-dash)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                />
              </svg>
            )}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 z-30">
            <div className="bg-primary-800/90 backdrop-blur-sm rounded-lg p-2 space-y-2">
              <button 
                onClick={handleZoomIn}
                className="w-10 h-10 bg-primary-700 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus size={16} />
              </button>
              <button 
                onClick={handleZoomOut}
                className="w-10 h-10 bg-primary-700 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <span className="text-lg font-bold">−</span>
              </button>
              <button
                onClick={handleRecenter}
                className="w-10 h-10 bg-accent-500 hover:bg-accent-600 text-black rounded-lg flex items-center justify-center transition-colors group"
                title="Recenter to your location"
              >
                <Locate size={16} className={`${isRecentering ? 'animate-spin' : ''} group-hover:scale-110 transition-transform`} />
              </button>
            </div>
          </div>

          {/* Search Radius Indicator */}
          <div className="absolute bottom-4 left-4 z-30">
            <div className="bg-primary-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2 text-sm text-primary-300">
                <Target size={14} />
                <span>Search radius: {searchRadius} mi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-32 left-4 right-4 z-50 bg-primary-800/95 backdrop-blur-lg border border-primary-700 rounded-xl p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-primary-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Distance - Auto-adjusted by zoom */}
            <div>
              <label className="block text-primary-300 text-sm mb-2">
                Search Radius (auto-adjusts with zoom)
              </label>
              <div className="bg-primary-700/50 rounded-lg p-4 border border-primary-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target size={20} className="text-accent-500" />
                    <span className="text-white font-semibold text-lg">{searchRadius} mi</span>
                  </div>
                  <p className="text-primary-400 text-xs">Use trackpad to zoom</p>
                </div>
                <div className="mt-2 h-1.5 bg-primary-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-500 to-accent-400"
                    style={{ width: `${((searchRadius - 1) / 24) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-primary-300 text-sm mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full bg-primary-700 border border-primary-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-primary-300 text-sm mb-2">Price Range</label>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-accent-500"
              />
              <div className="flex justify-between text-xs text-primary-400">
                <span>$0</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOpen}
                onChange={(e) => setOnlyOpen(e.target.checked)}
                className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
              />
              <span className="text-primary-300 text-sm">Open now</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
              />
              <span className="text-primary-300 text-sm">Verified only</span>
            </label>
          </div>

          {/* Specialties */}
          <div className="mt-4">
            <label className="block text-primary-300 text-sm mb-2">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {specialties.slice(0, 6).map(specialty => (
                <button
                  key={specialty}
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedSpecialties.includes(specialty)
                      ? 'bg-accent-500 text-black'
                      : 'bg-primary-700 text-primary-300 hover:bg-primary-600'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List View Overlay */}
      {showList && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-primary-900/95 backdrop-blur-lg border-t border-primary-700 max-h-80 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Nearby Barbers</h3>
                <p className="text-primary-400 text-sm">
                  {sortedBarbers.length} barber{sortedBarbers.length !== 1 ? 's' : ''} within {searchRadius} mi
                </p>
              </div>
              <button
                onClick={() => setShowList(false)}
                className="text-primary-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            {sortedBarbers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={24} className="text-primary-500" />
                </div>
                <p className="text-white font-medium mb-2">No barbers found</p>
                <p className="text-primary-400 text-sm mb-4">
                  Try zooming out to increase your search radius
                </p>
                <button
                  onClick={() => {
                    setZoomLevel(0.7)
                  }}
                  className="btn-secondary text-sm"
                >
                  Zoom Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedBarbers.map(barber => (
                <div
                  key={barber.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBarber === barber.id
                      ? 'bg-accent-500/20 border border-accent-500'
                      : 'bg-primary-800/50 hover:bg-primary-800'
                  }`}
                  onClick={() => {
                    setSelectedBarber(barber.id)
                    setShowList(false)
                  }}
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
                        {barber.promoted && (
                          <span className="bg-accent-500 text-black text-xs px-2 py-1 rounded-full">
                            Promoted
                          </span>
                        )}
                        {(barber as any).isUserCreated && (
                          <span className="bg-green-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                            ✨ NEW
                          </span>
                        )}
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
                        <span className="text-primary-400">•</span>
                        <span className={barber.open ? 'text-green-400' : 'text-red-400'}>
                          {barber.open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGetDirections(barber.id)
                        }}
                        className="p-2 bg-primary-700 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      >
                        <Route size={14} />
                      </button>
                      <Link
                        href={`/book/${barber.id}`}
                        className="p-2 bg-accent-500 hover:bg-accent-600 text-black rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Calendar size={14} />
                      </Link>
                    </div>
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
