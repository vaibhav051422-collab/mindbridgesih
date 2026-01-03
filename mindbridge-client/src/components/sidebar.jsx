import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaRegChartBar,
  FaUsers,
  FaBook,
  FaCalendarCheck,
  FaChartLine,
  FaSignOutAlt,
  FaRobot
} from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import ChatbotModal from './ChatbotModal'; // ✅ Import chatbot modal

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // ✅ State for chatbot modal

  const navLinks = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Mood Tracking', icon: <FaRegChartBar />, path: '/mood-tracker' },
    { name: 'Community Wall', icon: <FaUsers />, path: '/community' },
    { name: 'Resources', icon: <FaBook />, path: '/resources' },
    { name: 'Appointments', icon: <FaCalendarCheck />, path: '/appointments' },
    { name: 'Analytics', icon: <FaChartLine />, path: '/analytics' }, // ✅ Analytics
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error) setUserProfile(data);
      }
    };

    fetchProfile();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile();
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
      {/* Logo + Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">MindBridge</h1>
        <p className="text-sm text-gray-500">Mental Wellness Platform</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-4">
        <ul>
          {navLinks.map((link) => (
            <li key={link.name} className="mb-2">
              <Link
                to={link.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.name}
              </Link>
            </li>
          ))}

          {/* ✅ AI Assistant Button BELOW Analytics */}
          <li className="mt-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center p-3 w-full rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <FaRobot className="mr-3 text-lg" />
              AI Assistant
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer - User Info */}
      <div className="p-4 border-t border-gray-200">
        {userProfile ? (
          <div>
            <div className="flex items-center mb-4">
              <img
                src={userProfile.avatar_url || "https://i.pravatar.cc/40"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold text-gray-800">{userProfile.name || "User"}</p>
                <p className="text-sm text-gray-500">{userProfile.university || "Your Institute"}</p>
                <p className="text-sm font-bold text-orange-500">{userProfile.points || 0} points</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Loading user info...
          </div>
        )}
      </div>

      {/* ✅ Chatbot Modal */}
      {isChatOpen && <ChatbotModal onClose={() => setIsChatOpen(false)} />}
    </aside>
  );
};

export default Sidebar;
