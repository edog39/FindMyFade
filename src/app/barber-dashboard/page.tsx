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
  ChevronLeft,
  MessageCircle,
  Bell,
  BarChart3,
  Scissors
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
    phone: ''
  })

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
        setProfileData({
          shopName: profile.shopName || '',
          bio: profile.bio || '',
          specialties: profile.specialties || [],
          address: profile.address || '',
          phone: profile.phone || ''
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
    }
  }, [router])

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
    setEditingProfile(false)
    alert('✅ Profile updated successfully!')
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
            <div className="flex items-center space-x-4">
              <button className="relative text-primary-300 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-primary-800/50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Client #{i}</p>
                        <p className="text-primary-400 text-sm">Today at {9 + i}:00 AM</p>
                      </div>
                      <button className="text-accent-500 hover:text-accent-400">
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  ))}
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
              <div className="space-y-4">
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

