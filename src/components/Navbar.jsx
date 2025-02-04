import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  User, 
  MessageCircle, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Stethoscope,
  Camera,
  BookOpen,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-white p-2 rounded-full transition-transform group-hover:scale-110">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <span className="ml-2 text-xl font-bold text-white hidden md:inline">FirstAid.AI</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/first-aid" 
              className="text-white hover:text-gray-200 flex flex-col items-center group"
            >
              <BookOpen className="h-5 w-5 mb-1 transition-transform group-hover:scale-110" />
              <span className="text-xs">Guide</span>
            </Link>
            <Link 
              to="/injury-detection" 
              className="text-white hover:text-gray-200 flex flex-col items-center group"
            >
              <Camera className="h-5 w-5 mb-1 transition-transform group-hover:scale-110" />
              <span className="text-xs">Detection</span>
            </Link>
            <Link 
              to="/nearby-hospitals" 
              className="text-white hover:text-gray-200 flex flex-col items-center group"
            >
              <Stethoscope className="h-5 w-5 mb-1 transition-transform group-hover:scale-110" />
              <span className="text-xs">Hospitals</span>
            </Link>
            <Link 
              to="/chat" 
              className="text-white hover:text-gray-200 flex flex-col items-center group"
            >
              <MessageCircle className="h-5 w-5 mb-1 transition-transform group-hover:scale-110" />
              <span className="text-xs">Chat</span>
            </Link>

            {/* Notifications */}
            <button className="text-white hover:text-gray-200 relative group">
              <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-white hover:text-gray-200 flex items-center group"
                >
                  <div className="bg-blue-700 p-2 rounded-full transition-transform group-hover:scale-110">
                    <User className="h-5 w-5" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50">
                    {/* User Profile Section */}
                    <div className="p-4 border-b border-gray-200 flex items-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {user.displayName || 'User'}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </Link>
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-xl mt-2">
            <div className="p-4 space-y-4">
              <Link 
                to="/first-aid" 
                className="flex items-center text-gray-800 hover:bg-blue-50 p-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5 mr-3" />
                First Aid Guide
              </Link>
              <Link 
                to="/injury-detection" 
                className="flex items-center text-gray-800 hover:bg-blue-50 p-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Camera className="h-5 w-5 mr-3" />
                Injury Detection
              </Link>
              <Link 
                to="/nearby-hospitals" 
                className="flex items-center text-gray-800 hover:bg-blue-50 p-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Stethoscope className="h-5 w-5 mr-3" />
                Nearby Hospitals
              </Link>
              <Link 
                to="/chat" 
                className="flex items-center text-gray-800 hover:bg-blue-50 p-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Chat
              </Link>

              {/* Notifications */}
              <div className="flex items-center text-gray-800 hover:bg-blue-50 p-2 rounded-lg">
                <Bell className="h-5 w-5 mr-3" />
                Notifications
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </div>

              {/* User Section */}
              {user ? (
                <div>
                  <div className="flex items-center border-b pb-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {user.displayName || 'User'}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center text-gray-800 hover:bg-blue-50 p-2 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center text-gray-800 hover:bg-blue-50 p-2 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 mr-3" /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center text-red-600 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <LogOut className="h-5 w-5 mr-3" /> Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;