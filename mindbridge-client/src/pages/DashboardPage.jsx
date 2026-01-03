import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiTarget,
  FiFileText,
  FiStar,
  FiArrowRight,
  FiBookOpen,
  FiMessageSquare,
  FiClipboard,
  FiSunrise,
  FiVideo,
} from "react-icons/fi";
import MoodChart from "../components/MoodChart.jsx";
import { supabase } from "../supabaseClient";

const DashboardPage = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [quote, setQuote] = useState({
    text: "The first step towards getting somewhere is to decide you're not going to stay where you are.",
    author: "J.P. Morgan",
  });

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true);

      // ✅ Get active Supabase session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("❌ No active Supabase session:", userError);
        setUser(null);
        setChartData([]);
        setLoading(false);
        return;
      }

      setUser(user); // store for display

      // ✅ Fetch mood entries securely (RLS will auto-filter by auth.uid())
      const { data, error } = await supabase
        .from("mood_entries")
        .select("created_at, intensity")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Error fetching mood data:", error);
        setChartData([]);
      } else {
        console.log("✅ Supabase mood data:", data);
        const formattedData = data.slice(-7).map((entry) => ({
          date: new Date(entry.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          intensity: entry.intensity,
        }));
        setChartData(formattedData);
      }

      setLoading(false);
    };

    fetchUserAndData();
  }, []);

  const statsCards = [
    { name: "Mood Streak", value: "7 days", icon: <FiHeart className="text-green-500" />, bgColor: "bg-green-100" },
    { name: "Active Goals", value: "2", icon: <FiTarget className="text-blue-500" />, bgColor: "bg-blue-100" },
    { name: "Sessions", value: "0", icon: <FiFileText className="text-purple-500" />, bgColor: "bg-purple-100" },
    { name: "Points", value: "250", icon: <FiStar className="text-orange-500" />, bgColor: "bg-orange-100" },
  ];

  const quickActions = [
    { name: "Book Counseling Session", path: "/appointments", icon: <FiClipboard /> },
    { name: "Log Today's Mood", path: "/mood-tracker", icon: <FiHeart /> },
    { name: "Join Community Discussion", path: "/community", icon: <FiMessageSquare /> },
    { name: "Explore Wellness Resources", path: "/resources", icon: <FiBookOpen /> },
  ];

  return (
    <div className="p-6 md:p-8 min-h-full">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-8 rounded-2xl shadow-lg mb-10">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.user_metadata?.name || "User"}! 👋
            </h1>
            <p className="mt-2 text-blue-100">
              Let's continue your wellness journey. You have 250 points!
            </p>
          </div>
        </div>
      </header>

      {/* Quote */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80 mb-10 flex items-center">
        <div className="p-4 bg-yellow-100 rounded-full mr-5">
          <FiSunrise className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-gray-800 font-semibold">"{quote.text}"</p>
          <p className="text-sm text-gray-500 mt-1">- {quote.author}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((card) => (
          <div
            key={card.name}
            className="bg-white p-6 rounded-2xl shadow-md flex items-center border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`p-4 rounded-full mr-5 ${card.bgColor}`}>
              {React.cloneElement(card.icon, {
                className: "w-6 h-6 " + card.icon.props.className,
              })}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">{card.name}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Meet */}
      <div className="mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200/80 max-w-md mx-auto mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiVideo className="mr-2 text-green-600" /> Join a Google Meet
        </h2>
        <p className="text-gray-600 mb-4">
          Click below to join your scheduled counseling session on Google Meet.
        </p>
        <a
          href="https://meet.google.com/abc-defg-hij"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center p-4 rounded-xl bg-green-600 text-white font-semibold transition-all duration-300 hover:bg-green-700"
        >
          Open Google Meet
        </a>
      </div>

      {/* Mood Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Mood Trends</h2>
            <Link
              to="/mood-tracker"
              className="text-blue-600 font-semibold hover:underline flex items-center text-sm"
            >
              Add Entry <FiArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="h-80">
            {loading ? (
              <p className="text-center text-gray-500 mt-10">
                Loading mood data...
              </p>
            ) : chartData.length > 0 ? (
              <MoodChart data={chartData} />
            ) : (
              <div className="h-full bg-slate-100 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <svg
                  className="w-16 h-16 text-slate-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                <p className="text-gray-600 font-semibold">No mood data yet!</p>
                <p className="text-gray-400 text-sm mt-2">
                  Go to the "Mood Tracking" page to add your first entry.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <Link
                to={action.path}
                key={action.name}
                className={`w-full flex items-center p-4 rounded-xl font-semibold transition-all duration-300 text-sm transform hover:scale-105 ${
                  index === 0
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {React.cloneElement(action.icon, { className: "w-5 h-5 mr-3" })}
                {action.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
