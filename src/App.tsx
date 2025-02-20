import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Blog from './components/Blog';
import Contact from './components/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <HelmetProvider>
        <ThemeProvider>
          <Routes>
            {/* Main Site Routes */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                  <Header />
                  <Hero />
                  <About />
                  <Projects />
                  <Skills />
                  <Blog />
                  <Contact />
                </div>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;