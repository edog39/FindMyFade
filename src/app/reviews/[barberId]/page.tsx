'use client'

import { useState } from 'react'
import { 
  Star,
  ThumbsUp,
  ThumbsDown,
  Camera,
  MoreHorizontal,
  Flag,
  CheckCircle,
  User,
  Calendar,
  Filter,
  TrendingUp,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Award,
  Verified
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

const mockBarber = {
  id: 1,
  name: "Mike Johnson",
  shopName: "Mike's Premium Cuts",
  avatar: "/api/placeholder/60/60",
  verified: true,
  totalReviews: 247,
  averageRating: 4.8,
  ratingBreakdown: {
    5: 189,
    4: 41,
    3: 12,
    2: 3,
    1: 2
  },
  responseRate: 89,
  responseTime: "2 hours"
}

const mockReviews = [
  {
    id: 1,
    customer: {
      name: "John D.",
      avatar: "/api/placeholder/40/40",
      verified: true,
      totalReviews: 23,
      level: "Regular"
    },
    rating: 5,
    date: "2024-10-25",
    service: "Classic Fade + Beard Trim",
    comment: "Absolutely incredible experience! Mike's attention to detail is unmatched. He took the time to understand exactly what I wanted and delivered beyond my expectations. The shop has a great atmosphere and the hot towel treatment was a nice touch. I've been to many barbers but Mike is definitely the best in the city. Will be coming back for sure!",
    photos: ["/api/placeholder/200/200", "/api/placeholder/200/200"],
    helpful: 24,
    notHelpful: 1,
    isVerifiedBooking: true,
    barberResponse: {
      text: "Thank you so much John! It was great meeting you and I'm thrilled you're happy with the cut. Looking forward to seeing you again soon!",
      date: "2024-10-25",
      likes: 8
    },
    categories: {
      skill: 5,
      service: 5,
      cleanliness: 5,
      value: 4,
      atmosphere: 5
    }
  },
  {
    id: 2,
    customer: {
      name: "Marcus R.",
      avatar: "/api/placeholder/40/40",
      verified: true,
      totalReviews: 8,
      level: "Newcomer"
    },
    rating: 5,
    date: "2024-10-22",
    service: "Skin Fade",
    comment: "Best fade I've ever gotten! Mike is a true artist. The precision and technique are on another level. Booking was easy through the app and the shop is super clean and professional.",
    photos: ["/api/placeholder/200/200"],
    helpful: 18,
    notHelpful: 0,
    isVerifiedBooking: true,
    barberResponse: null,
    categories: {
      skill: 5,
      service: 5,
      cleanliness: 5,
      value: 5,
      atmosphere: 4
    }
  },
  {
    id: 3,
    customer: {
      name: "Alex M.",
      avatar: "/api/placeholder/40/40",
      verified: false,
      totalReviews: 1,
      level: "New"
    },
    rating: 4,
    date: "2024-10-20",
    service: "Buzz Cut",
    comment: "Good cut but had to wait a bit longer than expected. Mike was friendly and professional though. The result was exactly what I asked for.",
    photos: [],
    helpful: 5,
    notHelpful: 2,
    isVerifiedBooking: true,
    barberResponse: {
      text: "Thanks for the feedback Alex! Sorry about the wait time - we had an emergency that day. I appreciate your patience and I'm glad you're happy with the cut!",
      date: "2024-10-21",
      likes: 3
    },
    categories: {
      skill: 4,
      service: 3,
      cleanliness: 5,
      value: 4,
      atmosphere: 4
    }
  },
  {
    id: 4,
    customer: {
      name: "David K.",
      avatar: "/api/placeholder/40/40",
      verified: true,
      totalReviews: 156,
      level: "Expert"
    },
    rating: 5,
    date: "2024-10-18",
    service: "Classic Cut + Hot Towel Shave",
    comment: "Been going to barbers for 20+ years and Mike is hands down one of the best I've encountered. The hot towel shave was luxurious and the cut was perfect. Highly recommend!",
    photos: ["/api/placeholder/200/200", "/api/placeholder/200/200", "/api/placeholder/200/200"],
    helpful: 31,
    notHelpful: 0,
    isVerifiedBooking: true,
    barberResponse: {
      text: "Wow, thank you David! Coming from someone with your experience, this means the world to me. It was an honor to serve you!",
      date: "2024-10-18",
      likes: 12
    },
    categories: {
      skill: 5,
      service: 5,
      cleanliness: 5,
      value: 5,
      atmosphere: 5
    }
  }
]

const categoryLabels = {
  skill: "Skill & Technique",
  service: "Customer Service",
  cleanliness: "Cleanliness",
  value: "Value for Money",
  atmosphere: "Shop Atmosphere"
}

export default function ReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [showWithPhotos, setShowWithPhotos] = useState(false)
  const [expandedReview, setExpandedReview] = useState<number | null>(null)
  const [expandedPhotos, setExpandedPhotos] = useState<number | null>(null)

  const filteredReviews = mockReviews.filter(review => {
    if (filterRating && review.rating !== filterRating) return false
    if (showVerifiedOnly && !review.customer.verified) return false
    if (showWithPhotos && review.photos.length === 0) return false
    return true
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return b.helpful - a.helpful
      default: // newest
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const handleHelpful = (reviewId: number, type: 'helpful' | 'notHelpful') => {
    console.log(`Marked review ${reviewId} as ${type}`)
  }

  const handleReport = (reviewId: number) => {
    console.log(`Reported review ${reviewId}`)
  }

  const calculateAverageCategory = (category: keyof typeof categoryLabels) => {
    const total = mockReviews.reduce((sum, review) => sum + (review.categories[category] || 0), 0)
    return total / mockReviews.length
  }

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
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-primary-200 text-sm">MJ</span>
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl text-white">{mockBarber.shopName} Reviews</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                      <span className="text-white font-medium">{mockBarber.averageRating}</span>
                      <span className="text-primary-300">({mockBarber.totalReviews} reviews)</span>
                    </div>
                    {mockBarber.verified && (
                      <div className="flex items-center space-x-1 text-green-500">
                        <Verified size={14} />
                        <span className="text-xs">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rating Overview */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">{mockBarber.averageRating}</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(mockBarber.averageRating)
                        ? 'fill-accent-500 text-accent-500'
                        : 'text-primary-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-primary-300">Based on {mockBarber.totalReviews} reviews</div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = mockBarber.ratingBreakdown[rating as keyof typeof mockBarber.ratingBreakdown]
                const percentage = (count / mockBarber.totalReviews) * 100
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-primary-300 text-sm">{rating}</span>
                      <Star className="w-3 h-3 fill-accent-500 text-accent-500" />
                    </div>
                    <div className="flex-1 bg-primary-700 rounded-full h-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-primary-300 text-sm w-8">{count}</span>
                  </div>
                )
              })}
            </div>

            {/* Category Ratings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Detailed Ratings</h3>
              {Object.entries(categoryLabels).map(([key, label]) => {
                const avg = calculateAverageCategory(key as keyof typeof categoryLabels)
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-primary-300 text-sm">{label}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= Math.round(avg)
                                ? 'fill-accent-500 text-accent-500'
                                : 'text-primary-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white text-sm font-medium">{avg.toFixed(1)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Response Stats */}
          <div className="border-t border-primary-700 mt-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent-500">{mockBarber.responseRate}%</div>
                <div className="text-primary-300 text-sm">Response Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-500">{mockBarber.responseTime}</div>
                <div className="text-primary-300 text-sm">Avg Response Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center space-x-4">
              <div>
                <label className="text-primary-300 text-sm mr-2">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-primary-700 border border-primary-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>

              <div>
                <label className="text-primary-300 text-sm mr-2">Rating:</label>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setFilterRating(null)}
                    className={`px-2 py-1 rounded text-sm ${
                      filterRating === null ? 'bg-accent-500 text-black' : 'bg-primary-700 text-primary-300'
                    }`}
                  >
                    All
                  </button>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={`px-2 py-1 rounded text-sm ${
                        filterRating === rating ? 'bg-accent-500 text-black' : 'bg-primary-700 text-primary-300'
                      }`}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                  className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                />
                <span className="text-primary-300 text-sm">Verified only</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWithPhotos}
                  onChange={(e) => setShowWithPhotos(e.target.checked)}
                  className="rounded border-primary-600 bg-primary-800 text-accent-500 focus:ring-accent-500"
                />
                <span className="text-primary-300 text-sm">With photos</span>
              </label>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.map(review => (
            <div key={review.id} className="card">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-primary-200 text-sm font-medium">
                      {review.customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{review.customer.name}</span>
                      {review.customer.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        review.customer.level === 'Expert' ? 'bg-purple-500/20 text-purple-400' :
                        review.customer.level === 'Regular' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {review.customer.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-primary-400">
                      <span>{review.customer.totalReviews} reviews</span>
                      <span>•</span>
                      <span>{review.date}</span>
                      {review.isVerifiedBooking && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1 text-green-500">
                            <CheckCircle size={12} />
                            <span>Verified Booking</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-accent-500 text-accent-500'
                            : 'text-primary-600'
                        }`}
                      />
                    ))}
                  </div>
                  <button className="text-primary-400 hover:text-white p-1">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              {/* Service Info */}
              <div className="mb-3">
                <span className="text-accent-500 text-sm font-medium bg-accent-500/10 px-2 py-1 rounded-full">
                  {review.service}
                </span>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className={`text-primary-200 leading-relaxed ${
                  expandedReview === review.id ? '' : 'line-clamp-3'
                }`}>
                  {review.comment}
                </p>
                {review.comment.length > 200 && (
                  <button
                    onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                    className="text-accent-500 text-sm hover:text-accent-400 mt-2"
                  >
                    {expandedReview === review.id ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              {/* Category Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                {Object.entries(review.categories).map(([key, rating]) => (
                  <div key={key} className="text-center">
                    <div className="text-accent-500 font-medium text-sm">{rating}</div>
                    <div className="text-primary-400 text-xs">{categoryLabels[key as keyof typeof categoryLabels]}</div>
                  </div>
                ))}
              </div>

              {/* Photos */}
              {review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Camera className="w-4 h-4 text-primary-400" />
                    <span className="text-primary-300 text-sm">{review.photos.length} photos</span>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {review.photos.slice(0, expandedPhotos === review.id ? undefined : 3).map((photo, index) => (
                      <div key={index} className="aspect-square bg-primary-700 rounded-lg flex items-center justify-center overflow-hidden">
                        <span className="text-primary-400 text-xs">Photo {index + 1}</span>
                      </div>
                    ))}
                    {review.photos.length > 3 && expandedPhotos !== review.id && (
                      <button
                        onClick={() => setExpandedPhotos(review.id)}
                        className="aspect-square bg-primary-700/50 border-2 border-dashed border-primary-600 rounded-lg flex items-center justify-center text-primary-400 hover:text-white transition-colors"
                      >
                        <span className="text-xs">+{review.photos.length - 3}</span>
                      </button>
                    )}
                  </div>
                  {expandedPhotos === review.id && review.photos.length > 3 && (
                    <button
                      onClick={() => setExpandedPhotos(null)}
                      className="text-accent-500 text-sm hover:text-accent-400 mt-2"
                    >
                      Show less
                    </button>
                  )}
                </div>
              )}

              {/* Barber Response */}
              {review.barberResponse && (
                <div className="bg-primary-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                      <span className="text-black text-xs font-bold">M</span>
                    </div>
                    <div>
                      <span className="text-white font-medium">{mockBarber.name}</span>
                      <span className="text-primary-400 text-sm ml-2">• {review.barberResponse.date}</span>
                    </div>
                  </div>
                  <p className="text-primary-200 text-sm">{review.barberResponse.text}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="flex items-center space-x-1 text-primary-400 hover:text-white">
                      <ThumbsUp size={14} />
                      <span className="text-xs">{review.barberResponse.likes}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-primary-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpful(review.id, 'helpful')}
                    className="flex items-center space-x-2 text-primary-400 hover:text-green-400 transition-colors"
                  >
                    <ThumbsUp size={16} />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                  <button
                    onClick={() => handleHelpful(review.id, 'notHelpful')}
                    className="flex items-center space-x-2 text-primary-400 hover:text-red-400 transition-colors"
                  >
                    <ThumbsDown size={16} />
                    <span className="text-sm">{review.notHelpful}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-primary-400 hover:text-white transition-colors">
                    <MessageCircle size={16} />
                  </button>
                  <button
                    onClick={() => handleReport(review.id)}
                    className="text-primary-400 hover:text-red-400 transition-colors"
                  >
                    <Flag size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="btn-secondary px-6 py-3">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  )
}
