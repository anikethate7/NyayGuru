import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { motion } from 'framer-motion'; // We'll add framer-motion for animations

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active indicators
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  
  // Auto-scroll state
  const [autoScrollFeatures, setAutoScrollFeatures] = useState(true);
  const [autoScrollCategories, setAutoScrollCategories] = useState(true);
  
  // Refs for scrolling
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  
  // Feature cards configuration
  const featureCards = [
    { 
      id: "chat", 
      title: "Legal Chat", 
      icon: "bi-chat-dots-fill",
      description: "Get answers to your legal questions with our advanced AI assistant.",
      buttonText: "Start Chat",
      route: "/chat",
      highlight: true,
      color: "#4361EE" // Add color for each card
    },
    { 
      id: "documents", 
      title: "Document Analysis", 
      icon: "bi-file-text-fill",
      description: "Upload and analyze legal documents to extract insights.",
      buttonText: "Analyze Documents",
      route: "/documents",
      color: "#3A0CA3"
    },
    { 
      id: "lawyers", 
      title: "Lawyer Support", 
      icon: "bi-person-badge-fill",
      description: "Connect with verified lawyers for professional legal consultation.",
      buttonText: "Find Lawyers",
      route: "/lawyers",
      color: "#4CC9F0"
    },
    { 
      id: "dictionary", 
      title: "Legal Dictionary", 
      icon: "bi-book-fill",
      description: "Access a comprehensive dictionary of legal terms and concepts.",
      buttonText: "Browse Dictionary",
      route: "/dictionary",
      color: "#F72585"
    }
  ];
  
  // Popular legal categories
  const popularCategories = [
    { name: 'Criminal Law', path: '/chat', icon: 'bi-shield-fill', color: '#e63946' },
    { name: 'Property Law', path: '/chat', icon: 'bi-house-fill', color: '#457b9d' },
    { name: 'Family Law', path: '/chat', icon: 'bi-people-fill', color: '#2a9d8f' },
    { name: 'Cyber Law', path: '/chat', icon: 'bi-laptop-fill', color: '#4895ef' },
    { name: 'Corporate Law', path: '/chat', icon: 'bi-building-fill', color: '#6a4c93' },
    { name: 'Civil Law', path: '/chat', icon: 'bi-bank2', color: '#f77f00' },
    { name: 'Tax Law', path: '/chat', icon: 'bi-cash-stack', color: '#006400' },
    { name: 'Labor Law', path: '/chat', icon: 'bi-briefcase-fill', color: '#9c6644' },
    { name: 'Environmental Law', path: '/chat', icon: 'bi-tree-fill', color: '#38b000' },
    { name: 'Immigration Law', path: '/chat', icon: 'bi-globe', color: '#0077b6' },
    { name: 'Intellectual Property', path: '/chat', icon: 'bi-lightbulb-fill', color: '#ffba08' },
    { name: 'Constitutional Law', path: '/chat', icon: 'bi-journal-text', color: '#6c757d' }
  ];

  // Handle scroll events to update active indicators
  useEffect(() => {
    const handleFeatureScroll = () => {
      if (featuresRef.current) {
        const scrollLeft = featuresRef.current.scrollLeft;
        const cardWidth = 320 + 24; // card width + gap
        const index = Math.round(scrollLeft / cardWidth);
        setActiveFeatureIndex(Math.min(index, featureCards.length - 1));
      }
    };
    
    const handleCategoryScroll = () => {
      if (categoriesRef.current) {
        const scrollLeft = categoriesRef.current.scrollLeft;
        const cardWidth = 180 + 24; // card width + gap
        const index = Math.round(scrollLeft / cardWidth);
        setActiveCategoryIndex(Math.min(index, popularCategories.length - 1));
      }
    };
    
    const featuresElement = featuresRef.current;
    const categoriesElement = categoriesRef.current;
    
    if (featuresElement) {
      featuresElement.addEventListener('scroll', handleFeatureScroll);
    }
    
    if (categoriesElement) {
      categoriesElement.addEventListener('scroll', handleCategoryScroll);
    }
    
    return () => {
      if (featuresElement) {
        featuresElement.removeEventListener('scroll', handleFeatureScroll);
      }
      if (categoriesElement) {
        categoriesElement.removeEventListener('scroll', handleCategoryScroll);
      }
    };
  }, [featureCards.length, popularCategories.length]);

  // Auto-scroll functionality
  useEffect(() => {
    let featuresInterval;
    let categoriesInterval;
    
    if (autoScrollFeatures) {
      featuresInterval = setInterval(() => {
        if (featuresRef.current) {
          const nextIndex = (activeFeatureIndex + 1) % featureCards.length;
          scrollToIndex(featuresRef, nextIndex, 'feature');
        }
      }, 4000);
    }
    
    if (autoScrollCategories) {
      categoriesInterval = setInterval(() => {
        if (categoriesRef.current) {
          const nextIndex = (activeCategoryIndex + 1) % popularCategories.length;
          scrollToIndex(categoriesRef, nextIndex, 'category');
        }
      }, 3500);
    }
    
    return () => {
      clearInterval(featuresInterval);
      clearInterval(categoriesInterval);
    };
  }, [activeFeatureIndex, activeCategoryIndex, autoScrollFeatures, autoScrollCategories, featureCards.length, popularCategories.length]);

  const handleFeatureClick = (card) => {
    if (card.comingSoon) {
      alert(`${card.title} feature is coming soon!`);
    } else {
      navigate(card.route);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/chat?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Scroll handlers
  const scroll = (ref, direction) => {
    if (ref.current) {
      const cardWidth = ref === featuresRef ? 344 : 204; // card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Pause auto-scroll when manually scrolling
      if (ref === featuresRef) {
        setAutoScrollFeatures(false);
        setTimeout(() => setAutoScrollFeatures(true), 8000);
      } else {
        setAutoScrollCategories(false);
        setTimeout(() => setAutoScrollCategories(true), 8000);
      }
    }
  };
  
  // Scroll to specific index
  const scrollToIndex = (ref, index, itemType) => {
    if (ref.current) {
      const cardWidth = itemType === 'feature' ? 344 : 204; // card width + gap
      ref.current.scrollTo({ 
        left: index * cardWidth, 
        behavior: 'smooth' 
      });
    }
  };

  // Pause auto-scroll on mouse enter
  const handleMouseEnter = (section) => {
    if (section === 'features') {
      setAutoScrollFeatures(false);
    } else {
      setAutoScrollCategories(false);
    }
  };

  // Resume auto-scroll on mouse leave
  const handleMouseLeave = (section) => {
    if (section === 'features') {
      setAutoScrollFeatures(true);
    } else {
      setAutoScrollCategories(true);
    }
  };

  // Animation variants for framer-motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="home-page">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div 
            className="hero-left"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1>Nyay<span style={{ fontWeight: 400 }}>Guru</span></h1>
            <h2>Your AI Legal Assistant</h2>
            <p>Get reliable legal guidance powered by advanced AI technology</p>
            
            <motion.form 
              onSubmit={handleSearch} 
              className="search-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Ask a legal question..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <motion.button 
                  type="submit" 
                  className="search-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-search"></i>
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
              <motion.g 
                fill="none" 
                stroke="#4A90E2" 
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {/* Scale of Justice */}
                <motion.line 
                  x1="400" y1="100" x2="400" y2="500" strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                />
                <motion.circle 
                  cx="400" cy="100" r="20" fill="#4A90E2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                />
                <motion.circle 
                  cx="400" cy="500" r="20" fill="#4A90E2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                />
                
                {/* Left Scale */}
                <motion.line 
                  x1="400" y1="200" x2="200" y2="300" strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.3 }}
                />
                <motion.circle 
                  cx="200" cy="300" r="15" fill="#4A90E2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                />
                
                {/* Right Scale */}
                <motion.line 
                  x1="400" y1="200" x2="600" y2="300" strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.3 }}
                />
                <motion.circle 
                  cx="600" cy="300" r="15" fill="#4A90E2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                />
                
                {/* Book */}
                <motion.rect 
                  x="300" y="350" width="200" height="100" rx="10" fill="#4A90E2" fillOpacity="0.1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                />
                <motion.line 
                  x1="350" y1="380" x2="450" y2="380" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 2.1 }}
                />
                <motion.line 
                  x1="350" y1="400" x2="450" y2="400" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                />
                <motion.line 
                  x1="350" y1="420" x2="450" y2="420" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 2.3 }}
                />
              </motion.g>
            </svg>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        id="services-section" 
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <h3>Our Legal Services</h3>
        <div className="scroll-container">
          <motion.button 
            className="scroll-button left" 
            onClick={() => scroll(featuresRef, 'left')}
            aria-label="Scroll left"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="bi bi-chevron-left"></i>
          </motion.button>
          <motion.div 
            className="feature-cards" 
            ref={featuresRef}
            onMouseEnter={() => handleMouseEnter('features')}
            onMouseLeave={() => handleMouseLeave('features')}
            variants={staggerContainer}
          >
            {featureCards.map((card, index) => (
              <motion.div 
                key={card.id} 
                className={`feature-card ${card.comingSoon ? 'coming-soon' : ''} ${card.highlight ? 'highlight' : ''}`}
                onClick={() => handleFeatureClick(card)}
                style={{ 
                  background: `linear-gradient(145deg, ${card.color}10, ${card.color}30)`,
                  borderColor: `${card.color}40`
                }}
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: `0 10px 25px ${card.color}40`,
                  y: -10
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="card-icon"
                  style={{ backgroundColor: `${card.color}30`, color: card.color }}
                >
                  <i className={`bi ${card.icon}`}></i>
                </div>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
                <motion.button 
                  className={`card-button ${card.comingSoon ? 'disabled' : ''} ${card.highlight ? 'highlight-btn' : ''}`}
                  style={{ 
                    backgroundColor: card.comingSoon ? '#ccc' : card.color,
                    boxShadow: `0 4px 15px ${card.color}40`
                  }}
                  whileHover={!card.comingSoon ? { scale: 1.05 } : {}}
                  whileTap={!card.comingSoon ? { scale: 0.95 } : {}}
                >
                  {card.buttonText}
                  {card.comingSoon && <span className="soon-badge">Soon</span>}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
          <motion.button 
            className="scroll-button right" 
            onClick={() => scroll(featuresRef, 'right')}
            aria-label="Scroll right"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="bi bi-chevron-right"></i>
          </motion.button>
          
          <div className="scroll-indicator">
            {featureCards.map((_, index) => (
              <motion.div 
                key={index}
                className={`indicator-dot ${index === activeFeatureIndex ? 'active' : ''}`}
                onClick={() => scrollToIndex(featuresRef, index, 'feature')}
                whileHover={{ scale: 1.5 }}
                style={index === activeFeatureIndex ? { backgroundColor: featureCards[index].color } : {}}
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        id="categories-section" 
        className="categories-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <h3>Popular Legal Categories</h3>
        <div className="scroll-container">
          <motion.button 
            className="scroll-button left" 
            onClick={() => scroll(categoriesRef, 'left')}
            aria-label="Scroll left"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="bi bi-chevron-left"></i>
          </motion.button>
          <motion.div 
            className="category-cards" 
            ref={categoriesRef}
            onMouseEnter={() => handleMouseEnter('categories')}
            onMouseLeave={() => handleMouseLeave('categories')}
            variants={staggerContainer}
          >
            {popularCategories.map((category, index) => (
              <motion.div 
                key={index} 
                className="category-card"
                onClick={() => navigate(category.path)}
                style={{ 
                  background: `linear-gradient(145deg, ${category.color}10, ${category.color}30)`,
                  borderColor: `${category.color}40`
                }}
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: `0 10px 20px ${category.color}30`,
                  y: -5
                }}
                whileTap={{ scale: 0.98 }}
              >
                <i 
                  className={`bi ${category.icon}`}
                  style={{ color: category.color }}
                ></i>
                <span>{category.name}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.button 
            className="scroll-button right" 
            onClick={() => scroll(categoriesRef, 'right')}
            aria-label="Scroll right"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="bi bi-chevron-right"></i>
          </motion.button>
          
          <div className="scroll-indicator">
            {popularCategories.map((_, index) => (
              <motion.div 
                key={index}
                className={`indicator-dot ${index === activeCategoryIndex ? 'active' : ''}`}
                onClick={() => scrollToIndex(categoriesRef, index, 'category')}
                whileHover={{ scale: 1.5 }}
                style={index === activeCategoryIndex ? { backgroundColor: popularCategories[index].color } : {}}
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        id="benefits-section" 
        className="benefits-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <h3>Why Choose NyayGuru?</h3>
        <motion.div 
          className="benefits-grid"
          variants={staggerContainer}
        >
          <motion.div 
            className="benefit-item"
            variants={scaleIn}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f8f9fa"
            }}
          >
            <i className="bi bi-shield-check"></i>
            <h4>Reliable Information</h4>
            <p>Backed by verified legal resources</p>
          </motion.div>
          <motion.div 
            className="benefit-item"
            variants={scaleIn}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f8f9fa"
            }}
          >
            <i className="bi bi-lightning-charge"></i>
            <h4>Quick Answers</h4>
            <p>Get instant responses to your questions</p>
          </motion.div>
          <motion.div 
            className="benefit-item"
            variants={scaleIn}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f8f9fa"
            }}
          >
            <i className="bi bi-translate"></i>
            <h4>Multi-language Support</h4>
            <p>Available in English, Hindi, and Marathi</p>
          </motion.div>
          <motion.div 
            className="benefit-item"
            variants={scaleIn}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f8f9fa"
            }}
          >
            <i className="bi bi-lock"></i>
            <h4>Secure & Confidential</h4>
            <p>Your information is protected and private</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage; 