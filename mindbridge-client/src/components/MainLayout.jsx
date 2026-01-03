import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  FiHome,
  FiHeart,
  FiUsers,
  FiBookOpen,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiCpu // ✅ AI Assistant icon
} from 'react-icons/fi';

import ChatbotModal from '../components/ChatbotModal'; // ✅ apne path ke hisaab se check kar lo

const MainLayout = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // ✅ Chatbot modal state

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !session && location.pathname !== '/login' && location.pathname !== '/') {
      navigate('/login');
    }
  }, [isLoading, session, navigate, location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/mood-tracker', label: 'Mood Tracking', icon: FiHeart },
    { path: '/community', label: 'Community Wall', icon: FiUsers },
    { path: '/resources', label: 'Resources', icon: FiBookOpen },
    { path: '/appointments', label: 'Appointments', icon: FiCalendar },
    { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  ];

  const isActive = (path) => location.pathname === path;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="flex items-center justify-start h-16 px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">MindBridge</div>
              <div className="text-xs text-gray-500">Mental Wellness</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}

          {/* ✅ AI Assistant Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 w-full"
          >
            <FiCpu className="w-5 h-5 mr-3" />
            AI Assistant
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700">{session.user?.email || 'User'}</div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full text-left text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-2">
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <main className="min-h-full">
          {children}
        </main>
      </div>

      {/* ✅ Chatbot Modal */}
      {isChatOpen && <ChatbotModal onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default MainLayout;
