'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  User,
  MapPin,
  Calendar,
  ChevronLeft,
  TrendingUp,
  Flame,
  Search,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock data for demonstration showcase videos
const mockShowcaseVideos = [
  {
    id: 1,
    barber: {
      id: 1,
      name: "Mike Johnson",
      username: "@mikesccuts",
      avatar: "/api/placeholder/40/40",
      verified: true,
      shopName: "Mike's Premium Cuts",
      location: "Downtown, SF"
    },
    video: {
      url: "/api/placeholder/300/600",
      thumbnail: "/api/placeholder/300/600",
      duration: 45
    },
    description: "Clean taper fade transformation 🔥 #fade #transformation #barber",
    music: "Original Audio - Mike Johnson",
    likes: 2840,
    comments: 156,
    shares: 89,
    bookmarks: 432,
    isLiked: false,
    isBookmarked: false,
    tags: ["fade", "transformation", "barber", "beforeafter"],
    createdAt: "2 hours ago",
    trending: true
  },
  {
    id: 2,
    barber: {
      id: 2,
      name: "Sarah Miller", 
      username: "@sarahscuts",
      avatar: "/api/placeholder/40/40",
      verified: true,
      shopName: "Fresh Style Studio",
      location: "Midtown, SF"
    },
    video: {
      url: "/api/placeholder/300/600",
      thumbnail: "/api/placeholder/300/600", 
      duration: 38
    },
    description: "Beard styling tutorial ✨ Book your appointment now! #beardtrim #styling #tutorial",
    music: "Trending Audio",
    likes: 1650,
    comments: 92,
    shares: 45,
    bookmarks: 287,
    isLiked: true,
    isBookmarked: false,
    tags: ["beard", "styling", "tutorial"],
    createdAt: "5 hours ago",
    trending: false
  },
  {
    id: 3,
    barber: {
      id: 3,
      name: "Tony Rodriguez",
      username: "@tonysbarber",
      avatar: "/api/placeholder/40/40",
      verified: false,
      shopName: "Classic Cuts",
      location: "Oakland, CA"
    },
    video: {
      url: "/api/placeholder/300/600",
      thumbnail: "/api/placeholder/300/600",
      duration: 52
    },
    description: "Scissor over comb technique 💯 Years of practice pays off #classic #technique #barberskills",
    music: "Lo-fi Beats",
    likes: 890,
    comments: 67,
    shares: 23,
    bookmarks: 156,
    isLiked: false,
    isBookmarked: true,
    tags: ["classic", "technique", "scissors"],
    createdAt: "1 day ago",
    trending: false
  },
  {
    id: 4,
    barber: {
      id: 4,
      name: "Alex Chen",
      username: "@alexcuts",
      avatar: "/api/placeholder/40/40",
      verified: true,
      shopName: "Modern Edge",
      location: "South Bay, CA"
    },
    video: {
      url: "/api/placeholder/300/600",
      thumbnail: "/api/placeholder/300/600",
      duration: 41
    },
    description: "Textured crop with razor fade 🔥 What do you think? #texturedcrop #modern #fade",
    music: "Hip Hop Beats",
    likes: 3240,
    comments: 201,
    shares: 134,
    bookmarks: 567,
    isLiked: false,
    isBookmarked: false,
    tags: ["textured", "crop", "modern", "fade"],
    createdAt: "3 hours ago",
    trending: true
  }
]

export default function ShowcasePage() {
  const router = useRouter()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [videos, setVideos] = useState(mockShowcaseVideos)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'trending' | 'following' | 'nearby'>('all')
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const currentVideo = videos[currentVideoIndex]

  // Handle video play/pause
  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[currentVideoIndex]
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause()
      } else {
        currentVideo.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle mute/unmute
  const toggleMute = () => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.muted = !isMuted
      }
    })
    setIsMuted(!isMuted)
  }

  // Handle like
  const handleLike = (videoId: number) => {
    setVideos(prev => prev.map((video: typeof mockShowcaseVideos[0]) => 
      video.id === videoId 
        ? { 
            ...video, 
            isLiked: !video.isLiked, 
            likes: video.isLiked ? video.likes - 1 : video.likes + 1 
          }
        : video
    ))
  }

  // Handle bookmark
  const handleBookmark = (videoId: number) => {
    setVideos(prev => prev.map((video: typeof mockShowcaseVideos[0]) =>
      video.id === videoId
        ? {
            ...video,
            isBookmarked: !video.isBookmarked,
            bookmarks: video.isBookmarked ? video.bookmarks - 1 : video.bookmarks + 1
          }
        : video
    ))
  }

  // Handle scroll to change videos
  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(currentVideoIndex - 1)
      } else if (e.key === 'ArrowDown' && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1)
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex, isPlaying])

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-display font-bold text-xl text-white">Showcase</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="text-white hover:text-gray-300 transition-colors">
              <Search size={20} />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-6 px-4 pb-3">
          {[
            { key: 'all' as const, label: 'All', icon: null },
            { key: 'trending' as const, label: 'Trending', icon: <TrendingUp size={14} /> },
            { key: 'following' as const, label: 'Following', icon: <User size={14} /> },
            { key: 'nearby' as const, label: 'Nearby', icon: <MapPin size={14} /> }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                selectedFilter === filter.key 
                  ? 'text-accent-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="h-full relative"
        onWheel={handleScroll}
      >
        {/* Video Container */}
        <div className="h-full w-full relative">
          {/* Background Video */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center">
            <div className="text-center text-primary-300">
              <div className="w-32 h-48 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Play size={32} />
              </div>
              <p>Video Player</p>
              <p className="text-sm mt-1">Video {currentVideoIndex + 1} of {videos.length}</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-20 left-4 right-4">
            <div className="w-full bg-white/20 h-1 rounded-full">
              <div className="bg-white h-1 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>

        {/* Video Information Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-8">
          <div className="flex items-end justify-between">
            {/* Left Side - Video Info */}
            <div className="flex-1 pr-4">
              {/* Barber Info */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {videos[currentVideoIndex].barber.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">{videos[currentVideoIndex].barber.username}</span>
                    {videos[currentVideoIndex].barber.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {videos[currentVideoIndex].trending && (
                      <div className="flex items-center space-x-1 bg-red-500 px-2 py-1 rounded-full">
                        <Flame size={10} className="text-white" />
                        <span className="text-white text-xs">Trending</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <span>{videos[currentVideoIndex].barber.shopName}</span>
                    <span>•</span>
                    <span>{videos[currentVideoIndex].createdAt}</span>
                  </div>
                </div>
                <Link 
                  href={`/barber/${videos[currentVideoIndex].barber.id}`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Book Now
                </Link>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p className="text-white text-sm leading-relaxed">
                  {videos[currentVideoIndex].description}
                </p>
              </div>

              {/* Music */}
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-spin"></div>
                <span>{videos[currentVideoIndex].music}</span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-1 text-gray-400 text-xs mt-1">
                <MapPin size={12} />
                <span>{videos[currentVideoIndex].barber.location}</span>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col space-y-4">
              {/* Like */}
              <div className="text-center">
                <button
                  onClick={() => handleLike(videos[currentVideoIndex].id)}
                  className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors group"
                >
                  <Heart 
                    size={24} 
                    className={`transition-colors ${
                      videos[currentVideoIndex].isLiked 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-white group-hover:text-red-400'
                    }`} 
                  />
                </button>
                <span className="text-white text-xs font-medium mt-1 block">
                  {videos[currentVideoIndex].likes.toLocaleString()}
                </span>
              </div>

              {/* Comment */}
              <div className="text-center">
                <button className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                  <MessageCircle size={24} className="text-white" />
                </button>
                <span className="text-white text-xs font-medium mt-1 block">
                  {videos[currentVideoIndex].comments}
                </span>
              </div>

              {/* Share */}
              <div className="text-center">
                <button className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                  <Share size={24} className="text-white" />
                </button>
                <span className="text-white text-xs font-medium mt-1 block">
                  {videos[currentVideoIndex].shares}
                </span>
              </div>

              {/* Bookmark */}
              <div className="text-center">
                <button
                  onClick={() => handleBookmark(videos[currentVideoIndex].id)}
                  className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors group"
                >
                  <Bookmark 
                    size={24} 
                    className={`transition-colors ${
                      videos[currentVideoIndex].isBookmarked 
                        ? 'text-accent-400 fill-accent-400' 
                        : 'text-white group-hover:text-accent-400'
                    }`} 
                  />
                </button>
                <span className="text-white text-xs font-medium mt-1 block">
                  {videos[currentVideoIndex].bookmarks}
                </span>
              </div>

              {/* More */}
              <div className="text-center">
                <button className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                  <MoreHorizontal size={24} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Controls */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
          </button>
        </div>

        {/* Navigation Indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col space-y-1">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-1 h-8 rounded-full transition-colors ${
                  index === currentVideoIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Swipe Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-white/60 text-xs">
          <span>↑↓ Navigate</span>
          <span>Space to pause</span>
          <span>Scroll to browse</span>
        </div>
      </div>

      {/* Comments Modal (would be implemented separately) */}
      {/* Share Modal (would be implemented separately) */}
    </div>
  )
}
