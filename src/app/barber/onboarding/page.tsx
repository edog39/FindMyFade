'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Upload,
  Scissors,
  Smile,
  Clock,
  DollarSign,
  Handshake,
  MapPin,
  Building2,
  UserCheck,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface QuizData {
  // Step 1: Basic Identity
  shopType: string
  licenseNumber: string
  licenseUpload: string | null
  
  // Step 2: Specialties
  specialties: Array<{
    specialty: string
    type?: string
    confidence: 'confident' | 'comfortable' | 'learning'
  }>
  
  // Step 3: Vibe Profile
  conversationStyle: 'talkative' | 'neutral' | 'quiet'
  vibeType: 'community' | 'chill' | 'professional' | 'energetic' | 'luxury'
  comfortableTopics: string[]
  preferredClientTypes: string[]
  
  // Step 4: Availability
  typicalHours: any
  travelWilling: boolean
  campusGigs: boolean
  
  // Step 5: Pricing
  baseCutPrice: number | null
  beardAddOnPrice: number | null
  packageDeals: any[]
  studentDiscount: number | null
  
  // Step 6: Consent & Incentives
  agreeQuickResponse: boolean
  quickResponseHours: number | null
  optInFeatured: boolean
  optInCampusLeads: boolean
  optInPromotions: boolean
}

const SPECIALTY_OPTIONS = [
  { name: 'Fades', types: ['burst', 'mid', 'low', 'skin'] },
  { name: 'Tapers', types: [] },
  { name: 'Crops', types: [] },
  { name: 'Designs', types: [] },
  { name: 'Beard Work', types: [] },
  { name: 'Scissor Cuts', types: [] },
  { name: 'Line-ups', types: [] },
  { name: 'Hot Towel Shaves', types: [] },
  { name: 'Color Services', types: [] },
  { name: 'Texturizing', types: [] },
]

const CONFIDENCE_OPTIONS = [
  { value: 'confident', label: 'Confident', description: 'Master level' },
  { value: 'comfortable', label: 'Comfortable', description: 'Experienced' },
  { value: 'learning', label: 'Learning', description: 'Still improving' },
]

const TOPIC_OPTIONS = [
  'Sports', 'Business', 'Politics', 'Entertainment', 'Mental Health', 'None'
]

const CLIENT_TYPE_OPTIONS = [
  'College Students', 'Professionals', 'Older Adults', 'Families', 'All'
]

export default function BarberOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [completion, setCompletion] = useState(0)
  const [error, setError] = useState('')
  
  const [quizData, setQuizData] = useState<QuizData>({
    shopType: '',
    licenseNumber: '',
    licenseUpload: null,
    specialties: [],
    conversationStyle: 'neutral',
    vibeType: 'chill',
    comfortableTopics: [],
    preferredClientTypes: [],
    typicalHours: null,
    travelWilling: false,
    campusGigs: false,
    baseCutPrice: null,
    beardAddOnPrice: null,
    packageDeals: [],
    studentDiscount: null,
    agreeQuickResponse: false,
    quickResponseHours: null,
    optInFeatured: false,
    optInCampusLeads: false,
    optInPromotions: false,
  })

  const totalSteps = 6

  // Get user ID from localStorage
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile')
    if (!userProfile) {
      router.push('/login')
      return
    }
    
    const profile = JSON.parse(userProfile)
    if (profile.userType !== 'barber') {
      router.push('/')
      return
    }

    // Load existing onboarding data if available
    loadOnboardingData(profile.id)
  }, [router])

  const loadOnboardingData = async (userId: string) => {
    try {
      const response = await fetch(`/api/barbers/onboarding?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.quizData) {
          setQuizData(prev => ({ ...prev, ...data.quizData }))
        }
        setCompletion(data.completion || 0)
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error)
    }
  }

  const handleSpecialtyToggle = (specialtyName: string, type?: string) => {
    setQuizData(prev => {
      const existing = prev.specialties.find(
        s => s.specialty === specialtyName && (!type || s.type === type)
      )
      
      if (existing) {
        return {
          ...prev,
          specialties: prev.specialties.filter(
            s => !(s.specialty === specialtyName && (!type || s.type === type))
          )
        }
      } else {
        return {
          ...prev,
          specialties: [
            ...prev.specialties,
            {
              specialty: specialtyName,
              type: type || undefined,
              confidence: 'comfortable' as const
            }
          ]
        }
      }
    })
  }

  const handleSpecialtyConfidence = (specialtyName: string, type: string | undefined, confidence: 'confident' | 'comfortable' | 'learning') => {
    setQuizData(prev => ({
      ...prev,
      specialties: prev.specialties.map(s =>
        s.specialty === specialtyName && (type ? s.type === type : !s.type)
          ? { ...s, confidence }
          : s
      )
    }))
  }

  const handleTopicToggle = (topic: string) => {
    setQuizData(prev => ({
      ...prev,
      comfortableTopics: prev.comfortableTopics.includes(topic)
        ? prev.comfortableTopics.filter(t => t !== topic)
        : [...prev.comfortableTopics, topic]
    }))
  }

  const handleClientTypeToggle = (type: string) => {
    setQuizData(prev => ({
      ...prev,
      preferredClientTypes: prev.preferredClientTypes.includes(type)
        ? prev.preferredClientTypes.filter(t => t !== type)
        : [...prev.preferredClientTypes, type]
    }))
  }

  const handleSave = async (final: boolean = false) => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
    if (!userProfile.id) {
      setError('Please log in to continue')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/barbers/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.id,
          ...quizData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save onboarding data')
      }

      setCompletion(data.completion || 0)

      if (final && data.isComplete) {
        // Redirect to dashboard
        alert('🎉 Onboarding complete! Your profile is now live.')
        router.push('/barber-dashboard')
      } else if (final) {
        alert(`✅ Progress saved! You're ${(data.completion * 100).toFixed(0)}% complete. Complete more to get listed!`)
        router.push('/barber-dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      handleSave(false) // Auto-save progress
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    handleSave(true) // Final save
  }

  const progressPercentage = ((currentStep / totalSteps) * 100).toFixed(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/barber-dashboard"
            className="inline-flex items-center space-x-2 text-primary-300 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-2">
                Barber Onboarding
              </h1>
              <p className="text-primary-300">
                Complete your profile to start getting clients
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent-500">
                {(completion * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-primary-400">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-primary-800 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completion * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-primary-400 mb-6">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{completion >= 0.7 ? '✅ Ready to list' : 'Complete 70% to list'}</span>
          </div>

          {/* Incentive Banner */}
          {completion < 0.7 && (
            <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="text-accent-500 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-white mb-1">Complete 70% to unlock:</h3>
                  <ul className="text-sm text-primary-300 space-y-1">
                    <li>✨ Free "Featured" placement for 30 days</li>
                    <li>🎖️ "Verified Vibe" badge on your profile</li>
                    <li>📍 Higher visibility in search results</li>
                    <li>🎓 Access to campus campaign leads</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Identity */}
        {currentStep === 1 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="text-accent-500" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-white text-xl">Basic Identity & Licensing</h2>
                <p className="text-primary-400 text-sm">Tell us about your setup</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-primary-300 text-sm font-medium mb-3">
                  Shop Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['shop-based', 'independent', 'dorm/apartment', 'freelance'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuizData(prev => ({ ...prev, shopType: type }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        quizData.shopType === type
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-primary-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="font-medium text-white capitalize">
                        {type.replace('-', ' ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  License Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter license number if applicable"
                  value={quizData.licenseNumber}
                  onChange={(e) => setQuizData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  Upload License (Optional)
                </label>
                <button
                  type="button"
                  className="w-full p-8 border-2 border-dashed border-primary-600 rounded-xl hover:border-primary-500 transition-colors flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="text-primary-400" size={24} />
                  <span className="text-primary-300 text-sm">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-primary-500 text-xs">PDF, PNG, JPG (Max 5MB)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Specialties */}
        {currentStep === 2 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Scissors className="text-accent-500" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-white text-xl">Cut Specialties</h2>
                <p className="text-primary-400 text-sm">Select what you offer and your confidence level</p>
              </div>
            </div>

            <div className="space-y-6">
              {SPECIALTY_OPTIONS.map(spec => (
                <div key={spec.name} className="border border-primary-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{spec.name}</h3>
                    {quizData.specialties.some(s => s.specialty === spec.name) && (
                      <CheckCircle className="text-accent-500" size={20} />
                    )}
                  </div>
                  
                  {spec.types && spec.types.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {spec.types.map(type => {
                        const selected = quizData.specialties.find(
                          s => s.specialty === spec.name && s.type === type
                        )
                        return (
                          <div key={type} className="space-y-2">
                            <button
                              type="button"
                              onClick={() => handleSpecialtyToggle(spec.name, type)}
                              className={`w-full p-2 rounded-lg border text-sm transition-all ${
                                selected
                                  ? 'border-accent-500 bg-accent-500/10 text-white'
                                  : 'border-primary-600 text-primary-300 hover:border-primary-500'
                              }`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                            
                            {selected && (
                              <select
                                value={selected.confidence}
                                onChange={(e) => handleSpecialtyConfidence(
                                  spec.name,
                                  type,
                                  e.target.value as 'confident' | 'comfortable' | 'learning'
                                )}
                                className="w-full p-2 rounded-lg bg-primary-800 border border-primary-600 text-white text-xs"
                              >
                                {CONFIDENCE_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label} - {opt.description}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {(!spec.types || spec.types.length === 0) && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleSpecialtyToggle(spec.name)}
                        className={`w-full p-2 rounded-lg border transition-all ${
                          quizData.specialties.some(s => s.specialty === spec.name && !s.type)
                            ? 'border-accent-500 bg-accent-500/10 text-white'
                            : 'border-primary-600 text-primary-300 hover:border-primary-500'
                        }`}
                      >
                        {quizData.specialties.some(s => s.specialty === spec.name && !s.type) ? '✓ Selected' : 'Select'}
                      </button>
                      
                      {quizData.specialties.some(s => s.specialty === spec.name && !s.type) && (
                        <select
                          value={quizData.specialties.find(s => s.specialty === spec.name && !s.type)?.confidence || 'comfortable'}
                          onChange={(e) => handleSpecialtyConfidence(
                            spec.name,
                            undefined,
                            e.target.value as 'confident' | 'comfortable' | 'learning'
                          )}
                          className="w-full p-2 rounded-lg bg-primary-800 border border-primary-600 text-white text-xs"
                        >
                          {CONFIDENCE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label} - {opt.description}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Vibe Profile */}
        {currentStep === 3 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Smile className="text-accent-500" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-white text-xl">Experience Style & Vibe</h2>
                <p className="text-primary-400 text-sm">Help clients find the right match</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-primary-300 text-sm font-medium mb-3">
                  Conversation Style *
                </label>
                <div className="space-y-2">
                  {(['talkative', 'neutral', 'quiet'] as const).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setQuizData(prev => ({ ...prev, conversationStyle: style }))}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        quizData.conversationStyle === style
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-primary-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="font-medium text-white capitalize">{style}</div>
                      <div className="text-primary-400 text-sm mt-1">
                        {style === 'talkative' && 'Loves conversation'}
                        {style === 'neutral' && 'Balanced interaction'}
                        {style === 'quiet' && 'Minimal talk, focus on the cut'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-primary-300 text-sm font-medium mb-3">
                  Vibe Selector *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['community', 'chill', 'professional', 'energetic', 'luxury'] as const).map(vibe => (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => setQuizData(prev => ({ ...prev, vibeType: vibe }))}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        quizData.vibeType === vibe
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-primary-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="font-medium text-white capitalize">{vibe}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-primary-300 text-sm font-medium mb-3">
                  Topics Comfortable Discussing
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_OPTIONS.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        quizData.comfortableTopics.includes(topic)
                          ? 'border-accent-500 bg-accent-500/10 text-white'
                          : 'border-primary-600 text-primary-300 hover:border-primary-500'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-primary-300 text-sm font-medium mb-3">
                  Preferred Client Types
                </label>
                <div className="space-y-2">
                  {CLIENT_TYPE_OPTIONS.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleClientTypeToggle(type)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        quizData.preferredClientTypes.includes(type)
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-primary-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{type}</span>
                        {quizData.preferredClientTypes.includes(type) && (
                          <CheckCircle className="text-accent-500" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Availability */}
        {currentStep === 4 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Clock className="text-accent-500" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-white text-xl">Availability & Location</h2>
                <p className="text-primary-400 text-sm">When and where you work</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  Typical Hours (Set in Dashboard)
                </label>
                <p className="text-primary-400 text-sm mb-4">
                  You can set detailed business hours in your dashboard settings. This is just for quick reference.
                </p>
                <div className="bg-primary-800/50 border border-primary-700 rounded-lg p-4">
                  <p className="text-primary-300 text-sm">
                    💡 Tip: Complete your profile to access dashboard settings
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizData.travelWilling}
                    onChange={(e) => setQuizData(prev => ({ ...prev, travelWilling: e.target.checked }))}
                    className="w-5 h-5 rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                  />
                  <div>
                    <div className="font-medium text-white">Willing to Travel</div>
                    <div className="text-primary-400 text-sm">Are you available for mobile/home appointments?</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizData.campusGigs}
                    onChange={(e) => setQuizData(prev => ({ ...prev, campusGigs: e.target.checked }))}
                    className="w-5 h-5 rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                  />
                  <div>
                    <div className="font-medium text-white">Campus Gigs Available</div>
                    <div className="text-primary-400 text-sm">Interested in on-campus pop-up events?</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Pricing */}
        {currentStep === 5 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-accent-500" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-white text-xl">Pricing & Services</h2>
                <p className="text-primary-400 text-sm">Set your rates</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  Base Cut Price ($) *
                </label>
                <input
                  type="number"
                  placeholder="30.00"
                  value={quizData.baseCutPrice || ''}
                  onChange={(e) => setQuizData(prev => ({ 
                    ...prev, 
                    baseCutPrice: e.target.value ? parseFloat(e.target.value) : null 
                  }))}
                  className="input w-full"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  Beard Add-On Price ($)
                </label>
                <input
                  type="number"
                  placeholder="15.00"
                  value={quizData.beardAddOnPrice || ''}
                  onChange={(e) => setQuizData(prev => ({ 
                    ...prev, 
                    beardAddOnPrice: e.target.value ? parseFloat(e.target.value) : null 
                  }))}
                  className="input w-full"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  Student Discount (%)
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={quizData.studentDiscount || ''}
                  onChange={(e) => setQuizData(prev => ({ 
                    ...prev, 
                    studentDiscount: e.target.value ? parseFloat(e.target.value) : null 
                  }))}
                  className="input w-full"
                  min="0"
                  max="100"
                  step="1"
                />
                <p className="text-primary-400 text-xs mt-1">
                  Percentage discount for student clients
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Consent & Incentives */}
        {currentStep === 6 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Handshake className="text-accent-500" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-white text-xl">Consent & Incentives</h2>
                <p className="text-primary-400 text-sm">Finalize your profile</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-primary-700 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizData.agreeQuickResponse}
                    onChange={(e) => setQuizData(prev => ({ ...prev, agreeQuickResponse: e.target.checked }))}
                    className="w-5 h-5 rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">
                      Agree to Quick Response Time
                    </div>
                    <div className="text-primary-400 text-sm mb-3">
                      I commit to responding to booking requests within a specified time frame
                    </div>
                    {quizData.agreeQuickResponse && (
                      <select
                        value={quizData.quickResponseHours || 24}
                        onChange={(e) => setQuizData(prev => ({ 
                          ...prev, 
                          quickResponseHours: parseInt(e.target.value) 
                        }))}
                        className="input text-sm"
                      >
                        <option value={2}>2 hours</option>
                        <option value={4}>4 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={48}>48 hours</option>
                      </select>
                    )}
                  </div>
                </label>
              </div>

              <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizData.optInFeatured}
                    onChange={(e) => setQuizData(prev => ({ ...prev, optInFeatured: e.target.checked }))}
                    className="w-5 h-5 rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1 flex items-center space-x-2">
                      <Sparkles size={16} className="text-accent-500" />
                      <span>Opt-in for Featured Placement (FREE for 30 days)</span>
                    </div>
                    <div className="text-primary-300 text-sm">
                      Get free "Featured" placement for your first 30 days to increase visibility and attract early clients!
                    </div>
                  </div>
                </label>
              </div>

              <div className="border border-primary-700 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizData.optInCampusLeads}
                    onChange={(e) => setQuizData(prev => ({ ...prev, optInCampusLeads: e.target.checked }))}
                    className="w-5 h-5 rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">
                      Opt-in for Campus Campaign Leads
                    </div>
                    <div className="text-primary-400 text-sm">
                      Receive leads from campus pop-up events and student campaigns
                    </div>
                  </div>
                </label>
              </div>

              <div className="border border-primary-700 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizData.optInPromotions}
                    onChange={(e) => setQuizData(prev => ({ ...prev, optInPromotions: e.target.checked }))}
                    className="w-5 h-5 rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">
                      Opt-in for Promotions & Ads (Future)
                    </div>
                    <div className="text-primary-400 text-sm">
                      Get notified about paid promotion opportunities to boost your visibility
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Complete Onboarding</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

