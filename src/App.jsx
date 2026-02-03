import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// SafeIcon Component - converts kebab-case to PascalCase
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const [IconComponent, setIconComponent] = useState(null)
  
  useEffect(() => {
    const loadIcon = async () => {
      try {
        const { icons } = await import('lucide-react')
        // Convert kebab-case to PascalCase
        const pascalName = name
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')
        
        const Icon = icons[pascalName] || icons.HelpCircle
        setIconComponent(() => Icon)
      } catch (error) {
        // Fallback to HelpCircle if import fails
        const { HelpCircle } = await import('lucide-react')
        setIconComponent(() => HelpCircle)
      }
    }
    
    loadIcon()
  }, [name])
  
  if (!IconComponent) {
    return <div style={{ width: size, height: size }} className={className} />
  }
  
  return <IconComponent size={size} className={className} color={color} />
}

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (!isInView) return
    
    let startTime = null
    const startValue = 0
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart)
      
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, target, duration])
  
  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <SafeIcon name={icon} size={28} className="text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// Stat Card Component
const StatCard = ({ value, suffix, label, icon, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="text-center p-6"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 mb-4">
        <SafeIcon name={icon} size={24} className="text-cyan-400" />
      </div>
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div className="text-slate-400 font-medium">{label}</div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }
  
  const features = [
    {
      icon: 'shield-check',
      title: 'Security First',
      description: 'Audited by leading security firms with multi-sig protection and real-time monitoring systems.'
    },
    {
      icon: 'trending-up',
      title: 'High Yield Farming',
      description: 'Earn competitive APYs up to 25% on your crypto assets with automated yield optimization.'
    },
    {
      icon: 'zap',
      title: 'Lightning Fast',
      description: 'Transactions confirmed in seconds with minimal gas fees across multiple blockchain networks.'
    },
    {
      icon: 'wallet',
      title: 'Easy Integration',
      description: 'Connect with MetaMask, WalletConnect, and 20+ popular wallets instantly.'
    },
    {
      icon: 'lock',
      title: 'Non-Custodial',
      description: 'You retain full control of your funds. We never hold your private keys or assets.'
    },
    {
      icon: 'globe',
      title: 'Multi-Chain',
      description: 'Access DeFi opportunities across Ethereum, BSC, Polygon, Arbitrum, and more.'
    }
  ]
  
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <SafeIcon name="hexagon" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Nexus<span className="text-cyan-400">DeFi</span>
              </span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center gap-8"
            >
              {['Features', 'Stats', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25">
                Launch App
              </button>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4 border-t border-slate-800/50"
              >
                <div className="flex flex-col gap-4 pt-4">
                  {['Features', 'Stats', 'About'].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="text-slate-300 hover:text-cyan-400 transition-colors font-medium text-left"
                    >
                      {item}
                    </button>
                  ))}
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold w-full">
                    Launch App
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-sm font-semibold">Now Live on Mainnet</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight"
            >
              The Future of{' '}
              <span className="text-gradient">Decentralized</span>{' '}
              Finance
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Nexus DeFi is a next-generation protocol offering high-yield farming, 
              secure staking, and seamless cross-chain DeFi experiences. 
              Start earning passive income on your crypto today.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 min-h-[56px]">
                Connect Wallet
                <SafeIcon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-slate-800/50 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 min-h-[56px]">
                <SafeIcon name="book-open" size={20} />
                Documentation
              </button>
            </motion.div>
            
            {/* Trusted By */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 pt-8 border-t border-slate-800/50"
            >
              <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider font-semibold">Trusted by leading protocols</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                {['ethereum', 'bitcoin', 'layers', 'box', 'diamond', 'hexagon'].map((icon, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400">
                    <SafeIcon name={icon} size={24} />
                    <span className="font-bold">Partner {i + 1}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value={450} suffix="M+" label="Total Value Locked" icon="lock" delay={0} />
              <StatCard value={125} suffix="K+" label="Active Users" icon="users" delay={0.1} />
              <StatCard value={25} suffix="%" label="Max APY" icon="trending-up" delay={0.2} />
              <StatCard value={12} suffix="" label="Supported Chains" icon="link" delay={0.3} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Why Choose <span className="text-gradient">Nexus</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Built with security, efficiency, and user experience at its core. 
              Experience the next evolution of DeFi.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Ready to Start <span className="text-gradient">Earning?</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join over 125,000 users already earning passive income on Nexus DeFi. 
              No minimum deposit, no lock-up periods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 min-h-[60px]">
                <SafeIcon name="wallet" size={24} />
                Connect Wallet Now
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all border border-slate-700 flex items-center justify-center gap-2 min-h-[60px]">
                <SafeIcon name="download" size={24} />
                Download Whitepaper
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <SafeIcon name="hexagon" size={24} className="text-white" />
                </div>
                <span className="text-2xl font-black text-white">
                  Nexus<span className="text-cyan-400">DeFi</span>
                </span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                Next-generation decentralized finance protocol offering high-yield 
                farming, secure staking, and seamless cross-chain experiences.
              </p>
              <div className="flex gap-4">
                {['twitter', 'github', 'send', 'message-circle'].map((social) => (
                  <button 
                    key={social}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-500/20 flex items-center justify-center transition-colors group"
                  >
                    <SafeIcon name={social} size={20} className="text-slate-400 group-hover:text-cyan-400" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                {['Yield Farming', 'Staking', 'Governance', 'Bridge'].map((item) => (
                  <li key={item}>
                    <button className="text-slate-400 hover:text-cyan-400 transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'Whitepaper', 'Audits', 'FAQ'].map((item) => (
                  <li key={item}>
                    <button className="text-slate-400 hover:text-cyan-400 transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Nexus DeFi. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </button>
              <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App