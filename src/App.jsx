import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import api from './api';
import Home from './Components/Home';
import AdminDashboard from './Components/Admin/AdminDashboard';
import ManageProjects from './Components/Admin/ManageProjects';
import ManageSkills from './Components/Admin/ManageSkills';
import ManageExperience from './Components/Admin/ManageExperience';
import ManageCertificates from './Components/Admin/ManageCertificates';
import Login from './Components/Admin/Login';

const RequireAuth = ({ children }) => {
  const token = sessionStorage.getItem('auth-token');
  console.log("RequireAuth check. Token:", token);
  return token ? children : <Navigate to="/login" />;
};

import ManageEducation from './Components/Admin/ManageEducation';
import ManageProfile from './Components/Admin/ManageProfile';
import ManageAchievements from './Components/Admin/ManageAchievements';

import ManageMessages from './Components/Admin/ManageMessages';
import ManageResume from './Components/Admin/ManageResume';
import DashboardHome from './Components/Admin/DashboardHome';
import ManageContactDetail from './Components/Admin/ManageContactDetail';
import ManageBackgrounds from './Components/Admin/ManageBackgrounds';

// Component to track visits
const VisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only track if not in admin and it's the first load (or could be unique session based)
    // For simplicity, just tracking unique visits to the site root "/"
    if (location.pathname === '/') {
      // We can use a session storage flag to prevent counting refreshes
      if (!sessionStorage.getItem('visited')) {
        api.post('/analytics/visit').catch(err => console.error("Visit track error", err));
        sessionStorage.setItem('visited', 'true');
      }
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <VisitTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="resume" element={<ManageResume />} />
          <Route path="certificates" element={<ManageCertificates />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="experience" element={<ManageExperience />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="profile" element={<ManageProfile />} />
          <Route path="achievements" element={<ManageAchievements />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="contact-detail" element={<ManageContactDetail />} />
          <Route path="backgrounds" element={<ManageBackgrounds />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
