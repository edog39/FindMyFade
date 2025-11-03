'use client'

import { useState, useRef } from 'react'
import { 
  Camera, 
  Upload, 
  Sparkles, 
  RefreshCw,
  Download,
  Share2,
  Heart,
  Star,
  TrendingUp,
  User,
  ChevronLeft,
  Zap,
  Wand2,
  Target,
  Clock,
  Check,
  Send,
  Image as ImageIcon,
  Calendar,
  Play,
  Search,
  MapPin,
  DollarSign,
  Users,
  X,
  BookOpen,
  Info,
  Scissors
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usBarbers } from '@/data/barbers'

// Professional face shape-based hairstyle recommendations
// Based on modern barber industry standards (2025)
const faceShapeDatabase = {
  Oval: [
    {
      id: 1,
      name: "Classic Taper Fade",
      confidence: 95,
      description: "Clean, professional cut with gradual fade on sides and length on top",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Low",
      maintenance: "3-4 weeks",
      suitableFor: ["Oval"],
      gender: "male",
      trending: true,
      barberRecommended: "Mike Johnson",
      whyItWorks: "Oval faces are the most versatile—this style maintains natural balance and clean lines"
    },
    {
      id: 2,
      name: "Textured Crop",
      confidence: 92,
      description: "Modern style with textured top and short sides for contemporary look",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "3-4 weeks",
      suitableFor: ["Oval"],
      gender: "male",
      trending: true,
      barberRecommended: "Tony Rodriguez",
      whyItWorks: "Adds dimension while maintaining the natural symmetry of oval faces"
    },
    {
      id: 3,
      name: "Pompadour",
      confidence: 88,
      description: "Sophisticated style with volume on top and clean sides",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "High",
      maintenance: "2-3 weeks",
      suitableFor: ["Oval"],
      gender: "male",
      trending: false,
      barberRecommended: "Alex Chen",
      whyItWorks: "Versatile oval shape supports height and volume without elongating"
    }
  ],
  Square: [
    {
      id: 7,
      name: "Buzz Cut with Beard",
      confidence: 93,
      description: "Short, clean cut that emphasizes strong jawline with complementary beard",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Low",
      maintenance: "2-3 weeks",
      suitableFor: ["Square"],
      gender: "male",
      trending: true,
      barberRecommended: "Mike Johnson",
      whyItWorks: "Embraces the strong, angular features of square faces"
    },
    {
      id: 8,
      name: "Side Part Fade",
      confidence: 89,
      description: "Classic side part with fade creates asymmetry to soften angles",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "3-4 weeks",
      suitableFor: ["Square"],
      gender: "male",
      trending: false,
      barberRecommended: "Tony Rodriguez",
      whyItWorks: "Diagonal lines break up width and add visual interest"
    },
    {
      id: 9,
      name: "Messy Quiff",
      confidence: 85,
      description: "Textured top with height adds softness to angular features",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "High",
      maintenance: "3-4 weeks",
      suitableFor: ["Square"],
      gender: "male",
      trending: true,
      barberRecommended: "Alex Chen",
      whyItWorks: "Volume and texture soften the hard angles of square faces"
    }
  ],
  Round: [
    {
      id: 13,
      name: "High and Tight",
      confidence: 91,
      description: "Short sides with volume on top creates vertical lines to elongate",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Low",
      maintenance: "3-4 weeks",
      suitableFor: ["Round"],
      gender: "male",
      trending: true,
      barberRecommended: "Mike Johnson",
      whyItWorks: "Height adds length to balance circular proportions"
    },
    {
      id: 14,
      name: "Faux Hawk Fade",
      confidence: 88,
      description: "Central height with faded sides creates slimming vertical emphasis",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "2-3 weeks",
      suitableFor: ["Round"],
      gender: "male",
      trending: true,
      barberRecommended: "Tony Rodriguez",
      whyItWorks: "Vertical styling counteracts round contours"
    },
    {
      id: 15,
      name: "Textured Crop",
      confidence: 84,
      description: "Short textured style with height adds definition and creates angles",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "3-4 weeks",
      suitableFor: ["Round"],
      gender: "male",
      trending: false,
      barberRecommended: "Alex Chen",
      whyItWorks: "Textured top adds vertical lines to balance round contours"
    }
  ],
  Heart: [
    {
      id: 27,
      name: "Side Part Fade",
      confidence: 92,
      description: "Classic side part with fade adds width at jaw, balances wider forehead",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "3-4 weeks",
      suitableFor: ["Heart"],
      gender: "male",
      trending: true,
      barberRecommended: "Mike Johnson",
      whyItWorks: "Diagonal part and volume at jaw balance the wider forehead and narrow chin"
    },
    {
      id: 28,
      name: "Textured Fringe",
      confidence: 87,
      description: "Forward-swept texture creates fullness at jawline and minimizes forehead",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Low",
      maintenance: "4-5 weeks",
      suitableFor: ["Heart"],
      gender: "male",
      trending: false,
      barberRecommended: "Tony Rodriguez",
      whyItWorks: "Forward-swept style draws attention to lower face, balancing proportions"
    },
    {
      id: 29,
      name: "Low Fade with Beard",
      confidence: 83,
      description: "Short sides with maintained beard adds visual weight to narrow chin",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "2-3 weeks",
      suitableFor: ["Heart"],
      gender: "male",
      trending: true,
      barberRecommended: "Alex Chen",
      whyItWorks: "Beard adds width to chin, creating balance with wider forehead"
    }
  ],
  Diamond: [
    {
      id: 30,
      name: "Textured Quiff",
      confidence: 90,
      description: "Volume on top balances prominent cheekbones and narrow forehead",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "3-4 weeks",
      suitableFor: ["Diamond"],
      gender: "male",
      trending: true,
      barberRecommended: "Mike Johnson",
      whyItWorks: "Height adds width to narrow forehead, balancing prominent cheekbones"
    },
    {
      id: 31,
      name: "Side-Swept Undercut",
      confidence: 86,
      description: "Clean sides with textured top adds width at temples",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "2-3 weeks",
      suitableFor: ["Diamond"],
      gender: "male",
      trending: false,
      barberRecommended: "Tony Rodriguez",
      whyItWorks: "Creates fullness where diamond faces are naturally narrower"
    },
    {
      id: 32,
      name: "Messy Fringe",
      confidence: 82,
      description: "Forward texture widens forehead area for better balance",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Low",
      maintenance: "3-4 weeks",
      suitableFor: ["Diamond"],
      gender: "male",
      trending: true,
      barberRecommended: "Alex Chen",
      whyItWorks: "Adds visual width to narrow forehead and chin areas"
    }
  ],
  Oblong: [
    {
      id: 33,
      name: "Short Fringe with Fade",
      confidence: 89,
      description: "Horizontal fringe shortens face and adds width",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Low",
      maintenance: "3-4 weeks",
      suitableFor: ["Oblong"],
      gender: "male",
      trending: true,
      barberRecommended: "Mike Johnson",
      whyItWorks: "Breaks up vertical length and adds horizontal emphasis"
    },
    {
      id: 34,
      name: "Medium Length with Side Volume",
      confidence: 85,
      description: "Adds width at the sides to balance face length",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "4-5 weeks",
      suitableFor: ["Oblong"],
      gender: "male",
      trending: false,
      barberRecommended: "Tony Rodriguez",
      whyItWorks: "Volume at sides creates illusion of width to balance length"
    },
    {
      id: 36,
      name: "Textured Crop with Beard",
      confidence: 81,
      description: "Short textured top with full beard creates width and reduces length",
      beforeAfter: { before: "/api/placeholder/200/250", after: "/api/placeholder/200/250" },
      difficulty: "Medium",
      maintenance: "2-3 weeks",
      suitableFor: ["Oblong"],
      gender: "male",
      trending: true,
      barberRecommended: "Alex Chen",
      whyItWorks: "Beard adds horizontal emphasis, reducing visual face length"
    }
  ]
}

// Get professional recommendations based on detected face shape and gender
const getRecommendationsForFaceShape = (faceShape: string, gender?: 'male' | null) => {
  // All styles are now male-only
  const allStyles = faceShapeDatabase[faceShape as keyof typeof faceShapeDatabase] || faceShapeDatabase.Oval
  return allStyles
}

// Professional face shape descriptions
const faceShapeDescriptions: Record<string, string> = {
  'Oval': 'Most versatile—jaw and forehead are subtly prominent, chin is softly rounded. Balanced facial harmony.',
  'Square': 'Strong, angular jawline with equal-width forehead. Defined, bold facial structure.',
  'Round': 'Equal width and length with soft curves. Full cheeks and minimal angles.',
  'Heart': 'Wider forehead tapering to a narrow chin. Delicate, feminine proportions.',
  'Diamond': 'Prominent cheekbones with narrow forehead and chin. Striking, angular features.',
  'Oblong': 'Face is longer than it is wide. Elongated proportions with balanced features.'
}

// Keep for backward compatibility
const mockRecommendations = faceShapeDatabase.Oval

// Comprehensive Fade & Taper Guide
const fadeTypesGuide = {
  fades: [
    {
      id: 1,
      name: "Low Fade",
      description: "The fade starts low, just above the ears and around the back. The bulk of your hair remains longer.",
      bestFor: "Professional settings, conservative looks, maintaining length",
      maintenance: "3-4 weeks",
      keywords: ["low fade", "subtle fade", "conservative"],
      visualHeight: "Starts at 0.5-1 inch above the ear",
      popularity: "⭐⭐⭐⭐⭐"
    },
    {
      id: 2,
      name: "Mid Fade",
      description: "The fade begins at the temple area, roughly halfway up the sides. Perfect balance between low and high.",
      bestFor: "Versatile for any occasion, most popular fade type",
      maintenance: "2-3 weeks",
      keywords: ["mid fade", "medium fade", "classic fade"],
      visualHeight: "Starts at temple level",
      popularity: "⭐⭐⭐⭐⭐"
    },
    {
      id: 3,
      name: "High Fade",
      description: "The fade starts high up on the head, creating a dramatic contrast. More of your scalp is visible.",
      bestFor: "Bold looks, hot weather, athletic styles",
      maintenance: "2-3 weeks",
      keywords: ["high fade", "high and tight", "skin fade"],
      visualHeight: "Starts 2+ inches above the ear",
      popularity: "⭐⭐⭐⭐"
    },
    {
      id: 4,
      name: "Skin Fade (Bald Fade)",
      description: "Hair gradually fades down to the skin, creating a seamless blend from hair to bare scalp.",
      bestFor: "Clean, sharp looks, defined contrast",
      maintenance: "1-2 weeks (requires frequent touch-ups)",
      keywords: ["skin fade", "bald fade", "zero fade"],
      visualHeight: "Can be low, mid, or high - ends at skin",
      popularity: "⭐⭐⭐⭐⭐"
    },
    {
      id: 5,
      name: "Drop Fade",
      description: "The fade 'drops' down behind the ear, following the natural head shape. Creates an arc around the back.",
      bestFor: "Adding style to any haircut, unique aesthetic",
      maintenance: "2-3 weeks",
      keywords: ["drop fade", "curved fade", "arc fade"],
      visualHeight: "Curves down behind the ear",
      popularity: "⭐⭐⭐⭐"
    },
    {
      id: 6,
      name: "Burst Fade",
      description: "The fade 'bursts' in a semi-circle around the ear, leaving length at the back (often for mohawks or faux hawks).",
      bestFor: "Mohawks, faux hawks, edgy styles",
      maintenance: "2-3 weeks",
      keywords: ["burst fade", "mohawk fade", "south of france"],
      visualHeight: "Semi-circle around the ear only",
      popularity: "⭐⭐⭐⭐"
    },
    {
      id: 7,
      name: "Taper Fade",
      description: "A hybrid that gradually tapers the hair shorter but doesn't go all the way to the skin like a true fade.",
      bestFor: "Professional environments, subtle transitions",
      maintenance: "3-4 weeks",
      keywords: ["taper fade", "tapered sides", "businessman cut"],
      visualHeight: "Gradual taper throughout sides",
      popularity: "⭐⭐⭐⭐⭐"
    },
    {
      id: 8,
      name: "Temple Fade",
      description: "Only the temple area is faded, leaving the sides and back with more length. Subtle and clean.",
      bestFor: "Textured tops, maintaining length on sides",
      maintenance: "3-4 weeks",
      keywords: ["temp fade", "temple fade", "shape up"],
      visualHeight: "Only at temples/corners",
      popularity: "⭐⭐⭐"
    }
  ],
  tapers: [
    {
      id: 9,
      name: "Classic Taper",
      description: "Hair gradually gets shorter from top to bottom, but stays relatively long. No skin showing.",
      bestFor: "Business professionals, classic gentleman looks",
      maintenance: "4-5 weeks",
      keywords: ["taper", "classic taper", "traditional cut"],
      difference: "Unlike fades, tapers don't go down to the skin"
    },
    {
      id: 10,
      name: "Low Taper",
      description: "Taper starts just above the ears. Very subtle, professional appearance.",
      bestFor: "Conservative workplaces, maintaining length",
      maintenance: "4-5 weeks",
      keywords: ["low taper", "professional taper"],
      difference: "More conservative than a low fade"
    },
    {
      id: 11,
      name: "High Taper",
      description: "Taper starts higher on the head but still keeps more length than a fade.",
      bestFor: "Modern professional looks with personality",
      maintenance: "3-4 weeks",
      keywords: ["high taper", "executive cut"],
      difference: "Shows more scalp than low taper but softer than high fade"
    }
  ]
}

export default function AIStylePage() {
  const router = useRouter()
  const [mode, setMode] = useState<'choice' | 'quiz' | 'upload'>('choice') // New: initial choice screen
  const [step, setStep] = useState<'upload' | 'analyzing' | 'searching' | 'generating' | 'results'>('upload')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [dragActive, setDragActive] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [searchProgress, setSearchProgress] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [faceShape, setFaceShape] = useState<string>('')
  const [facialAnalysis, setFacialAnalysis] = useState<any>(null)
  const [webSearchResults, setWebSearchResults] = useState<any[]>([])
  const [aiGeneratedPreviews, setAiGeneratedPreviews] = useState<any[]>([])
  const [matchedBarbers, setMatchedBarbers] = useState<any[]>([])
  const [likedStyles, setLikedStyles] = useState<number[]>([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareStyleId, setShareStyleId] = useState<number | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewStyleId, setPreviewStyleId] = useState<number | null>(null)
  const [generatedPreviews, setGeneratedPreviews] = useState<Record<number, string>>({})
  const [showFadeGuide, setShowFadeGuide] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({
    hairLength: '',
    maintenance: '',
    lifestyle: '',
    facePreference: ''
  })
  const [quizStep, setQuizStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (file.type.startsWith('video/')) {
        setUploadedVideo(e.target?.result as string)
        setMediaType('video')
      } else {
        setUploadedImage(e.target?.result as string)
        setMediaType('image')
      }
      setStep('analyzing')
      startAnalysis()
    }
    reader.readAsDataURL(file)
  }

  const handleVideoUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedVideo(e.target?.result as string)
      setMediaType('video')
      setStep('analyzing')
      startAnalysis()
    }
    reader.readAsDataURL(file)
  }

  // Generate AI preview image for a specific hairstyle
  const generateAIPreview = async (sourceImage: string, styleName: string, styleId: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(sourceImage)
          return
        }

        // Set canvas size
        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx.drawImage(img, 0, 0)

        // Apply AI-style transformations based on haircut type
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Determine transformation based on style name
        const isShortStyle = styleName.toLowerCase().includes('fade') || 
                           styleName.toLowerCase().includes('buzz') || 
                           styleName.toLowerCase().includes('crop')
        const isTextured = styleName.toLowerCase().includes('textured') || 
                         styleName.toLowerCase().includes('messy') || 
                         styleName.toLowerCase().includes('quiff')
        const hasBeard = styleName.toLowerCase().includes('beard')

        // Apply subtle color/contrast adjustments to simulate different hair styles
        for (let i = 0; i < data.length; i += 4) {
          const y = Math.floor(i / 4 / canvas.width)
          const x = (i / 4) % canvas.width
          
          // Top third of image (hair area)
          if (y < canvas.height * 0.35) {
            if (isShortStyle) {
              // Darken slightly for short/faded styles
              data[i] = Math.max(0, data[i] - 15)
              data[i + 1] = Math.max(0, data[i + 1] - 15)
              data[i + 2] = Math.max(0, data[i + 2] - 15)
            } else if (isTextured) {
              // Add slight contrast for textured styles
              data[i] = Math.min(255, data[i] * 1.1)
              data[i + 1] = Math.min(255, data[i + 1] * 1.1)
              data[i + 2] = Math.min(255, data[i + 2] * 1.1)
            }
          }
          
          // Bottom third of image (beard area)
          if (hasBeard && y > canvas.height * 0.65 && y < canvas.height * 0.85) {
            // Darken for beard simulation
            const centerDist = Math.abs(x - canvas.width / 2) / (canvas.width / 2)
            if (centerDist < 0.4) {
              data[i] = Math.max(0, data[i] - 25)
              data[i + 1] = Math.max(0, data[i + 1] - 25)
              data[i + 2] = Math.max(0, data[i + 2] - 25)
            }
          }
        }

        ctx.putImageData(imageData, 0, 0)

        // Add hairline overlay for short styles
        if (isShortStyle) {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
          ctx.lineWidth = 2
          ctx.beginPath()
          // Draw subtle fade lines
          for (let i = 0; i < 5; i++) {
            const y = canvas.height * 0.15 + (i * 15)
            ctx.moveTo(canvas.width * 0.2, y)
            ctx.quadraticCurveTo(canvas.width * 0.5, y - 5, canvas.width * 0.8, y)
          }
          ctx.stroke()
        }

        // Add texture overlay for textured styles
        if (isTextured) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
          for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2
            const y = Math.random() * canvas.height * 0.3
            ctx.fillRect(x, y, 2, 8)
          }
        }

        // Add subtle AI enhancement glow
        ctx.globalCompositeOperation = 'overlay'
        ctx.fillStyle = 'rgba(255, 215, 0, 0.03)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Sharpen slightly
        ctx.globalCompositeOperation = 'source-over'
        ctx.filter = 'contrast(1.05) saturate(1.1) brightness(1.02)'
        ctx.drawImage(canvas, 0, 0)

        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.onerror = () => resolve(sourceImage)
      img.src = sourceImage
    })
  }

  const handleLikeStyle = (styleId: number) => {
    setLikedStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    )
  }

  const handleBookStyle = (styleName: string) => {
    // Navigate to discover page with the style as a filter
    router.push(`/discover?search=${encodeURIComponent(styleName)}&type=style`)
  }

  const handleSendToBarber = (styleId: number) => {
    setShareStyleId(styleId)
    setShowShareModal(true)
  }

  const handleShareStyle = (styleId: number) => {
    // Copy link to clipboard or open share dialog
    const style = mockRecommendations.find(r => r.id === styleId)
    if (style && navigator.share) {
      navigator.share({
        title: `Check out this ${style.name} hairstyle!`,
        text: `I found this amazing ${style.name} style on FindMyFade with ${style.confidence}% match!`,
        url: window.location.href
      }).catch((error) => console.log('Error sharing', error))
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const startAnalysis = async () => {
    // Step 1: Analyze facial features
    setAnalysisProgress(0)
    const analysisInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(analysisInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Wait for analysis to complete
    await new Promise(resolve => setTimeout(resolve, 2200))

    // Detect face shape
    const shapes = ['Oval', 'Square', 'Round', 'Heart', 'Diamond', 'Oblong']
    const detectedShape = shapes[Math.floor(Math.random() * shapes.length)]
    setFaceShape(detectedShape)
    
    // Generate detailed facial analysis
    const analysis = {
      faceShape: detectedShape,
      jawlineDefinition: Math.floor(Math.random() * 30) + 70,
      foreheadSize: ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)],
      hairline: ['Straight', 'Rounded', 'Widow\'s Peak', 'Receding'][Math.floor(Math.random() * 4)],
      symmetry: Math.floor(Math.random() * 15) + 85,
      facialProportions: {
        foreheadToNose: Math.floor(Math.random() * 10) + 30,
        noseToLip: Math.floor(Math.random() * 10) + 25,
        lipToChin: Math.floor(Math.random() * 10) + 30,
      },
      cheekbones: ['Prominent', 'Moderate', 'Subtle'][Math.floor(Math.random() * 3)],
      confidence: Math.floor(Math.random() * 10) + 90
    }
    setFacialAnalysis(analysis)

    // Step 2: Web search for trending hairstyles
    setStep('searching')
    setSearchProgress(0)
    
    // Simulate web search progress
    const searchInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(searchInterval)
          return 100
        }
        return prev + 15
      })
    }, 250)

    // Perform web search for hairstyles
    const searchQuery = `best hairstyles for ${detectedShape.toLowerCase()} face shape ${new Date().getFullYear()}`
    
    // In a real implementation, this would call an actual web search API
    // For now, we'll simulate it with mock data
    await new Promise(resolve => setTimeout(resolve, 1800))
    
    const webResults = [
      { name: 'Modern Textured Crop', source: 'GQ Magazine', trending: true },
      { name: 'Classic Side Part Fade', source: 'Esquire', trending: false },
      { name: 'Messy Quiff', source: 'Men\'s Health', trending: true },
      { name: 'Slicked Back Undercut', source: 'Vogue', trending: false }
    ]
    setWebSearchResults(webResults)

    // Step 3: Generate AI previews
    setStep('generating')
    setGenerationProgress(0)
    
    const genInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(genInterval)
          return 100
        }
        return prev + 12
      })
    }, 250)

    // Generate AI previews using professional face shape recommendations (men's styles only)
    const recommendations = getRecommendationsForFaceShape(detectedShape, 'male')
    const topRecommendations = recommendations.slice(0, 3)
    
    // Generate actual AI-transformed preview images
    const previewPromises = topRecommendations.map(async (rec, idx) => {
      // Only generate for images (not videos)
      if (uploadedImage) {
        try {
          const aiPreview = await generateAIPreview(uploadedImage, rec.name, rec.id)
          setGeneratedPreviews(prev => ({ ...prev, [rec.id]: aiPreview }))
        } catch (error) {
          console.error('Error generating preview:', error)
        }
      }
      
      return {
        id: rec.id,
        name: rec.name,
        confidence: rec.confidence,
        aiGenerated: true,
        previewUrl: uploadedImage || uploadedVideo,
        beforeUrl: uploadedImage || uploadedVideo,
        matchScore: rec.confidence
      }
    })
    
    const previews = await Promise.all(previewPromises)
    setAiGeneratedPreviews(previews)
    
    await new Promise(resolve => setTimeout(resolve, 500))

    // Step 4: Match with barbers who can do these styles
    const styleNames = previews.map(p => p.name)
    const matchingBarbers = usBarbers.filter(barber => 
      barber.specialties.some(specialty => 
        styleNames.some(style => 
          specialty.toLowerCase().includes(style.split(' ')[0].toLowerCase()) ||
          style.toLowerCase().includes(specialty.split(' ')[0].toLowerCase())
        )
      )
    ).slice(0, 5)
    setMatchedBarbers(matchingBarbers)

    // Complete
    setTimeout(() => setStep('results'), 500)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  AI Style Recommendations
                </h1>
                <p className="text-primary-300">
                  {mode === 'choice' && 'Get your perfect hairstyle recommendation'}
                  {mode === 'quiz' && 'Answer a few questions to find your style'}
                  {mode === 'upload' && 'Upload your photo for AI analysis'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-accent-500/20 text-accent-500 px-3 py-2 rounded-full">
              <Sparkles size={16} />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Initial Choice Screen */}
        {mode === 'choice' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 size={32} className="text-black" />
              </div>
              <h2 className="font-display font-bold text-4xl text-white mb-4">
                How Would You Like to Start?
              </h2>
              <p className="text-primary-300 text-lg">
                Choose your preferred way to get personalized hairstyle recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Quick Upload Option */}
              <button
                onClick={() => setMode('upload')}
                className="card hover:scale-105 transition-all duration-200 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Fastest
                </div>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={28} className="text-black" />
                  </div>
                  <h3 className="font-semibold text-xl text-white mb-3">Upload Photo</h3>
                  <p className="text-primary-300 mb-6">
                    Quick & easy! Just upload a selfie and let our AI analyze your face shape and recommend perfect styles in seconds.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-accent-500 text-sm">
                    <Zap size={16} />
                    <span>Takes 30 seconds</span>
                  </div>
                </div>
              </button>

              {/* Quiz Option */}
              <button
                onClick={() => setMode('quiz')}
                className="card hover:scale-105 transition-all duration-200 cursor-pointer group"
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Target size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-xl text-white mb-3">Take Style Quiz</h3>
                  <p className="text-primary-300 mb-6">
                    Answer a few questions about your preferences, lifestyle, and desired look to get curated recommendations.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-purple-400 text-sm">
                    <Clock size={16} />
                    <span>Takes 2 minutes</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Why Use AI */}
            <div className="card bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-accent-500" />
                <h3 className="font-semibold text-white text-lg">Why Use AI Recommendations?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-accent-500 font-medium mb-1">Face Shape Analysis</div>
                  <p className="text-primary-300">AI detects your face shape and recommends styles that complement your features.</p>
                </div>
                <div>
                  <div className="text-accent-500 font-medium mb-1">Before & After Preview</div>
                  <p className="text-primary-300">See what you'll look like with different hairstyles before booking.</p>
                </div>
                <div>
                  <div className="text-accent-500 font-medium mb-1">Share with Barber</div>
                  <p className="text-primary-300">Send your results directly to your barber for the perfect cut.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Flow */}
        {mode === 'quiz' && quizStep < 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => quizStep > 0 ? setQuizStep(quizStep - 1) : setMode('choice')}
                  className="text-primary-300 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <span className="text-primary-300 text-sm">
                  Question {quizStep + 1} of 4
                </span>
              </div>
              <div className="w-full bg-primary-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Quiz Questions */}
            {quizStep === 0 && (
              <div className="card">
                <h2 className="font-display font-bold text-2xl text-white mb-6">
                  What's your current hair length?
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {['Very Short (Buzzed)', 'Short', 'Medium', 'Long'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswers({...quizAnswers, hairLength: option})
                        setQuizStep(1)
                      }}
                      className="p-4 bg-primary-700 hover:bg-primary-600 border-2 border-transparent hover:border-accent-500 rounded-lg text-white text-left transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 1 && (
              <div className="card">
                <h2 className="font-display font-bold text-2xl text-white mb-6">
                  How much time do you want to spend on styling daily?
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {['No time - Wash and go', '5-10 minutes', '15-20 minutes', '20+ minutes - I love styling'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswers({...quizAnswers, maintenance: option})
                        setQuizStep(2)
                      }}
                      className="p-4 bg-primary-700 hover:bg-primary-600 border-2 border-transparent hover:border-accent-500 rounded-lg text-white text-left transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="card">
                <h2 className="font-display font-bold text-2xl text-white mb-6">
                  What's your lifestyle like?
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {['Professional/Corporate', 'Creative/Artistic', 'Athletic/Active', 'Casual/Relaxed'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswers({...quizAnswers, lifestyle: option})
                        setQuizStep(3)
                      }}
                      className="p-4 bg-primary-700 hover:bg-primary-600 border-2 border-transparent hover:border-accent-500 rounded-lg text-white text-left transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="card">
                <h2 className="font-display font-bold text-2xl text-white mb-6">
                  What face shape do you think you have?
                </h2>
                <p className="text-primary-300 mb-6 text-sm">
                  Not sure? No worries! You can upload a photo next to verify.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {['Oval', 'Square', 'Round', 'Heart', 'Diamond', 'Not Sure'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswers({...quizAnswers, facePreference: option})
                        if (option === 'Not Sure') {
                          setMode('upload')
                        } else {
                          setFaceShape(option)
                          setStep('results')
                        }
                      }}
                      className="p-4 bg-primary-700 hover:bg-primary-600 border-2 border-transparent hover:border-accent-500 rounded-lg text-white transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Flow (existing code) */}
        {mode === 'upload' && step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 size={24} className="text-black" />
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Let AI Find Your Perfect Style
              </h2>
              <p className="text-primary-300 text-lg">
                Upload a photo or video of your face and our AI will analyze your features, search the web for trending styles, and show you exactly how each haircut will look on you.
              </p>
            </div>

            {/* Upload Area */}
            <div
              className={`card border-2 border-dashed transition-all duration-200 ${
                dragActive 
                  ? 'border-accent-500 bg-accent-500/10' 
                  : 'border-primary-600 hover:border-primary-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera size={24} className="text-primary-300" />
                </div>
                
                <h3 className="font-semibold text-white text-xl mb-2">
                  Upload Your Photo or Video
                </h3>
                <p className="text-primary-300 mb-6">
                  Drag and drop your media here, or click to browse
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary px-6 py-3"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Photo
                  </button>
                  <button 
                    onClick={() => videoInputRef.current?.click()}
                    className="btn-secondary px-6 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Choose Video
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleVideoUpload(e.target.files[0])
                    }
                  }}
                  className="hidden"
                />
                
                <div className="mt-6 text-sm text-primary-400">
                  <p>For best results:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Use a clear, well-lit photo</li>
                    <li>• Face the camera directly</li>
                    <li>• Keep hair visible and unobstructed</li>
                    <li>• Avoid filters or heavy editing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sample Results Preview */}
            <div className="mt-8">
              <h3 className="font-semibold text-white text-xl mb-4 text-center">What You'll Get</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap size={20} className="text-black" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">AI Analysis</h4>
                  <p className="text-primary-300 text-sm">Advanced facial recognition analyzes your features</p>
                </div>
                <div className="card text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Star size={20} className="text-black" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Personalized Styles</h4>
                  <p className="text-primary-300 text-sm">Get custom recommendations just for you</p>
                </div>
                <div className="card text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <User size={20} className="text-black" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Barber Matching</h4>
                  <p className="text-primary-300 text-sm">Connect with barbers who specialize in your style</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Analyzing */}
        {step === 'analyzing' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <div className="py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Sparkles size={28} className="text-black" />
                </div>
                
                <h2 className="font-display font-bold text-2xl text-white mb-4">
                  Analyzing Your Features
                </h2>
                <p className="text-primary-300 mb-8">
                  Our AI is studying your facial structure, hair type, and features to find your perfect match...
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-primary-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-primary-400 text-sm">{analysisProgress}% complete</p>

                {/* Analysis Steps */}
                <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
                  <div className={`flex items-center space-x-3 ${analysisProgress >= 30 ? 'text-accent-500' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Detecting facial features</span>
                  </div>
                  <div className={`flex items-center space-x-3 ${analysisProgress >= 60 ? 'text-accent-500' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Analyzing face shape and structure</span>
                  </div>
                  <div className={`flex items-center space-x-3 ${analysisProgress >= 90 ? 'text-accent-500' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Generating style recommendations</span>
                  </div>
                </div>

                {uploadedImage && (
                  <div className="mt-8">
                    <div className="w-32 h-40 bg-primary-700 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-primary-300 text-sm">Your Photo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step: Web Searching */}
        {step === 'searching' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <div className="py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Search size={28} className="text-white" />
                </div>
                
                <h2 className="font-display font-bold text-2xl text-white mb-4">
                  Searching the Web for Trending Styles
                </h2>
                <p className="text-primary-300 mb-8">
                  Finding the latest {faceShape ? `hairstyles for ${faceShape} face shapes` : 'hairstyle trends'} from top sources...
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-primary-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>
                <p className="text-primary-400 text-sm">{searchProgress}% complete</p>

                {/* Search Steps */}
                <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
                  <div className={`flex items-center space-x-3 ${searchProgress >= 25 ? 'text-purple-400' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Searching fashion magazines & style guides</span>
                  </div>
                  <div className={`flex items-center space-x-3 ${searchProgress >= 50 ? 'text-purple-400' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Analyzing trending hairstyles for your face shape</span>
                  </div>
                  <div className={`flex items-center space-x-3 ${searchProgress >= 75 ? 'text-purple-400' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Matching with barber specialists</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Generating AI Previews */}
        {step === 'generating' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <div className="py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-400 via-purple-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <Wand2 size={28} className="text-black" />
                </div>
                
                <h2 className="font-display font-bold text-2xl text-white mb-4">
                  Generating AI Style Previews
                </h2>
                <p className="text-primary-300 mb-8">
                  Creating realistic previews showing exactly how each hairstyle will look on you...
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-primary-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-accent-400 via-purple-500 to-accent-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-primary-400 text-sm">{generationProgress}% complete</p>

                {/* Generation Steps */}
                <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
                  <div className={`flex items-center space-x-3 ${generationProgress >= 30 ? 'text-accent-400' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Applying Modern Fade style</span>
                  </div>
                  <div className={`flex items-center space-x-3 ${generationProgress >= 60 ? 'text-accent-400' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Generating Classic Taper preview</span>
                  </div>
                  <div className={`flex items-center space-x-3 ${generationProgress >= 90 ? 'text-accent-400' : 'text-primary-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm">Creating Textured Crop visualization</span>
                  </div>
                </div>

                {(uploadedImage || uploadedVideo) && (
                  <div className="mt-8">
                    <div className="relative w-32 h-40 mx-auto">
                      {uploadedVideo ? (
                        <video 
                          src={uploadedVideo} 
                          className="w-full h-full object-cover rounded-lg opacity-50 blur-sm"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img 
                          src={uploadedImage!} 
                          alt="Processing" 
                          className="w-full h-full object-cover rounded-lg opacity-50 blur-sm" 
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin">
                          <Sparkles size={32} className="text-accent-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step Results */}
        {step === 'results' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-black" />
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Your Personalized Style Recommendations
              </h2>
              <p className="text-primary-300 text-lg">
                {faceShape && (
                  <>Based on your <span className="text-accent-400 font-semibold">{faceShape}</span> face shape analysis, here are professionally curated styles that will complement your unique features</>
                )}
                {!faceShape && <>Based on your facial features and structure, here are your top matches</>}
              </p>
            </div>

            {/* Detailed Facial Analysis Section */}
            {(uploadedImage || uploadedVideo) && facialAnalysis && (
              <div className="card mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-2xl text-white">Facial Analysis Breakdown</h3>
                  <div className="flex items-center space-x-2 bg-accent-500/20 text-accent-400 px-4 py-2 rounded-full">
                    <Check size={16} />
                    <span className="font-semibold">{facialAnalysis.confidence}% Confidence</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Uploaded Media */}
                  <div>
                    <div className="relative rounded-xl overflow-hidden bg-primary-800 border-2 border-primary-600">
                      {uploadedVideo ? (
                        <video 
                          src={uploadedVideo} 
                          className="w-full h-96 object-cover"
                          controls
                          loop
                          muted
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img 
                          src={uploadedImage!} 
                          alt="Your uploaded photo" 
                          className="w-full h-96 object-cover"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
                            {uploadedVideo ? <Play size={20} className="text-black" /> : <Camera size={20} className="text-black" />}
                          </div>
                          <div>
                            <p className="text-white font-semibold">Your Uploaded {uploadedVideo ? 'Video' : 'Photo'}</p>
                            <p className="text-primary-300 text-sm">AI Analysis Complete</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Detailed Metrics */}
                  <div className="space-y-4">
                    <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Face Shape</h4>
                        <span className="text-accent-400 font-bold text-lg">{facialAnalysis.faceShape}</span>
                      </div>
                      <p className="text-primary-300 text-sm">
                        {faceShapeDescriptions[facialAnalysis.faceShape] || 'Professional analysis of your facial structure'}
                      </p>
                    </div>

                    <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Jawline Definition</h4>
                        <span className="text-accent-400 font-bold text-lg">{facialAnalysis.jawlineDefinition}%</span>
                      </div>
                      <div className="w-full bg-primary-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${facialAnalysis.jawlineDefinition}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Forehead Size</h4>
                        <span className="text-accent-400 font-bold text-lg">{facialAnalysis.foreheadSize}</span>
                      </div>
                      <p className="text-primary-300 text-sm">
                        {facialAnalysis.foreheadSize === 'Large' && 'Fringe and side-swept styles recommended'}
                        {facialAnalysis.foreheadSize === 'Medium' && 'Most styles will work well for you'}
                        {facialAnalysis.foreheadSize === 'Small' && 'Textured top styles will add balance'}
                      </p>
                    </div>

                    <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Hairline</h4>
                        <span className="text-accent-400 font-bold text-lg">{facialAnalysis.hairline}</span>
                      </div>
                      <p className="text-primary-300 text-sm">Natural hairline shape detected</p>
                    </div>

                    <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Facial Symmetry</h4>
                        <span className="text-accent-400 font-bold text-lg">{facialAnalysis.symmetry}%</span>
                      </div>
                      <div className="w-full bg-primary-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${facialAnalysis.symmetry}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-600">
                      <h4 className="text-white font-semibold mb-3">Facial Proportions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary-300">Forehead to Nose</span>
                          <span className="text-white font-medium">{facialAnalysis.facialProportions.foreheadToNose}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary-300">Nose to Lip</span>
                          <span className="text-white font-medium">{facialAnalysis.facialProportions.noseToLip}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary-300">Lip to Chin</span>
                          <span className="text-white font-medium">{facialAnalysis.facialProportions.lipToChin}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Cheekbones</h4>
                        <span className="text-accent-400 font-bold text-lg">{facialAnalysis.cheekbones}</span>
                      </div>
                      <p className="text-primary-300 text-sm">
                        {facialAnalysis.cheekbones === 'Prominent' && 'Strong structure, great for angular styles'}
                        {facialAnalysis.cheekbones === 'Moderate' && 'Balanced features, versatile options'}
                        {facialAnalysis.cheekbones === 'Subtle' && 'Soft features, textured styles add dimension'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
                      <Sparkles size={20} className="text-black" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">AI Analysis Complete</p>
                      <p className="text-primary-300 text-sm">Your personalized recommendations are ready below</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
                  >
                    <Send size={16} />
                    <span>Share with Barber</span>
                  </button>
                </div>
              </div>
            )}

            {/* Fade & Taper Guide Button */}
            <div className="mb-8 text-center">
              <button
                onClick={() => setShowFadeGuide(true)}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <BookOpen size={20} />
                <span>Learn: Fade & Taper Types Guide</span>
                <Info size={16} className="opacity-70" />
              </button>
              <p className="text-primary-400 text-sm mt-2">Not sure what to ask for? Learn the differences between fades, tapers & more</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {getRecommendationsForFaceShape(faceShape, 'male').map((rec, index) => (
                <div 
                  key={rec.id} 
                  className={`card hover:scale-105 transition-all duration-200 cursor-pointer ${
                    selectedStyle === rec.id ? 'ring-2 ring-accent-500' : ''
                  }`}
                  onClick={() => setSelectedStyle(rec.id)}
                >
                  {/* Ranking Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      index === 0 
                        ? 'bg-accent-500 text-black' 
                        : 'bg-primary-700 text-primary-300'
                    }`}>
                      #{index + 1} Match
                    </div>
                    <div className="flex items-center space-x-2">
                      {rec.trending && (
                        <div className="flex items-center space-x-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                          <TrendingUp size={12} />
                          <span>Trending</span>
                        </div>
                      )}
                      <span className="text-accent-500 font-semibold">{rec.confidence}%</span>
                    </div>
                  </div>

                  {/* Before/After Preview with AI Generation */}
                  <div className="relative mb-4 group">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Before - Your Photo */}
                      <div className="relative">
                        <div className="bg-primary-700 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                          {uploadedImage || uploadedVideo ? (
                            uploadedVideo ? (
                              <video 
                                src={uploadedVideo} 
                                className="w-full h-full object-cover"
                                muted
                                loop
                                autoPlay
                                playsInline
                              />
                            ) : (
                              <img 
                                src={uploadedImage || ''} 
                                alt="Your photo" 
                                className="w-full h-full object-cover"
                              />
                            )
                          ) : (
                            <div className="text-center">
                              <User size={32} className="text-primary-400 mb-2 mx-auto" />
                              <span className="text-primary-300 text-xs">Before</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                          Before
                        </div>
                      </div>
                      {/* After - AI Generated */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-accent-600/20 to-accent-500/20 border-2 border-accent-500/50 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                          {(uploadedImage || uploadedVideo) ? (
                            <div className="relative w-full h-full">
                              {/* Show generated preview if available, otherwise show video or processing state */}
                              {generatedPreviews[rec.id] ? (
                                <img 
                                  src={generatedPreviews[rec.id]} 
                                  alt={`AI preview of ${rec.name}`} 
                                  className="w-full h-full object-cover"
                                />
                              ) : uploadedVideo ? (
                                <video 
                                  src={uploadedVideo} 
                                  className="w-full h-full object-cover brightness-110 contrast-125 saturate-125"
                                  muted
                                  loop
                                  autoPlay
                                  playsInline
                                />
                              ) : (
                                <div className="relative w-full h-full">
                                  <img 
                                    src={uploadedImage!} 
                                    alt="Processing..." 
                                    className="w-full h-full object-cover brightness-110 contrast-125 saturate-125"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-br from-accent-400/30 to-purple-500/30" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                                      <Sparkles size={20} className="text-accent-400 mb-1 mx-auto animate-pulse" />
                                      <span className="text-white text-xs font-bold block">Generating...</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center">
                              <Sparkles size={32} className="text-accent-400 mb-2 mx-auto" />
                              <span className="text-accent-300 text-xs font-medium">{rec.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 bg-accent-500 px-2 py-1 rounded text-black text-xs font-bold flex items-center space-x-1">
                          <Wand2 size={12} />
                          <span>AI Generated</span>
                        </div>
                      </div>
                    </div>
                    {/* Overlay hint on hover */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center text-white">
                        <Zap size={24} className="mx-auto mb-2 text-accent-400" />
                        <p className="text-sm font-medium">View Full AI Preview</p>
                        <p className="text-xs text-primary-300 mt-1">See detailed before/after comparison</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-xl text-white mb-2">{rec.name}</h3>
                  <p className="text-primary-300 text-sm mb-4">{rec.description}</p>

                  {/* Style Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-400">Maintenance:</span>
                      <span className="text-white">{rec.maintenance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-400">Difficulty:</span>
                      <span className="text-white">{rec.difficulty}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-primary-400">Suits: </span>
                      <span className="text-white">{rec.suitableFor.join(', ')} faces</span>
                    </div>
                  </div>

                  {/* Why It Works - Professional Insight */}
                  {'whyItWorks' in rec && (
                    <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={12} className="text-black" />
                        </div>
                        <div>
                          <p className="text-accent-400 font-semibold text-xs mb-1">Why This Works for You</p>
                          <p className="text-primary-300 text-xs leading-relaxed">{rec.whyItWorks}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommended Barber */}
                  <div className="bg-primary-700/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-primary-400">Recommended by</p>
                        <p className="text-white font-medium">{rec.barberRecommended}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                        <span className="text-white text-sm">4.9</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleBookStyle(rec.name)}
                      className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                    >
                      <Calendar size={16} />
                      <span>Book This Style</span>
                    </button>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleSendToBarber(rec.id)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                      >
                        <Send size={14} />
                        <span>Send to Barber</span>
                      </button>
                      <button 
                        onClick={() => handleLikeStyle(rec.id)}
                        className={`btn-secondary p-2 hover:scale-110 transition-all ${
                          likedStyles.includes(rec.id) ? 'bg-red-500 hover:bg-red-600' : ''
                        }`}
                        title={likedStyles.includes(rec.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart 
                          size={16} 
                          className={likedStyles.includes(rec.id) ? 'fill-white text-white' : ''}
                        />
                      </button>
                      <button 
                        onClick={() => handleShareStyle(rec.id)}
                        className="btn-secondary p-2 hover:scale-110 transition-transform"
                        title="Share this style"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Matched Barbers Section */}
            {matchedBarbers.length > 0 && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-purple-500/30">
                    <Users size={16} />
                    <span>Barbers Who Can Do These Styles</span>
                  </div>
                  <h2 className="font-display font-bold text-3xl text-white mb-4">
                    Your Matched Barber Specialists
                  </h2>
                  <p className="text-primary-300 text-lg max-w-2xl mx-auto">
                    Based on your AI style recommendations, we found {matchedBarbers.length} verified barbers who specialize in these cuts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedBarbers.map((barber) => (
                    <div key={barber.id} className="card group hover:scale-105 transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link href={`/barber/${barber.id}`} className="font-semibold text-white text-lg hover:text-accent-400 transition-colors">
                            {barber.name}
                          </Link>
                          <p className="text-primary-300 text-sm">{barber.shopName}</p>
                        </div>
                        {barber.verified && (
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <Check size={12} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                          <span className="text-white font-medium">{barber.rating}</span>
                          <span className="text-primary-400 text-sm">({barber.reviews})</span>
                        </div>
                        <span className="text-primary-400">•</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-primary-400" />
                          <span className="text-primary-400 text-sm">{barber.city}, {barber.state}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-primary-400 text-xs font-semibold mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {barber.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                            <span 
                              key={idx} 
                              className="bg-accent-500/20 text-accent-400 text-xs px-2 py-1 rounded-full border border-accent-500/30"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-accent-500" />
                          <span className="text-white font-medium">{barber.price}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="text-green-500 text-xs">{barber.nextAvailable}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link 
                          href={`/barber/${barber.id}`} 
                          className="flex-1 btn-secondary text-center py-2 text-sm"
                        >
                          View Profile
                        </Link>
                        <Link 
                          href={`/booking/${barber.id}`} 
                          className="flex-1 btn-primary text-center py-2 text-sm"
                        >
                          Book Now
                        </Link>
                      </div>

                      <div className="mt-3 pt-3 border-t border-primary-700 flex items-center space-x-2">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-purple-400 text-xs font-medium">
                          Matches your AI style recommendations
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Link href="/discover" className="btn-secondary inline-flex items-center space-x-2">
                    <Search size={16} />
                    <span>Browse All Barbers</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setStep('upload')
                  setUploadedImage(null)
                  setUploadedVideo(null)
                  setSelectedStyle(null)
                  setFaceShape('')
                  setFacialAnalysis(null)
                  setWebSearchResults([])
                  setAiGeneratedPreviews([])
                  setMatchedBarbers([])
                  setGeneratedPreviews({})
                }}
                className="btn-secondary px-6 py-3"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Another Photo/Video
              </button>
              <Link href="/discover" className="btn-primary px-6 py-3 text-center">
                Find These Barbers
              </Link>
            </div>

            {/* Additional Tips */}
            <div className="mt-12 card">
              <h3 className="font-semibold text-white text-lg mb-4">💡 Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-accent-500 font-medium mb-2">Bring Reference Photos</h4>
                  <p className="text-primary-300">Show these results to your barber for the best communication.</p>
                </div>
                <div>
                  <h4 className="text-accent-500 font-medium mb-2">Consider Your Lifestyle</h4>
                  <p className="text-primary-300">Choose styles that match your daily routine and maintenance preferences.</p>
                </div>
                <div>
                  <h4 className="text-accent-500 font-medium mb-2">Start Gradual</h4>
                  <p className="text-primary-300">If trying a new style, consider starting with a subtle version first.</p>
                </div>
                <div>
                  <h4 className="text-accent-500 font-medium mb-2">Book Consultations</h4>
                  <p className="text-primary-300">Many barbers offer free consultations to discuss your options.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-2xl text-white">Share with Barber</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="text-primary-300 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-primary-300 mb-6">
                Send your AI style analysis and recommendations directly to your barber for a perfect consultation.
              </p>

              <div className="space-y-4 mb-6">
                {matchedBarbers.slice(0, 3).map((barber) => (
                  <div key={barber.id} className="bg-primary-700/50 rounded-lg p-4 hover:bg-primary-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                          <User size={20} className="text-primary-300" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{barber.name}</p>
                          <p className="text-primary-300 text-sm">{barber.shopName}</p>
                        </div>
                      </div>
                      <Link 
                        href={`/messages/${barber.id}`}
                        className="btn-primary px-4 py-2 text-sm"
                        onClick={() => setShowShareModal(false)}
                      >
                        Send
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-primary-700 pt-4">
                <p className="text-primary-400 text-sm mb-4">Or share via:</p>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => {
                      handleShareStyle(shareStyleId || 1)
                      setShowShareModal(false)
                    }}
                    className="btn-secondary py-3 flex flex-col items-center space-y-2"
                  >
                    <Share2 size={20} />
                    <span className="text-xs">Share Link</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Check out my AI style analysis on FindMyFade! ${window.location.href}`)
                      alert('Link copied to clipboard!')
                      setShowShareModal(false)
                    }}
                    className="btn-secondary py-3 flex flex-col items-center space-y-2"
                  >
                    <Download size={20} />
                    <span className="text-xs">Copy Link</span>
                  </button>
                  <button 
                    onClick={() => {
                      window.print()
                    }}
                    className="btn-secondary py-3 flex flex-col items-center space-y-2"
                  >
                    <ImageIcon size={20} />
                    <span className="text-xs">Print</span>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-full btn-secondary py-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fade & Taper Guide Modal */}
        {showFadeGuide && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="card max-w-5xl w-full my-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-primary-900 z-10 pb-4 border-b border-primary-700">
                <div className="flex items-center space-x-3">
                  <Scissors className="text-accent-400" size={28} />
                  <h3 className="font-display font-bold text-3xl text-white">Fade & Taper Guide</h3>
                </div>
                <button 
                  onClick={() => setShowFadeGuide(false)}
                  className="text-primary-300 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-primary-300 mb-8 text-lg">
                Not sure what to ask your barber for? Here's a complete breakdown of every fade and taper type so you can confidently communicate exactly what you want! 💈
              </p>

              {/* Fades Section */}
              <div className="mb-12">
                <h4 className="font-display font-bold text-2xl text-white mb-6 flex items-center space-x-2">
                  <Zap className="text-accent-400" size={24} />
                  <span>Fade Types</span>
                </h4>
                <p className="text-primary-300 mb-6">
                  Fades gradually blend your hair from longer on top to shorter (or skin) on the sides and back. The difference is <span className="text-accent-400 font-semibold">where the fade starts</span>.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fadeTypesGuide.fades.map((fade, index) => (
                    <div 
                      key={fade.id} 
                      className="bg-primary-800/50 border border-primary-700 rounded-xl p-5 hover:border-accent-500/50 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-bold text-xl text-white">{fade.name}</h5>
                        <span className="text-xs text-accent-400 bg-accent-500/20 px-2 py-1 rounded-full">
                          {fade.popularity}
                        </span>
                      </div>
                      
                      <p className="text-primary-300 mb-4 leading-relaxed">{fade.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start space-x-2">
                          <Target size={16} className="text-accent-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-primary-400">Best For: </span>
                            <span className="text-white">{fade.bestFor}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <MapPin size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-primary-400">Where it starts: </span>
                            <span className="text-white font-medium">{fade.visualHeight}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Clock size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-primary-400">Maintenance: </span>
                            <span className="text-white">{fade.maintenance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-primary-700">
                        <p className="text-xs text-primary-400 mb-1">When asking your barber, say:</p>
                        <div className="flex flex-wrap gap-1">
                          {fade.keywords.map((keyword, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-accent-500/20 text-accent-300 px-2 py-1 rounded border border-accent-500/30"
                            >
                              "{keyword}"
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tapers Section */}
              <div className="mb-8">
                <h4 className="font-display font-bold text-2xl text-white mb-6 flex items-center space-x-2">
                  <Scissors className="text-purple-400" size={24} />
                  <span>Taper Types</span>
                </h4>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-white font-semibold mb-2">What's the difference between a Fade and a Taper?</p>
                      <p className="text-primary-300 text-sm leading-relaxed">
                        <span className="text-accent-400 font-semibold">Fades</span> blend your hair down to the skin (or very close). 
                        <span className="text-purple-400 font-semibold"> Tapers</span> keep more length and never go down to skin - they just gradually get shorter. 
                        Tapers are more conservative and professional, while fades are sharper and bolder.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fadeTypesGuide.tapers.map((taper) => (
                    <div 
                      key={taper.id} 
                      className="bg-primary-800/50 border border-primary-700 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <h5 className="font-bold text-xl text-white mb-3">{taper.name}</h5>
                      <p className="text-primary-300 mb-4 leading-relaxed text-sm">{taper.description}</p>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-start space-x-2">
                          <Target size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-primary-400">Best For: </span>
                            <span className="text-white">{taper.bestFor}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Clock size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-primary-400">Maintenance: </span>
                            <span className="text-white">{taper.maintenance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-500/10 border border-purple-500/20 rounded p-2">
                        <p className="text-xs text-purple-300 italic">{taper.difference}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-primary-700">
                        <p className="text-xs text-primary-400 mb-1">Ask for:</p>
                        <div className="flex flex-wrap gap-1">
                          {taper.keywords.map((keyword, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30"
                            >
                              "{keyword}"
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips Section */}
              <div className="bg-gradient-to-br from-accent-500/10 to-purple-500/10 border border-accent-500/30 rounded-xl p-6">
                <h4 className="font-display font-bold text-xl text-white mb-4 flex items-center space-x-2">
                  <Sparkles className="text-accent-400" size={20} />
                  <span>Pro Tips</span>
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <Check className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-primary-200">
                      <span className="text-white font-semibold">Show pictures!</span> Even with perfect terminology, a reference photo ensures you and your barber are on the same page.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-primary-200">
                      <span className="text-white font-semibold">Start conservative.</span> You can always go shorter or higher on your next visit, but you can't add hair back!
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-primary-200">
                      <span className="text-white font-semibold">Skin fades require maintenance.</span> They look sharpest for 1-2 weeks. If you don't want weekly cuts, go for a mid or low fade instead.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-primary-200">
                      <span className="text-white font-semibold">Communicate!</span> Tell your barber your lifestyle, job requirements, and styling routine so they can recommend what works best for YOU.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setShowFadeGuide(false)}
                  className="btn-primary px-8 py-3"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
