import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  // Minimal state for UI toggle only
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Get current location for active state
  const location = useLocation();

  // Mock navigation links with no actual functionality
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Doctors", path: "/doctors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Check if current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav>
      {/* Top info bar with gradient */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span className="hidden sm:flex items-center hover:text-primary-100 transition-colors">
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">hospital@healthconnect.com</span>
            </span>
          </div>
          <div className="flex items-center space-x-6 mt-2 sm:mt-0">
            <span className="flex items-center bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <PhoneIcon className="h-4 w-4 mr-2 text-red-200" />
              <span className="font-semibold">Emergency: +91 9420020598</span>
            </span>
            <span className="hidden lg:flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">Mon-Fri 8AM-8PM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar with enhanced styling */}
      <div className={`sticky top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-white shadow-md'
        } transition-all duration-300 ease-in-out border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Health</span>
                  <span className="text-gray-900">Connect</span>
                </span>
              </Link>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-base font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 ${isActive(link.path)
                    ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50'
                    }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></span>
                  )}
                </Link>
              ))}

              <div className="pl-4 ml-2 border-l border-gray-200">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                {isOpen ? (
                  <XMarkIcon className="h-7 w-7" />
                ) : (
                  <Bars3Icon className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-5 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 ${isActive(link.path)
                  ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50 hover:text-primary-600"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 