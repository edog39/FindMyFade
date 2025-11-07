'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Clock,
  MapPin,
  Star,
  ChevronLeft,
  CheckCircle,
  XCircle,
  CreditCard,
  DollarSign,
  Phone,
  MessageCircle,
  Trash2,
  AlertCircle,
  Edit2,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Booking {
  id: number
  barberId: number
  barberName: string
  shopName: string
  service: string
  date: string
  time: string
  price: number
  status: 'confirmed_prepaid' | 'confirmed' | 'cancelled'
  paymentMethod: 'prepay' | 'pay_later'
  bookedAt: string
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')
  const [editingBooking, setEditingBooking] = useState<number | null>(null)
  const [newService, setNewService] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load appointments from database
      const fetchAppointments = async () => {
        const userProfile = localStorage.getItem('userProfile')
        if (userProfile) {
          const profile = JSON.parse(userProfile)
          
          try {
            console.log('🔄 Fetching client appointments for user:', profile.id)
            const response = await fetch(`/api/appointments?userId=${profile.id}&userType=client`, {
              cache: 'no-store'
            })

            if (response.ok) {
              const data = await response.json()
              console.log('✅ Loaded', data.appointments.length, 'appointments from database')
              
              // Combine database appointments with localStorage (for backwards compatibility)
              const savedBookings = localStorage.getItem('userBookings')
              const localBookings = savedBookings ? JSON.parse(savedBookings) : []
              
              // Merge and deduplicate
              const allBookings = [...data.appointments, ...localBookings]
              setBookings(allBookings)
            } else {
              console.log('⚠️ Failed to load appointments from database, using localStorage')
              const savedBookings = localStorage.getItem('userBookings')
              if (savedBookings) {
                setBookings(JSON.parse(savedBookings))
              }
            }
          } catch (error) {
            console.error('❌ Error fetching appointments:', error)
            // Fallback to localStorage
      const savedBookings = localStorage.getItem('userBookings')
      if (savedBookings) {
              setBookings(JSON.parse(savedBookings))
            }
          }
        }
      }

      fetchAppointments()
      
      // Load wallet balance
      const walletData = localStorage.getItem('walletData')
      if (walletData) {
        const wallet = JSON.parse(walletData)
        setWalletBalance(wallet.balance || 0)
      }
      
      // Load AI recommendations
      const aiResults = localStorage.getItem('aiStyleResults')
      if (aiResults) {
        const results = JSON.parse(aiResults)
        if (results.recommendations) {
          setAiRecommendations(results.recommendations)
        }
      }
    }
  }, [])

  const updateService = (bookingId: number) => {
    if (!newService.trim()) return
    
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, service: newService }
        : booking
    )
    setBookings(updatedBookings)
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings))
    setEditingBooking(null)
    setNewService('')
    alert('Service updated successfully!')
  }

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking)
    setShowCancelModal(true)
  }

  const confirmCancellation = () => {
    if (!bookingToCancel) return
    
    const booking = bookingToCancel
    const bookingDateTime = new Date(booking.date + ' ' + booking.time)
    const now = new Date()
    const hoursUntil = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    // Determine cancellation policy
    let refundPercentage = 1.0
    let cancellationFee = 0
    
    if (hoursUntil < 48) {
      refundPercentage = 0.5
      cancellationFee = booking.price * 0.5
    }
    
    const updatedBookings = bookings.map(b => 
      b.id === booking.id 
        ? { ...b, status: 'cancelled' as const }
        : b
    )
    setBookings(updatedBookings)
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings))
    
    // If it was prepaid, process refund based on cancellation policy
    if (booking && booking.paymentMethod === 'prepay') {
      const walletData = JSON.parse(localStorage.getItem('walletData') || '{"balance": 0, "points": 0}')
      
      const refundAmount = booking.price * refundPercentage
      walletData.balance += refundAmount
      walletData.points = Math.max(0, walletData.points - Math.ceil(booking.price))
      localStorage.setItem('walletData', JSON.stringify(walletData))
      setWalletBalance(walletData.balance)
      
      // Add refund transaction
      const transaction = {
        id: Date.now(),
        type: 'refund',
        amount: refundAmount,
        description: hoursUntil < 48 
          ? `Partial Refund (50%) - ${booking.service} | $${cancellationFee.toFixed(2)} cancellation fee`
          : `Full Refund - ${booking.service} (Cancelled)`,
        date: new Date().toISOString().split('T')[0],
        pointsEarned: -Math.ceil(booking.price),
        status: 'completed'
      }
      const transactions = JSON.parse(localStorage.getItem('walletTransactions') || '[]')
      transactions.unshift(transaction)
      localStorage.setItem('walletTransactions', JSON.stringify(transactions))
      
      // If there's a cancellation fee, create a separate transaction for barber compensation
      if (cancellationFee > 0) {
        const compensationTransaction = {
          id: Date.now() + 1,
          type: 'cancellation_fee',
          amount: -cancellationFee,
          description: `Cancellation Fee - Barber Compensation (${booking.shopName})`,
          date: new Date().toISOString().split('T')[0],
          pointsEarned: 0,
          status: 'completed'
        }
        transactions.unshift(compensationTransaction)
        localStorage.setItem('walletTransactions', JSON.stringify(transactions))
      }
    }
    
    setShowCancelModal(false)
    setBookingToCancel(null)
  }

  const filterBookings = (bookings: Booking[]) => {
    const now = new Date()
    
    if (filter === 'upcoming') {
      return bookings.filter(booking => {
        const bookingDate = new Date(booking.date + ' ' + booking.time)
        return bookingDate >= now && booking.status !== 'cancelled'
      })
    } else if (filter === 'past') {
      return bookings.filter(booking => {
        const bookingDate = new Date(booking.date + ' ' + booking.time)
        return bookingDate < now || booking.status === 'cancelled'
      })
    }
    return bookings
  }

  const filteredBookings = filterBookings(bookings)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="text-primary-300 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="font-display font-bold text-2xl text-white">My Appointments</h1>
                <p className="text-primary-300">View and manage your bookings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-primary-800/50 rounded-lg p-1">
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'upcoming'
                    ? 'bg-accent-500 text-black'
                    : 'text-primary-300 hover:text-white'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'past'
                    ? 'bg-accent-500 text-black'
                    : 'text-primary-300 hover:text-white'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-accent-500 text-black'
                    : 'text-primary-300 hover:text-white'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={48} className="text-primary-400" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">
              {filter === 'upcoming' ? 'No Upcoming Appointments' : 'No Appointments Found'}
            </h2>
            <p className="text-primary-300 mb-8">
              {filter === 'upcoming' 
                ? 'Book your first appointment to get started!' 
                : 'Try adjusting your filters or book a new appointment.'}
            </p>
            <Link href="/discover" className="btn-primary inline-block">
              Find a Barber
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const bookingDate = new Date(booking.date + ' ' + booking.time)
              const isPast = bookingDate < new Date()
              const isCancelled = booking.status === 'cancelled'
              
              return (
                <div 
                  key={booking.id} 
                  className={`card hover:scale-[1.01] transition-all duration-200 ${
                    isCancelled ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
                        <span className="text-xl">💈</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{booking.shopName}</h3>
                        <p className="text-primary-400 text-sm">{booking.barberName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isCancelled ? (
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <XCircle size={12} />
                          <span>Cancelled</span>
                        </span>
                      ) : booking.paymentMethod === 'prepay' ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <CheckCircle size={12} />
                          <span>Prepaid</span>
                        </span>
                      ) : (
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <AlertCircle size={12} />
                          <span>Pay Day-of</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-primary-300">
                        <Calendar size={16} className="text-accent-400" />
                        <span className="text-sm">{new Date(booking.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-primary-300">
                        <Clock size={16} className="text-accent-400" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-primary-300">
                          <Star size={16} className="text-accent-400" />
                          <span className="text-sm">{booking.service}</span>
                        </div>
                        {!isCancelled && !isPast && editingBooking !== booking.id && (
                          <button
                            onClick={() => {
                              setEditingBooking(booking.id)
                              setNewService(booking.service)
                            }}
                            className="text-accent-400 hover:text-accent-300 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-primary-300">
                        <DollarSign size={16} className="text-accent-400" />
                        <span className="text-sm font-semibold">${booking.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Service Form */}
                  {editingBooking === booking.id && (
                    <div className="bg-primary-800/50 border border-accent-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold text-sm">Change Service</h4>
                        <button
                          onClick={() => {
                            setEditingBooking(null)
                            setNewService('')
                          }}
                          className="text-primary-400 hover:text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      {aiRecommendations.length > 0 && (
                        <div className="mb-3">
                          <p className="text-primary-300 text-xs mb-2">🤖 AI Recommended Styles:</p>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {aiRecommendations.slice(0, 4).map((rec: any, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => setNewService(rec.name || rec.style)}
                                className="bg-primary-700/50 hover:bg-accent-500/20 border border-primary-600 hover:border-accent-500 rounded-lg p-2 text-left transition-all"
                              >
                                <p className="text-white text-xs font-medium">{rec.name || rec.style}</p>
                                <p className="text-primary-400 text-[10px]">{rec.description?.substring(0, 40)}...</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <input
                        type="text"
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        placeholder="Enter new service or select AI recommendation"
                        className="input w-full mb-3"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateService(booking.id)}
                          className="flex-1 btn-primary py-2 text-sm"
                        >
                          Update Service
                        </button>
                        <button
                          onClick={() => {
                            setEditingBooking(null)
                            setNewService('')
                          }}
                          className="flex-1 btn-secondary py-2 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {booking.paymentMethod === 'prepay' && !isCancelled && (
                    <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <CreditCard size={16} className="text-accent-400" />
                          <span className="text-accent-400 font-medium">Paid from Wallet</span>
                        </div>
                        <span className="text-accent-400 font-semibold">${booking.price}</span>
                      </div>
                    </div>
                  )}

                  {/* Cancellation Policy Warning */}
                  {!isCancelled && !isPast && (() => {
                    const bookingDateTime = new Date(booking.date + ' ' + booking.time)
                    const now = new Date()
                    const hoursUntil = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
                    if (hoursUntil < 48 && hoursUntil > 0) {
                      return (
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4">
                          <div className="flex items-start space-x-2">
                            <AlertCircle size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
                            <div className="text-xs">
                              <p className="text-orange-400 font-semibold mb-1">⚠️ Cancellation Policy</p>
                              <p className="text-primary-300">Cancelling now will incur a 50% fee (${(booking.price * 0.5).toFixed(2)}) to compensate the barber for lost revenue.</p>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}

                  <div className="flex items-center space-x-3">
                    <Link 
                      href={`/barber/${booking.barberId}`}
                      className="flex-1 btn-secondary py-2 text-center text-sm"
                    >
                      View Profile
                    </Link>
                    <Link 
                      href={`/messages/${booking.barberId}`}
                      className="flex-1 btn-secondary py-2 text-center text-sm flex items-center justify-center space-x-2"
                    >
                      <MessageCircle size={16} />
                      <span>Message</span>
                    </Link>
                    {!isCancelled && !isPast && (
                      <button
                        onClick={() => handleCancelClick(booking)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancellation Modal with Balance Preview */}
      {showCancelModal && bookingToCancel && (() => {
        const bookingDateTime = new Date(bookingToCancel.date + ' ' + bookingToCancel.time)
        const now = new Date()
        const hoursUntil = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
        const isWithin48Hours = hoursUntil < 48
        const refundPercentage = isWithin48Hours ? 0.5 : 1.0
        const refundAmount = bookingToCancel.price * refundPercentage
        const cancellationFee = bookingToCancel.price * (1 - refundPercentage)
        const newBalance = walletBalance + refundAmount

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-primary-900 rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} className="text-white" />
                </div>
                <h2 className="font-bold text-2xl text-white mb-2">Cancel Appointment?</h2>
                <p className="text-primary-300">Review cancellation details below</p>
              </div>

              {/* Appointment Details */}
              <div className="bg-primary-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-xl">💈</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{bookingToCancel.shopName}</p>
                    <p className="text-sm text-primary-400">{bookingToCancel.barberName}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-400">Service:</span>
                    <span className="text-white font-medium">{bookingToCancel.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-400">Date:</span>
                    <span className="text-white font-medium">
                      {new Date(bookingToCancel.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-400">Time:</span>
                    <span className="text-white font-medium">{bookingToCancel.time}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy Warning */}
              {isWithin48Hours && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle size={20} className="text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-orange-400 font-semibold text-sm mb-1">⚠️ Cancellation Fee Applied</p>
                      <p className="text-primary-300 text-xs">
                        Cancelling within 48 hours incurs a 50% fee to compensate the barber for lost revenue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Refund Breakdown - Only show for prepaid bookings */}
              {bookingToCancel.paymentMethod === 'prepay' && (
                <div className="bg-primary-800/50 border-2 border-accent-500/50 rounded-xl p-4 mb-4">
                  <h4 className="text-white font-semibold text-sm mb-3">💰 Wallet Balance Update</h4>
                  <div className="space-y-2">
                    <div className="bg-primary-900/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary-300">Current Balance:</span>
                        <span className="text-white font-bold">${walletBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary-300">Original Payment:</span>
                        <span className="text-white font-semibold">${bookingToCancel.price.toFixed(2)}</span>
                      </div>
                      {isWithin48Hours && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-400">Refund Amount (50%):</span>
                            <span className="text-green-400 font-semibold">+${refundAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-red-400">Cancellation Fee:</span>
                            <span className="text-red-400 font-semibold">-${cancellationFee.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      {!isWithin48Hours && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-400">Full Refund:</span>
                          <span className="text-green-400 font-semibold">+${refundAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="h-px bg-primary-700"></div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-accent-400 font-semibold">New Balance:</span>
                        <span className="text-accent-400 font-bold text-lg">${newBalance.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 font-semibold text-sm">Points Deducted:</span>
                        <span className="text-red-400 font-bold text-lg">-{Math.ceil(bookingToCancel.price)} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setBookingToCancel(null)
                  }}
                  className="flex-1 btn-secondary py-3"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmCancellation}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <XCircle size={20} />
                  <span>Yes, Cancel It</span>
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

