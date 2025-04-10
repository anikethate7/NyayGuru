import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import '../styles/LawyerProfile.css';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Animation variants for smooth transitions
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const LawyerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // Mock reviews for development
  const mockReviews = [
    {
      id: 1,
      name: "Amit Sharma",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: new Date(2023, 6, 15),
      comment: "Very knowledgeable lawyer who helped me with my property dispute. Explained everything in simple terms and got results quickly."
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: new Date(2023, 5, 22),
      comment: "Good experience overall. Professional approach and always responsive to queries. The case took longer than expected but ended with a positive outcome."
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      rating: 5,
      date: new Date(2023, 4, 10),
      comment: "Excellent service and expertise. Handled my divorce case with sensitivity and professionalism. Would definitely recommend."
    }
  ];

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/lawyers/${id}`);
        setLawyer(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching lawyer details:", err);
        setError("Failed to load lawyer details. Please try again later.");
        
        // For development: use mock data if API fails
        if (process.env.NODE_ENV === 'development') {
          setLawyer({
            id: id,
            name: "Adv. Vikram Malhotra",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            specialization: "Criminal Law",
            experience: 12,
            rating: 4.8,
            reviewCount: 124,
            cases: 280,
            successRate: 92,
            online: true,
            phone: "+91 98765 43210",
            email: "vikram.malhotra@legaladvisor.com",
            location: "Mumbai, Maharashtra",
            languages: ["English", "Hindi", "Marathi"],
            feesRange: "₹2,000 - ₹5,000",
            bio: "Senior advocate with 12+ years of experience in criminal law. I've successfully handled over 280 cases ranging from petty offenses to serious crimes. My approach focuses on thorough investigation, strong courtroom representation, and client-centered service.",
            education: [
              { degree: "LLB", institution: "National Law School, Bangalore", year: "2011" },
              { degree: "LLM in Criminal Law", institution: "Delhi University", year: "2013" }
            ],
            experience_details: [
              { position: "Senior Associate", firm: "Sharma & Associates", period: "2013-2018", description: "Handled criminal cases including bail applications, trials, and appeals." },
              { position: "Partner", firm: "Legal Defenders LLP", period: "2018-Present", description: "Lead a team of 5 associates focusing on criminal defense and constitutional matters." }
            ],
            achievements: [
              "Successfully defended clients in 15 high-profile murder cases",
              "Recognized by Bar Association for pro bono services (2019)",
              "Published author in Indian Law Journal"
            ]
          });
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChatClick = () => {
    navigate(`/chat/${id}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <i key={index} className="fas fa-star"></i>;
          } else if (index === fullStars && hasHalfStar) {
            return <i key={index} className="fas fa-star-half-alt"></i>;
          } else {
            return <i key={index} className="far fa-star"></i>;
          }
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading lawyer profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          <i className="fas fa-sync-alt"></i> Try Again
        </button>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="profile-error">
        <i className="fas fa-user-slash"></i>
        <h3>Lawyer Not Found</h3>
        <p>The lawyer profile you're looking for doesn't exist or has been removed.</p>
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i> Back to Lawyers
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="lawyer-profile-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="profile-hero-section">
        <div className="profile-hero-overlay"></div>
        <div className="profile-container">
          <motion.button 
            className="back-button" 
            onClick={handleBackClick}
            variants={fadeInUp}
          >
            <i className="fas fa-arrow-left"></i> Back
          </motion.button>
          
          <motion.div className="profile-hero" variants={fadeInUp}>
            <div className="avatar-container">
              {lawyer.avatar ? (
                <img src={lawyer.avatar} alt={lawyer.name} />
              ) : (
                <div className="avatar-placeholder">
                  {lawyer.name.charAt(0)}
                </div>
              )}
              {lawyer.online && (
                <div className="status-badge online">
                  <span>Online</span>
                </div>
              )}
              <div className="verification-badge">
                <i className="fas fa-check"></i> Verified
              </div>
            </div>
            
            <div className="profile-info">
              <motion.h1 variants={fadeInUp}>{lawyer.name}</motion.h1>
              <motion.div className="profile-specialization" variants={fadeInUp}>
                <span>{lawyer.specialization}</span>
              </motion.div>
              
              <motion.div className="profile-stats" variants={staggerContainer}>
                <motion.div className="stat-item" variants={fadeInUp}>
                  <div className="stat-value">{lawyer.experience}+</div>
                  <div className="stat-label">Years</div>
                </motion.div>
                <motion.div className="stat-item" variants={fadeInUp}>
                  <div className="stat-value">{lawyer.cases || '200'}+</div>
                  <div className="stat-label">Cases</div>
                </motion.div>
                <motion.div className="stat-item" variants={fadeInUp}>
                  <div className="stat-value">{lawyer.successRate || '90'}%</div>
                  <div className="stat-label">Success</div>
                </motion.div>
                <motion.div className="stat-item rating" variants={fadeInUp}>
                  <div className="rating-stars">
                    {renderStars(lawyer.rating)}
                    <span>{lawyer.rating}</span>
                  </div>
                  <div className="stat-label">{lawyer.reviewCount || '50'} Reviews</div>
                </motion.div>
              </motion.div>
              
              <motion.button 
                className="chat-button" 
                onClick={handleChatClick}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-comment-alt"></i> Chat Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="profile-container">
        <motion.div 
          className="profile-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="profile-tabs" variants={fadeInUp}>
            <button 
              className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <i className="fas fa-user"></i> About
            </button>
            <button 
              className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <i className="fas fa-briefcase"></i> Experience
            </button>
            <button 
              className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <i className="fas fa-graduation-cap"></i> Education
            </button>
            <button 
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <i className="fas fa-star"></i> Reviews
            </button>
          </motion.div>
          
          <motion.div className="profile-tab-content" variants={fadeInUp}>
            {activeTab === 'about' && (
              <motion.div 
                className="about-section"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="profile-section" variants={fadeInUp}>
                  <h3>Bio</h3>
                  <p>{lawyer.bio}</p>
                </motion.div>
                
                <motion.div className="profile-section" variants={fadeInUp}>
                  <h3>Contact Information</h3>
                  <div className="lawyer-info-grid">
                    <div className="info-item">
                      <i className="fas fa-phone"></i>
                      <div>
                        <strong>Phone</strong>
                        <p>{lawyer.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <strong>Email</strong>
                        <p>{lawyer.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <div>
                        <strong>Location</strong>
                        <p>{lawyer.location || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-language"></i>
                      <div>
                        <strong>Languages</strong>
                        <p>{lawyer.languages ? lawyer.languages.join(', ') : 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-rupee-sign"></i>
                      <div>
                        <strong>Consultation Fees</strong>
                        <p>{lawyer.feesRange || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {lawyer.achievements && lawyer.achievements.length > 0 && (
                  <motion.div className="profile-section" variants={fadeInUp}>
                    <h3>Achievements</h3>
                    <ul className="achievements-list">
                      {lawyer.achievements.map((achievement, index) => (
                        <li key={index}>
                          <i className="fas fa-trophy"></i>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'experience' && (
              <motion.div 
                className="experience-section"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {lawyer.experience_details && lawyer.experience_details.length > 0 ? (
                  <div className="timeline">
                    {lawyer.experience_details.map((exp, index) => (
                      <motion.div 
                        className="timeline-item" 
                        key={index}
                        variants={fadeInUp}
                      >
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <h3>{exp.position}</h3>
                          <div className="timeline-details">
                            <span>
                              <i className="fas fa-building"></i> {exp.firm}
                            </span>
                            <span>
                              <i className="fas fa-calendar-alt"></i> {exp.period}
                            </span>
                          </div>
                          <p>{exp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <i className="fas fa-info-circle"></i>
                    <p>No detailed experience information available.</p>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'education' && (
              <motion.div 
                className="education-section"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {lawyer.education && lawyer.education.length > 0 ? (
                  <div className="timeline">
                    {lawyer.education.map((edu, index) => (
                      <motion.div 
                        className="timeline-item" 
                        key={index}
                        variants={fadeInUp}
                      >
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <h3>{edu.degree}</h3>
                          <div className="timeline-details">
                            <span>
                              <i className="fas fa-university"></i> {edu.institution}
                            </span>
                            <span>
                              <i className="fas fa-calendar-alt"></i> {edu.year}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <i className="fas fa-info-circle"></i>
                    <p>No detailed education information available.</p>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'reviews' && (
              <motion.div 
                className="reviews-section"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="reviews-summary" variants={fadeInUp}>
                  <div className="rating-overview">
                    <div className="rating-big">
                      <span>{lawyer.rating}</span>
                      <div className="big-stars">{renderStars(lawyer.rating)}</div>
                      <p>{lawyer.reviewCount || mockReviews.length} reviews</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div className="reviews-list" variants={staggerContainer}>
                  {(lawyer.reviews || mockReviews).map((review, index) => (
                    <motion.div 
                      className="review-item" 
                      key={review.id || index}
                      variants={fadeInUp}
                    >
                      <div className="review-header">
                        <div className="reviewer-info">
                          {review.avatar ? (
                            <img src={review.avatar} alt={review.name} />
                          ) : (
                            <div className="avatar-placeholder small">
                              {review.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4>{review.name}</h4>
                            <span className="review-date">
                              {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LawyerProfilePage; 