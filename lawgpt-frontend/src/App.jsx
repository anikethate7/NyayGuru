import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import ChatLayout from "./components/ChatLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LegalDictionary from "./pages/LegalDictionary";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import LawyersPage from "./pages/LawyersPage";
import LawyerProfilePage from "./pages/LawyerProfilePage";
import LawyerRegistrationPage from "./pages/LawyerRegistrationPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";
import { SessionProvider } from "./context/SessionContext";
import { AuthProvider, AuthConsumer, useAuth } from "./context/AuthContext";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public route - redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Admin route - only accessible to admin users
const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// App Layout Component
const AppLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();
  
  // Check if we're on an auth page (login, signup, or forgot password)
  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/forgot-password';
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Check if we're on the chat page
  const isChatPage = 
    location.pathname === '/chat' || 
    location.pathname.startsWith('/category/') ||
    location.pathname.startsWith('/chat/lawyer/');
    
  // Check if we're on the document analysis page
  const isDocumentPage = location.pathname === '/documents';
  
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  // For chat page, we don't want to show the navbar or regular container
  if (isChatPage) {
    return (
      <div className="App full-page">
        <Routes>
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          } />
          <Route path="/category/:category" element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          } />
          <Route path="/chat/lawyer/:lawyerId" element={
            <ProtectedRoute>
              <ChatLayout chatType="lawyer" />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    );
  }
  
  return (
    <div className="App">
      {/* Show Navbar on all pages except auth pages */}
      {!isAuthPage && <Navbar />}
      
      <main className={isAuthPage ? "" : isDocumentPage ? "app-main document-page-main" : "app-main"}>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dictionary" element={
            <ProtectedRoute>
              <LegalDictionary />
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <DocumentAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } />
          <Route path="/lawyers" element={
            <ProtectedRoute>
              <LawyersPage />
            </ProtectedRoute>
          } />
          <Route path="/lawyers/:id" element={
            <ProtectedRoute>
              <LawyerProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/lawyer-registration" element={
            <ProtectedRoute>
              <LawyerRegistrationPage />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Only show footer when not on auth pages or chat pages or document pages */}
      {!isAuthPage && !isChatPage && !isDocumentPage && (
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} JusticeJunction - Legal AI Assistant. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SessionProvider>
          <AuthConsumer>
            <AppLayout />
          </AuthConsumer>
        </SessionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
