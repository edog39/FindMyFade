'use client'

import { useState, useEffect } from 'react'
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Heart,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  DollarSign,
  Award,
  Users,
  CheckCircle,
  Check,
  X,
  CreditCard,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usBarbers } from '@/data/barbers'

// Function to get barber by ID from real data
function getBarberById(id: string) {
  const barber = usBarbers.find(b => b.id === parseInt(id))
  if (!barber) return null
  
  return {
    id: barber.id,
    name: barber.name,
    shopName: barber.shopName,
    bio: barber.bio,
    rating: barber.rating,
    totalReviews: barber.reviews,
    verified: barber.verified,
    yearsExperience: barber.yearsExperience,
    totalClients: barber.reviews * 10, // Estimate
    profileImage: barber.image,
    coverImage: barber.image,
    location: {
      address: barber.address,
      city: barber.city,
      distance: barber.distance || 0
    },
    contact: {
      phone: barber.phone,
      instagram: barber.instagram,
      website: barber.website
    },
    hours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "10:00 AM - 5:00 PM"
    },
    services: barber.specialties.map((specialty, idx) => ({
      id: idx + 1,
      name: specialty,
      description: `Professional ${specialty.toLowerCase()} service`,
      price: parseInt(barber.price.split('-')[0].replace('$', '')) + (idx * 5),
      duration: 30 + (idx * 15),
      popular: idx < 2
    })),
    portfolio: Array(6).fill(null).map((_, idx) => ({
      id: idx + 1,
      type: idx % 3 === 2 ? 'video' : 'image',
      url: barber.image,
      caption: `${barber.specialties[idx % barber.specialties.length]} example`,
      thumbnail: barber.image
    })),
    reviews: [
      {
        id: 1,
        customerName: "John D.",
        rating: 5,
        date: "2 days ago",
        comment: `Incredible attention to detail! ${barber.name} gave me exactly what I asked for. Definitely my go-to barber now.`,
        serviceUsed: barber.specialties[0],
        verified: true
      },
      {
        id: 2,
        customerName: "Alex M.",
        rating: 5,
        date: "1 week ago",
        comment: `Best cut I've ever gotten. ${barber.name} is a true professional and the shop has a great atmosphere.`,
        serviceUsed: barber.specialties[1] || barber.specialties[0],
        verified: true
      }
    ],
    availability: [
      { date: '2025-10-30', slots: ['2:30 PM', '4:00 PM', '5:30 PM'] },
      { date: '2025-10-31', slots: ['10:00 AM', '11:30 AM', '3:00 PM', '4:30 PM'] },
      { date: '2025-11-01', slots: ['9:00 AM', '2:00 PM', '6:00 PM'] }
    ]
  }
}

// Keep old mock data as fallback
const mockBarberData_FALLBACK = {
  id: 1,
  name: "Mike Johnson",
  shopName: "Mike's Premium Cuts",
  bio: "Professional barber with 12+ years of experience specializing in modern fades and classic cuts. Certified in straight razor techniques and passionate about creating the perfect look for every client.",
  rating: 4.9,
  totalReviews: 127,
  verified: true,
  yearsExperience: 12,
  totalClients: 2400,
  profileImage: "/api/placeholder/200/200",
  coverImage: "/api/placeholder/800/400",
  location: {
    address: "123 Main St, Downtown",
    city: "San Francisco",
    distance: 0.3
  },
  contact: {
    phone: "(555) 123-4567",
    instagram: "@mikespremiumcuts",
    website: "mikespremiumcuts.com"
  },
  hours: {
    monday: "9:00 AM - 7:00 PM",
    tuesday: "9:00 AM - 7:00 PM", 
    wednesday: "9:00 AM - 7:00 PM",
    thursday: "9:00 AM - 8:00 PM",
    friday: "9:00 AM - 8:00 PM",
    saturday: "8:00 AM - 6:00 PM",
    sunday: "10:00 AM - 5:00 PM"
  },
  services: [
    {
      id: 1,
      name: "Classic Fade",
      description: "Traditional fade with modern precision",
      price: 35,
      duration: 45,
      popular: true
    },
    {
      id: 2,
      name: "Beard Trim & Shape",
      description: "Professional beard styling and maintenance",
      price: 25,
      duration: 30,
      popular: true
    },
    {
      id: 3,
      name: "Hot Towel Shave",
      description: "Luxurious traditional straight razor shave",
      price: 45,
      duration: 60,
      popular: false
    },
    {
      id: 4,
      name: "Hair Wash & Style",
      description: "Complete hair wash and styling service",
      price: 20,
      duration: 20,
      popular: false
    }
  ],
  portfolio: [
    { id: 1, type: 'image', url: '/api/placeholder/300/300', caption: 'Clean fade with hard part' },
    { id: 2, type: 'image', url: '/api/placeholder/300/300', caption: 'Modern textured cut' },
    { id: 3, type: 'video', url: '/api/placeholder/300/300', caption: 'Fade transformation', thumbnail: '/api/placeholder/300/300' },
    { id: 4, type: 'image', url: '/api/placeholder/300/300', caption: 'Classic pompadour' },
    { id: 5, type: 'image', url: '/api/placeholder/300/300', caption: 'Beard shaping' },
    { id: 6, type: 'video', url: '/api/placeholder/300/300', caption: 'Complete makeover', thumbnail: '/api/placeholder/300/300' }
  ],
  reviews: [
    {
      id: 1,
      customerName: "John D.",
      rating: 5,
      date: "2 days ago",
      comment: "Incredible attention to detail! Mike gave me exactly what I asked for and even made suggestions that improved the look. Definitely my go-to barber now.",
      serviceUsed: "Classic Fade",
      verified: true
    },
    {
      id: 2,
      customerName: "Alex M.",
      rating: 5,
      date: "1 week ago", 
      comment: "Best fade I've ever gotten. Mike is a true professional and the shop has a great atmosphere. Worth every penny!",
      serviceUsed: "Beard Trim & Shape",
      verified: true
    },
    {
      id: 3,
      customerName: "Carlos R.",
      rating: 4,
      date: "2 weeks ago",
      comment: "Great cut as always. Mike knows what he's doing and I never leave disappointed. The hot towel shave is amazing too!",
      serviceUsed: "Hot Towel Shave",
      verified: true
    }
  ],
  availability: [
    { date: '2025-10-30', slots: ['2:30 PM', '4:00 PM', '5:30 PM'] },
    { date: '2025-10-31', slots: ['10:00 AM', '11:30 AM', '3:00 PM', '4:30 PM'] },
    { date: '2025-11-01', slots: ['9:00 AM', '2:00 PM', '6:00 PM'] }
  ]
}

export default function BarberProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('portfolio')
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [sendingSMS, setSendingSMS] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [userPhone, setUserPhone] = useState('')
  const [availableRewards, setAvailableRewards] = useState<any[]>([])
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'prepay' | 'pay_later'>('prepay')
  const [barber, setBarber] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch barber from database
  useEffect(() => {
    const fetchBarber = async () => {
      try {
        setLoading(true)
        console.log('🔄 Fetching barber with ID:', params.id)
        
        const response = await fetch(`/api/barbers/${params.id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        console.log('📥 Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          setBarber(data.barber)
          console.log('✅ Loaded barber from database:', {
            id: data.barber.id,
            name: data.barber.name,
            shop: data.barber.shopName,
            services: data.barber.services?.length || 0,
            reviews: data.barber.reviews?.length || 0,
            hasProfileImage: !!data.barber.profileImage,
            hasCoverImage: !!data.barber.coverImage
          })
        } else {
          // Fallback to mock data
          console.log('⚠️ Barber not in database (status:', response.status, '), using mock data')
          const mockData = getBarberById(params.id as string)
          setBarber(mockData || mockBarberData_FALLBACK)
        }
      } catch (error) {
        console.error('❌ Error fetching barber:', error)
        // Fallback to mock data
        const mockData = getBarberById(params.id as string)
        setBarber(mockData || mockBarberData_FALLBACK)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBarber()
    }
  }, [params.id])

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('userProfile')
      if (profile) {
        const userData = JSON.parse(profile)
        setUserPhone(userData.phone || '')
      }
      
      // Load wallet balance
      const walletData = localStorage.getItem('walletData')
      if (walletData) {
        const wallet = JSON.parse(walletData)
        setWalletBalance(wallet.balance || 0)
      }
      
      // Load available (unused) rewards
      const rewards = JSON.parse(localStorage.getItem('redeemedRewards') || '[]')
      const unusedRewards = rewards.filter((r: any) => !r.used && new Date(r.expiresAt) > new Date())
      setAvailableRewards(unusedRewards)
    }
  }, [])

  const handleBooking = () => {
    if (selectedService && selectedDate && selectedTime) {
      setShowConfirmation(true)
    }
  }

  const confirmBooking = async () => {
    setSendingSMS(true)
    
    const selectedServiceObj = barber.services.find((s: any) => s.id === selectedService)
    let servicePrice = selectedServiceObj?.price || 0
    
    // Apply reward discount if selected
    let discount = 0
    if (selectedReward) {
      discount = selectedReward.discount
      servicePrice = Math.max(0, servicePrice - discount)
    }
    
    // Simulate API call delay for booking and payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create booking object
    const booking = {
      id: Date.now(),
      barberId: barber.id,
      barberName: barber.name,
      shopName: barber.shopName,
      service: selectedServiceObj?.name || '',
      date: selectedDate,
      time: selectedTime,
      price: servicePrice,
      status: 'confirmed_prepaid' as const,
      paymentMethod: 'prepay' as const,
      bookedAt: new Date().toISOString()
    }
    
    // Save booking to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
    existingBookings.push(booking)
    localStorage.setItem('userBookings', JSON.stringify(existingBookings))
    
    // Mark reward as used if selected
    if (selectedReward) {
      const rewards = JSON.parse(localStorage.getItem('redeemedRewards') || '[]')
      const updatedRewards = rewards.map((r: any) => 
        r.id === selectedReward.id ? { ...r, used: true, usedAt: new Date().toISOString() } : r
      )
      localStorage.setItem('redeemedRewards', JSON.stringify(updatedRewards))
    }
    
    // Handle points and wallet updates based on payment method
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{"balance": 0, "points": 0}')
    
    if (paymentMethod === 'prepay') {
      // Deduct payment from wallet balance
      walletData.balance = (walletData.balance || 0) - servicePrice
      
      // Calculate and add points immediately: 1.5x for prepay
      const pointsEarned = Math.ceil(servicePrice * 1.5)
      walletData.points = (walletData.points || 0) + pointsEarned
      
      // Create transaction record
      const transaction = {
        id: Date.now(),
        type: 'booking_payment',
        amount: -servicePrice,
        description: `${selectedServiceObj?.name} - ${barber.shopName}${selectedReward ? ` (${selectedReward.title} applied)` : ''}`,
        date: new Date().toISOString().split('T')[0],
        pointsEarned: pointsEarned,
        status: 'completed',
        barberName: barber.name
      }
      
      // Save transaction
      const existingTransactions = JSON.parse(localStorage.getItem('walletTransactions') || '[]')
      existingTransactions.unshift(transaction)
      localStorage.setItem('walletTransactions', JSON.stringify(existingTransactions))
      
      // Update local state
      setWalletBalance(walletData.balance)
    }
    // For pay day-of: points will be added when they pay at the shop (not now)
    
    // Save updated wallet data
    localStorage.setItem('walletData', JSON.stringify(walletData))
    
    // Reload available rewards after booking (to remove used ones)
    const updatedRewards = JSON.parse(localStorage.getItem('redeemedRewards') || '[]')
    const unusedRewards = updatedRewards.filter((r: any) => !r.used && new Date(r.expiresAt) > new Date())
    setAvailableRewards(unusedRewards)
    
    setSendingSMS(false)
    setShowConfirmation(false)
    setShowSuccessNotification(true)
    
    // Auto-hide notification after 6 seconds
    setTimeout(() => {
      setShowSuccessNotification(false)
      // Reset form
      setSelectedService(null)
      setSelectedDate('')
      setSelectedTime('')
      setSelectedReward(null)
    }, 6000)
  }

  // Show loading state
  if (loading || !barber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-primary-300 text-lg">Loading barber profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary-700 to-primary-600 flex items-center justify-center overflow-hidden">
        {barber.coverImage && barber.coverImage !== 'https://via.placeholder.com/800x400?text=Cover' ? (
          <img src={barber.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
        <span className="text-primary-300 text-lg">Cover Photo</span>
        )}
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors">
            <Heart size={20} className="text-white" />
          </button>
          <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors">
            <Share2 size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary-800 bg-gradient-to-br from-primary-600 to-primary-500">
                {barber.profileImage && barber.profileImage !== 'https://via.placeholder.com/200x200?text=Barber' ? (
                  <img src={barber.profileImage} alt={barber.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                <span className="text-primary-200 text-lg">Photo</span>
                  </div>
                )}
              </div>
              {barber.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle size={16} />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">
                    {barber.name}
                  </h1>
                  <h2 className="text-xl text-accent-500 mb-2">{barber.shopName}</h2>
                  <div className="flex items-center space-x-4 text-primary-300">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-accent-500 text-accent-500" />
                      <span className="text-white font-medium">{barber.rating}</span>
                      <span>({barber.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{barber.location.distance} mi away</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Link
                    href={`/booking/${barber.id}`}
                    className="btn-primary px-6 py-3"
                  >
                    Book Now
                  </Link>
                  <a href={`tel:${barber.contact.phone}`} className="btn-secondary px-4 py-3">
                    <Phone size={18} />
                  </a>
                  <Link href={`/messages/${barber.id}`} className="btn-secondary px-4 py-3">
                    <MessageCircle size={18} />
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-bold text-lg text-accent-500">{barber.yearsExperience}+</div>
                  <div className="text-sm text-primary-300">Years Exp.</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-accent-500">{barber.totalClients}+</div>
                  <div className="text-sm text-primary-300">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-accent-500">{barber.totalReviews}</div>
                  <div className="text-sm text-primary-300">Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-primary-800/50 p-1 rounded-xl">
              {['portfolio', 'services', 'reviews', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-accent-500 text-black' 
                      : 'text-primary-300 hover:text-white hover:bg-primary-700/50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <h3 className="font-display font-semibold text-xl text-white">Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {barber.portfolio.map((item: any) => (
                    <div key={item.id} className="relative group">
                      <div className="aspect-square bg-gradient-to-br from-primary-700 to-primary-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.type === 'video' && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <span className="text-primary-300 text-sm">{item.type === 'video' ? 'Video' : 'Image'}</span>
                      </div>
                      <p className="text-primary-300 text-sm mt-2">{item.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <h3 className="font-display font-semibold text-xl text-white">Services</h3>
                <div className="space-y-4">
                  {barber.services.map((service: any) => (
                    <div key={service.id} className="card hover:bg-primary-750 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-white">{service.name}</h4>
                            {service.popular && (
                              <span className="bg-accent-500 text-black text-xs px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-primary-300 text-sm mb-3">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-primary-300">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${service.price}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{service.duration} min</span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/booking/${barber.id}`}
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Book
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-xl text-white">Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-accent-500 text-accent-500" />
                    <span className="font-semibold text-white">{barber.rating}</span>
                    <span className="text-primary-300">({barber.totalReviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {barber.reviews.map((review: any) => (
                    <div key={review.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-primary-200 text-sm">{review.customerName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{review.customerName}</span>
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating 
                                        ? 'fill-accent-500 text-accent-500' 
                                        : 'text-primary-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-primary-400 text-sm">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-primary-300 mb-2">{review.comment}</p>
                      <span className="text-accent-500 text-sm">Service: {review.serviceUsed}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <h3 className="font-display font-semibold text-xl text-white">About</h3>
                <div className="card">
                  <p className="text-primary-300 leading-relaxed mb-6">{barber.bio}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Location</h4>
                      <p className="text-primary-300">{barber.location.address}</p>
                      <p className="text-primary-300">{barber.location.city}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Hours</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {Object.entries(barber.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="text-primary-300 capitalize">{day}:</span>
                            <span className="text-white">{hours as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Contact</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-primary-300">Phone: {barber.contact.phone}</p>
                        <p className="text-primary-300">Instagram: {barber.contact.instagram}</p>
                        <p className="text-primary-300">Website: {barber.contact.website}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Booking */}
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Quick Book</h3>
              <div className="space-y-3">
                <select 
                  value={selectedService || ''}
                  onChange={(e) => setSelectedService(Number(e.target.value))}
                  className="input w-full"
                >
                  <option value="">Select Service</option>
                  {barber.services.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
                
                <select 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select Date</option>
                  {barber.availability.map((day: any) => (
                    <option key={day.date} value={day.date}>
                      {new Date(day.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                
                {selectedDate && (
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Select Time</option>
                    {barber.availability
                      .find((day: any) => day.date === selectedDate)
                      ?.slots.map((time: any) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                )}
                
                <button 
                  onClick={handleBooking}
                  disabled={!selectedService || !selectedDate || !selectedTime}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Appointment
                </button>
                
                <div className="pt-3 border-t border-primary-700">
                  <Link 
                    href={`/booking/${barber.id}`}
                    className="text-accent-500 hover:text-accent-400 text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Calendar size={16} />
                    <span>See Full Calendar</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <Phone size={18} />
                  <span>Call Now</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <MessageCircle size={18} />
                  <span>Message</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <ExternalLink size={18} />
                  <span>Instagram</span>
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Location</h3>
              <div className="bg-primary-700 h-32 rounded-lg flex items-center justify-center mb-3">
                <span className="text-primary-300">Map View</span>
              </div>
              <p className="text-primary-300 text-sm">{barber.location.address}</p>
              <p className="text-primary-300 text-sm">{barber.location.city}</p>
              <button className="w-full mt-3 btn-secondary text-sm">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-primary-900 rounded-2xl max-w-md w-full p-6 my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 -mx-6 px-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-white" />
                </div>
                <h2 className="font-bold text-2xl text-white mb-2">Confirm Your Booking</h2>
                <p className="text-primary-300">Please review your appointment details</p>
              </div>

              <div className="space-y-4 mb-6">
              <div className="bg-primary-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-xl">💈</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{barber.shopName}</p>
                    <p className="text-sm text-primary-400">{barber.name}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-400">Service:</span>
                    <span className="text-white font-medium">
                      {barber.services.find((s: any) => s.id === selectedService)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-400">Date:</span>
                    <span className="text-white font-medium">
                      {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-400">Time:</span>
                    <span className="text-white font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary-700">
                    <span className="text-primary-400">Total:</span>
                    <span className="text-accent-500 font-bold text-lg">
                      ${barber.services.find((s: any) => s.id === selectedService)?.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 mb-4">
                <h4 className="text-white font-semibold text-sm">💳 Payment Method</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('prepay')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'prepay'
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-primary-700 bg-primary-800/30 hover:border-primary-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Prepay Now</span>
                      {paymentMethod === 'prepay' && <CheckCircle size={16} className="text-accent-400" />}
                    </div>
                    <p className="text-primary-300 text-xs mb-2">Pay from wallet now</p>
                    <div className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1">
                      <p className="text-green-400 font-bold text-xs">⭐ 1.5x Points!</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('pay_later')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'pay_later'
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-primary-700 bg-primary-800/30 hover:border-primary-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Pay Day-of</span>
                      {paymentMethod === 'pay_later' && <CheckCircle size={16} className="text-accent-400" />}
                    </div>
                    <p className="text-primary-300 text-xs mb-2">Pay at the shop</p>
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded px-2 py-1">
                      <p className="text-blue-400 font-bold text-xs">⭐ 1x Points</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Available Rewards */}
              {availableRewards.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h4 className="text-white font-semibold text-sm">💎 Available Rewards</h4>
                  <div className="space-y-2">
                    {availableRewards.map(reward => (
                      <button
                        key={reward.id}
                        onClick={() => setSelectedReward(selectedReward?.id === reward.id ? null : reward)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedReward?.id === reward.id
                            ? 'border-accent-500 bg-accent-500/20'
                            : 'border-primary-700 bg-primary-800/30 hover:border-primary-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">{reward.title}</p>
                            <p className="text-primary-400 text-xs">{reward.description}</p>
                            <p className="text-primary-500 text-xs mt-1">
                              Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-accent-400 font-bold">${reward.discount}</div>
                            {selectedReward?.id === reward.id && (
                              <CheckCircle size={20} className="text-accent-400" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-sm">
                    {paymentMethod === 'prepay' ? 'Payment from Wallet' : 'Pay Day-of'}
                  </p>
                  <div className="flex items-center space-x-1 text-accent-400">
                    <CreditCard size={16} />
                    <span className="text-xs">Instant Confirmation</span>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="bg-primary-800/50 border-2 border-accent-500/50 rounded-xl p-4">
                  <div className="space-y-2">
                    {paymentMethod === 'prepay' ? (
                      <div className="bg-primary-900/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary-300">Current Balance:</span>
                          <span className="text-white font-bold">${walletBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary-300">Service Price:</span>
                          <span className="text-white font-semibold">${barber.services.find((s: any) => s.id === selectedService)?.price}</span>
                        </div>
                        {selectedReward && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-400">Reward Discount:</span>
                            <span className="text-green-400 font-semibold">-${selectedReward.discount}</span>
                          </div>
                        )}
                        <div className="h-px bg-primary-700"></div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-red-400">Payment Amount:</span>
                          <span className="text-red-400 font-bold">
                            -${Math.max(0, (barber.services.find((s: any) => s.id === selectedService)?.price || 0) - (selectedReward?.discount || 0)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-accent-400 font-semibold">New Balance:</span>
                          <span className="text-accent-400 font-bold text-lg">
                            ${(walletBalance - Math.max(0, (barber.services.find((s: any) => s.id === selectedService)?.price || 0) - (selectedReward?.discount || 0))).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-primary-900/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary-300">Service Price:</span>
                          <span className="text-white font-semibold">${barber.services.find((s: any) => s.id === selectedService)?.price}</span>
                        </div>
                        {selectedReward && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-400">Reward Discount:</span>
                            <span className="text-green-400 font-semibold">-${selectedReward.discount}</span>
                          </div>
                        )}
                        <div className="h-px bg-primary-700"></div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-400 font-semibold">Pay at Shop:</span>
                          <span className="text-blue-400 font-bold text-lg">
                            ${Math.max(0, (barber.services.find((s: any) => s.id === selectedService)?.price || 0) - (selectedReward?.discount || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star size={16} className="text-green-400 fill-green-400" />
                          <span className="text-green-400 font-semibold text-sm">Points You'll Earn:</span>
                        </div>
                        <span className="text-green-400 font-bold text-lg">
                          +{Math.ceil(Math.max(0, (barber.services.find((s: any) => s.id === selectedService)?.price || 0) - (selectedReward?.discount || 0)) * (paymentMethod === 'prepay' ? 1.5 : 1.0))} pts
                        </span>
                      </div>
                      <p className="text-green-300/70 text-[10px] mt-1">
                        {paymentMethod === 'prepay' ? '🎉 1.5x bonus for prepaying!' : '⭐ 1x points (earned when you pay at shop)'}
                      </p>
                    </div>
                    
                    {paymentMethod === 'prepay' && walletBalance < Math.max(0, (barber.services.find((s: any) => s.id === selectedService)?.price || 0) - (selectedReward?.discount || 0)) && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-400 text-xs">
                          ⚠️ Insufficient balance. <Link href="/wallet" className="underline">Top up wallet</Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SMS Notification Info */}
              {userPhone && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Smartphone size={16} className="text-blue-400" />
                    <p className="text-blue-400 text-sm">
                      SMS confirmation will be sent to {userPhone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                    </p>
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Fixed Buttons at Bottom */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-primary-700 flex-shrink-0">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 btn-secondary py-3"
                disabled={sendingSMS}
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={sendingSMS || (paymentMethod === 'prepay' && walletBalance < Math.max(0, (barber.services.find((s: any) => s.id === selectedService)?.price || 0) - (selectedReward?.discount || 0)))}
                className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingSMS ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{paymentMethod === 'prepay' ? 'Processing Payment...' : 'Confirming...'}</span>
                  </>
                ) : (
                  <>
                    {paymentMethod === 'prepay' ? (
                      <>
                        <CreditCard size={20} />
                        <span>Pay ${Math.max(0, (barber.services.find((s: any) => s.id === selectedService)?.price || 0) - (selectedReward?.discount || 0)).toFixed(2)} & Confirm</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-500 text-white rounded-lg shadow-2xl p-4 max-w-md">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Booking Confirmed! 🎉</h3>
                <p className="text-sm text-green-50 mb-2">
                  Your appointment with {barber.shopName} is confirmed for {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })} at {selectedTime}.
                </p>
                
                {paymentMethod === 'prepay' ? (
                  <div className="bg-accent-500/20 border border-accent-400/30 rounded-lg px-3 py-2 mb-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">💰 Paid from Wallet</span>
                      <span>${barber.services.find((s: any) => s.id === selectedService)?.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="font-semibold">⭐ Points Earned</span>
                      <span className="text-accent-300 font-bold">
                        +{Math.ceil((barber.services.find((s: any) => s.id === selectedService)?.price || 0) * 1.5)} pts
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-2 mb-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">💳 Pay Day-of</span>
                      <span>${barber.services.find((s: any) => s.id === selectedService)?.price}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-semibold">⭐ You'll earn {Math.ceil(barber.services.find((s: any) => s.id === selectedService)?.price || 0)} pts when you pay at the shop!</span>
                    </div>
                  </div>
                )}
                
                {userPhone && (
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 mt-2">
                    <Smartphone size={16} />
                    <p className="text-xs">
                      📱 SMS sent to {userPhone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
