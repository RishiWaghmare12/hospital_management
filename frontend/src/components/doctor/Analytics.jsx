import React from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  // Sample analytics data - would be fetched from API in real application
  const stats = [
    {
      name: 'Total Patients',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: UserGroupIcon
    },
    {
      name: 'Appointments',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: CalendarIcon
    },
    {
      name: 'Revenue',
      value: '$45,678',
      change: '+15%',
      changeType: 'increase',
      icon: CurrencyDollarIcon
    },
    {
      name: 'Patient Satisfaction',
      value: '94%',
      change: '-2%',
      changeType: 'decrease',
      icon: ChartBarIcon
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Vibrant Header */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-2 text-white" /> Analytics Dashboard
          </h1>
          <p className="mt-1 text-emerald-100">Track your performance and insights</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-md">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 flex items-center text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stat.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4 text-emerald-900">Appointment Trends</h2>
          <div className="h-64 bg-white rounded-lg flex items-center justify-center border-2 border-emerald-200">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4 text-emerald-900">Patient Demographics</h2>
          <div className="h-64 bg-white rounded-lg flex items-center justify-center border-2 border-emerald-200">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-emerald-900">Recent Activity</h2>
        </div>
        <ul className="divide-y divide-emerald-200">
          {[1, 2, 3, 4, 5].map((item) => (
            <li key={item} className="p-4 hover:bg-emerald-100 transition-colors">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New appointment scheduled with Patient {item}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <button className="text-emerald-600 hover:text-emerald-900 text-sm font-medium">
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;