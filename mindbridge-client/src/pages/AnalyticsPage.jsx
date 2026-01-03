import React, { useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiCalendar, FiBarChart2, FiPieChart } from 'react-icons/fi';

const AnalyticsPage = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock data for analytics
  const moodData = [
    { mood: 'Happy', count: 15, percentage: 45 },
    { mood: 'Neutral', count: 8, percentage: 24 },
    { mood: 'Stressed', count: 6, percentage: 18 },
    { mood: 'Anxious', count: 4, percentage: 13 }
  ];

  const weeklyTrends = [
    { week: 'Week 1', avgMood: 7.2 },
    { week: 'Week 2', avgMood: 6.8 },
    { week: 'Week 3', avgMood: 7.5 },
    { week: 'Week 4', avgMood: 8.1 }
  ];

  const insights = [
    {
      title: "Mood Improvement",
      description: "Your mood has improved by 12% this month",
      type: "positive",
      icon: FiTrendingUp
    },
    {
      title: "Consistent Tracking",
      description: "You've tracked your mood 25 out of 30 days",
      type: "positive",
      icon: FiCalendar
    },
    {
      title: "Stress Patterns",
      description: "Higher stress levels observed on Mondays",
      type: "neutral",
      icon: FiBarChart2 // Corrected Icon
    }
  ];

  const getMoodColor = (mood) => {
    switch (mood.toLowerCase()) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-gray-500';
      case 'stressed': return 'bg-red-500';
      case 'anxious': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-8 p-8 min-h-full">
        <div>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Here's an overview of your wellness journey.</p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiTrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Mood</p>
                  <p className="text-2xl font-bold text-gray-900">7.4</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiCalendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tracking Streak</p>
                  <p className="text-2xl font-bold text-gray-900">12 days</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiBarChart2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900">33</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FiPieChart className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wellness Score</p>
                  <p className="text-2xl font-bold text-gray-900">8.2</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Mood Distribution</h3>
            <div className="space-y-4">
              {moodData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.mood}</span>
                    <span className="text-sm font-medium text-gray-700">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getMoodColor(item.mood)}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Trends</h3>
            <div className="h-48 flex items-end justify-around pt-4">
                {weeklyTrends.map((trend, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div 
                            className="w-8 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                            style={{ height: `${(trend.avgMood / 10) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">{trend.week}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default AnalyticsPage;

