import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/LawyerProfile.css';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const LawyerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    // Fetch lawyer details from API
    const fetchLawyerDetails = async () => {
      setLoading(true);
      try {
        // Make API request
        const response = await axios.get(`${API_BASE_URL}/lawyers/${id}`);
        
        if (response.status === 200) {
          setLawyer(response.data);
        } else {
          throw new Error('Failed to fetch lawyer details');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lawyer details:', err);
        setError('Failed to load lawyer details. Please try again later.');
        setLoading(false);
        
        // Fallback to mock data in development or when API is unavailable
        if (import.meta.env.DEV) {
          console.log('Falling back to mock data in development mode');
          setTimeout(() => {
            const foundLawyer = mockLawyers.find(l => l.id === parseInt(id));
            if (foundLawyer) {
              setLawyer(foundLawyer);
              setError(null);
            } else {
              setError('Lawyer not found');
            }
            setLoading(false);
          }, 800);
        }
      }
    };
    
    fetchLawyerDetails();
  }, [id]);

  const handleStartChat = () => {
    navigate(`/chat/lawyer/${id}`);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="lawyer-profile-loading">
        <div className="spinner"></div>
        <p>Loading lawyer profile...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="lawyer-profile-error">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <div className="error-buttons">
          <button onClick={() => navigate('/lawyers')} className="back-button">
            <i className="bi bi-arrow-left"></i> Back to Lawyers
          </button>
          <button onClick={() => window.location.reload()} className="retry-button">
            <i className="bi bi-arrow-clockwise"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  // Render not found state
  if (!lawyer) {
    return (
      <div className="lawyer-profile-not-found">
        <i className="bi bi-person-x-fill"></i>
        <h3>Lawyer Not Found</h3>
        <p>The lawyer you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/lawyers')} className="back-button">
          <i className="bi bi-arrow-left"></i> Back to Lawyers
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
      <div className="profile-header">
        <button onClick={() => navigate('/lawyers')} className="back-button">
          <i className="bi bi-arrow-left"></i> Back to Lawyers
        </button>
        
        <div className="profile-hero">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {lawyer.profilePicture ? (
                <img src={lawyer.profilePicture} alt={lawyer.name} />
              ) : (
                <div className="avatar-placeholder">
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
              <div className={`status-indicator ${lawyer.online ? 'online' : 'offline'}`}></div>
            </div>
            {lawyer.verified && (
              <div className="verification-badge">
                <i className="bi bi-patch-check-fill"></i> Verified
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h1>{lawyer.name}</h1>
            <h3 className="specialization">{lawyer.specialization}</h3>
            
            <div className="profile-stats">
              <div className="stat-item">
                <i className="bi bi-star-fill"></i>
                <span className="stat-value">{lawyer.rating.toFixed(1)}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <i className="bi bi-chat-text-fill"></i>
                <span className="stat-value">{lawyer.reviewCount}</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-item">
                <i className="bi bi-briefcase-fill"></i>
                <span className="stat-value">{lawyer.experience}</span>
                <span className="stat-label">Years</span>
              </div>
            </div>
            
            <div className="profile-badge-container">
              {lawyer.badges && lawyer.badges.map((badge, index) => (
                <span key={index} className="profile-badge" style={{ background: badge.color }}>
                  <i className={`bi ${badge.icon}`}></i> {badge.name}
                </span>
              ))}
            </div>
            
            <div className="profile-actions">
              <button 
                onClick={handleStartChat}
                className={`chat-button ${!lawyer.online ? 'offline-button' : ''}`}
                disabled={!lawyer.online && !lawyer.allowOfflineMessages}
              >
                {lawyer.online ? (
                  <>
                    <i className="bi bi-chat-text-fill"></i> Chat Now
                  </>
                ) : lawyer.allowOfflineMessages ? (
                  <>
                    <i className="bi bi-envelope-fill"></i> Leave a Message
                  </>
                ) : (
                  <>
                    <i className="bi bi-clock-fill"></i> Offline
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <i className="bi bi-info-circle"></i> About
          </button>
          <button 
            className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <i className="bi bi-briefcase"></i> Experience
          </button>
          <button 
            className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <i className="bi bi-mortarboard"></i> Education
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="bi bi-star"></i> Reviews
          </button>
        </div>
        
        <div className="profile-tab-content">
          {activeTab === 'about' && (
            <div className="about-tab">
              <h3>About {lawyer.name}</h3>
              <p className="lawyer-bio">{lawyer.bio}</p>
              
              <div className="info-section">
                <h4><i className="bi bi-geo-alt-fill"></i> Location</h4>
                <p>{lawyer.location}</p>
              </div>
              
              <div className="info-section">
                <h4><i className="bi bi-translate"></i> Languages</h4>
                <div className="language-list">
                  {lawyer.languages.map((lang, index) => (
                    <span key={index} className="language-tag">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="info-section">
                <h4><i className="bi bi-briefcase"></i> Specialization</h4>
                <p>{lawyer.specialization}</p>
                {lawyer.subSpecialties && (
                  <div className="subspecialties">
                    <h5>Sub-specialties:</h5>
                    <ul>
                      {lawyer.subSpecialties.map((specialty, index) => (
                        <li key={index}>{specialty}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'experience' && (
            <div className="experience-tab">
              <h3>Professional Experience</h3>
              
              {lawyer.experience ? (
                <div className="experience-years">
                  <i className="bi bi-briefcase-fill"></i>
                  <span>{lawyer.experience} years of experience</span>
                </div>
              ) : null}
              
              {lawyer.workHistory ? (
                <div className="work-history">
                  {lawyer.workHistory.map((work, index) => (
                    <div key={index} className="work-item">
                      <div className="work-period">{work.period}</div>
                      <div className="work-role">{work.role}</div>
                      <div className="work-company">{work.company}</div>
                      <div className="work-description">{work.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-message">No detailed work history available</p>
              )}
            </div>
          )}
          
          {activeTab === 'education' && (
            <div className="education-tab">
              <h3>Education & Qualifications</h3>
              
              {lawyer.education ? (
                <div className="education-history">
                  {lawyer.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-period">{edu.period}</div>
                      <div className="education-degree">{edu.degree}</div>
                      <div className="education-institution">{edu.institution}</div>
                      <div className="education-description">{edu.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-message">No detailed education information available</p>
              )}
              
              {lawyer.certifications && lawyer.certifications.length > 0 && (
                <div className="certifications">
                  <h4>Certifications & Licenses</h4>
                  <ul className="certification-list">
                    {lawyer.certifications.map((cert, index) => (
                      <li key={index} className="certification-item">
                        <div className="certification-name">{cert.name}</div>
                        <div className="certification-issuer">{cert.issuer}</div>
                        <div className="certification-year">Issued: {cert.year}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <h3>Client Reviews</h3>
              
              <div className="reviews-summary">
                <div className="overall-rating">
                  <div className="rating-number">{lawyer.rating.toFixed(1)}</div>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`bi ${i < Math.floor(lawyer.rating) ? 'bi-star-fill' : i < lawyer.rating ? 'bi-star-half' : 'bi-star'}`}
                      ></i>
                    ))}
                  </div>
                  <div className="rating-count">Based on {lawyer.reviewCount} reviews</div>
                </div>
              </div>
              
              {lawyer.reviews ? (
                <div className="reviews-list">
                  {lawyer.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-name">{review.name}</div>
                        <div className="review-date">{review.date}</div>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                          ></i>
                        ))}
                      </div>
                      <div className="review-content">{review.comment}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-message">No reviews available yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
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
    bio: 'Specializing in criminal defense with over 12 years of experience. I have successfully defended clients in high-profile cases including white-collar crimes, assault charges, and fraud allegations. My approach focuses on thorough case preparation and strategic defense planning that has resulted in numerous acquittals and favorable plea agreements for my clients.',
    verified: true,
    allowOfflineMessages: true,
    badges: [
      { name: 'Top Rated', icon: 'bi-award-fill', color: '#FFD700' },
      { name: 'Quick Responder', icon: 'bi-lightning-fill', color: '#4361EE' }
    ],
    subSpecialties: ['White Collar Crime', 'Assault Defense', 'Fraud Cases'],
    workHistory: [
      {
        period: '2015 - Present',
        role: 'Senior Partner',
        company: 'Sharma & Associates',
        description: 'Leading a team of criminal defense attorneys handling major cases across Maharashtra.'
      },
      {
        period: '2010 - 2015',
        role: 'Associate Lawyer',
        company: 'Mehta Law Firm',
        description: 'Specialized in criminal defense with focus on financial crimes and fraud cases.'
      }
    ],
    education: [
      {
        period: '2005 - 2010',
        degree: 'LLB',
        institution: 'Government Law College, Mumbai',
        description: 'Graduated with honors, specializing in Criminal Law'
      }
    ],
    certifications: [
      {
        name: 'Bar Council of Maharashtra and Goa',
        issuer: 'Bar Council of India',
        year: '2010'
      }
    ],
    reviews: [
      {
        name: 'Amit Desai',
        date: 'March 15, 2023',
        rating: 5,
        comment: 'Adv. Sharma handled my case with exceptional professionalism. His knowledge of criminal law and court procedures is impressive. Highly recommended!'
      },
      {
        name: 'Priya Malhotra',
        date: 'January 23, 2023',
        rating: 4,
        comment: 'Very thorough and dedicated lawyer. Took time to explain every detail of my case and achieved a favorable outcome.'
      }
    ]
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
    bio: 'I am a family law specialist focused on divorce, child custody, and domestic violence cases. My approach is compassionate yet effective, ensuring the best outcome for my clients while minimizing emotional trauma. I believe in finding amicable solutions where possible but am prepared to vigorously advocate in court when necessary.',
    verified: true,
    allowOfflineMessages: true,
    badges: [
      { name: 'Top Rated', icon: 'bi-award-fill', color: '#FFD700' }
    ],
    subSpecialties: ['Divorce', 'Child Custody', 'Domestic Violence Protection'],
    workHistory: [
      {
        period: '2018 - Present',
        role: 'Founding Partner',
        company: 'Patel Family Law Practice',
        description: 'Established and leading a specialized family law practice serving clients across Delhi NCR.'
      },
      {
        period: '2015 - 2018',
        role: 'Senior Associate',
        company: 'Singh & Partners',
        description: 'Handled complex family law cases including high-asset divorces and international custody disputes.'
      }
    ],
    education: [
      {
        period: '2012 - 2015',
        degree: 'LLB',
        institution: 'Faculty of Law, Delhi University',
        description: 'Graduated with distinction, specializing in Family Law'
      }
    ],
    reviews: [
      {
        name: 'Neha Singh',
        date: 'April 2, 2023',
        rating: 5,
        comment: 'Ms. Patel handled my divorce with extraordinary sensitivity and professionalism. She was always available to address my concerns and guided me through a difficult time with compassion.'
      },
      {
        name: 'Rahul Khanna',
        date: 'February 10, 2023',
        rating: 5,
        comment: "Adv. Patel's expertise in child custody matters was invaluable. She prioritized my children's well-being throughout the case and helped secure a favorable arrangement."
      }
    ]
  }
];

export default LawyerProfilePage; 