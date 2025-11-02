# FindMyFade - Complete Barber Discovery Platform 💇‍♂️✨

**FindMyFade** is a comprehensive, full-featured platform that revolutionizes how clients find and connect with barbers. Built with Next.js 14, TypeScript, and a modern black design aesthetic, it includes everything from AI-powered style recommendations to social media features and advanced booking systems.

## 🌟 Complete Feature Set

### 🎯 **For Clients**
- 🔍 **Advanced Discovery** - Find barbers by location, rating, price, specialties, and availability
- 🗺️ **Interactive Map** - Real-time location services with dynamic barber markers and directions
- 🤖 **AI Style Recommendations** - Upload photos for personalized hairstyle suggestions powered by AI
- 📱 **Social Reels** - TikTok-style vertical video feed showcasing barber work and trending styles
- 📅 **Complete Booking System** - Multi-step booking with calendar integration, service selection, and payment
- 💳 **Digital Wallet & Rewards** - Prepaid booking discounts, loyalty points, and referral bonuses
- ⭐ **Comprehensive Reviews** - Detailed rating system with photos, barber responses, and verified bookings
- 👤 **User Authentication** - Secure signup/login with social media integration

### 💼 **For Barbers**
- 🏪 **Professional Profiles** - Showcase work portfolio, services, pricing, and availability
- 📊 **Business Management** - Service listings, schedule management, and customer communications
- 💰 **Integrated Payments** - Secure payment processing with automatic payouts
- 📸 **Portfolio Builder** - Upload photos and videos to showcase your best work
- 🎬 **Social Media Tools** - Create reels to attract new clients and show off skills
- 💬 **Customer Engagement** - Respond to reviews and manage client relationships

### 🔧 **Platform Features**
- 📱 **Responsive Design** - Perfect experience across all devices
- 🌙 **Modern Dark Theme** - Sleek black design with golden accents
- ⚡ **High Performance** - Optimized loading and smooth animations
- 🔒 **Security First** - Secure authentication and payment processing
- 📈 **Analytics Ready** - Built for tracking and optimization

## 🛠 Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom design system
- **Lucide React** - Modern icon library
- **Framer Motion** - Smooth animations (configured)

### **Backend & Database**
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Authentication system
- **Stripe** - Payment processing

### **APIs & Services**
- **Google Maps API** - Location services and mapping (Required)
- **UploadThing** - File and image uploads
- **AI Integration** - Style recommendation system

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Google Maps API

1. **Get Your API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **Maps JavaScript API** and **Places API**
   - Create credentials (API Key)
   - (Optional) Restrict the API key to your domain for security

2. **Add to Environment:**
   - Create a `.env.local` file in the root directory
   - Add your API key:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Restart Development Server:**
   ```bash
   npm run dev
   ```

The map page will automatically use Google Maps when the API key is configured!

## 🎨 Design System

### **Color Palette**
```css
/* Primary Scale (Dark Theme) */
--primary-950: #0f1114  /* Darkest background */
--primary-900: #1a1d20  /* Main background */
--primary-800: #212529  /* Card backgrounds */
--primary-700: #343a40  /* Interactive elements */
--primary-600: #495057  /* Borders */
--primary-500: #6c757d  /* Text secondary */
--primary-400: #adb5bd  /* Text tertiary */
--primary-300: #ced4da  /* Text light */

/* Accent Colors */
--accent-500: #f59e0b   /* Primary gold */
--accent-400: #fbbf24   /* Light gold */
--accent-600: #d97706   /* Dark gold */
```

### **Typography**
- **Display Font**: Poppins (headings, hero text)
- **Body Font**: Inter (UI elements, body text)

### **Components**
```css
.btn-primary { @apply bg-accent-500 hover:bg-accent-600 text-black font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105; }
.btn-secondary { @apply bg-primary-800 hover:bg-primary-700 text-white border border-primary-600 font-medium px-6 py-3 rounded-lg transition-all duration-200; }
.card { @apply bg-primary-800 border border-primary-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200; }
.input { @apply bg-primary-800 border border-primary-600 text-white placeholder-primary-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200; }
```

## 📁 Complete Project Structure

```
findmyfade/
├── prisma/
│   └── schema.prisma          # Complete database schema
├── src/
│   ├── app/                   # Next.js 14 app directory
│   │   ├── ai-style/         # AI hairstyle recommendations
│   │   │   └── page.tsx      # Photo upload & AI analysis
│   │   ├── barber/[id]/      # Dynamic barber profiles
│   │   │   └── page.tsx      # Complete barber showcase
│   │   ├── book/[barberId]/  # Multi-step booking system
│   │   │   └── page.tsx      # Service selection, calendar, payment
│   │   ├── discover/         # Advanced barber discovery
│   │   │   └── page.tsx      # Search, filters, sorting
│   │   ├── login/            # User authentication
│   │   │   └── page.tsx      # Login with social options
│   │   ├── map/              # Interactive location-based discovery
│   │   │   └── page.tsx      # Real-time maps with markers
│   │   ├── reels/            # Social media feed
│   │   │   └── page.tsx      # TikTok-style video player
│   │   ├── reviews/[barberId]/ # Comprehensive review system
│   │   │   └── page.tsx      # Detailed ratings & responses
│   │   ├── signup/           # User registration
│   │   │   └── page.tsx      # Multi-step signup flow
│   │   ├── wallet/           # Digital wallet & rewards
│   │   │   └── page.tsx      # Balance, points, transactions
│   │   ├── globals.css       # Global styles & utilities
│   │   ├── layout.tsx        # Root layout with theme
│   │   └── page.tsx          # Landing page with navigation
│   ├── components/           # Reusable React components
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript definitions
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

## 🚀 Quick Start Guide

### **Prerequisites**
- Node.js 18 or higher
- npm or yarn package manager
- Git

### **Installation**

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd findmyfade
   npm install
   ```

2. **Environment Variables**
   ```bash
   # Create .env.local file
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Optional API Keys
   GOOGLE_MAPS_API_KEY="your-google-maps-key"
   STRIPE_SECRET_KEY="your-stripe-key"
   UPLOADTHING_SECRET="your-upload-secret"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Production Deployment**
```bash
npm run build
npm start
```

## 📱 Page Guide & Features

### **🏠 Landing Page (`/`)**
- Hero section with search functionality
- Quick action buttons (Near Me, AI Style Match, Top Rated)
- Feature showcase with animated cards
- Statistics and testimonials
- Complete navigation to all features

### **🔍 Discovery (`/discover`)**
- Advanced search with multiple filters
- Grid/List view toggle
- Sort by distance, rating, price, reviews
- Filter by specialties, verification, availability
- Real-time availability display
- Direct booking integration

### **🗺️ Map View (`/map`)**
- Interactive Google Maps integration
- Real-time user location services
- Dynamic barber markers with status indicators
- Barber info popups with quick actions
- Route planning and directions
- Map style toggle (Default/Satellite/Terrain)
- Advanced filtering with radius control

### **👤 Barber Profile (`/barber/[id]`)**
- Complete barber information display
- Tabbed interface: Portfolio, Services, Reviews, About
- Photo/video portfolio gallery
- Service listings with pricing and duration
- Customer review system with ratings
- Quick booking sidebar
- Contact information and directions

### **📅 Booking System (`/book/[barberId]`)**
- **Step 1**: Service Selection with pricing
- **Step 2**: Interactive calendar with time slots
- **Step 3**: Customer details form
- **Step 4**: Payment method selection
- **Step 5**: Booking confirmation
- Real-time availability checking
- Booking summary sidebar
- Multiple payment options

### **🤖 AI Style Recommendations (`/ai-style`)**
- Photo upload interface with drag & drop
- AI analysis simulation with progress tracking
- Personalized style recommendations
- Confidence ratings and suitability analysis
- Barber matching for each style
- Save and share functionality

### **📱 Social Reels (`/reels`)**
- TikTok-style vertical video player
- Infinite scroll through barber content
- Interactive engagement (likes, comments, shares, bookmarks)
- Barber profile integration
- Trending content discovery
- Direct booking from reels

### **💳 Wallet & Rewards (`/wallet`)**
- Digital wallet balance management
- Loyalty points system with tiers
- Add money with bonus promotions
- Transaction history tracking
- Reward redemption marketplace
- Referral program with codes

### **⭐ Review System (`/reviews/[barberId]`)**
- Comprehensive rating breakdown
- Photo uploads with reviews
- Barber response system
- Helpful/not helpful voting
- Verified booking badges
- Category-specific ratings
- Advanced filtering and sorting

### **🔐 Authentication**
- **Login (`/login`)**: Email/password + social login options
- **Signup (`/signup`)**: Multi-step registration for clients and barbers
- Role-based access control
- Demo account access
- Secure session management

## 🎯 Core User Flows

### **Client Journey**
1. **Discovery**: Browse barbers via discover page or map
2. **Research**: View profiles, portfolios, and reviews
3. **AI Matching**: Upload photo for style recommendations
4. **Social**: Explore reels for inspiration
5. **Booking**: Complete multi-step reservation
6. **Payment**: Use wallet, cards, or loyalty points
7. **Experience**: Attend appointment
8. **Review**: Rate and review with photos

### **Barber Journey**
1. **Registration**: Multi-step professional signup
2. **Profile Setup**: Add services, portfolio, pricing
3. **Content Creation**: Upload photos and reels
4. **Client Management**: Respond to reviews and messages
5. **Business Growth**: Gain visibility and bookings

## 🔧 Customization

### **Theming**
Modify `tailwind.config.ts` to customize:
- Color schemes
- Typography scales  
- Component variants
- Animation presets

### **Features**
Each page is modular and can be:
- Customized independently
- Enhanced with additional features
- Integrated with real APIs
- Styled differently

## 📈 Performance Features

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **SEO Friendly**: Meta tags and structured data
- **Progressive Enhancement**: Works without JavaScript
- **Mobile First**: Responsive design approach

## 🔒 Security Features

- **Authentication**: Secure session management
- **Payment Security**: PCI-compliant processing
- **Input Validation**: Client and server-side validation
- **CSRF Protection**: Built-in security measures
- **Data Encryption**: Sensitive data protection

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build verification
npm run build
```

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🆘 Support

For questions, issues, or support:
- 📧 Email: hello@findmyfade.com
- 💬 Discord: [Join Community](https://discord.gg/findmyfade)
- 🐛 Issues: [GitHub Issues](https://github.com/findmyfade/issues)

---

**FindMyFade** - *Discover Your Perfect Fade* 🔥

*Built with ❤️ using Next.js, TypeScript, and modern web technologies*