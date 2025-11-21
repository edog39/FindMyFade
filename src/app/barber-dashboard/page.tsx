'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar,
  Clock,
  Upload,
  Settings,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  Video,
  Plus,
  Edit,
  X,
  Check,
  CheckCircle,
  ChevronLeft,
  MessageCircle,
  Bell,
  BarChart3,
  Scissors,
  LogOut,
  Camera,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Globe,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function BarberDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'showcase' | 'availability' | 'profile'>('overview')
  const [barberProfile, setBarberProfile] = useState<any>(null)
  const [uploadedContent, setUploadedContent] = useState<any[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image')
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadCaption, setUploadCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [availability, setAvailability] = useState<any[]>([])
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    shopName: '',
    bio: '',
    specialties: [] as string[],
    address: '',
    phone: '',
    instagram: '',
    website: '',
    pricing: '',
    profileImage: '',
    coverImage: ''
  })
  const [myBarberId, setMyBarberId] = useState<string | null>(null)
  const [myUserId, setMyUserId] = useState<string | null>(null)
  const [barberAppointments, setBarberAppointments] = useState<any[]>([])
  const profileImageRef = useRef<HTMLInputElement>(null)
  const coverImageRef = useRef<HTMLInputElement>(null)
  const [onboardingCompletion, setOnboardingCompletion] = useState<number | null>(null)
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userProfile = localStorage.getItem('userProfile')
      if (userProfile) {
        const profile = JSON.parse(userProfile)
        if (profile.userType !== 'barber') {
          // Redirect non-barbers to home
          router.push('/')
          return
        }
        setBarberProfile(profile)
        setMyUserId(profile.id) // Store user ID for fetching appointments
        setProfileData({
          shopName: profile.shopName || '',
          bio: profile.bio || '',
          specialties: profile.specialties || [],
          address: profile.address || '',
          phone: profile.phone || '',
          instagram: profile.instagram || '',
          website: profile.website || '',
          pricing: profile.pricing || '$$',
          profileImage: profile.profileImage || '',
          coverImage: profile.coverImage || ''
        })
      } else {
        router.push('/login')
      }

      // Load saved showcase content
      const savedContent = localStorage.getItem('barberShowcaseContent')
      if (savedContent) {
        setUploadedContent(JSON.parse(savedContent))
      }

      // Load saved availability
      const savedAvailability = localStorage.getItem('barberAvailability')
      if (savedAvailability) {
        setAvailability(JSON.parse(savedAvailability))
      } else {
        // Initialize default availability (9 AM - 8 PM, Mon-Sat)
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const defaultAvailability = days.map(day => ({
          day,
          enabled: day !== 'Sunday',
          startTime: '09:00',
          endTime: '20:00'
        }))
        setAvailability(defaultAvailability)
      }

      // Get barber profile ID from user profile (set during signup)
      if (userProfile) {
        const profile = JSON.parse(userProfile)
        if (profile.barberProfileId) {
          setMyBarberId(profile.barberProfileId)
        }
      }
    }
  }, [router])

  // Fetch barber's appointments from database
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!myUserId) return

      try {
        console.log('🔄 Fetching barber appointments for user:', myUserId)
        const response = await fetch(`/api/appointments?userId=${myUserId}&userType=barber`, {
          cache: 'no-store'
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Loaded', data.appointments.length, 'appointments from database')
          setBarberAppointments(data.appointments)
        } else {
          console.log('⚠️ Failed to load appointments from database')
        }
      } catch (error) {
        console.error('❌ Error fetching appointments:', error)
      }
    }

    fetchAppointments()
  }, [myUserId])

  // Check onboarding completion status
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!myUserId) return

      try {
        const response = await fetch(`/api/barbers/onboarding?userId=${myUserId}`)
        if (response.ok) {
          const data = await response.json()
          setOnboardingCompletion(data.completion || 0)
          setOnboardingComplete(data.isComplete || false)
        }
      } catch (error) {
        console.error('❌ Error checking onboarding status:', error)
      }
    }

    checkOnboarding()
  }, [myUserId])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    if (!uploadPreview) return

    const newContent = {
      id: Date.now(),
      type: uploadType,
      url: uploadPreview,
      caption: uploadCaption,
      likes: 0,
      views: 0,
      uploadedAt: new Date().toISOString()
    }

    const updated = [...uploadedContent, newContent]
    setUploadedContent(updated)
    localStorage.setItem('barberShowcaseContent', JSON.stringify(updated))

    // Reset upload state
    setUploadPreview(null)
    setUploadCaption('')
    setShowUploadModal(false)
    alert('✅ Content uploaded to your showcase!')
  }

  const deleteContent = (id: number) => {
    if (confirm('Delete this content from your showcase?')) {
      const updated = uploadedContent.filter(c => c.id !== id)
      setUploadedContent(updated)
      localStorage.setItem('barberShowcaseContent', JSON.stringify(updated))
    }
  }

  const saveAvailability = () => {
    localStorage.setItem('barberAvailability', JSON.stringify(availability))
    alert('✅ Availability updated!')
  }

  const updateAvailability = (index: number, field: string, value: any) => {
    const updated = [...availability]
    updated[index] = { ...updated[index], [field]: value }
    setAvailability(updated)
  }

  const saveProfile = () => {
    const updatedProfile = {
      ...barberProfile,
      ...profileData
    }
    setBarberProfile(updatedProfile)
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
    
    // Also update in userCreatedBarbers if it exists
    const userCreatedBarbers = JSON.parse(localStorage.getItem('userCreatedBarbers') || '[]')
    const barberIndex = userCreatedBarbers.findIndex((b: any) => b.id === myBarberId)
    if (barberIndex !== -1) {
      userCreatedBarbers[barberIndex] = {
        ...userCreatedBarbers[barberIndex],
        shopName: profileData.shopName,
        bio: profileData.bio,
        specialties: profileData.specialties,
        address: profileData.address,
        phone: profileData.phone,
        instagram: profileData.instagram,
        image: profileData.profileImage || userCreatedBarbers[barberIndex].image
      }
      localStorage.setItem('userCreatedBarbers', JSON.stringify(userCreatedBarbers))
    }
    
    setEditingProfile(false)
    alert('✅ Profile updated successfully!')
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isLoggedIn')
      router.push('/')
    }
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileData({...profileData, profileImage: event.target?.result as string})
    }
    reader.readAsDataURL(file)
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileData({...profileData, coverImage: event.target?.result as string})
    }
    reader.readAsDataURL(file)
  }

  if (!barberProfile) {
    return <div className="min-h-screen bg-primary-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-primary-300 hover:text-white transition-colors">
                <ChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="font-display font-bold text-2xl text-white">Barber Dashboard</h1>
                <p className="text-primary-300 text-sm">{barberProfile.shopName || 'Your Barber Business'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {myBarberId && (
                <Link
                  href={`/barber/${myBarberId}`}
                  target="_blank"
                  className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
                >
                  <Users size={16} />
                  <span>Preview My Profile</span>
                </Link>
              )}
              <button className="relative text-primary-300 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Prompt Banner */}
      {onboardingCompletion !== null && onboardingCompletion < 0.7 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-accent-500/10 border-2 border-accent-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-accent-500" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-2">
                    Complete Your Onboarding to Get Listed!
                  </h3>
                  <p className="text-primary-300 text-sm mb-4">
                    You're <span className="font-semibold text-accent-400">{(onboardingCompletion * 100).toFixed(0)}%</span> complete. 
                    Complete 70% to unlock featured placement, verified badge, and higher visibility.
                  </p>
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/barber/onboarding"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Sparkles size={16} />
                      <span>Complete Onboarding</span>
                    </Link>
                    <button
                      onClick={() => setOnboardingCompletion(null)}
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
              {/* Progress Circle */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-primary-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${onboardingCompletion * 175.93} 175.93`}
                    className="text-accent-500 transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {(onboardingCompletion * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-accent-500" size={24} />
              <TrendingUp className="text-green-400" size={16} />
            </div>
            <p className="text-primary-400 text-sm">Total Clients</p>
            <p className="text-white text-2xl font-bold">248</p>
            <p className="text-green-400 text-xs mt-1">+12% this month</p>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="text-blue-400" size={24} />
            </div>
            <p className="text-primary-400 text-sm">Appointments</p>
            <p className="text-white text-2xl font-bold">32</p>
            <p className="text-primary-500 text-xs mt-1">This week</p>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-accent-500" size={24} />
              <TrendingUp className="text-green-400" size={16} />
            </div>
            <p className="text-primary-400 text-sm">Revenue</p>
            <p className="text-white text-2xl font-bold">$2,450</p>
            <p className="text-green-400 text-xs mt-1">+8% vs last week</p>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Star className="text-accent-500 fill-accent-500" size={24} />
            </div>
            <p className="text-primary-400 text-sm">Rating</p>
            <p className="text-white text-2xl font-bold">4.9</p>
            <p className="text-primary-500 text-xs mt-1">156 reviews</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b border-primary-700 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'showcase', label: 'My Showcase', icon: ImageIcon },
            { id: 'availability', label: 'Availability', icon: Calendar },
            { id: 'profile', label: 'Profile', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent-500 text-white'
                    : 'border-transparent text-primary-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-white text-xl mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('showcase')}
                  className="flex items-center space-x-3 bg-primary-800 hover:bg-primary-700 border border-primary-600 hover:border-accent-500 px-6 py-4 rounded-xl transition-all group"
                >
                  <Upload className="text-accent-500 group-hover:scale-110 transition-transform" size={24} />
                  <div className="text-left">
                    <p className="text-white font-semibold">Upload Content</p>
                    <p className="text-primary-400 text-xs">Add to showcase</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('availability')}
                  className="flex items-center space-x-3 bg-primary-800 hover:bg-primary-700 border border-primary-600 hover:border-accent-500 px-6 py-4 rounded-xl transition-all group"
                >
                  <Calendar className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                  <div className="text-left">
                    <p className="text-white font-semibold">Set Hours</p>
                    <p className="text-primary-400 text-xs">Manage availability</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center space-x-3 bg-primary-800 hover:bg-primary-700 border border-primary-600 hover:border-accent-500 px-6 py-4 rounded-xl transition-all group"
                >
                  <Settings className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
                  <div className="text-left">
                    <p className="text-white font-semibold">Edit Profile</p>
                    <p className="text-primary-400 text-xs">Update info</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold text-white text-lg mb-4">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {barberAppointments.length > 0 ? (
                    barberAppointments
                      .filter((apt: any) => apt.status !== 'CANCELLED')
                      .slice(0, 5)
                      .map((apt: any) => (
                        <div key={apt.id} className="bg-primary-800/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-white font-medium">{apt.clientName || apt.barberName}</p>
                              <p className="text-primary-400 text-sm">
                                {new Date(apt.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} at {apt.time}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-accent-500 font-semibold">${apt.price}</p>
                              <p className="text-primary-500 text-xs">{apt.service}</p>
                            </div>
                          </div>
                          {apt.prepaid && (
                            <div className="text-xs text-green-400 flex items-center space-x-1">
                              <CheckCircle size={12} />
                              <span>Prepaid</span>
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                      <p className="text-primary-400 text-sm">No upcoming appointments</p>
                      <p className="text-primary-500 text-xs mt-1">Bookings will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-white text-lg mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-primary-300 text-sm">New booking from John D.</p>
                    <span className="text-primary-500 text-xs ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-primary-300 text-sm">5-star review received</p>
                    <span className="text-primary-500 text-xs ml-auto">5h ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <p className="text-primary-300 text-sm">Payment received: $45</p>
                    <span className="text-primary-500 text-xs ml-auto">1d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'showcase' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-2xl">My Showcase</h3>
                <p className="text-primary-400">Upload your best work to attract clients</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Upload Content</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedContent.map(content => (
                <div key={content.id} className="relative group card p-0 overflow-hidden">
                  {content.type === 'image' ? (
                    <img src={content.url} alt={content.caption} className="w-full h-64 object-cover" />
                  ) : (
                    <video src={content.url} className="w-full h-64 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm mb-2">{content.caption}</p>
                      <div className="flex items-center justify-between text-xs text-primary-300">
                        <span>❤️ {content.likes}</span>
                        <span>👁️ {content.views}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteContent(content.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {uploadedContent.length === 0 && (
                <div className="col-span-full card text-center py-12">
                  <ImageIcon className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                  <h4 className="text-white font-semibold text-lg mb-2">No content yet</h4>
                  <p className="text-primary-400 mb-4">Upload photos and videos to showcase your work!</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Upload size={18} />
                    <span>Upload Your First Post</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white text-2xl mb-2">Set Your Availability</h3>
              <p className="text-primary-400">Manage your working hours for client bookings</p>
            </div>

            <div className="card">
              <div className="space-y-4">
                {availability.map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-4 pb-4 border-b border-primary-700 last:border-0">
                    <div className="w-32">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.enabled}
                          onChange={(e) => updateAvailability(index, 'enabled', e.target.checked)}
                          className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                        />
                        <span className="text-white font-medium">{day.day}</span>
                      </label>
                    </div>

                    {day.enabled && (
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-primary-400" />
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                            className="input py-2 px-3"
                          />
                        </div>
                        <span className="text-primary-400">to</span>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                          className="input py-2 px-3"
                        />
                      </div>
                    )}

                    {!day.enabled && (
                      <span className="text-primary-500 text-sm italic">Closed</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={saveAvailability}
                className="btn-primary w-full mt-6"
              >
                <Check size={18} className="mr-2" />
                Save Availability
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-2xl mb-2">Your Profile</h3>
                <p className="text-primary-400">Update your business information</p>
              </div>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <div className="card">
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-3">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-800 flex items-center justify-center border-2 border-primary-700">
                        {profileData.profileImage ? (
                          <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Scissors className="w-10 h-10 text-primary-600" />
                        )}
                      </div>
                      {editingProfile && (
                        <button
                          onClick={() => profileImageRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-accent-500 hover:bg-accent-600 text-white p-2 rounded-full transition-all"
                        >
                          <Camera size={14} />
                        </button>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">{profileData.shopName || 'Your Shop'}</p>
                      <p className="text-primary-400 text-sm">{profileData.phone || 'No phone set'}</p>
                    </div>
                  </div>
                  <input
                    ref={profileImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Cover Image Section */}
                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-3">Cover Image</label>
                  <div className="relative h-40 rounded-xl overflow-hidden bg-primary-800 border-2 border-primary-700">
                    {profileData.coverImage ? (
                      <img src={profileData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-600">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    {editingProfile && (
                      <button
                        onClick={() => coverImageRef.current?.click()}
                        className="absolute bottom-3 right-3 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                      >
                        <Camera size={16} />
                        <span className="text-sm font-medium">Change Cover</span>
                      </button>
                    )}
                  </div>
                  <input
                    ref={coverImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Shop Name</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profileData.shopName}
                      onChange={(e) => setProfileData({...profileData, shopName: e.target.value})}
                      className="input w-full"
                      placeholder="Your shop name"
                    />
                  ) : (
                    <p className="text-white text-lg">{profileData.shopName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Bio</label>
                  {editingProfile ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="input w-full resize-none"
                      rows={4}
                      placeholder="Tell clients about yourself and your experience..."
                    />
                  ) : (
                    <p className="text-white">{profileData.bio || 'No bio added'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Address</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="input w-full"
                      placeholder="Your shop address"
                    />
                  ) : (
                    <p className="text-white">{profileData.address || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Phone</label>
                  {editingProfile ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="input w-full"
                      placeholder="Your contact number"
                    />
                  ) : (
                    <p className="text-white">{profileData.phone || barberProfile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Instagram</label>
                  {editingProfile ? (
                    <div className="flex items-center space-x-2">
                      <Instagram size={18} className="text-primary-400" />
                      <input
                        type="text"
                        value={profileData.instagram}
                        onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                        className="input w-full"
                        placeholder="@yourshopname"
                      />
                    </div>
                  ) : (
                    <p className="text-white flex items-center space-x-2">
                      <Instagram size={18} className="text-primary-400" />
                      <span>{profileData.instagram || 'Not set'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Website</label>
                  {editingProfile ? (
                    <div className="flex items-center space-x-2">
                      <Globe size={18} className="text-primary-400" />
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className="input w-full"
                        placeholder="https://yourshop.com"
                      />
                    </div>
                  ) : (
                    <p className="text-white flex items-center space-x-2">
                      <Globe size={18} className="text-primary-400" />
                      <span>{profileData.website || 'Not set'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Pricing Level</label>
                  {editingProfile ? (
                    <select
                      value={profileData.pricing}
                      onChange={(e) => setProfileData({...profileData, pricing: e.target.value})}
                      className="input w-full"
                    >
                      <option value="$">Budget-Friendly ($)</option>
                      <option value="$$">Moderate ($$)</option>
                      <option value="$$$">Premium ($$$)</option>
                      <option value="$$$$">Luxury ($$$$)</option>
                    </select>
                  ) : (
                    <p className="text-white flex items-center space-x-2">
                      <DollarSign size={18} className="text-primary-400" />
                      <span>{profileData.pricing || '$$'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {(profileData.specialties || []).map((spec: string, idx: number) => (
                      <span key={idx} className="bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full text-sm border border-accent-500/30">
                        {spec}
                      </span>
                    ))}
                    {profileData.specialties.length === 0 && <p className="text-primary-500 text-sm">No specialties added</p>}
                  </div>
                </div>

                {editingProfile && (
                  <div className="flex space-x-3 pt-4 border-t border-primary-700">
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2"
                    >
                      <Check size={18} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-primary-900 rounded-2xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-2xl text-white">Upload to Showcase</h2>
              <button onClick={() => {
                setShowUploadModal(false)
                setUploadPreview(null)
                setUploadCaption('')
              }} className="text-primary-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Upload Type Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setUploadType('image')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  uploadType === 'image'
                    ? 'border-accent-500 bg-accent-500/20'
                    : 'border-primary-700 bg-primary-800/30'
                }`}
              >
                <ImageIcon size={24} className="mx-auto mb-2 text-accent-500" />
                <p className="text-white font-semibold text-sm">Photo</p>
              </button>
              <button
                onClick={() => setUploadType('video')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  uploadType === 'video'
                    ? 'border-accent-500 bg-accent-500/20'
                    : 'border-primary-700 bg-primary-800/30'
                }`}
              >
                <Video size={24} className="mx-auto mb-2 text-accent-500" />
                <p className="text-white font-semibold text-sm">Video</p>
              </button>
            </div>

            {/* File Upload */}
            {!uploadPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary-600 hover:border-accent-500 rounded-xl p-12 text-center cursor-pointer transition-all group"
              >
                <Upload size={48} className="mx-auto mb-4 text-primary-400 group-hover:text-accent-500 group-hover:scale-110 transition-all" />
                <p className="text-white font-semibold mb-2">Click to upload {uploadType}</p>
                <p className="text-primary-400 text-sm">
                  {uploadType === 'image' ? 'JPG, PNG, or GIF up to 10MB' : 'MP4 or MOV up to 50MB'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  {uploadType === 'image' ? (
                    <img src={uploadPreview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
                  ) : (
                    <video src={uploadPreview} className="w-full h-64 object-cover rounded-xl" controls />
                  )}
                  <button
                    onClick={() => setUploadPreview(null)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">Caption</label>
                  <textarea
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    className="input w-full resize-none"
                    rows={3}
                    placeholder="Describe this haircut, technique, or style..."
                  />
                </div>

                <button
                  onClick={handleUpload}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Upload size={18} />
                  <span>Post to Showcase</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={uploadType === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  )
}

