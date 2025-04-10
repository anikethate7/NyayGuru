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
      color: "#6c63ff" // Updated to new primary color
    },
    { 
      id: "documents", 
      title: "Document Analysis", 
      icon: "bi-file-text-fill",
      description: "Upload and analyze legal documents to extract insights.",
      buttonText: "Analyze Documents",
      route: "/documents",
      color: "#5a52d5" // Updated darker shade
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
            
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ask a legal question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </motion.div>
          
          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
              width="100%"
              height="auto"
              viewBox="0 0 974.75 748.45"
            >
              <path
                d="M960.89,729.28l6.33,31h7.05c2.4,0,4.36,4.37,4.36,9.74s-1.96,9.74-4.36,9.74H656.52c-2.4,0-4.36-4.37-4.36-9.74s1.96-9.74,4.36-9.74h7.05l6.33-31Z"
                transform="translate(-112.63 -75.78)"
                fill="#e6e6e6"
              />
              <path
                d="M1020.43,767.93c0,2.21-42.06,4-93.93,4s-93.93-1.79-93.93-4,42.06-4,93.93-4,93.93,1.79,93.93,4Z"
                transform="translate(-112.63 -75.78)"
                fill="#e6e6e6"
              />
              <path
                d="M960.57,727.76c7.47,16.14,15.53,33.52,15.53,33.52h2.2l-6.2-34.52-11.53,1Z"
                transform="translate(-112.63 -75.78)"
                fill="#6c63ff"
              />
              <path
                d="M671.41,761.28h2.2s8.06-17.39,15.53-33.52l-11.53-1-6.2,34.52Z"
                transform="translate(-112.63 -75.78)"
                fill="#6c63ff"
              />
              {/* Rest of SVG path data omitted for brevity */}
            </svg>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="features-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeInUp}>Explore Our Legal Services</motion.h3>
        
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => scroll(featuresRef, 'left')}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <div 
            className="feature-cards" 
            ref={featuresRef}
            onMouseEnter={() => handleMouseEnter('features')}
            onMouseLeave={() => handleMouseLeave('features')}
          >
            {featureCards.map((card, index) => (
              <motion.div 
                key={card.id}
                className={`feature-card ${card.highlight ? 'highlight' : ''} ${card.comingSoon ? 'coming-soon' : ''}`}
                variants={scaleIn}
                onClick={() => handleFeatureClick(card)}
              >
                {card.comingSoon && <div className="soon-badge">Soon</div>}
                <div className="card-icon" style={{color: card.color}}>
                  <i className={`bi ${card.icon}`}></i>
                </div>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
                <button 
                  className={`card-button ${card.highlight ? 'highlight-btn' : ''} ${card.comingSoon ? 'disabled' : ''}`}
                >
                  {card.buttonText} <i className="bi bi-arrow-right"></i>
                </button>
              </motion.div>
            ))}
          </div>
          
          <button 
            className="scroll-button right" 
            onClick={() => scroll(featuresRef, 'right')}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        
        <div className="scroll-indicator">
          {featureCards.map((_, index) => (
            <div 
              key={index}
              className={`indicator-dot ${index === activeFeatureIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(featuresRef, index, 'feature')}
            ></div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className="categories-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeInUp}>Explore Legal Categories</motion.h3>
        
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => scroll(categoriesRef, 'left')}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <div 
            className="category-cards" 
            ref={categoriesRef}
            onMouseEnter={() => handleMouseEnter('categories')}
            onMouseLeave={() => handleMouseLeave('categories')}
          >
            {popularCategories.map((category, index) => (
              <motion.div 
                key={index}
                className="category-card"
                variants={scaleIn}
                onClick={() => navigate(`${category.path}?category=${encodeURIComponent(category.name)}`)}
              >
                <i className={`bi ${category.icon}`} style={{color: category.color}}></i>
                <span>{category.name}</span>
              </motion.div>
            ))}
          </div>
          
          <button 
            className="scroll-button right" 
            onClick={() => scroll(categoriesRef, 'right')}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        
        <div className="scroll-indicator">
          {popularCategories.map((_, index) => (
            <div 
              key={index}
              className={`indicator-dot ${index === activeCategoryIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(categoriesRef, index, 'category')}
            ></div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className="benefits-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeInUp}>Why Choose NyayGuru</motion.h3>
        
        <div className="benefits-grid">
          <motion.div className="benefit-item" variants={fadeInUp}>
            <i className="bi bi-shield-check"></i>
            <h4>Reliable Guidance</h4>
            <p>AI-powered legal assistance based on Indian law and legal precedents</p>
          </motion.div>
          
          <motion.div className="benefit-item" variants={fadeInUp}>
            <i className="bi bi-lightning-charge"></i>
            <h4>Instant Answers</h4>
            <p>Get immediate responses to your legal questions 24/7</p>
          </motion.div>
          
          <motion.div className="benefit-item" variants={fadeInUp}>
            <i className="bi bi-person-check"></i>
            <h4>Expert Support</h4>
            <p>Connect with verified lawyers for professional consultation</p>
          </motion.div>
          
          <motion.div className="benefit-item" variants={fadeInUp}>
            <i className="bi bi-lock"></i>
            <h4>Private & Secure</h4>
            <p>Your data and conversations are encrypted and confidential</p>
          </motion.div>
          
          <motion.div className="benefit-item" variants={fadeInUp}>
            <i className="bi bi-translate"></i>
            <h4>Multi-language</h4>
            <p>Support for multiple Indian languages to serve diverse users</p>
          </motion.div>
          
          <motion.div className="benefit-item" variants={fadeInUp}>
            <i className="bi bi-currency-rupee"></i>
            <h4>Affordable</h4>
            <p>Cost-effective legal assistance accessible to everyone</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage; 