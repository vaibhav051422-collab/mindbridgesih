import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import { supabase } from "../supabaseClient"; // ✅ Correct import path

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    userType: 'student'
  });
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const navigate = useNavigate();

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to get the current session (this will test the connection)
        const { error } = await supabase.auth.getSession();
        if (error && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
          setConnectionStatus('failed');
          setErrorMsg('⚠️ Cannot connect to Supabase. Please check: 1) Your internet connection, 2) The Supabase project is active, 3) The Supabase URL is correct.');
        } else {
          setConnectionStatus('connected');
        }
      } catch (err) {
        setConnectionStatus('failed');
        console.error('Connection test failed:', err);
      }
    };
    testConnection();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      let result;

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          // Better error handling for network issues
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Network error: Please check your internet connection and try again. If the problem persists, the Supabase service might be unavailable.');
          }
          throw error;
        }
        result = data;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              userType: formData.userType
            }
          }
        });

        if (error) {
          // Better error handling for network issues
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Network error: Please check your internet connection and try again. If the problem persists, the Supabase service might be unavailable.');
          }
          throw error;
        }
        result = data;
      }

      // ✅ Navigate after successful login/signup
      if (result?.session) {
        navigate('/dashboard');
      } else if (!isLogin) {
        // For signup, show success message if email confirmation is required
        setErrorMsg('Account created! Please check your email to verify your account.');
      }
    } catch (error) {
      console.error('Login/Signup error:', error);
      setErrorMsg(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: 'anonymous@example.com'
      });

      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Network error: Please check your internet connection.');
        }
        throw error;
      }

      alert('Check your email for the login link!');
    } catch (error) {
      console.error('Anonymous login error:', error);
      setErrorMsg(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/login.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">MB</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-white drop-shadow-lg">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-200">
          {isLogin
            ? 'Sign in to continue your mental wellness journey'
            : 'Join MindBridge and start tracking your mental health'}
        </p>
        {connectionStatus === 'checking' && (
          <p className="text-yellow-300 text-center mt-2 text-xs">Checking connection...</p>
        )}
        {connectionStatus === 'failed' && (
          <p className="text-red-400 text-center mt-2 text-xs bg-red-900/50 p-2 rounded">
            ⚠️ Connection issue detected. Please verify your Supabase configuration.
          </p>
        )}
        {errorMsg && (
          <p className="text-red-400 text-center mt-2 bg-red-900/50 p-2 rounded">{errorMsg}</p>
        )}
      </div>

      <div className="mt-8 relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white bg-opacity-90 backdrop-blur-md py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="institute">Institute</option>
                </select>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleAnonymousLogin}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiShield className="w-4 h-4 mr-2" />
                Continue Anonymously
              </button>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-500 font-medium text-sm"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
