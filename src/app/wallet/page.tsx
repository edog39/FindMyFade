'use client'

import { useState, useEffect } from 'react'
import { 
  Wallet,
  CreditCard,
  Gift,
  TrendingUp,
  DollarSign,
  Plus,
  Star,
  Users,
  Calendar,
  Receipt,
  ChevronRight,
  ChevronLeft,
  Award,
  Target,
  Clock,
  Check,
  Copy,
  Share2,
  Zap
} from 'lucide-react'
import Link from 'next/link'

const mockUser = {
  walletBalance: 125.50,
  loyaltyPoints: 1250,
  tier: 'Gold',
  referralCode: 'MIKE2024',
  totalSavings: 285.75,
  nextRewardAt: 1500
}

const mockTransactions = [
  {
    id: 1,
    type: 'booking_payment',
    amount: -35.00,
    description: 'Classic Fade - Mike\'s Premium Cuts',
    date: '2024-10-28',
    pointsEarned: 35,
    status: 'completed'
  },
  {
    id: 2,
    type: 'wallet_topup',
    amount: 50.00,
    description: 'Wallet Top-up + 10% Bonus',
    date: '2024-10-25',
    pointsEarned: 0,
    status: 'completed'
  },
  {
    id: 3,
    type: 'referral_bonus',
    amount: 15.00,
    description: 'Referral Bonus - Friend signed up',
    date: '2024-10-22',
    pointsEarned: 150,
    status: 'completed'
  },
  {
    id: 4,
    type: 'loyalty_redemption',
    amount: 10.00,
    description: 'Loyalty Points Redeemed',
    date: '2024-10-20',
    pointsEarned: -100,
    status: 'completed'
  }
]

const topupOptions = [
  { amount: 25, bonus: 0, popular: false },
  { amount: 50, bonus: 5, popular: true },
  { amount: 100, bonus: 15, popular: false },
  { amount: 200, bonus: 40, popular: false }
]

const loyaltyTiers = [
  { name: 'Silver', minPoints: 0, color: 'text-gray-400', benefits: ['1 point per $1', 'Birthday discount'] },
  { name: 'Gold', minPoints: 1000, color: 'text-accent-500', benefits: ['1.5 points per $1', 'Priority booking', 'Free cancellation'] },
  { name: 'Platinum', minPoints: 2500, color: 'text-purple-400', benefits: ['2 points per $1', 'VIP support', 'Exclusive styles'] },
  { name: 'Diamond', minPoints: 5000, color: 'text-blue-400', benefits: ['3 points per $1', 'Personal stylist', 'Premium perks'] }
]

const rewards = [
  {
    id: 1,
    title: '$5 Off Next Booking',
    cost: 50,
    description: 'Use on any service $25 or more',
    expiry: '30 days',
    available: true
  },
  {
    id: 2,
    title: '$10 Off Premium Services',
    cost: 100,
    description: 'Valid for hot towel shaves and premium cuts',
    expiry: '60 days',
    available: true
  },
  {
    id: 3,
    title: 'Free Beard Trim',
    cost: 250,
    description: 'Complimentary beard trim with any haircut',
    expiry: '90 days',
    available: true
  },
  {
    id: 4,
    title: '20% Off Entire Visit',
    cost: 500,
    description: 'Maximum discount of $50',
    expiry: '30 days',
    available: false
  }
]

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history'>('overview')
  const [showReferral, setShowReferral] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [transactions, setTransactions] = useState(mockTransactions)
  
  // Load wallet data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const walletData = localStorage.getItem('walletData')
      if (walletData) {
        const wallet = JSON.parse(walletData)
        setWalletBalance(wallet.balance || 0)
        setLoyaltyPoints(wallet.points || 0)
      }
      
      const savedTransactions = localStorage.getItem('walletTransactions')
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions)
        setTransactions(parsed.length > 0 ? parsed : mockTransactions)
      }
    }
  }, [])
  
  const user = {
    ...mockUser,
    walletBalance: walletBalance,
    loyaltyPoints: loyaltyPoints
  }

  const currentTier = loyaltyTiers.find(tier => 
    tier.minPoints <= user.loyaltyPoints && 
    (loyaltyTiers.indexOf(tier) === loyaltyTiers.length - 1 || 
     loyaltyTiers[loyaltyTiers.indexOf(tier) + 1].minPoints > user.loyaltyPoints)
  )

  const nextTier = loyaltyTiers[loyaltyTiers.indexOf(currentTier!) + 1]
  const pointsToNextTier = nextTier ? nextTier.minPoints - user.loyaltyPoints : 0

  const handleTopup = (amount: number) => {
    const bonus = topupOptions.find(opt => opt.amount === amount)?.bonus || 0
    const totalAmount = amount + bonus
    
    // Update wallet balance
    const newBalance = walletBalance + totalAmount
    setWalletBalance(newBalance)
    
    // Save to localStorage
    const walletData = { balance: newBalance, points: loyaltyPoints }
    localStorage.setItem('walletData', JSON.stringify(walletData))
    
    // Create transaction
    const transaction = {
      id: Date.now(),
      type: 'wallet_topup',
      amount: totalAmount,
      description: `Wallet Top-up${bonus > 0 ? ` + $${bonus} Bonus` : ''}`,
      date: new Date().toISOString().split('T')[0],
      pointsEarned: 0,
      status: 'completed'
    }
    
    // Update transactions
    const newTransactions = [transaction, ...transactions]
    setTransactions(newTransactions)
    localStorage.setItem('walletTransactions', JSON.stringify(newTransactions))
    
    alert(`Successfully added $${totalAmount} to your wallet!`)
  }

  const handleRedeemReward = (rewardId: number) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (reward && user.loyaltyPoints >= reward.cost) {
      // Deduct points
      const newPoints = loyaltyPoints - reward.cost
      setLoyaltyPoints(newPoints)
      
      // Save to localStorage
      const walletData = { balance: walletBalance, points: newPoints }
      localStorage.setItem('walletData', JSON.stringify(walletData))
      
      // Create transaction
      const transaction = {
        id: Date.now(),
        type: 'loyalty_redemption',
        amount: 0,
        description: `Redeemed: ${reward.title}`,
        date: new Date().toISOString().split('T')[0],
        pointsEarned: -reward.cost,
        status: 'completed'
      }
      
      const existingTransactions = JSON.parse(localStorage.getItem('walletTransactions') || '[]')
      existingTransactions.unshift(transaction)
      localStorage.setItem('walletTransactions', JSON.stringify(existingTransactions))
      setTransactions(existingTransactions)
      
      // Save redeemed reward to use later
      const redeemedRewards = JSON.parse(localStorage.getItem('redeemedRewards') || '[]')
      redeemedRewards.push({
        id: Date.now(),
        rewardId: reward.id,
        title: reward.title,
        description: reward.description,
        discount: parseFloat(reward.title.match(/\$(\d+)/)?.[1] || '0'),
        redeemedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        used: false
      })
      localStorage.setItem('redeemedRewards', JSON.stringify(redeemedRewards))
      
      alert(`✅ ${reward.title} redeemed successfully! Apply it during your next booking.`)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode)
    // Show toast notification
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <div className="bg-primary-900/80 backdrop-blur-lg border-b border-primary-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-primary-300 hover:text-white transition-colors">
                <ChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="font-display font-bold text-2xl text-white">My Wallet</h1>
                <p className="text-primary-300">View transactions and payments</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowReferral(true)}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Users size={16} className="mr-2" />
              Refer Friends
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Balance Card */}
        <div className="card bg-gradient-to-br from-accent-600 to-accent-700 border-accent-500 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-6 h-6 text-white fill-white" />
              <h3 className="font-semibold text-white">Wallet Balance</h3>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">${user.walletBalance.toFixed(2)}</span>
          </div>
          
          {/* Quick Top-up Buttons */}
          <div>
            <p className="text-white/80 text-sm mb-3">Quick Top-up:</p>
            <div className="grid grid-cols-4 gap-2">
              {topupOptions.map(option => (
                <button
                  key={option.amount}
                  onClick={() => handleTopup(option.amount)}
                  className={`relative bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-3 text-center transition-all hover:scale-105 ${
                    option.popular ? 'ring-2 ring-white' : ''
                  }`}
                >
                  {option.popular && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="font-bold text-lg">${option.amount}</div>
                  {option.bonus > 0 && (
                    <div className="text-xs text-green-300">+${option.bonus}</div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-white/60 text-xs mt-3 text-center">💡 Tip: Top up to earn bonus funds & use for instant bookings</p>
          </div>
        </div>

        {/* Loyalty Points Card */}
        <div className="mb-8">
          {/* Loyalty Points */}
          <div className="card bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-white fill-white" />
                <h3 className="font-semibold text-white">Loyalty Points</h3>
              </div>
              <div className={`px-3 py-1 rounded-full bg-white/20 ${currentTier?.color}`}>
                <span className="text-sm font-medium">{currentTier?.name}</span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-white">{user.loyaltyPoints.toLocaleString()}</span>
              <span className="text-white/80 text-sm ml-2">points</span>
            </div>
            {nextTier && (
              <div className="mt-3">
                <div className="flex justify-between text-white/80 text-sm mb-1">
                  <span>Progress to {nextTier.name}</span>
                  <span>{pointsToNextTier} points to go</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${((user.loyaltyPoints - currentTier!.minPoints) / (nextTier.minPoints - currentTier!.minPoints)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <TrendingUp className="w-8 h-8 text-accent-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">${user.totalSavings.toFixed(2)}</div>
            <div className="text-primary-300 text-sm">Total Savings</div>
          </div>
          <div className="card text-center">
            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-primary-300 text-sm">Bookings This Year</div>
          </div>
          <div className="card text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-primary-300 text-sm">Friends Referred</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-primary-800/50 p-1 rounded-xl">
          {[
            { key: 'overview' as const, label: 'Overview', icon: <Wallet size={18} /> },
            { key: 'rewards' as const, label: 'Rewards', icon: <Gift size={18} /> },
            { key: 'history' as const, label: 'History', icon: <Receipt size={18} /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key 
                  ? 'bg-accent-500 text-black' 
                  : 'text-primary-300 hover:text-white hover:bg-primary-700/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="flex items-center space-x-3 p-4 bg-primary-700/50 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Gift className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Redeem Rewards</div>
                    <div className="text-primary-300 text-sm">{user.loyaltyPoints} points available</div>
                  </div>
                </button>

                <Link href="/discover" className="flex items-center space-x-3 p-4 bg-primary-700/50 rounded-lg hover:bg-primary-700 transition-colors">
                  <Calendar className="w-6 h-6 text-green-500" />
                  <div className="text-left">
                    <div className="text-white font-medium">Book Appointment</div>
                    <div className="text-primary-300 text-sm">Find a barber near you</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Loyalty Progress */}
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Loyalty Program</h3>
              <div className="space-y-4">
                {loyaltyTiers.map(tier => {
                  const isCurrentTier = tier.name === currentTier?.name
                  const isPassed = user.loyaltyPoints >= tier.minPoints
                  
                  return (
                    <div key={tier.name} className={`flex items-center space-x-4 p-4 rounded-lg ${
                      isCurrentTier ? 'bg-accent-500/20 border border-accent-500' : 'bg-primary-800/30'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isPassed ? 'bg-accent-500' : 'bg-primary-600'
                      }`}>
                        {isPassed ? <Check size={16} className="text-black" /> : <span className={`text-xs ${tier.color}`}>{tier.name[0]}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${isPassed ? 'text-white' : 'text-primary-300'}`}>
                            {tier.name}
                          </span>
                          {isCurrentTier && <span className="text-xs bg-accent-500 text-black px-2 py-1 rounded-full">Current</span>}
                        </div>
                        <div className="text-sm text-primary-400">
                          {tier.minPoints > 0 ? `${tier.minPoints.toLocaleString()} points` : 'Starting tier'} • {tier.benefits.join(', ')}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Available Rewards</h3>
                <div className="text-accent-500 font-medium">
                  {user.loyaltyPoints} points available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map(reward => (
                  <div key={reward.id} className={`p-4 rounded-lg border-2 ${
                    reward.available && user.loyaltyPoints >= reward.cost
                      ? 'border-accent-500/50 bg-accent-500/5'
                      : 'border-primary-600 bg-primary-800/30'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{reward.title}</h4>
                        <p className="text-primary-300 text-sm">{reward.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-accent-500 font-bold">{reward.cost}</div>
                        <div className="text-primary-400 text-xs">points</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-primary-400 text-xs">
                        <Clock size={12} className="inline mr-1" />
                        Expires in {reward.expiry}
                      </div>
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!reward.available || user.loyaltyPoints < reward.cost}
                        className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {user.loyaltyPoints >= reward.cost ? 'Redeem' : 'Not enough points'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Transaction History</h3>
              
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-primary-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'booking_payment' ? 'bg-red-500/20' :
                        transaction.type === 'wallet_topup' ? 'bg-green-500/20' :
                        transaction.type === 'referral_bonus' ? 'bg-blue-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {transaction.type === 'booking_payment' ? <Calendar size={16} className="text-red-400" /> :
                         transaction.type === 'wallet_topup' ? <Plus size={16} className="text-green-400" /> :
                         transaction.type === 'referral_bonus' ? <Users size={16} className="text-blue-400" /> :
                         <Gift size={16} className="text-purple-400" />}
                      </div>
                      <div>
                        <div className="text-white font-medium">{transaction.description}</div>
                        <div className="text-primary-400 text-sm">{transaction.date}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${transaction.amount >= 0 ? 'text-green-400' : 'text-white'}`}>
                        {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      {transaction.pointsEarned !== 0 && (
                        <div className={`text-sm ${transaction.pointsEarned > 0 ? 'text-accent-400' : 'text-primary-400'}`}>
                          {transaction.pointsEarned > 0 ? '+' : ''}{transaction.pointsEarned} pts
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Referral Modal */}
        {showReferral && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-lg">Refer Friends</h3>
                <button onClick={() => setShowReferral(false)} className="text-primary-400 hover:text-white">
                  ×
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-black" />
                </div>
                <h4 className="font-semibold text-white mb-2">Invite friends and earn together!</h4>
                <p className="text-primary-300 text-sm">You both get $15 when they book their first appointment</p>
              </div>

              <div className="mb-4">
                <label className="block text-primary-300 text-sm mb-2">Your Referral Code</label>
                <div className="flex">
                  <input
                    type="text"
                    value={user.referralCode}
                    readOnly
                    className="input flex-1 rounded-r-none"
                  />
                  <button
                    onClick={copyReferralCode}
                    className="btn-primary px-4 rounded-l-none"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <button className="btn-primary w-full">
                <Share2 size={16} className="mr-2" />
                Share with Friends
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
