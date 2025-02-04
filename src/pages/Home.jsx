import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Camera, MessageCircle } from 'lucide-react';

const Hospital = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"  // Updated to match other icons
    height="48" // Updated to match other icons
    viewBox="0 0 24 24" // Changed to standard 24x24 viewBox
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-500" // Added color class to match styling pattern
  >
    <path d="M12 6v4" />
    <path d="M14 14h-4" />
    <path d="M14 18h-4" />
    <path d="M14 8h-4" />
    <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
    <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
  </svg>
);

function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to FirstAid.AI
        </h1>
        <p className="text-xl text-gray-600">
          Your intelligent first aid assistant for emergency situations
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {/* Feature cards with consistent heights */}
        <Link to="/first-aid" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4 h-12">
              <Heart size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">First Aid Guide</h2>
            <p className="text-gray-600 text-center flex-grow">
              Get instant first aid instructions for various injuries
            </p>
          </div>
        </Link>

        <Link to="/injury-detection" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4 h-12">
              <Camera size={48} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Injury Detection</h2>
            <p className="text-gray-600 text-center flex-grow">
              AI-powered injury assessment through image analysis
            </p>
          </div>
        </Link>

        <Link to="/nearby-hospitals" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4 h-12">
              <Hospital />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Nearby Hospitals</h2>
            <p className="text-gray-600 text-center flex-grow">
              Find emergency medical facilities in your area
            </p>
          </div>
        </Link>

        <Link to="/chat" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4 h-12">
              <MessageCircle size={48} className="text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">AI Chat Assistant</h2>
            <p className="text-gray-600 text-center flex-grow">
              Get instant first aid advice from our AI assistant
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Why Choose FirstAid.AI?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Instant AI Analysis</h3>
            <p className="text-gray-600">
              Our advanced AI technology helps assess injuries and provides appropriate first aid recommendations
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Emergency Location Services</h3>
            <p className="text-gray-600">
              Quickly locate nearby hospitals and emergency services when you need them most
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;