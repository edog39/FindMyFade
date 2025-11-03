'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Send, 
  MessageSquare, 
  Star, 
  Lightbulb, 
  Bug, 
  Heart,
  CheckCircle,
  Mail
} from 'lucide-react'

export default function FeedbackPage() {
  const router = useRouter()
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'compliment' | 'feature'>('suggestion')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const feedbackTypes = [
    {
      id: 'suggestion',
      label: 'Suggestion',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      description: 'Share ideas to improve FindMyFade'
    },
    {
      id: 'bug',
      label: 'Bug Report',
      icon: Bug,
      color: 'from-red-500 to-pink-500',
      description: 'Report issues or problems you found'
    },
    {
      id: 'compliment',
      label: 'Compliment',
      icon: Heart,
      color: 'from-pink-500 to-purple-500',
      description: 'Let us know what you love!'
    },
    {
      id: 'feature',
      label: 'Feature Request',
      icon: Star,
      color: 'from-blue-500 to-cyan-500',
      description: 'Request new features or improvements'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)

    try {
      // Create mailto link with all the details
      const emailSubject = subject || `${feedbackTypes.find(t => t.id === feedbackType)?.label} - FindMyFade App`
      const emailBody = `
Feedback Type: ${feedbackTypes.find(t => t.id === feedbackType)?.label}
From: ${userName || 'Anonymous User'} (${userEmail || 'No email provided'})
Subject: ${emailSubject}

Message:
${message}

---
Sent from FindMyFade App
Date: ${new Date().toLocaleString()}
      `.trim()

      // Create the mailto link
      const mailtoLink = `mailto:FindMyFade@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      
      // Open the user's email client
      window.location.href = mailtoLink

      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setMessage('')
        setSubject('')
        setUserEmail('')
        setUserName('')
      }, 3000)

    } catch (error) {
      console.error('Error sending feedback:', error)
      alert('Error sending feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
                <h1 className="font-display font-bold text-2xl text-white">Feedback & Suggestions</h1>
                <p className="text-primary-300">Help us improve FindMyFade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitted ? (
          /* Success State */
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="font-bold text-2xl text-white mb-3">Thank You! 🎉</h2>
            <p className="text-primary-300 mb-4">
              Your feedback has been sent to our team at FindMyFade@gmail.com
            </p>
            <p className="text-primary-400 text-sm">
              We appreciate you taking the time to help us improve!
            </p>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type Selector */}
            <div className="card">
              <h3 className="font-semibold text-white text-lg mb-4">What type of feedback do you have?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbackTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id as any)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        feedbackType === type.id
                          ? 'border-accent-500 bg-accent-500/20'
                          : 'border-primary-700 bg-primary-800/30 hover:border-primary-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-full flex items-center justify-center`}>
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{type.label}</h4>
                          <p className="text-primary-300 text-sm">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="card">
              <h3 className="font-semibold text-white text-lg mb-4">Your Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-primary-300 text-sm font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="input w-full"
                  />
                </div>
              </div>
              <p className="text-primary-400 text-xs mt-2">
                💡 Providing your email helps us follow up on your feedback if needed
              </p>
            </div>

            {/* Feedback Content */}
            <div className="card">
              <h3 className="font-semibold text-white text-lg mb-4">Your Feedback</h3>
              
              <div className="mb-4">
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={`${feedbackTypes.find(t => t.id === feedbackType)?.label} about...`}
                  className="input w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-primary-300 text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us your thoughts, ideas, or issues you've encountered..."
                  rows={6}
                  className="input w-full resize-none"
                  required
                />
                <p className="text-primary-400 text-xs mt-1">
                  {message.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="w-full btn-primary py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Feedback...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send to FindMyFade@gmail.com</span>
                  </>
                )}
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Mail size={20} className="text-blue-400" />
                <h4 className="text-blue-400 font-semibold">Direct Contact</h4>
              </div>
              <p className="text-primary-300 text-sm">
                You can also email us directly at{' '}
                <a 
                  href="mailto:FindMyFade@gmail.com" 
                  className="text-blue-400 hover:text-blue-300 underline font-medium"
                >
                  FindMyFade@gmail.com
                </a>
              </p>
              <p className="text-primary-400 text-xs mt-2">
                We typically respond within 24-48 hours!
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
