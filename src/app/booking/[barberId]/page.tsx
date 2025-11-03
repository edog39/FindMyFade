'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Check,
  X,
  DollarSign,
  CreditCard,
  CheckCircle,
  Bell,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usBarbers } from '@/data/barbers'

// Generate availability for the next 30 days
function generateAvailability(barberId: number) {
  const availability = []
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Generate time slots based on business hours
    const slots: { time: string; available: boolean; booked: boolean }[] = []
    const startHour = isWeekend ? 10 : 9
    const endHour = isWeekend ? 18 : 20
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Every 30 minutes
      ['00', '30'].forEach(minute => {
        // Random availability (70% chance of being available)
        if (Math.random() > 0.3) {
          const isPM = hour >= 12
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
          slots.push({
            time: `${displayHour}:${minute} ${isPM ? 'PM' : 'AM'}`,
            available: true,
            booked: Math.random() < 0.2 // 20% chance of being booked
          })
        }
      })
    }
    
    availability.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      slots: slots
    })
  }
  
  return availability
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const barberId = parseInt(params.barberId as string)
  const barber = usBarbers.find(b => b.id === barberId)
  
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [sendingSMS, setSendingSMS] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'prepay' | 'pay_later'>('prepay')
  const [walletBalance, setWalletBalance] = useState(0)
  const [availableRewards, setAvailableRewards] = useState<any[]>([])
  const [selectedReward, setSelectedReward] = useState<any>(null)

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

  if (!barber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Barber not found</p>
          <Link href="/discover" className="btn-primary">
            Back to Discover
          </Link>
        </div>
      </div>
    )
  }

  const availability = generateAvailability(barberId)
  const services = barber.specialties.map((specialty, idx) => ({
    id: idx + 1,
    name: specialty,
    description: `Professional ${specialty.toLowerCase()} service`,
    price: parseInt(barber.price.split('-')[0].replace('$', '')) + (idx * 5),
    duration: 30 + (idx * 15)
  }))

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  
  const calendarDays = []
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayAvailability = availability.find(a => a.date === dateStr)
    const availableSlots = dayAvailability?.slots.filter(s => s.available && !s.booked).length || 0
    
    calendarDays.push({
      day,
      dateStr,
      availableSlots,
      isPast: new Date(dateStr) < new Date(new Date().toDateString())
    })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const selectedDayData = selectedDate ? availability.find(a => a.date === selectedDate) : null

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService) {
      alert('Please select a service, date, and time')
      return
    }
    setShowConfirmation(true)
  }

  const confirmBooking = async () => {
    setSendingSMS(true)
    
    const selectedServiceObj = services.find(s => s.name === selectedService)
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
      barberId: barberId,
      barberName: barber.name,
      shopName: barber.shopName,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      price: servicePrice,
      status: paymentMethod === 'prepay' ? 'confirmed_prepaid' : 'confirmed',
      paymentMethod: paymentMethod,
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
        description: `${selectedService} - ${barber.shopName}${selectedReward ? ` (${selectedReward.title} applied)` : ''}`,
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
    
    // In a real app, this would make an API call to send SMS via Twilio, AWS SNS, etc.
    // Example: await sendSMS(userPhone, `Your appointment with ${barber.shopName} is confirmed for ${selectedDate} at ${selectedTime}`)
    
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
      router.push(`/barber/${barberId}`)
    }, 6000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()} 
                className="text-primary-300 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
                  Book Appointment
                </h1>
                <p className="text-primary-300">with {barber.shopName}</p>
              </div>
            </div>
            <Link href={`/messages/${barberId}`} className="btn-secondary flex items-center space-x-2">
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Message</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Barber Info & Services */}
          <div className="lg:col-span-1 space-y-6">
            {/* Barber Card */}
            <div className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-white">{barber.shopName}</h3>
                    {barber.verified && <CheckCircle size={16} className="text-accent-500" />}
                  </div>
                  <div className="flex items-center space-x-1 text-accent-500 text-sm mb-1">
                    <Star size={14} fill="currentColor" />
                    <span className="font-semibold">{barber.rating}</span>
                    <span className="text-primary-400">({barber.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-primary-400 text-xs">
                    <MapPin size={12} />
                    <span>{barber.city}, {barber.state}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a href={`tel:${barber.phone}`} className="btn-secondary flex-1 py-2 text-sm flex items-center justify-center space-x-2">
                  <Phone size={16} />
                  <span>Call</span>
                </a>
                <Link href={`/messages/${barberId}`} className="btn-secondary flex-1 py-2 text-sm flex items-center justify-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Message</span>
                </Link>
              </div>
            </div>

            {/* Service Selection */}
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Select Service</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.name)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedService === service.name
                        ? 'border-accent-500 bg-accent-500/10'
                        : 'border-primary-600 bg-primary-800/50 hover:border-primary-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{service.name}</h4>
                      <div className="flex items-center space-x-1 text-accent-500">
                        <DollarSign size={16} />
                        <span className="font-semibold">{service.price}</span>
                      </div>
                    </div>
                    <p className="text-sm text-primary-300 mb-2">{service.description}</p>
                    <div className="flex items-center space-x-1 text-primary-400 text-xs">
                      <Clock size={12} />
                      <span>{service.duration} min</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            {(selectedDate || selectedTime || selectedService) && (
              <div className="card bg-gradient-to-br from-accent-500/10 to-accent-600/10 border border-accent-500/30">
                <h3 className="font-semibold text-white mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  {selectedService && (
                    <div className="flex items-center justify-between">
                      <span className="text-primary-300">Service:</span>
                      <span className="text-white font-medium">{selectedService}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-primary-300">Date:</span>
                      <span className="text-white font-medium">
                        {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-primary-300">Time:</span>
                      <span className="text-white font-medium">{selectedTime}</span>
                    </div>
                  )}
                  {selectedService && (
                    <div className="flex items-center justify-between pt-3 border-t border-accent-500/30">
                      <span className="text-primary-300">Total:</span>
                      <span className="text-accent-500 font-bold text-lg">
                        ${services.find(s => s.name === selectedService)?.price}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || !selectedService}
                  className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </div>

          {/* Right: Calendar & Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 bg-primary-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-accent-500 text-black font-semibold'
                      : 'text-primary-300 hover:text-white'
                  }`}
                >
                  Calendar View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-accent-500 text-black font-semibold'
                      : 'text-primary-300 hover:text-white'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>

            {viewMode === 'calendar' ? (
              <>
                {/* Calendar */}
                <div className="card">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={goToPreviousMonth}
                      className="btn-secondary p-2"
                      disabled={currentMonth <= new Date()}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-semibold text-white text-xl">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                      onClick={goToNextMonth}
                      className="btn-secondary p-2"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-primary-400 text-sm font-medium py-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar Days */}
                    {calendarDays.map((dayData, index) => {
                      if (!dayData) {
                        return <div key={`empty-${index}`} className="aspect-square" />
                      }
                      
                      const isSelected = selectedDate === dayData.dateStr
                      const isDisabled = dayData.isPast || dayData.availableSlots === 0
                      
                      return (
                        <button
                          key={dayData.dateStr}
                          onClick={() => !isDisabled && setSelectedDate(dayData.dateStr)}
                          disabled={isDisabled}
                          className={`aspect-square rounded-lg transition-all relative ${
                            isSelected
                              ? 'bg-accent-500 text-black font-bold'
                              : isDisabled
                              ? 'bg-primary-800/30 text-primary-600 cursor-not-allowed'
                              : 'bg-primary-800/50 hover:bg-primary-700 text-white'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-lg">{dayData.day}</span>
                            {!isDisabled && dayData.availableSlots > 0 && (
                              <span className={`text-xs ${isSelected ? 'text-black/70' : 'text-accent-400'}`}>
                                {dayData.availableSlots} slots
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-primary-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-accent-500 rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary-700 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary-800/30 rounded"></div>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && selectedDayData && (
                  <div className="card">
                    <h3 className="font-semibold text-white mb-4">
                      Available Times - {selectedDayData.dayName}, {selectedDayData.month} {selectedDayData.dayNumber}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {selectedDayData.slots.map((slot, idx) => {
                        const isBooked = slot.booked
                        const isSelected = selectedTime === slot.time
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => !isBooked && setSelectedTime(slot.time)}
                            disabled={isBooked}
                            className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-accent-500 text-black'
                                : isBooked
                                ? 'bg-primary-800/30 text-primary-600 cursor-not-allowed line-through'
                                : 'bg-primary-800/50 hover:bg-primary-700 text-white border border-primary-600 hover:border-accent-500'
                            }`}
                          >
                            {slot.time}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* List View */
              <div className="space-y-4">
                {availability.slice(0, 10).map((day) => {
                  const availableSlots = day.slots.filter(s => s.available && !s.booked)
                  if (availableSlots.length === 0) return null
                  
                  return (
                    <div key={day.date} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {day.dayName}, {day.month} {day.dayNumber}
                          </h3>
                          <p className="text-primary-400 text-sm">{availableSlots.length} slots available</p>
                        </div>
                        <CalendarIcon className="text-accent-500" size={24} />
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                        {availableSlots.slice(0, 12).map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDate(day.date)
                              setSelectedTime(slot.time)
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                              selectedDate === day.date && selectedTime === slot.time
                                ? 'bg-accent-500 text-black'
                                : 'bg-primary-800/50 hover:bg-primary-700 text-white border border-primary-600'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
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
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{barber.shopName}</p>
                    <p className="text-sm text-primary-400">{barber.name}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-400">Service:</span>
                    <span className="text-white font-medium">{selectedService}</span>
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
                      ${services.find(s => s.name === selectedService)?.price}
                    </span>
                  </div>
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

              {/* Payment Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-sm">
                    {paymentMethod === 'prepay' ? 'Payment from Wallet' : 'Pay Day-of'}
                  </p>
                  <div className="flex items-center space-x-1 text-accent-400">
                    <CreditCard size={16} />
                    <span className="text-xs">{paymentMethod === 'prepay' ? 'Instant Confirmation' : 'Reserve Now'}</span>
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
                          <span className="text-white font-semibold">${services.find(s => s.name === selectedService)?.price}</span>
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
                            -${Math.max(0, (services.find(s => s.name === selectedService)?.price || 0) - (selectedReward?.discount || 0)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-accent-400 font-semibold">New Balance:</span>
                          <span className="text-accent-400 font-bold text-lg">
                            ${(walletBalance - Math.max(0, (services.find(s => s.name === selectedService)?.price || 0) - (selectedReward?.discount || 0))).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-primary-900/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary-300">Service Price:</span>
                          <span className="text-white font-semibold">${services.find(s => s.name === selectedService)?.price}</span>
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
                            ${Math.max(0, (services.find(s => s.name === selectedService)?.price || 0) - (selectedReward?.discount || 0)).toFixed(2)}
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
                          +{Math.ceil(Math.max(0, (services.find(s => s.name === selectedService)?.price || 0) - (selectedReward?.discount || 0)) * (paymentMethod === 'prepay' ? 1.5 : 1.0))} pts
                        </span>
                      </div>
                      <p className="text-green-300/70 text-[10px] mt-1">
                        {paymentMethod === 'prepay' ? '🎉 1.5x bonus for prepaying!' : '⭐ 1x points for pay day-of'}
                      </p>
                    </div>
                    
                    {paymentMethod === 'prepay' && walletBalance < Math.max(0, (services.find(s => s.name === selectedService)?.price || 0) - (selectedReward?.discount || 0)) && (
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
                disabled={sendingSMS || (paymentMethod === 'prepay' && walletBalance < Math.max(0, (services.find(s => s.name === selectedService)?.price || 0) - (selectedReward?.discount || 0)))}
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
                        <span>Pay ${Math.max(0, (services.find(s => s.name === selectedService)?.price || 0) - (selectedReward?.discount || 0)).toFixed(2)} & Confirm</span>
                      </>
                    ) : (
                      <>
                        <Check size={20} />
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

      {/* Success Notification Banner */}
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
                      <span>${services.find(s => s.name === selectedService)?.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="font-semibold">⭐ Points Earned</span>
                      <span className="text-accent-300 font-bold">+{Math.ceil((services.find(s => s.name === selectedService)?.price || 0) * 1.5)} pts</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-2 mb-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">💳 Pay Day-of</span>
                      <span>${services.find(s => s.name === selectedService)?.price}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-semibold">⭐ You'll earn {Math.ceil(services.find(s => s.name === selectedService)?.price || 0)} pts when you pay at the shop!</span>
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

