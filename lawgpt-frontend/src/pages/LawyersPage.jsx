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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="lawyers-loading">
        <div className="spinner"></div>
        <p>Loading lawyers...</p>
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
      <div className="lawyers-header">
        <h1>Find a Lawyer</h1>
        <p>Connect with verified legal professionals for consultation</p>
        <button 
          onClick={() => navigate('/lawyer-registration')} 
          className="register-lawyer-btn"
        >
          <i className="bi bi-person-plus-fill"></i> Register as a Lawyer
        </button>
      </div>
      
      <div className="lawyers-filters">
        <div className="filter-group search">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Specialization</label>
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
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">Highest Rating</option>
            <option value="experience">Most Experienced</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Min. Experience</label>
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
      </div>
      
      <div className="lawyers-results-info">
        <p>Showing <strong>{filteredLawyers.length}</strong> lawyers</p>
      </div>
      
      <motion.div 
        className="lawyers-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredLawyers.length === 0 ? (
          <div className="no-lawyers-found">
            <i className="bi bi-search"></i>
            <h3>No lawyers found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          filteredLawyers.map(lawyer => (
            <motion.div 
              key={lawyer.id} 
              className="lawyer-card"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
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
                  <div className="lawyer-specialization">{lawyer.specialization}</div>
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
                    <span className="review-count">({lawyer.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="lawyer-details">
                <div className="detail-item">
                  <i className="bi bi-briefcase-fill"></i>
                  <span>{lawyer.experience} years experience</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>{lawyer.location}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-translate"></i>
                  <span>{lawyer.languages.join(', ')}</span>
                </div>
              </div>
              
              <p className="lawyer-bio">{lawyer.bio?.substring(0, 120)}...</p>
              
              <div className="lawyer-card-footer">
                <button 
                  onClick={() => handleViewProfile(lawyer.id)} 
                  className="view-profile-btn"
                >
                  <i className="bi bi-person-vcard"></i> View Profile
                </button>
                <button 
                  onClick={() => handleStartChat(lawyer.id)} 
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
    </div>
  );
};

// Mock data for development and fallback
const mockLawyers = [
  {
    id: 1,
    name: 'Adv. Rajesh Sharma',
    specialization: 'Criminal Law',
    experience: 12,
    rating: 4.8,
    reviewCount: 124,
    online: true,
    location: 'Mumbai, Maharashtra',
    languages: ['English', 'Hindi', 'Marathi'],
    profilePicture: 'https://randomuser.me/api/portraits/men/42.jpg',
    bio: 'Specializing in criminal defense with over 12 years of experience. I have successfully defended clients in high-profile cases including white-collar crimes, assault charges, and fraud allegations.'
  },
  {
    id: 2,
    name: 'Adv. Priya Patel',
    specialization: 'Family Law',
    experience: 8,
    rating: 4.9,
    reviewCount: 87,
    online: true,
    location: 'Delhi, NCR',
    languages: ['English', 'Hindi', 'Punjabi'],
    profilePicture: 'https://randomuser.me/api/portraits/women/26.jpg',
    bio: 'I am a family law specialist focused on divorce, child custody, and domestic violence cases. My approach is compassionate yet effective, ensuring the best outcome for my clients.'
  },
  {
    id: 3,
    name: 'Adv. Vikram Malhotra',
    specialization: 'Corporate Law',
    experience: 15,
    rating: 4.7,
    reviewCount: 156,
    online: false,
    location: 'Bangalore, Karnataka',
    languages: ['English', 'Hindi', 'Kannada'],
    profilePicture: 'https://randomuser.me/api/portraits/men/21.jpg',
    bio: 'Former legal advisor to multiple Fortune 500 companies. I specialize in corporate structuring, mergers & acquisitions, and compliance issues with expertise in international business law.'
  },
  {
    id: 4,
    name: 'Adv. Sneha Gupta',
    specialization: 'Property Law',
    experience: 6,
    rating: 4.5,
    reviewCount: 62,
    online: true,
    location: 'Pune, Maharashtra',
    languages: ['English', 'Hindi', 'Marathi'],
    profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Property law expert specializing in real estate transactions, tenant disputes, and property documentation. I provide end-to-end legal solutions for all property-related matters.'
  },
  {
    id: 5,
    name: 'Adv. Sunil Reddy',
    specialization: 'Cyber Law',
    experience: 9,
    rating: 4.6,
    reviewCount: 93,
    online: false,
    location: 'Hyderabad, Telangana',
    languages: ['English', 'Hindi', 'Telugu'],
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Cyber law specialist with expertise in data privacy, online fraud, and digital rights. I have worked with tech companies and individuals facing cybercrime issues.'
  },
  {
    id: 6,
    name: 'Adv. Meera Krishnan',
    specialization: 'Labor Law',
    experience: 11,
    rating: 4.7,
    reviewCount: 108,
    online: true,
    location: 'Chennai, Tamil Nadu',
    languages: ['English', 'Tamil', 'Malayalam'],
    profilePicture: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Experienced in handling workplace disputes, employment contracts, and labor compliance. I have successfully represented both employees and employers in various labor cases.'
  }
];

export default LawyersPage; 