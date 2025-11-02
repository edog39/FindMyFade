'use client'

import { useState } from 'react'
import { 
  ChevronDown,
  ChevronLeft,
  Search,
  HelpCircle,
  Calendar,
  CreditCard,
  MapPin,
  Camera,
  MessageCircle,
  Shield,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const faqCategories = [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    questions: [
      {
        question: 'What is FindMyFade?',
        answer: 'FindMyFade is the ultimate platform for discovering, booking, and connecting with top-rated barbers in your area. We use AI technology to help you find the perfect hairstyle and make booking appointments easier than ever.'
      },
      {
        question: 'Is FindMyFade free to use?',
        answer: 'Yes! FindMyFade is completely free for clients. You can search for barbers, view profiles, read reviews, and book appointments at no cost. You only pay for the actual barber services when you get your haircut.'
      },
      {
        question: 'How do I create an account?',
        answer: 'Click the "Get Started" or "Sign Up" button in the top navigation. You can create an account using your email, or sign up with Google or Facebook for faster access.'
      },
      {
        question: 'What areas does FindMyFade cover?',
        answer: 'FindMyFade is available nationwide across the United States. We partner with barbers in major cities and surrounding areas, with new locations being added regularly.'
      }
    ]
  },
  {
    id: 'booking',
    name: 'Booking',
    icon: Calendar,
    questions: [
      {
        question: 'How do I book an appointment?',
        answer: 'Simply search for barbers in your area, browse their profiles, select a service, choose an available time slot from their calendar, and confirm your booking. You\'ll receive instant confirmation via email and SMS.'
      },
      {
        question: 'Can I cancel or reschedule my appointment?',
        answer: 'Yes! You can cancel or reschedule your appointment up to 24 hours before the scheduled time. Go to your bookings page, select the appointment, and choose "Reschedule" or "Cancel". Please note that cancellations within 24 hours may incur a fee.'
      },
      {
        question: 'What if I\'m running late?',
        answer: 'Contact your barber directly through our messaging feature as soon as possible. Most barbers appreciate a heads-up and may be able to accommodate you, though they may need to shorten your appointment or reschedule.'
      },
      {
        question: 'Can I book for multiple people?',
        answer: 'Absolutely! When booking, you can select multiple time slots or book back-to-back appointments for your group. Some barbers also offer group booking discounts.'
      },
      {
        question: 'How far in advance can I book?',
        answer: 'You can book appointments up to 30 days in advance, depending on the barber\'s availability. Popular time slots fill up fast, so we recommend booking early!'
      }
    ]
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: CreditCard,
    questions: [
      {
        question: 'How much do services cost?',
        answer: 'Pricing varies by barber, location, and service type. You\'ll see exact prices on each barber\'s profile before booking. Most basic cuts range from $25-$60, with specialty services priced accordingly.'
      },
      {
        question: 'Can I pay online?',
        answer: 'Yes! We offer secure online payment through credit/debit cards, Apple Pay, and Google Pay. You can also choose to pay at the shop if the barber offers that option.'
      },
      {
        question: 'What is the prepay discount?',
        answer: 'When you pay in advance through FindMyFade, many barbers offer a 10% discount. This helps them reduce no-shows and passes the savings on to you!'
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees! The price you see is the price you pay. If you choose to leave a tip for your barber, you can add that during checkout or at the shop.'
      },
      {
        question: 'What is your refund policy?',
        answer: 'If you prepaid and cancel within the allowed timeframe (24+ hours before), you\'ll receive a full refund. Late cancellations may forfeit the deposit. If you\'re unsatisfied with your service, contact us within 24 hours to discuss a resolution.'
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI Style Match',
    icon: Camera,
    questions: [
      {
        question: 'How does the AI Style Match work?',
        answer: 'Our AI analyzes your facial features, face shape, and bone structure from your uploaded photo. It then recommends hairstyles that complement your unique features and shows you before/after previews.'
      },
      {
        question: 'Is my photo stored or shared?',
        answer: 'Your photos are processed securely and encrypted. We use them only for AI analysis and do not share them with third parties. You can delete your photos from your account settings at any time.'
      },
      {
        question: 'Can I try the AI feature without an account?',
        answer: 'Yes! You can use the AI Style Match feature as a guest. However, creating an account lets you save your results and easily share them with your barber.'
      },
      {
        question: 'What if I don\'t like the AI recommendations?',
        answer: 'The AI provides suggestions based on facial analysis, but you always have the final say! Browse barber portfolios to find styles you love, or message barbers directly to discuss your preferences.'
      }
    ]
  },
  {
    id: 'barbers',
    name: 'For Barbers',
    icon: Star,
    questions: [
      {
        question: 'How can I list my barbershop?',
        answer: 'Click "For Barbers" in the footer or contact us directly. We\'ll guide you through the verification process, set up your profile, and get you started with online bookings within 24 hours.'
      },
      {
        question: 'What does it cost for barbers?',
        answer: 'We offer flexible pricing plans starting at $29/month, which includes profile listing, online booking, payment processing, and marketing tools. Contact us for custom enterprise pricing.'
      },
      {
        question: 'How do barbers get paid?',
        answer: 'Barbers receive payouts via direct deposit on a weekly basis for all prepaid appointments. There\'s a small processing fee (2.9% + $0.30 per transaction) similar to other payment platforms.'
      },
      {
        question: 'Can barbers control their own schedule?',
        answer: 'Absolutely! Barbers have full control over their availability, working hours, services offered, and pricing. They can also block off personal time or set recurring schedules.'
      }
    ]
  },
  {
    id: 'support',
    name: 'Support & Safety',
    icon: Shield,
    questions: [
      {
        question: 'How do I contact customer support?',
        answer: 'You can reach our support team 24/7 via the chat button in the bottom right, email us at support@findmyfade.com, or call us at 1-800-FINDCUT. Average response time is under 2 hours.'
      },
      {
        question: 'Are barbers verified?',
        answer: 'Yes! All barbers on FindMyFade go through a verification process including license validation, background checks, and portfolio review. Verified barbers have a checkmark badge on their profile.'
      },
      {
        question: 'What if I have a bad experience?',
        answer: 'We take customer satisfaction seriously. Contact us immediately if you have any issues. We\'ll mediate with the barber and, if warranted, issue refunds or credits for future services.'
      },
      {
        question: 'How do reviews work?',
        answer: 'Only verified customers who completed appointments can leave reviews. Reviews are moderated to prevent fake or spam reviews. Barbers can respond to reviews but cannot remove legitimate feedback.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Absolutely. We use bank-level encryption (SSL/TLS) for all data transmission, and your payment information is processed through PCI-compliant payment processors. We never store full credit card numbers.'
      }
    ]
  }
]

export default function FAQPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const key = `${categoryId}-${questionIndex}`
    setOpenQuestions(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    selectedCategory ? category.id === selectedCategory : category.questions.length > 0
  )

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
                  Frequently Asked Questions
                </h1>
                <p className="text-primary-300">Find answers to common questions about FindMyFade</p>
              </div>
            </div>
            <Link href="/" className="text-accent-500 hover:text-accent-400 transition-colors font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 bg-primary-800/50 backdrop-blur-sm border-2 border-primary-600 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              !selectedCategory
                ? 'bg-accent-500 text-black shadow-lg'
                : 'bg-primary-800/50 text-primary-300 hover:bg-primary-700/50'
            }`}
          >
            All Topics
          </button>
          {faqCategories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-accent-500 text-black shadow-lg'
                    : 'bg-primary-800/50 text-primary-300 hover:bg-primary-700/50'
                }`}
              >
                <Icon size={18} />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.id}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-black" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-white">
                    {category.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((item, index) => {
                    const isOpen = openQuestions.includes(`${category.id}-${index}`)
                    return (
                      <div
                        key={index}
                        className="card hover:border-accent-500/30 transition-all duration-200"
                      >
                        <button
                          onClick={() => toggleQuestion(category.id, index)}
                          className="w-full flex items-start justify-between text-left"
                        >
                          <h3 className="font-semibold text-lg text-white pr-4 flex-1">
                            {item.question}
                          </h3>
                          <ChevronDown
                            size={24}
                            className={`text-accent-500 flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-96 mt-4' : 'max-h-0'
                          }`}
                        >
                          <div className="pt-4 border-t border-primary-700">
                            <p className="text-primary-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {filteredCategories.every(cat => cat.questions.length === 0) && (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-primary-400" />
              </div>
              <h3 className="font-semibold text-white text-xl mb-2">No results found</h3>
              <p className="text-primary-300">
                Try adjusting your search or browse all categories
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="card bg-gradient-to-r from-accent-500/10 to-accent-600/10 border-2 border-accent-500/30 text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">
              Still Have Questions?
            </h3>
            <p className="text-primary-300 mb-6 max-w-xl mx-auto">
              Can't find what you're looking for? Our support team is here to help 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-3">
                <MessageCircle size={18} className="mr-2" />
                Contact Support
              </Link>
              <a href="mailto:support@findmyfade.com" className="btn-secondary px-8 py-3">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

