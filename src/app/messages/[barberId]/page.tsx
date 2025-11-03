'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Image as ImageIcon,
  Paperclip,
  Calendar,
  MapPin,
  Clock,
  Check,
  CheckCheck,
  Star,
  Info,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usBarbers } from '@/data/barbers'

export default function MessagesPage() {
  const params = useParams()
  const router = useRouter()
  const barberId = parseInt(params.barberId as string)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'barber',
      text: 'Hey! Thanks for reaching out. How can I help you today?',
      timestamp: '10:30 AM',
      read: true
    },
    {
      id: 2,
      sender: 'user',
      text: "Hi! I'm looking to get a fade. Do you have any availability this weekend?",
      timestamp: '10:32 AM',
      read: true
    },
    {
      id: 3,
      sender: 'barber',
      text: "Absolutely! I have slots available on Saturday at 2:00 PM and 4:30 PM, and Sunday at 11:00 AM. Which works best for you?",
      timestamp: '10:33 AM',
      read: true
    },
    {
      id: 4,
      sender: 'user',
      text: "Saturday at 2:00 PM would be perfect!",
      timestamp: '10:35 AM',
      read: true
    },
    {
      id: 5,
      sender: 'barber',
      text: "Great! I've got you down for Saturday at 2:00 PM. Would you like a regular fade or something more specific?",
      timestamp: '10:36 AM',
      read: true
    }
  ])
  const [showInfo, setShowInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get barber data
  const barber = usBarbers.find(b => b.id === barberId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      read: false
    }

    setMessages([...messages, newMessage])
    setMessage('')

    // Simulate barber response
    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        sender: 'barber',
        text: "Thanks for your message! I'll get back to you shortly.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        read: false
      }
      setMessages(prev => [...prev, autoReply])
    }, 2000)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex flex-col">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <button 
                onClick={() => router.back()} 
                className="text-primary-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-primary-300">👤</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary-900 rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h1 className="font-semibold text-white truncate">{barber.shopName}</h1>
                    {barber.verified && (
                      <CheckCircle size={16} className="text-accent-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-primary-400">{barber.name}</p>
                  <p className="text-xs text-green-400">Active now</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <a href={`tel:${barber.phone}`} className="btn-secondary p-3">
                <Phone size={20} />
              </a>
              <Link href={`/booking/${barberId}`} className="btn-primary px-4 py-2 flex items-center space-x-2">
                <Calendar size={18} />
                <span className="hidden sm:inline">Book</span>
              </Link>
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="btn-secondary p-3"
              >
                <Info size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex max-w-4xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            {/* Date Separator */}
            <div className="flex items-center justify-center">
              <div className="bg-primary-800/50 backdrop-blur-sm px-4 py-1 rounded-full text-primary-300 text-xs">
                Today
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-black'
                        : 'bg-primary-800/80 backdrop-blur-sm text-white border border-primary-700'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <div className={`flex items-center space-x-1 mt-1 text-xs text-primary-400 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && (
                      msg.read ? <CheckCheck size={14} className="text-accent-400" /> : <Check size={14} />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 justify-center py-4">
              <Link href={`/booking/${barberId}`} className="bg-primary-800/50 hover:bg-primary-700/50 backdrop-blur-sm border border-primary-600 px-4 py-2 rounded-full text-sm text-white transition-colors flex items-center space-x-2">
                <Calendar size={16} />
                <span>Book Appointment</span>
              </Link>
              <Link href={`/barber/${barberId}`} className="bg-primary-800/50 hover:bg-primary-700/50 backdrop-blur-sm border border-primary-600 px-4 py-2 rounded-full text-sm text-white transition-colors flex items-center space-x-2">
                <Star size={16} />
                <span>View Services</span>
              </Link>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-primary-900/80 backdrop-blur-lg border-t border-primary-800 px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-primary-800/50 backdrop-blur-sm border border-primary-600 rounded-xl px-4 py-3 pr-24 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button
                      type="button"
                      className="p-2 text-primary-400 hover:text-white transition-colors rounded-lg hover:bg-primary-700"
                    >
                      <Paperclip size={18} />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-primary-400 hover:text-white transition-colors rounded-lg hover:bg-primary-700"
                    >
                      <ImageIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-xs text-primary-500 mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>

        {/* Info Sidebar (Desktop) */}
        {showInfo && (
          <div className="hidden lg:block w-80 border-l border-primary-800 bg-primary-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{barber.shopName}</h3>
                <p className="text-primary-300 text-sm mb-2">{barber.name}</p>
                <div className="flex items-center justify-center space-x-1 text-accent-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-semibold">{barber.rating}</span>
                  <span className="text-primary-400">({barber.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Location</h4>
                  <div className="flex items-start space-x-2 text-primary-300 text-sm">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{barber.address}, {barber.city}, {barber.state}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Contact</h4>
                  <a href={`tel:${barber.phone}`} className="flex items-center space-x-2 text-primary-300 hover:text-white text-sm mb-2 transition-colors">
                    <Phone size={16} />
                    <span>{barber.phone}</span>
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty, idx) => (
                      <span key={idx} className="bg-primary-800 px-3 py-1 rounded-full text-xs text-primary-300">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/booking/${barberId}`} className="btn-primary w-full py-3 flex items-center justify-center space-x-2">
                  <Calendar size={18} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Info Modal */}
      {showInfo && (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-primary-900 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-lg">Barber Info</h3>
                <button onClick={() => setShowInfo(false)} className="text-primary-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{barber.shopName}</h3>
                <p className="text-primary-300 text-sm mb-2">{barber.name}</p>
                <div className="flex items-center justify-center space-x-1 text-accent-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-semibold">{barber.rating}</span>
                  <span className="text-primary-400">({barber.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Location</h4>
                  <div className="flex items-start space-x-2 text-primary-300 text-sm">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{barber.address}, {barber.city}, {barber.state}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Contact</h4>
                  <a href={`tel:${barber.phone}`} className="flex items-center space-x-2 text-primary-300 hover:text-white text-sm mb-2 transition-colors">
                    <Phone size={16} />
                    <span>{barber.phone}</span>
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty, idx) => (
                      <span key={idx} className="bg-primary-800 px-3 py-1 rounded-full text-xs text-primary-300">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/booking/${barberId}`} className="btn-primary w-full py-3 flex items-center justify-center space-x-2">
                  <Calendar size={18} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

