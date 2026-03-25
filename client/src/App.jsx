import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Public Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import SkillsPage from './pages/SkillsPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminMessages from './pages/admin/AdminMessages';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSkills from './pages/admin/AdminSkills';
import AdminServices from './pages/admin/AdminServices';
import AdminTestimonials from './pages/admin/AdminTestimonials';

function App() {
  const [appLoading, setAppLoading] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            {appLoading && <Preloader key="preloader" onComplete={() => setAppLoading(false)} />}
          </AnimatePresence>
          <Routes>
            {/* Public Routes with Main Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Standalone Route for Admin Login */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected Admin Routes with Sidebar Layout */}
            <Route 
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
