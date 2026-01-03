import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MoodTrackingPage from './pages/MoodTrackingPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LandingPage from './pages/landingpage.jsx'; // Naye page ko import karein

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Yeh layout istemal nahi karte */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - Yeh MainLayout (sidebar ke saath) istemal karte hain */}
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/mood-tracker" element={<MainLayout><MoodTrackingPage /></MainLayout>} />
        <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
        <Route path="/resources" element={<MainLayout><ResourcesPage /></MainLayout>} />
        <Route path="/appointments" element={<MainLayout><AppointmentsPage /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout><AnalyticsPage /></MainLayout>} />

        {/* Agar koi aur URL daala jaye, toh landing page par bhej dein */}
        <Route path="*" element={<LandingPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;

