'use client'

import { useState } from 'react'
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff,
  MapPin,
  Scissors,
  Users,
  ChevronLeft,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'client' | 'barber'>('client')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Barber specific
    shopName: '',
    experience: '',
    specialties: [] as string[],
    address: '',
    bio: '',
    // Client specific
    preferredStyle: '',
    gender: '' as 'male' | 'female' | ''
  })

  const specialtyOptions = [
    'Classic Cuts', 'Modern Fades', 'Beard Trimming', 'Straight Razor', 
    'Hair Styling', 'Color Services', 'Hot Towel Shaves', 'Mustache Styling'
  ]

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step < (userType === 'barber' ? 3 : 2)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔥 HANDLE SUBMIT CALLED!')
    console.log('Form data:', formData)
    console.log('User type:', userType)
    
    // Save user profile to localStorage
    const userProfile = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password, // Save for login verification
      userType: userType,
      accountType: userType,
      createdAt: new Date().toISOString(),
      ...(userType === 'client' && formData.gender ? { gender: formData.gender } : {}),
      ...(userType === 'barber' ? { 
        shopName: formData.shopName,
        experience: formData.experience,
        specialties: formData.specialties,
        address: formData.address,
        bio: formData.bio,
        verified: false
      } : {})
    }
    
    // Save to localStorage
    console.log('Saving user profile:', userProfile)
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userType', userType)
    localStorage.setItem('hasVisitedBefore', 'true')
    
    if (userType === 'client' && formData.gender) {
      localStorage.setItem('userGender', formData.gender)
    }
    
    // Verify it was saved
    const saved = localStorage.getItem('userProfile')
    console.log('Verified saved profile:', saved)
    
    // Show success message
    alert(`✅ Account created successfully! Welcome, ${formData.firstName}! 🎉`)
    
    // Redirect to home after signup
    setTimeout(() => {
      router.push('/')
    }, 100)
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
            Join FindMyFade
          </h1>
          <p className="text-primary-300">
            Create your account to get started
          </p>
        </div>

        {/* User Type Selection */}
        {step === 1 && (
          <div className="card">
            <h2 className="font-semibold text-white text-xl mb-6 text-center">
              What brings you here?
            </h2>
            
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setUserType('client')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  userType === 'client'
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-primary-600 hover:border-primary-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    userType === 'client' ? 'bg-accent-500 text-black' : 'bg-primary-700 text-primary-300'
                  }`}>
                    <Users size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">I'm a Client</h3>
                    <p className="text-primary-300 text-sm">Looking for a great barber</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUserType('barber')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  userType === 'barber'
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-primary-600 hover:border-primary-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    userType === 'barber' ? 'bg-accent-500 text-black' : 'bg-primary-700 text-primary-300'
                  }`}>
                    <Scissors size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">I'm a Barber</h3>
                    <p className="text-primary-300 text-sm">Ready to grow my business</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={handleNextStep}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="card">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-1 bg-accent-500 rounded-full"></div>
              <div className="w-8 h-1 bg-accent-500 rounded-full"></div>
              {userType === 'barber' && <div className="w-8 h-1 bg-primary-600 rounded-full"></div>}
            </div>

            <h2 className="font-semibold text-white text-xl mb-6 text-center">
              {userType === 'client' ? 'Personal Information' : 'Basic Information'}
            </h2>

            <form onSubmit={userType === 'client' ? handleSubmit : handleNextStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="input w-full pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

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

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input w-full pl-10"
                  required
                />
              </div>

              {userType === 'barber' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scissors className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Shop/Business Name"
                    value={formData.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    className="input w-full pl-10"
                    required
                  />
                </div>
              )}

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
                    <EyeOff className="h-5 w-5 text-primary-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-primary-400" />
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="input w-full pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-primary-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-primary-400" />
                  )}
                </button>
              </div>

              {/* Gender Selection for Clients */}
              {userType === 'client' && (
                <div>
                  <label className="block text-primary-300 text-sm mb-3 font-medium">
                    Style Preference
                    <span className="text-primary-500 ml-1 text-xs">(helps personalize your experience)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('gender', 'male')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.gender === 'male'
                          ? 'border-accent-500 bg-accent-500/20'
                          : 'border-primary-600 hover:border-primary-500 bg-primary-800/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          formData.gender === 'male' ? 'bg-blue-500/30' : 'bg-primary-700'
                        }`}>
                          <User className={`h-6 w-6 ${formData.gender === 'male' ? 'text-blue-400' : 'text-primary-400'}`} />
                        </div>
                        <p className={`font-semibold text-sm ${formData.gender === 'male' ? 'text-white' : 'text-primary-300'}`}>
                          Men's Styles
                        </p>
                        <p className="text-primary-400 text-xs mt-1">Fades, tapers, cuts</p>
                        {formData.gender === 'male' && (
                          <div className="mt-2">
                            <CheckCircle className="h-5 w-5 text-accent-500 mx-auto" />
                          </div>
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInputChange('gender', 'female')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.gender === 'female'
                          ? 'border-accent-500 bg-accent-500/20'
                          : 'border-primary-600 hover:border-primary-500 bg-primary-800/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          formData.gender === 'female' ? 'bg-pink-500/30' : 'bg-primary-700'
                        }`}>
                          <User className={`h-6 w-6 ${formData.gender === 'female' ? 'text-pink-400' : 'text-primary-400'}`} />
                        </div>
                        <p className={`font-semibold text-sm ${formData.gender === 'female' ? 'text-white' : 'text-primary-300'}`}>
                          Women's Styles
                        </p>
                        <p className="text-primary-400 text-xs mt-1">Cuts, colors, layers</p>
                        {formData.gender === 'female' && (
                          <div className="mt-2">
                            <CheckCircle className="h-5 w-5 text-accent-500 mx-auto" />
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary px-6 py-3"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {userType === 'client' ? 'Create Account' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Barber Details */}
        {step === 3 && userType === 'barber' && (
          <div className="card">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-1 bg-accent-500 rounded-full"></div>
              <div className="w-8 h-1 bg-accent-500 rounded-full"></div>
              <div className="w-8 h-1 bg-accent-500 rounded-full"></div>
            </div>

            <h2 className="font-semibold text-white text-xl mb-6 text-center">
              Professional Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  type="text"
                  placeholder="Business Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input w-full pl-10"
                  required
                />
              </div>

              <div>
                <label className="block text-primary-300 text-sm mb-2">
                  Years of Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="input w-full"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-primary-300 text-sm mb-2">
                  Specialties (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {specialtyOptions.map(specialty => (
                    <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                      />
                      <span className="text-primary-300 text-sm">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-primary-300 text-sm mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  placeholder="Tell clients about yourself and your experience..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="input w-full h-24 resize-none"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary px-6 py-3"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Barber Account
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-primary-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-500 hover:text-accent-400 font-medium">
              Sign In
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="text-center mt-4">
          <p className="text-primary-500 text-xs">
            By creating an account, you agree to our{' '}
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
