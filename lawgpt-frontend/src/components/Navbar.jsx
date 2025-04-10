import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80, // Adjust for navbar height
          behavior: 'smooth'
        });
      }
    }
    setIsMenuOpen(false);
  };
  
  useEffect(() => {
    // Check if we navigated from another page with scroll instruction
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        if (section) {
          window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05, 
      color: '#4361EE',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      backgroundColor: 'rgba(67, 97, 238, 0.1)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.nav 
      className={`app-navbar ${scrolled ? 'scrolled' : ''}`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="navbar-container">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link to="/" className="navbar-brand">
            <i className="bi bi-briefcase-fill"></i>
            <div>
              <h1>Nyay<span style={{ fontWeight: 400 }}>Guru</span></h1>
              <p className="tagline">Your AI Legal Assistant</p>
            </div>
          </Link>
        </motion.div>
        
        <motion.div 
          className="mobile-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
        </motion.div>
        
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={linkVariants}
          >
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <i className="bi bi-house-fill"></i> Home
            </Link>
          </motion.div>
          
          <motion.button 
            onClick={() => scrollToSection('services-section')} 
            className={`nav-link-btn`}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <i className="bi bi-gear-fill"></i> Services
          </motion.button>
          
          <motion.button 
            onClick={() => scrollToSection('categories-section')} 
            className={`nav-link-btn`}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <i className="bi bi-grid-fill"></i> Categories
          </motion.button>
          
          <motion.button 
            onClick={() => scrollToSection('benefits-section')} 
            className={`nav-link-btn`}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <i className="bi bi-award-fill"></i> Why Us
          </motion.button>
          
          {currentUser && (
            <div className="nav-auth-section">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link to="/profile" className="profile-icon-link" title="Profile">
                  <div className="profile-icon">
                    <i className="bi bi-person-fill"></i>
                  </div>
                </Link>
              </motion.div>
            </div>
          )}
          
          {!currentUser && (
            <div className="nav-auth-section">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={linkVariants}
              >
                <Link to="/login" className="nav-link login-btn">
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/signup" className="nav-link signup">
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 