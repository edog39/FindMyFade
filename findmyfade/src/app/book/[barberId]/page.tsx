'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  DollarSign,
  Scissors,
  Gift,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// Mock data for demonstration
const mockBarber = {
  id: 1,
  name: "Mike Johnson",
  shopName: "Mike's Premium Cuts",
  rating: 4.9,
  reviews: 127,
  avatar: "/api/placeholder/80/80",
  address: "123 Main St, Downtown",
  phone: "(555) 123-4567"
}

const mockServices = [
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
  },
  {
    id: 5,
    name: "Full Service Package",
    description: "Cut, wash, style, and beard trim",
    price: 65,
    duration: 90,
    popular: true
  }
]

const generateTimeSlots = (date: Date) => {
  const slots = []
  const startHour = 9
  const endHour = 18
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes of [0, 30]) {
      if (hour === endHour - 1 && minutes === 30) break
      const time = new Date(date)
      time.setHours(hour, minutes, 0, 0)
      
      // Mark some slots as unavailable for realism
      const isAvailable = Math.random() > 0.3
      slots.push({
        time: time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        available: isAvailable
      })
    }
  }
  return slots
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Services, 2: DateTime, 3: Details, 4: Payment, 5: Confirmation
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'paypal'>('card')
  const [useWallet, setUseWallet] = useState(false)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([])

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const calendarDays = getDaysInMonth(currentDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots(generateTimeSlots(selectedDate))
    }
  }, [selectedDate])

  // Calculate totals
  const selectedServiceDetails = mockServices.filter(s => selectedServices.includes(s.id))
  const subtotal = selectedServiceDetails.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = selectedServiceDetails.reduce((sum, service) => sum + service.duration, 0)
  const loyaltyDiscount = useWallet ? Math.min(loyaltyPoints * 0.1, subtotal * 0.2) : 0
  const total = subtotal - loyaltyDiscount

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleBooking = () => {
    // Process booking
    console.log('Booking details:', {
      barberId: params.barberId,
      services: selectedServiceDetails,
      date: selectedDate,
      time: selectedTime,
      customer: customerDetails,
      payment: paymentMethod,
      total,
      loyaltyPointsUsed: useWallet ? loyaltyPoints : 0
    })
    handleNext()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()} 
                className="text-primary-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-primary-200 text-sm">MB</span>
                </div>
                <div>
                  <h1 className="font-semibold text-white">{mockBarber.shopName}</h1>
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                    <span className="text-primary-300">{mockBarber.rating} ({mockBarber.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(num => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    num < step ? 'bg-accent-500 text-black' :
                    num === step ? 'bg-accent-500 text-black' :
                    'bg-primary-700 text-primary-400'
                  }`}
                >
                  {num < step ? <CheckCircle size={16} /> : num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white mb-2">Choose Your Services</h2>
                  <p className="text-primary-300">Select the services you'd like to book</p>
                </div>

                <div className="space-y-4">
                  {mockServices.map(service => (
                    <div 
                      key={service.id}
                      className={`card cursor-pointer transition-all duration-200 ${
                        selectedServices.includes(service.id) 
                          ? 'ring-2 ring-accent-500 bg-accent-500/10' 
                          : 'hover:bg-primary-750'
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleServiceToggle(service.id)}
                              className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                            />
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-white">{service.name}</h3>
                              {service.popular && (
                                <span className="bg-accent-500 text-black text-xs px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-primary-300 text-sm mb-3 ml-8">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-primary-300 ml-8">
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
                      </div>
                    </div>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <button onClick={handleNext} className="btn-primary w-full">
                    Continue to Date & Time
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white mb-2">Select Date & Time</h2>
                  <p className="text-primary-300">Choose your preferred appointment time</p>
                </div>

                {/* Calendar */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">
                      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-primary-300" />
                      </button>
                      <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-primary-300" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-primary-400 text-sm py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      if (!day) return <div key={index} />
                      
                      const isToday = day.getTime() === today.getTime()
                      const isPast = day < today
                      const isSelected = selectedDate && day.getTime() === selectedDate.getTime()
                      
                      return (
                        <button
                          key={index}
                          onClick={() => !isPast && handleDateSelect(day)}
                          disabled={isPast}
                          className={`
                            aspect-square p-2 text-sm rounded-lg transition-colors
                            ${isPast 
                              ? 'text-primary-600 cursor-not-allowed' 
                              : 'text-white hover:bg-primary-700'
                            }
                            ${isToday ? 'bg-primary-600' : ''}
                            ${isSelected ? 'bg-accent-500 text-black' : ''}
                          `}
                        >
                          {day.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="card">
                    <h3 className="font-semibold text-white mb-4">Available Times</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`
                            p-3 rounded-lg text-sm transition-colors
                            ${!slot.available 
                              ? 'bg-primary-700 text-primary-500 cursor-not-allowed' 
                              : selectedTime === slot.time
                                ? 'bg-accent-500 text-black'
                                : 'bg-primary-700 text-white hover:bg-primary-600'
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="flex space-x-4">
                    <button onClick={handleBack} className="btn-secondary px-6 py-3">
                      Back
                    </button>
                    <button onClick={handleNext} className="btn-primary flex-1">
                      Continue to Details
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Customer Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white mb-2">Your Details</h2>
                  <p className="text-primary-300">Please provide your contact information</p>
                </div>

                <div className="card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={customerDetails.firstName}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, firstName: e.target.value }))}
                        className="input w-full pl-10"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={customerDetails.lastName}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, lastName: e.target.value }))}
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
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
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
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="input w-full pl-10"
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Special requests or notes (optional)"
                      value={customerDetails.notes}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, notes: e.target.value }))}
                      className="input w-full h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button onClick={handleBack} className="btn-secondary px-6 py-3">
                    Back
                  </button>
                  <button onClick={handleNext} className="btn-primary flex-1">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white mb-2">Payment</h2>
                  <p className="text-primary-300">Choose your payment method</p>
                </div>

                {/* Wallet Option */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">FindMyFade Wallet</h3>
                    <div className="text-accent-500 font-medium">1,250 points available</div>
                  </div>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                    />
                    <div className="flex-1">
                      <div className="text-white">Use loyalty points (save ${loyaltyDiscount.toFixed(2)})</div>
                      <div className="text-primary-300 text-sm">Each point = $0.10 off, max 20% discount</div>
                    </div>
                  </label>
                </div>

                {/* Payment Methods */}
                <div className="card">
                  <h3 className="font-semibold text-white mb-4">Payment Method</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-primary-700/50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                        className="text-accent-500 focus:ring-accent-500"
                      />
                      <CreditCard className="w-5 h-5 text-primary-300" />
                      <span className="text-white">Credit/Debit Card</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-primary-700/50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                        className="text-accent-500 focus:ring-accent-500"
                      />
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <span className="text-white">PayPal</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-primary-700/50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="wallet"
                        checked={paymentMethod === 'wallet'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'wallet')}
                        className="text-accent-500 focus:ring-accent-500"
                      />
                      <Gift className="w-5 h-5 text-accent-500" />
                      <span className="text-white">Prepaid Wallet Balance</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button onClick={handleBack} className="btn-secondary px-6 py-3">
                    Back
                  </button>
                  <button onClick={handleBooking} className="btn-primary flex-1">
                    Confirm Booking - ${total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-white" />
                </div>
                
                <div>
                  <h2 className="font-display font-bold text-3xl text-white mb-2">Booking Confirmed!</h2>
                  <p className="text-primary-300 text-lg">Your appointment has been successfully booked</p>
                </div>

                <div className="card text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-white mb-4">Booking Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary-300">Barber:</span>
                      <span className="text-white">{mockBarber.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-300">Date:</span>
                      <span className="text-white">{selectedDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-300">Time:</span>
                      <span className="text-white">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-300">Duration:</span>
                      <span className="text-white">{totalDuration} minutes</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-primary-300">Total:</span>
                      <span className="text-accent-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bookings" className="btn-primary px-8 py-3">
                    View My Bookings
                  </Link>
                  <Link href="/" className="btn-secondary px-8 py-3">
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-semibold text-white mb-4">Booking Summary</h3>
              
              {/* Barber Info */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-primary-700">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-primary-200 text-sm">MB</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">{mockBarber.name}</h4>
                  <p className="text-primary-300 text-sm">{mockBarber.shopName}</p>
                </div>
              </div>

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Services</h4>
                  <div className="space-y-2">
                    {selectedServiceDetails.map(service => (
                      <div key={service.id} className="flex justify-between text-sm">
                        <div>
                          <div className="text-white">{service.name}</div>
                          <div className="text-primary-400">{service.duration} min</div>
                        </div>
                        <div className="text-accent-500">${service.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Time */}
              {selectedDate && selectedTime && (
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Date & Time</h4>
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 text-primary-300">
                      <Calendar size={14} />
                      <span>{selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-primary-300 mt-1">
                      <Clock size={14} />
                      <span>{selectedTime} ({totalDuration} min)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Location</h4>
                <div className="flex items-start space-x-2 text-sm text-primary-300">
                  <MapPin size={14} className="mt-0.5" />
                  <span>{mockBarber.address}</span>
                </div>
              </div>

              {/* Pricing */}
              {selectedServices.length > 0 && (
                <div className="pt-4 border-t border-primary-700">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary-300">Subtotal:</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {loyaltyDiscount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Loyalty Discount:</span>
                        <span>-${loyaltyDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-primary-700">
                      <span className="text-white">Total:</span>
                      <span className="text-accent-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
