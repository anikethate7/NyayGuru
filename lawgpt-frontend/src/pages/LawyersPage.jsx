import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/LawyersPage.css';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const LawyersPage = () => {
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [specialization, setSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [minExperience, setMinExperience] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list view

  // Specializations array
  const specializations = [
    'Criminal Law', 'Family Law', 'Property Law', 'Corporate Law',
    'Civil Law', 'Cyber Law', 'Tax Law', 'Labor Law',
    'Environmental Law', 'Immigration Law', 'Intellectual Property', 'Constitutional Law'
  ];

  useEffect(() => {
    // Fetch lawyers from API
    const fetchLawyers = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (specialization) params.append('specialization', specialization);
        if (minExperience > 0) params.append('min_experience', minExperience);
        if (searchQuery) params.append('search', searchQuery);
        params.append('sort_by', sortBy);

        // Make API request
        const response = await axios.get(`${API_BASE_URL}/lawyers/?${params.toString()}`);
        
        if (response.status === 200) {
          setLawyers(response.data);
        } else {
          throw new Error('Failed to fetch lawyers');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lawyers:', err);
        setError('Failed to load lawyers. Please try again later.');
        setLoading(false);
        
        // Fallback to mock data in development or when API is unavailable
        if (import.meta.env.DEV) {
          console.log('Falling back to mock data in development mode');
          setTimeout(() => {
            setLawyers(mockLawyers);
            setLoading(false);
            setError(null);
          }, 800);
        }
      }
    };
    
    fetchLawyers();
  }, [specialization, minExperience, sortBy, searchQuery]);

  // Apply client-side sorting if needed (should be handled by API with sort_by)
  const filteredLawyers = lawyers;

  // Handle view profile button click
  const handleViewProfile = (lawyerId) => {
    navigate(`/lawyers/${lawyerId}`);
  };

  // Handle chat button click
  const handleStartChat = (lawyerId) => {
    navigate(`/chat/lawyer/${lawyerId}`);
  };

  // Animation variants
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="lawyers-loading">
        <div className="spinner"></div>
        <p>Looking for legal experts...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="lawyers-error">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          <i className="bi bi-arrow-clockwise"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="lawyers-page">
      {/* Hero Section */}
      <div className="lawyers-hero-wrapper">
        <motion.div 
          className="lawyers-hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="lawyers-hero-content">
            <motion.div 
              className="lawyers-hero-text"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h1>Expert <span>Legal</span> Advice</h1>
              <p>Connect with verified legal professionals for personalized consultation</p>
              <div className="hero-cta-buttons">
                <motion.button 
                  className="primary-cta-btn"
                  onClick={() => document.querySelector('.lawyers-filters').scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-search"></i> Find Lawyers
                </motion.button>
                <motion.button 
                  onClick={() => navigate('/lawyer-registration')} 
                  className="secondary-cta-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-person-plus-fill"></i> Register as a Lawyer
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <div className="lawyers-main-content">
        <motion.div 
          className="lawyers-content-container"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Search and Filter Section */}
          <motion.div className="filters-container" variants={fadeInUp}>
            <div className="section-header">
              <h2>Find Legal Experts</h2>
              <p>Search and filter to find the right legal professional for your needs</p>
            </div>
            
            <div className="lawyers-filters">
              <div className="search-bar">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search by name, expertise or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="clear-search" 
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
              
              <div className="filters-row">
                <div className="filter-group">
                  <label>
                    <i className="bi bi-briefcase-fill"></i> Specialization
                  </label>
                  <select 
                    value={specialization} 
                    onChange={(e) => setSpecialization(e.target.value)}
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>
                    <i className="bi bi-sort-down"></i> Sort By
                  </label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="rating">Highest Rating</option>
                    <option value="experience">Most Experienced</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>
                    <i className="bi bi-calendar-check"></i> Experience
                  </label>
                  <select 
                    value={minExperience} 
                    onChange={(e) => setMinExperience(Number(e.target.value))}
                  >
                    <option value="0">Any Experience</option>
                    <option value="2">2+ Years</option>
                    <option value="5">5+ Years</option>
                    <option value="10">10+ Years</option>
                    <option value="15">15+ Years</option>
                  </select>
                </div>
                
                <div className="view-toggle">
                  <button 
                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </button>
                  <button 
                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <i className="bi bi-list-ul"></i>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Results Counter */}
          <motion.div className="lawyers-results-info" variants={fadeInUp}>
            <div className="results-count">
              <i className="bi bi-people-fill"></i>
              <p><strong>{filteredLawyers.length}</strong> lawyers available</p>
            </div>
            
            {(specialization || minExperience > 0 || searchQuery) && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSpecialization('');
                  setSortBy('rating');
                  setMinExperience(0);
                  setSearchQuery('');
                }}
              >
                <i className="bi bi-x-circle"></i> Clear Filters
              </button>
            )}
          </motion.div>
          
          {/* Lawyers List/Grid */}
          <motion.div 
            className={`lawyers-${viewMode}`}
            variants={staggerContainer}
          >
            {filteredLawyers.length === 0 ? (
              <motion.div 
                className="no-lawyers-found"
                variants={fadeInUp}
              >
                <div className="empty-state-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h3>No lawyers found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button 
                  className="reset-search-btn"
                  onClick={() => {
                    setSpecialization('');
                    setSortBy('rating');
                    setMinExperience(0);
                    setSearchQuery('');
                  }}
                >
                  Reset Search
                </button>
              </motion.div>
            ) : (
              filteredLawyers.map(lawyer => (
                <motion.div 
                  key={lawyer.id} 
                  className="lawyer-card"
                  variants={scaleIn}
                  onClick={() => handleViewProfile(lawyer.id)}
                >
                  {lawyer.verified && (
                    <div className="verification-badge" title="Verified Professional">
                      <i className="bi bi-patch-check-fill"></i>
                    </div>
                  )}
                  
                  <div className="lawyer-card-header">
                    <div className="lawyer-avatar">
                      {lawyer.profilePicture ? (
                        <img src={lawyer.profilePicture} alt={lawyer.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          <i className="bi bi-person-fill"></i>
                        </div>
                      )}
                      <div className={`status-indicator ${lawyer.online ? 'online' : 'offline'}`}></div>
                    </div>
                    <div className="lawyer-info">
                      <h3>{lawyer.name}</h3>
                      <div className="specialization-badge">
                        <i className="bi bi-briefcase-fill"></i>
                        <span>{lawyer.specialization}</span>
                      </div>
                      <div className="lawyer-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi ${i < Math.floor(lawyer.rating) ? 'bi-star-fill' : i < lawyer.rating ? 'bi-star-half' : 'bi-star'}`}
                            ></i>
                          ))}
                        </div>
                        <span>{lawyer.rating.toFixed(1)}</span>
                        <span className="review-count">({lawyer.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lawyer-details">
                    <div className="detail-badge">
                      <i className="bi bi-briefcase"></i>
                      <span>{lawyer.experience} years</span>
                    </div>
                    <div className="detail-badge">
                      <i className="bi bi-geo-alt"></i>
                      <span>{lawyer.location}</span>
                    </div>
                    <div className="detail-badge">
                      <i className="bi bi-translate"></i>
                      <span>{lawyer.languages.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="lawyer-bio-section">
                    <p className="lawyer-bio">{lawyer.bio?.substring(0, 140)}...</p>
                  </div>
                  
                  <div className="lawyer-card-footer">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(lawyer.id);
                      }} 
                      className="view-profile-btn"
                    >
                      <i className="bi bi-person-lines-fill"></i> View Profile
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartChat(lawyer.id);
                      }} 
                      className={`chat-button ${!lawyer.online ? 'offline-button' : ''}`}
                      disabled={!lawyer.online && !lawyer.allowOfflineMessages}
                    >
                      {lawyer.online ? (
                        <>
                          <i className="bi bi-chat-text-fill"></i> Chat Now
                        </>
                      ) : lawyer.allowOfflineMessages ? (
                        <>
                          <i className="bi bi-envelope-fill"></i> Leave Message
                        </>
                      ) : (
                        <>
                          <i className="bi bi-clock-fill"></i> Offline
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* CTA Section */}
      <motion.div 
        className="lawyers-cta-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="cta-content">
          <h2>Are You a Legal Professional?</h2>
          <p>Join our platform to connect with clients seeking legal advice and grow your practice</p>
          <button 
            className="register-lawyer-cta"
            onClick={() => navigate('/lawyer-registration')}
          >
            <i className="bi bi-person-plus-fill"></i> Register as a Lawyer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Mock data for development and fallback
const mockLawyers = [
  {
    id: 1,
    name: 'Adv. Rahul Sharma',
    specialization: 'Criminal Law',
    experience: 12,
    rating: 4.8,
    reviewCount: 52,
    languages: ['English', 'Hindi', 'Marathi'],
    location: 'Mumbai, Maharashtra',
    online: true,
    verified: true,
    bio: 'Experienced criminal lawyer with expertise in handling serious criminal cases, bail applications, and appeals. Former public prosecutor with excellent track record.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 2,
    name: 'Adv. Priya Patel',
    specialization: 'Family Law',
    experience: 8,
    rating: 4.9,
    reviewCount: 47,
    languages: ['English', 'Gujarati', 'Hindi'],
    location: 'Ahmedabad, Gujarat',
    online: false,
    verified: true,
    bio: 'Dedicated family lawyer specializing in divorce, child custody, maintenance, and domestic violence cases with compassionate approach to sensitive family matters.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 3,
    name: 'Adv. Vikram Singh',
    specialization: 'Corporate Law',
    experience: 15,
    rating: 4.7,
    reviewCount: 38,
    languages: ['English', 'Hindi', 'Punjabi'],
    location: 'Delhi, NCR',
    online: true,
    verified: true,
    bio: 'Corporate lawyer with extensive experience in mergers & acquisitions, company formation, corporate governance, and commercial contracts for businesses of all sizes.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 4,
    name: 'Adv. Ananya Krishnan',
    specialization: 'Property Law',
    experience: 7,
    rating: 4.5,
    reviewCount: 29,
    languages: ['English', 'Tamil', 'Malayalam'],
    location: 'Chennai, Tamil Nadu',
    online: false,
    verified: true,
    bio: 'Property law specialist handling property disputes, registration, land acquisition, and tenant-landlord issues. Previously worked with Tamil Nadu Housing Board.',
    profilePicture: null,
    allowOfflineMessages: false
  },
  {
    id: 5,
    name: 'Adv. Mohammad Farhan',
    specialization: 'Civil Law',
    experience: 10,
    rating: 4.6,
    reviewCount: 41,
    languages: ['English', 'Hindi', 'Urdu'],
    location: 'Lucknow, Uttar Pradesh',
    online: true,
    verified: true,
    bio: 'Civil litigation expert specializing in consumer disputes, recovery suits, civil rights, and injunction matters with strong negotiation and courtroom skills.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 6,
    name: 'Adv. Neha Joshi',
    specialization: 'Cyber Law',
    experience: 5,
    rating: 4.4,
    reviewCount: 18,
    languages: ['English', 'Hindi', 'Marathi'],
    location: 'Pune, Maharashtra',
    online: true,
    verified: true,
    bio: 'Cyber law specialist handling cases of online fraud, privacy violations, data protection, digital rights, and technology contracts. Certified in Digital Forensics.',
    profilePicture: null,
    allowOfflineMessages: true
  }
];

export default LawyersPage; 