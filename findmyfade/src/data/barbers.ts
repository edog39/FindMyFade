// Comprehensive US Barbers Database
// Real-style barber data across major US cities

export interface Barber {
  id: number
  name: string
  shopName: string
  rating: number
  reviews: number
  distance?: number
  image: string
  specialties: string[]
  price: string
  nextAvailable: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  verified: boolean
  promoted: boolean
  latitude: number
  longitude: number
  bio: string
  yearsExperience: number
  instagram?: string
  website?: string
}

export const usBarbers: Barber[] = [
  // New York City
  {
    id: 1,
    name: "Marcus Johnson",
    shopName: "Uptown Fades NYC",
    rating: 4.9,
    reviews: 342,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Beard Trim", "Line Up"],
    price: "$45-75",
    nextAvailable: "Today 2:30 PM",
    address: "234 Malcolm X Blvd",
    city: "New York",
    state: "NY",
    zipCode: "10026",
    phone: "(212) 555-0123",
    verified: true,
    promoted: true,
    latitude: 40.8089,
    longitude: -73.9482,
    bio: "Master barber specializing in classic and modern fades. 15 years of experience in Harlem.",
    yearsExperience: 15,
    instagram: "@uptownfadesnyc"
  },
  {
    id: 2,
    name: "Tony Romano",
    shopName: "Brooklyn Barber Co",
    rating: 4.8,
    reviews: 289,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Hot Towel Shave", "Beard Design"],
    price: "$40-65",
    nextAvailable: "Tomorrow 10:00 AM",
    address: "456 Bedford Ave",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11249",
    phone: "(718) 555-0234",
    verified: true,
    promoted: false,
    latitude: 40.7178,
    longitude: -73.9562,
    bio: "Old-school barbering meets modern style in Williamsburg.",
    yearsExperience: 12,
    instagram: "@brooklynbarberco"
  },

  // Los Angeles
  {
    id: 3,
    name: "Carlos Ramirez",
    shopName: "LA Premium Cuts",
    rating: 4.9,
    reviews: 456,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Fades", "Hair Design", "Color"],
    price: "$50-80",
    nextAvailable: "Today 4:15 PM",
    address: "789 Melrose Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90046",
    phone: "(323) 555-0345",
    verified: true,
    promoted: true,
    latitude: 34.0836,
    longitude: -118.3465,
    bio: "Celebrity barber serving LA's finest. Featured in GQ Magazine.",
    yearsExperience: 18,
    instagram: "@lapremiumcuts",
    website: "lapremiumcuts.com"
  },
  {
    id: 4,
    name: "Sarah Chen",
    shopName: "Venice Beach Barbers",
    rating: 4.7,
    reviews: 198,
    image: "/api/placeholder/300/200",
    specialties: ["Textured Cuts", "Surf Style", "Beard Styling"],
    price: "$35-60",
    nextAvailable: "Today 6:00 PM",
    address: "321 Abbot Kinney Blvd",
    city: "Venice",
    state: "CA",
    zipCode: "90291",
    phone: "(310) 555-0456",
    verified: true,
    promoted: false,
    latitude: 33.9946,
    longitude: -118.4682,
    bio: "Laid-back cuts with beach vibes. Specializing in textured styles.",
    yearsExperience: 8
  },

  // Chicago
  {
    id: 5,
    name: "Michael Washington",
    shopName: "Windy City Barbers",
    rating: 4.8,
    reviews: 267,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Taper", "Beard Trim"],
    price: "$35-55",
    nextAvailable: "Today 3:00 PM",
    address: "567 State St",
    city: "Chicago",
    state: "IL",
    zipCode: "60605",
    phone: "(312) 555-0567",
    verified: true,
    promoted: false,
    latitude: 41.8756,
    longitude: -87.6274,
    bio: "South Loop's premier barbershop. Clean cuts, great conversation.",
    yearsExperience: 10,
    instagram: "@windycitybarbers"
  },
  {
    id: 6,
    name: "Jake Mueller",
    shopName: "Wicker Park Cuts",
    rating: 4.6,
    reviews: 145,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Cuts", "Styling", "Beard Care"],
    price: "$40-70",
    nextAvailable: "Tomorrow 11:30 AM",
    address: "890 Milwaukee Ave",
    city: "Chicago",
    state: "IL",
    zipCode: "60622",
    phone: "(773) 555-0678",
    verified: false,
    promoted: false,
    latitude: 41.9089,
    longitude: -87.6775,
    bio: "Trendy cuts in Chicago's hippest neighborhood.",
    yearsExperience: 6
  },

  // Miami
  {
    id: 7,
    name: "Diego Martinez",
    shopName: "South Beach Barbershop",
    rating: 4.9,
    reviews: 321,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Hair Design", "Beard Sculpting"],
    price: "$45-70",
    nextAvailable: "Today 1:45 PM",
    address: "123 Ocean Drive",
    city: "Miami Beach",
    state: "FL",
    zipCode: "33139",
    phone: "(305) 555-0789",
    verified: true,
    promoted: true,
    latitude: 25.7823,
    longitude: -80.1304,
    bio: "Miami's hottest barbershop. Precision cuts with Latin flair.",
    yearsExperience: 14,
    instagram: "@southbeachbarber"
  },

  // Houston
  {
    id: 8,
    name: "James Butler",
    shopName: "Houston's Finest Cuts",
    rating: 4.7,
    reviews: 234,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Fade", "Beard Trim"],
    price: "$30-50",
    nextAvailable: "Today 5:30 PM",
    address: "456 Westheimer Rd",
    city: "Houston",
    state: "TX",
    zipCode: "77027",
    phone: "(713) 555-0890",
    verified: true,
    promoted: false,
    latitude: 29.7372,
    longitude: -95.4618,
    bio: "Family-friendly barbershop in the heart of Houston.",
    yearsExperience: 11
  },

  // Phoenix
  {
    id: 9,
    name: "Alex Rivera",
    shopName: "Desert Cuts AZ",
    rating: 4.8,
    reviews: 178,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Fades", "Hair Design", "Kids Cuts"],
    price: "$35-60",
    nextAvailable: "Tomorrow 9:00 AM",
    address: "789 Camelback Rd",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85013",
    phone: "(602) 555-0901",
    verified: true,
    promoted: false,
    latitude: 33.5091,
    longitude: -112.0733,
    bio: "Phoenix's go-to spot for clean cuts and great service.",
    yearsExperience: 9,
    instagram: "@desertcutsaz"
  },

  // Philadelphia
  {
    id: 10,
    name: "Kevin Brown",
    shopName: "Philly Fade Masters",
    rating: 4.8,
    reviews: 298,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Taper", "Line Up"],
    price: "$35-55",
    nextAvailable: "Today 2:00 PM",
    address: "234 South St",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19147",
    phone: "(215) 555-1012",
    verified: true,
    promoted: false,
    latitude: 39.9415,
    longitude: -75.1471,
    bio: "South Philly's premier fade specialists since 2015.",
    yearsExperience: 13
  },

  // San Antonio
  {
    id: 11,
    name: "Roberto Garcia",
    shopName: "Alamo City Barbers",
    rating: 4.7,
    reviews: 167,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Fade", "Beard Styling"],
    price: "$28-45",
    nextAvailable: "Today 4:00 PM",
    address: "567 Commerce St",
    city: "San Antonio",
    state: "TX",
    zipCode: "78205",
    phone: "(210) 555-1123",
    verified: true,
    promoted: false,
    latitude: 29.4246,
    longitude: -98.4951,
    bio: "Traditional barbering with Texas hospitality.",
    yearsExperience: 16
  },

  // San Diego
  {
    id: 12,
    name: "Tyler Adams",
    shopName: "Pacific Beach Cuts",
    rating: 4.9,
    reviews: 245,
    image: "/api/placeholder/300/200",
    specialties: ["Surf Cuts", "Fade", "Beard Design"],
    price: "$40-65",
    nextAvailable: "Today 3:30 PM",
    address: "890 Garnet Ave",
    city: "San Diego",
    state: "CA",
    zipCode: "92109",
    phone: "(858) 555-1234",
    verified: true,
    promoted: true,
    latitude: 32.7967,
    longitude: -117.2297,
    bio: "San Diego's best beach-style cuts and grooming.",
    yearsExperience: 10,
    instagram: "@pacificbeachcuts"
  },

  // Dallas
  {
    id: 13,
    name: "Brandon Williams",
    shopName: "Dallas Elite Barbers",
    rating: 4.8,
    reviews: 312,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Hair Design", "Hot Towel Shave"],
    price: "$40-70",
    nextAvailable: "Tomorrow 10:30 AM",
    address: "123 McKinney Ave",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    phone: "(214) 555-1345",
    verified: true,
    promoted: false,
    latitude: 32.7905,
    longitude: -96.8013,
    bio: "Uptown Dallas' premier barbershop for modern professionals.",
    yearsExperience: 12,
    instagram: "@dallaselitebarbers"
  },

  // San Jose
  {
    id: 14,
    name: "Daniel Kim",
    shopName: "Silicon Valley Cuts",
    rating: 4.7,
    reviews: 189,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Cuts", "Fade", "Styling"],
    price: "$45-75",
    nextAvailable: "Today 5:00 PM",
    address: "456 Santana Row",
    city: "San Jose",
    state: "CA",
    zipCode: "95128",
    phone: "(408) 555-1456",
    verified: true,
    promoted: false,
    latitude: 37.3220,
    longitude: -121.9480,
    bio: "Tech professional grooming in the heart of Silicon Valley.",
    yearsExperience: 8
  },

  // Austin
  {
    id: 15,
    name: "Matt Rodriguez",
    shopName: "Keep Austin Faded",
    rating: 4.9,
    reviews: 278,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Beard Trim", "Creative Cuts"],
    price: "$38-60",
    nextAvailable: "Today 2:45 PM",
    address: "789 South Congress Ave",
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    phone: "(512) 555-1567",
    verified: true,
    promoted: true,
    latitude: 30.2465,
    longitude: -97.7492,
    bio: "Austin's quirkiest barbershop with killer fades.",
    yearsExperience: 11,
    instagram: "@keepaustinfaded"
  },

  // Jacksonville
  {
    id: 16,
    name: "Chris Thompson",
    shopName: "Jax Beach Barbers",
    rating: 4.6,
    reviews: 134,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Fade", "Beard Styling"],
    price: "$32-50",
    nextAvailable: "Tomorrow 1:00 PM",
    address: "234 Beach Blvd",
    city: "Jacksonville",
    state: "FL",
    zipCode: "32250",
    phone: "(904) 555-1678",
    verified: true,
    promoted: false,
    latitude: 30.2894,
    longitude: -81.3932,
    bio: "Beachside cuts with Southern charm.",
    yearsExperience: 9
  },

  // San Francisco
  {
    id: 17,
    name: "Mike Johnson",
    shopName: "Mike's Premium Cuts",
    rating: 4.9,
    reviews: 427,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Beard Trim", "Classic Cuts"],
    price: "$50-85",
    nextAvailable: "Today 2:30 PM",
    address: "123 Market St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    phone: "(415) 555-1789",
    verified: true,
    promoted: true,
    latitude: 37.7749,
    longitude: -122.4194,
    bio: "SF's most trusted barber. Precision cuts with 15+ years experience.",
    yearsExperience: 15,
    instagram: "@mikespremiumcuts",
    website: "mikespremiumcuts.com"
  },

  // Fort Worth
  {
    id: 18,
    name: "Jose Hernandez",
    shopName: "Cowtown Cuts",
    rating: 4.7,
    reviews: 156,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Taper", "Beard Trim"],
    price: "$30-50",
    nextAvailable: "Today 4:30 PM",
    address: "567 Main St",
    city: "Fort Worth",
    state: "TX",
    zipCode: "76102",
    phone: "(817) 555-1890",
    verified: true,
    promoted: false,
    latitude: 32.7518,
    longitude: -97.3324,
    bio: "Traditional Texas barbering at its finest.",
    yearsExperience: 14
  },

  // Columbus
  {
    id: 19,
    name: "Andrew Miller",
    shopName: "Short North Barbers",
    rating: 4.8,
    reviews: 223,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Cuts", "Fade", "Styling"],
    price: "$35-60",
    nextAvailable: "Tomorrow 11:00 AM",
    address: "890 High St",
    city: "Columbus",
    state: "OH",
    zipCode: "43215",
    phone: "(614) 555-1901",
    verified: true,
    promoted: false,
    latitude: 39.9743,
    longitude: -82.9988,
    bio: "Columbus' trendiest spot for fresh cuts.",
    yearsExperience: 7,
    instagram: "@shortnorthbarbers"
  },

  // Charlotte
  {
    id: 20,
    name: "Marcus Davis",
    shopName: "Queen City Fades",
    rating: 4.8,
    reviews: 289,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Line Up", "Beard Design"],
    price: "$35-55",
    nextAvailable: "Today 3:15 PM",
    address: "123 Tryon St",
    city: "Charlotte",
    state: "NC",
    zipCode: "28202",
    phone: "(704) 555-2012",
    verified: true,
    promoted: false,
    latitude: 35.2249,
    longitude: -80.8433,
    bio: "Charlotte's premier destination for perfect fades.",
    yearsExperience: 13
  },

  // Indianapolis
  {
    id: 21,
    name: "Ryan Foster",
    shopName: "Indy Cuts Co",
    rating: 4.6,
    reviews: 167,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Fade", "Beard Trim"],
    price: "$32-50",
    nextAvailable: "Today 5:45 PM",
    address: "456 Massachusetts Ave",
    city: "Indianapolis",
    state: "IN",
    zipCode: "46204",
    phone: "(317) 555-2123",
    verified: true,
    promoted: false,
    latitude: 39.7767,
    longitude: -86.1459,
    bio: "Downtown Indy's friendliest barbershop.",
    yearsExperience: 10
  },

  // Seattle
  {
    id: 22,
    name: "Jason Park",
    shopName: "Emerald City Barbers",
    rating: 4.9,
    reviews: 334,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Fades", "Beard Care", "Hair Design"],
    price: "$45-75",
    nextAvailable: "Today 1:30 PM",
    address: "789 Pike St",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    phone: "(206) 555-2234",
    verified: true,
    promoted: true,
    latitude: 47.6097,
    longitude: -122.3331,
    bio: "Seattle's top-rated barbershop since 2018.",
    yearsExperience: 12,
    instagram: "@emeraldcitybarbers"
  },

  // Denver
  {
    id: 23,
    name: "Trevor Walsh",
    shopName: "Mile High Cuts",
    rating: 4.8,
    reviews: 256,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Classic Cuts", "Beard Styling"],
    price: "$38-62",
    nextAvailable: "Tomorrow 9:30 AM",
    address: "234 Larimer St",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    phone: "(303) 555-2345",
    verified: true,
    promoted: false,
    latitude: 39.7506,
    longitude: -104.9942,
    bio: "Denver's go-to spot for quality cuts and good vibes.",
    yearsExperience: 11
  },

  // Boston
  {
    id: 24,
    name: "Patrick O'Brien",
    shopName: "Boston Barber Lounge",
    rating: 4.7,
    reviews: 298,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Hot Towel Shave", "Beard Trim"],
    price: "$45-70",
    nextAvailable: "Today 4:00 PM",
    address: "567 Newbury St",
    city: "Boston",
    state: "MA",
    zipCode: "02116",
    phone: "(617) 555-2456",
    verified: true,
    promoted: false,
    latitude: 42.3505,
    longitude: -71.0818,
    bio: "Traditional barbering in the heart of Back Bay.",
    yearsExperience: 16,
    instagram: "@bostonbarberlounge"
  },

  // Nashville
  {
    id: 25,
    name: "Luke Harrison",
    shopName: "Music City Cuts",
    rating: 4.9,
    reviews: 312,
    image: "/api/placeholder/300/200",
    specialties: ["Modern Cuts", "Fade", "Beard Design"],
    price: "$40-65",
    nextAvailable: "Today 2:15 PM",
    address: "890 Broadway",
    city: "Nashville",
    state: "TN",
    zipCode: "37203",
    phone: "(615) 555-2567",
    verified: true,
    promoted: true,
    latitude: 36.1622,
    longitude: -86.7742,
    bio: "Nashville's hottest barbershop for music industry pros.",
    yearsExperience: 9,
    instagram: "@musiccitycuts"
  },

  // Portland
  {
    id: 26,
    name: "Derek Chen",
    shopName: "PDX Barber Shop",
    rating: 4.7,
    reviews: 201,
    image: "/api/placeholder/300/200",
    specialties: ["Creative Cuts", "Fade", "Beard Care"],
    price: "$42-68",
    nextAvailable: "Tomorrow 12:00 PM",
    address: "123 Burnside St",
    city: "Portland",
    state: "OR",
    zipCode: "97209",
    phone: "(503) 555-2678",
    verified: true,
    promoted: false,
    latitude: 45.5202,
    longitude: -122.6742,
    bio: "Portland's most creative barbershop. Keep it weird!",
    yearsExperience: 8
  },

  // Las Vegas
  {
    id: 27,
    name: "Victor Martinez",
    shopName: "Vegas Premium Cuts",
    rating: 4.8,
    reviews: 267,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Hair Design", "VIP Service"],
    price: "$50-90",
    nextAvailable: "Today 6:30 PM",
    address: "456 Las Vegas Blvd",
    city: "Las Vegas",
    state: "NV",
    zipCode: "89109",
    phone: "(702) 555-2789",
    verified: true,
    promoted: true,
    latitude: 36.1147,
    longitude: -115.1728,
    bio: "VIP grooming experience on the Strip.",
    yearsExperience: 14,
    instagram: "@vegaspremiumcuts"
  },

  // Detroit
  {
    id: 28,
    name: "Antoine Jackson",
    shopName: "Motor City Fades",
    rating: 4.7,
    reviews: 178,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Taper", "Line Up"],
    price: "$32-52",
    nextAvailable: "Today 3:45 PM",
    address: "789 Woodward Ave",
    city: "Detroit",
    state: "MI",
    zipCode: "48226",
    phone: "(313) 555-2890",
    verified: true,
    promoted: false,
    latitude: 42.3315,
    longitude: -83.0466,
    bio: "Detroit's finest fades with hometown pride.",
    yearsExperience: 12
  },

  // Memphis
  {
    id: 29,
    name: "Terrell Williams",
    shopName: "Beale Street Barbers",
    rating: 4.6,
    reviews: 145,
    image: "/api/placeholder/300/200",
    specialties: ["Classic Cuts", "Fade", "Beard Styling"],
    price: "$28-45",
    nextAvailable: "Tomorrow 10:00 AM",
    address: "234 Beale St",
    city: "Memphis",
    state: "TN",
    zipCode: "38103",
    phone: "(901) 555-2901",
    verified: true,
    promoted: false,
    latitude: 35.1382,
    longitude: -90.0511,
    bio: "Memphis soul meets modern barbering.",
    yearsExperience: 10
  },

  // Atlanta
  {
    id: 30,
    name: "DeAndre Brown",
    shopName: "ATL Fade Masters",
    rating: 4.9,
    reviews: 389,
    image: "/api/placeholder/300/200",
    specialties: ["Fade", "Hair Design", "Beard Sculpting"],
    price: "$40-70",
    nextAvailable: "Today 1:00 PM",
    address: "567 Peachtree St",
    city: "Atlanta",
    state: "GA",
    zipCode: "30308",
    phone: "(404) 555-3012",
    verified: true,
    promoted: true,
    latitude: 33.7679,
    longitude: -84.3877,
    bio: "Atlanta's #1 spot for celebrity-level fades.",
    yearsExperience: 16,
    instagram: "@atlfademasters",
    website: "atlfademasters.com"
  }
]

// Helper function to filter barbers by city/state
export function getBarbersByLocation(city?: string, state?: string): Barber[] {
  if (!city && !state) return usBarbers
  
  return usBarbers.filter(barber => {
    const cityMatch = city ? barber.city.toLowerCase().includes(city.toLowerCase()) : true
    const stateMatch = state ? barber.state.toLowerCase() === state.toLowerCase() : true
    return cityMatch && stateMatch
  })
}

// Helper function to get barbers by search query
export function searchBarbers(query: string): Barber[] {
  const lowerQuery = query.toLowerCase()
  return usBarbers.filter(barber => 
    barber.shopName.toLowerCase().includes(lowerQuery) ||
    barber.name.toLowerCase().includes(lowerQuery) ||
    barber.city.toLowerCase().includes(lowerQuery) ||
    barber.state.toLowerCase().includes(lowerQuery) ||
    barber.specialties.some(s => s.toLowerCase().includes(lowerQuery))
  )
}

// Helper to get random nearby barbers (simulated)
export function getNearbyBarbers(count: number = 10): Barber[] {
  const shuffled = [...usBarbers].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map((barber, index) => ({
    ...barber,
    distance: parseFloat((Math.random() * 5 + 0.1).toFixed(1))
  }))
}
