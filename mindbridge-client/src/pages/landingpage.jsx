import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiBookOpen, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {

  const features = [
    {
      icon: FiHeart,
      title: 'Track Your Mood',
      description: 'Easily track your mood throughout the day and understand your emotional patterns.',
    },
    {
      icon: FiUsers,
      title: 'Join a Community',
      description: 'Join a supportive community, share your experiences, and learn from others.',
    },
    {
      icon: FiBookOpen,
      title: 'Access Resources',
      description: 'Access articles, tools, and resources related to mental wellness, all in one place.',
    },
    {
      icon: FiTrendingUp,
      title: 'Visualize Progress',
      description: 'View your progress through beautiful charts and analytics and stay motivated.',
    }
  ];

  return (
    <div className="bg-white text-gray-800">

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MindBridge</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with background image */}
      <main className="relative w-full h-screen flex items-center justify-center text-center bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url('/images/inner-peace.png')" }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative z-10 px-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Your Personal Mental <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Wellness Companion
            </span>
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            MindBridge helps you to better understand and manage your mental health.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 shadow-xl hover:scale-105"
          >
            Start Your Journey <FiArrowRight className="inline ml-2" />
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Features to Support You</h2>
            <p className="text-gray-600 mt-2">Everything you need for your mental wellness.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MindBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
