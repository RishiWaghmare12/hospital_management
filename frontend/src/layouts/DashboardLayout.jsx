import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const DashboardLayout = ({ sidebarItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Use actual logout functionality
  const handleLogout = () => {
    console.log("Logout clicked - redirecting to force login page");
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to force login page
    window.location.replace('/forcelogin');
  };

  // Get user name from localStorage
  const getUserName = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Return name based on user type
        return user.name || user.drName || 'My Profile';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return 'My Profile';
  };

  // Simple and reliable isActive function
  const isActive = (path) => {
    // Simple exact match - this ensures Dashboard only matches Dashboard, not prescriptions
    return location.pathname === path;
  };

  const colors = {
    blue: {
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      shadow: 'shadow-blue-500/30',
    },
    green: {
      gradient: 'from-green-500 via-green-600 to-green-700',
      shadow: 'shadow-green-500/30',
    },
    purple: {
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      shadow: 'shadow-purple-500/30',
    },
    orange: {
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      shadow: 'shadow-orange-500/30',
    },
    cyan: {
      gradient: 'from-cyan-500 via-cyan-600 to-cyan-700',
      shadow: 'shadow-cyan-500/30',
    },
    teal: {
      gradient: 'from-teal-500 via-teal-600 to-teal-700',
      shadow: 'shadow-teal-500/30',
    }
  };

  const SidebarContent = () => (
    <>
      <div className="relative flex items-center h-24 px-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 via-white to-primary-50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent"></div>
        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/40 hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-display">
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Health</span>
            <span className="text-gray-700">Connect</span>
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 ml-auto lg:hidden rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const itemColor = item.color ? colors[item.color] || colors.blue : colors.blue;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`relative flex items-center w-full px-4 py-4 text-sm font-bold rounded-2xl transition-all duration-300 group overflow-hidden ${active
                ? `bg-gradient-to-br ${itemColor.gradient} text-white shadow-xl ${itemColor.shadow} scale-[1.03] border-2 border-white/20`
                : item.highlight
                  ? `bg-gradient-to-br from-white to-gray-50 text-gray-700 shadow-md border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg`
                  : "bg-white/50 text-gray-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white hover:text-gray-900 hover:shadow-md border-2 border-gray-200 hover:border-gray-300"
                }`}
              onClick={() => setSidebarOpen(false)}
            >
              {/* Animated Background Effect */}
              {active && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                </>
              )}

              {/* Icon Container */}
              <div className={`relative p-3 rounded-xl mr-4 transition-all duration-300 ${active
                ? "bg-white/25 text-white shadow-lg backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6"
                : item.highlight
                  ? `bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 text-${item.color}-700 group-hover:scale-110`
                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-primary-100 group-hover:to-primary-200 group-hover:text-primary-600 group-hover:scale-110 group-hover:shadow-md"
                }`}>
                <item.icon className="h-6 w-6" />
              </div>

              {/* Text */}
              <span className="flex-1 relative z-10 tracking-wide">{item.name}</span>

              {/* Highlight Indicator */}
              {item.highlight && !active && (
                <div className="ml-auto flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${itemColor.gradient} animate-pulse shadow-lg`}></div>
                </div>
              )}

              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 mb-2 bg-gradient-to-b from-transparent to-gray-50/50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-4 text-sm font-bold rounded-2xl transition-all duration-300 text-gray-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:text-red-600 group hover:shadow-lg border-2 border-transparent hover:border-red-200"
        >
          <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 group-hover:bg-gradient-to-br group-hover:from-red-100 group-hover:to-red-200 group-hover:text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </div>
          <span className="tracking-wide">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'
          }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-2xl transform transition-transform duration-300">
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-white via-gray-50/30 to-white border-r border-gray-200/80 shadow-[8px_0_32px_rgba(0,0,0,0.06)] z-20">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <div className="sticky top-0 z-30 flex h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">

          <button
            type="button"
            className="px-4 text-gray-500 hover:text-primary-600 focus:outline-none transition-colors lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-bold text-gray-800 font-display tracking-tight">
                {sidebarItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full border border-primary-100">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-primary-700">System Online</span>
              </div>

              <Link to={location.pathname.includes('/patient') ? '/patient/profile' :
                (location.pathname.includes('/doctor') ? '/doctor/profile' : '/admin/profile')}
                className="relative group"
                title="Update Profile">
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                    <p className="text-xs text-gray-500">View Settings</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 p-0.5 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 ring-2 ring-white">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;