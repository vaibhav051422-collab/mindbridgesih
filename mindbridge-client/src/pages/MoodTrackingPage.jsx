import React, { useState } from "react";
import { FiHeart, FiSmile, FiFrown, FiMeh, FiZap } from "react-icons/fi";
import { supabase } from "../supabaseClient";

const MoodTrackingPage = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const moods = [
    { id: "happy", label: "Happy", icon: FiSmile, color: "text-green-500", bgColor: "bg-green-100" },
    { id: "excited", label: "Excited", icon: FiHeart, color: "text-pink-500", bgColor: "bg-pink-100" },
    { id: "neutral", label: "Neutral", icon: FiMeh, color: "text-gray-500", bgColor: "bg-gray-100" },
    { id: "sad", label: "Sad", icon: FiFrown, color: "text-blue-500", bgColor: "bg-blue-100" },
    { id: "anxious", label: "Anxious", icon: FiZap, color: "text-orange-500", bgColor: "bg-orange-100" },
  ];

  const tagOptions = ["academics", "relationships", "family", "health", "work", "social", "financial", "future"];
  const activityOptions = ["studying", "exercise", "socializing", "sleeping", "eating", "entertainment", "work", "travel"];

  const handleTagToggle = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleActivityToggle = (activity) => {
    setActivities((prev) => (prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMood) {
      alert("Please select a mood before submitting.");
      return;
    }

    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User error:", userError);
      alert("Please login first!");
      setLoading(false);
      return;
    }

    const moodData = {
      user_id: user.id,
      mood: selectedMood,
      intensity,
      notes,
      tags,        // ✅ Ensure tags[] column exists, else use JSON.stringify(tags)
      activities,  // ✅ Same for activities[]
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("mood_entries").insert([moodData]);

    if (error) {
      console.error("Error inserting mood entry:", error.message);
      alert("Failed to record mood. Please try again.");
      setLoading(false);
    } else {
      setIsSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedMood("");
        setIntensity(5);
        setNotes("");
        setTags([]);
        setActivities([]);
      }, 2000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiHeart className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mood Recorded!</h2>
          <p className="text-gray-600">Thank you for taking a moment for your wellness.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">How are you feeling today?</h1>
          <p className="text-lg text-gray-500">Select a mood that best represents how you feel right now.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Selection */}
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-5">1. Select your primary mood</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  aria-label={`Select mood ${mood.label}`}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 transform hover:-translate-y-1 ${
                    selectedMood === mood.id
                      ? `border-blue-500 ring-4 ring-blue-100 ${mood.bgColor}`
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <mood.icon className={`w-10 h-10 mx-auto mb-2 ${mood.color}`} />
                  <p className="text-sm font-semibold text-gray-700">{mood.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              2. Set the intensity level: <span className="text-blue-600">{intensity}</span>
            </h3>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">3. Add some notes (Optional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-28 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={500}
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. What's affecting your mood? (Optional)</h3>
            <div className="flex flex-wrap gap-3">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-label={`Toggle tag ${tag}`}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 ${
                    tags.includes(tag)
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">5. What have you been doing? (Optional)</h3>
            <div className="flex flex-wrap gap-3">
              {activityOptions.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  aria-label={`Toggle activity ${activity}`}
                  onClick={() => handleActivityToggle(activity)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 ${
                    activities.includes(activity)
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {activity.charAt(0).toUpperCase() + activity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={!selectedMood || loading}
              className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedMood
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Saving..." : "Record My Mood"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodTrackingPage;
