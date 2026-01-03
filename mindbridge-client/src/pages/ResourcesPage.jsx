import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiPlay, FiStar, FiFilter, FiHeart, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Modal from '../components/modal.jsx'; // Naya Modal component import karein

// Updated sample data with content for modals
const allResources = [
  {
    id: 1,
    type: "video",
    category: "mindfulness",
    title: "Mindfulness Meditation Guide",
    description: "A comprehensive guide to mindfulness meditation for beginners.",
    duration: "15 min",
    rating: 4.8,
    isFree: true,
    icon: FiPlay,
    videoId: "O-6f5wQXSu8" // YouTube Video ID
  },
  {
    id: 2,
    type: "article",
    category: "stress",
    title: "Managing Academic Stress",
    description: "Evidence-based strategies for handling academic pressure.",
    duration: "8 min read",
    rating: 4.6,
    isFree: true,
    icon: FiFileText,
    link: "https://www.verywellmind.com/coping-with-the-stress-of-final-exams-3145100" // Real article link
  },
  {
    id: 3,
    type: "exercise",
    category: "anxiety",
    title: "Breathing Exercises for Anxiety",
    description: "Simple breathing techniques to calm anxiety.",
    duration: "5 min",
    rating: 4.9,
    isFree: true,
    icon: FiHeart,
    steps: [ // Steps for the exercise modal
      "Find a comfortable, quiet place to sit or lie down.",
      "Close your eyes and take a deep breath in through your nose for 4 seconds.",
      "Hold your breath for a count of 7 seconds.",
      "Exhale slowly and completely through your mouth for a count of 8 seconds.",
      "Repeat this cycle 3 to 5 times, focusing on your breath."
    ]
  },
  {
    id: 4,
    type: "book",
    category: "relationships",
    title: "The Five Love Languages",
    description: "Learn how people give and receive love in different ways.",
    duration: "Book",
    rating: 4.7,
    isFree: false,
    icon: FiBookOpen,
    link: "https://en.wikipedia.org/wiki/The_Five_Love_Languages"
  }
];


const ResourcesPage = () => {
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [filteredResources, setFilteredResources] = useState(allResources);
    
    // State for managing the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (resource) => {
        setModalContent(resource);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    useEffect(() => {
        let resources = [...allResources];
        if (categoryFilter !== 'All Categories') {
            resources = resources.filter(r => r.category === categoryFilter);
        }
        if (typeFilter !== 'All Types') {
            resources = resources.filter(r => r.type === typeFilter);
        }
        setFilteredResources(resources);
    }, [categoryFilter, typeFilter]);

    const categories = ['All Categories', ...new Set(allResources.map(r => r.category))];
    const types = ['All Types', ...new Set(allResources.map(r => r.type))];

    const getButtonInfo = (resource) => {
        switch(resource.type) {
            case 'video': return { text: 'Watch', style: 'bg-blue-500 hover:bg-blue-600', action: () => openModal(resource) };
            case 'article': return { text: 'Read', style: 'bg-indigo-500 hover:bg-indigo-600', action: () => window.open(resource.link, '_blank') };
            case 'exercise': return { text: 'Start', style: 'bg-green-500 hover:bg-green-600', action: () => openModal(resource) };
            case 'book': return { text: 'Download', style: 'bg-purple-500 hover:bg-purple-600', action: () => window.open(resource.link, '_blank') };
            default: return { text: 'View', style: 'bg-gray-500 hover:bg-gray-600', action: () => {} };
        }
    }

    return (
        <>
            <div className="p-8 min-h-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Wellness Resources</h1>
                    <p className="text-gray-500 mt-1">Curated mental health resources to support your journey</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 flex items-center space-x-4">
                    <FiFilter className="text-gray-500" />
                    <span className="font-semibold text-gray-700">Filters:</span>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-gray-100 border-none rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-gray-100 border-none rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {types.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => {
                        const button = getButtonInfo(resource);
                        return (
                            <div key={resource.id} className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <resource.icon className="w-5 h-5 mr-2 text-blue-500" />
                                            {resource.type}
                                            {resource.isFree && <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Free</span>}
                                        </div>
                                        <div className="flex items-center text-sm font-bold text-yellow-500">
                                            <FiStar className="w-4 h-4 mr-1 fill-current" /> {resource.rating}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{resource.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm text-gray-500">{resource.duration}</span>
                                    <button onClick={button.action} className={`text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md ${button.style}`}>
                                        {button.text}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Modal Rendering */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent?.title}>
                {modalContent?.type === 'video' && (
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${modalContent.videoId}`}
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                        ></iframe>
                    </div>
                )}
                {modalContent?.type === 'exercise' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Follow these steps:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                            {modalContent.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ResourcesPage;

