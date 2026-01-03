import React, { useState, useEffect, useRef } from "react";

// --- CHATBOT MODAL COMPONENT ---
const ChatbotModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef(null);

  const videoLinks = [
    "https://www.youtube.com/watch?v=mgmVOuLgFB0",
    "https://www.youtube.com/watch?v=wnHW6o8WMas",
    "https://www.youtube.com/watch?v=ZXsQAXx_ao0",
  ];
  const songLinks = [
    "https://youtu.be/j6muwUGdvXw?si=23FzdGhWKO8PjljC",
    "https://youtu.be/pw59ySNWAjs?si=3rc3T4VLG7qb4hUl",
  ];

  useEffect(() => {
    setMessages([{ sender: "bot", text: "Hi! How's your mood today? 😊" }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMoodSelect = (mood) => {
    let reply = "";
    if (mood === "happy") reply = "That's awesome! Keep smiling 🌟";
    if (mood === "sad") reply = "I'm sorry to hear that 💙. Better days are coming!";
    if (mood === "angry") reply = "Take a deep breath 😌. You got this!";
    if (mood === "stressed") reply = "It's okay to feel stressed. Relax, you're stronger than you think 💪";
    
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `I'm feeling ${mood}` },
      { sender: "bot", text: reply },
      { sender: "bot", text: "How can I help you today?" },
    ]);
    setStep(1);
  };

  const handleHelpSelect = (choice) => {
    let reply = "";
    if (choice === "joke") {
      reply = "😂 Why don't skeletons fight each other? Because they don't have the guts!";
    } else if (choice === "lyrics") {
      const randomSong = songLinks[Math.floor(Math.random() * songLinks.length)];
      reply = (
        <span>
          🎵 Here's a Hindi song lyric:{" "}
          <a
            href={randomSong}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Listen on YouTube
          </a>
        </span>
      );
    } else if (choice === "quote") {
      reply = "💡 'Believe you can and you're halfway there.' – Theodore Roosevelt";
    } else if (choice === "video") {
      const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
      reply = (
        <span>
          ▶️ Here's a motivational video:{" "}
          <a
            href={randomVideo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Watch on YouTube
          </a>
        </span>
      );
    } else if (choice === "song") {
      const randomSong = songLinks[Math.floor(Math.random() * songLinks.length)];
      reply = (
        <span>
          🎶 Here's a slow romantic Hindi song:{" "}
          <a
            href={randomSong}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Listen on YouTube
          </a>
        </span>
      );
    }
    
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `I want: ${choice}` },
      { sender: "bot", text: reply },
    ]);
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.sender === "user";
    const isReactElement = React.isValidElement(msg.text);

    return (
      <div
        key={index}
        className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
            MB
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl max-w-xs shadow-md ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-white text-gray-800 rounded-bl-none"
          }`}
        >
          {isReactElement ? msg.text : <span>{msg.text}</span>}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">MindBridge Assistant</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 text-3xl font-light transition-colors leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-gray-50">
          {messages.map((msg, i) => renderMessage(msg, i))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-5 border-t bg-white">
          {step === 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleMoodSelect("happy")}
                className="flex-1 px-3 py-2 bg-green-100 text-green-800 font-semibold rounded-lg hover:bg-green-200 transition-all transform hover:scale-105"
              >
                😊 Happy
              </button>
              <button
                onClick={() => handleMoodSelect("sad")}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-all transform hover:scale-105"
              >
                😔 Sad
              </button>
              <button
                onClick={() => handleMoodSelect("angry")}
                className="flex-1 px-3 py-2 bg-red-100 text-red-800 font-semibold rounded-lg hover:bg-red-200 transition-all transform hover:scale-105"
              >
                😡 Angry
              </button>
              <button
                onClick={() => handleMoodSelect("stressed")}
                className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded-lg hover:bg-yellow-200 transition-all transform hover:scale-105"
              >
                😰 Stressed
              </button>
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleHelpSelect("joke")}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg text-left font-medium hover:bg-gray-200 transition-colors"
              >
                😂 Tell me a joke
              </button>
              <button
                onClick={() => handleHelpSelect("lyrics")}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg text-left font-medium hover:bg-gray-200 transition-colors"
              >
                🎵 Share a lyric
              </button>
              <button
                onClick={() => handleHelpSelect("song")}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg text-left font-medium hover:bg-gray-200 transition-colors"
              >
                🎶 Suggest a song
              </button>
              <button
                onClick={() => handleHelpSelect("quote")}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg text-left font-medium hover:bg-gray-200 transition-colors"
              >
                💡 Motivational quote
              </button>
              <button
                onClick={() => handleHelpSelect("video")}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg text-left font-medium hover:bg-gray-200 transition-colors"
              >
                ▶️ Motivational video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
