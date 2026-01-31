import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  AcademicCapIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import AddDoctor from './AddDoctor';
import { doctorService, specialtyService } from '../../services/api';
import { toast } from 'react-toastify';

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Convert specialties array to a map for easy lookup
  const specialtyMap = specialties.reduce((map, specialty) => {
    map[specialty.spId] = specialty.spName;
    return map;
  }, {});

  useEffect(() => {
    // Fetch doctors and specialties on component mount
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    setIsLoadingSpecialties(true);
    try {
      const list = await specialtyService.getAllSpecialtiesNormalized();
      setSpecialties(list);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      toast.error('Failed to load specialties');
    } finally {
      setIsLoadingSpecialties(false);
    }
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks

    setIsDeleting(true);
    try {
      await doctorService.deleteDoctor(doctorToDelete.drId);
      toast.success('Doctor deleted successfully');
      // Refresh the doctors list
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to delete doctor');
    } finally {
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
      setIsDeleting(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    // Filter by search query
    const matchesSearch = doctor.drName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.emailId.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by specialty if needed
    const matchesFilter = selectedFilter === 'all' || doctor.spId.toString() === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Get recent doctors (last 3)
  const recentDoctors = doctors.slice(-3).reverse();

  // Calculate stats
  const totalDoctors = doctors.length;
  const specialtyCount = new Set(doctors.map(d => d.spId)).size;
  const avgExperience = doctors.length > 0
    ? Math.round(doctors.reduce((sum, d) => sum + (d.experience || 0), 0) / doctors.length)
    : 0;

  return (
    <div className="space-y-8 p-6">
      {/* Vibrant Header */}
      <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <UserGroupIcon className="h-8 w-8 mr-2 text-white" /> Doctors Management
          </h1>
          <p className="mt-1 text-sky-100">Manage medical staff and specialists</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-white text-sky-600 px-6 py-3 rounded-lg hover:bg-sky-50 flex items-center shadow-lg hover:shadow-xl transition-all font-semibold"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Doctors */}
        <div className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-white rounded-2xl shadow-xl p-6 border-[4px] border-sky-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative flex items-center">
            <div className="p-4 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 mr-5 shadow-xl group-hover:rotate-6 transition-transform duration-300">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Total Doctors</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">{totalDoctors}</p>
              <p className="text-xs text-gray-500 mt-1">Active medical staff</p>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="relative bg-gradient-to-br from-purple-50 via-purple-50 to-white rounded-2xl shadow-xl p-6 border-[4px] border-purple-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-fuchsia-500/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative flex items-center">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-400 via-purple-500 to-fuchsia-600 mr-5 shadow-xl group-hover:rotate-6 transition-transform duration-300">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Specialties</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">{specialtyCount}</p>
              <p className="text-xs text-gray-500 mt-1">Medical departments</p>
            </div>
          </div>
        </div>

        {/* Avg Experience */}
        <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-white rounded-2xl shadow-xl p-6 border-[4px] border-emerald-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative flex items-center">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 mr-5 shadow-xl group-hover:rotate-6 transition-transform duration-300">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Avg Experience</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{avgExperience} <span className="text-2xl">yrs</span></p>
              <p className="text-xs text-gray-500 mt-1">Team expertise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Doctors - Takes 2 columns */}
        <div className="lg:col-span-2 bg-gradient-to-br from-sky-50 via-blue-50 to-white rounded-2xl shadow-xl p-6 border-2 border-sky-400 border-l-[8px] border-l-sky-500 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 mr-3 shadow-lg">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Recent Doctors</span>
          </h2>
          <ul className="space-y-3">
            {recentDoctors.length === 0 ? (
              <li className="py-6 text-center text-gray-500">No recent doctors.</li>
            ) : (
              recentDoctors.map(doc => (
                <li key={doc.drId} className="group bg-white rounded-xl p-4 border-2 border-sky-200 hover:border-sky-400 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="relative">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <UserGroupIcon className="h-7 w-7 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-bold text-gray-900 text-lg group-hover:text-sky-600 transition-colors">{doc.drName}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-3 mt-1">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-sky-500 rounded-full mr-1"></span>
                            Age: {doc.age}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1 text-emerald-500" />
                            {doc.experience} years
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 px-4 py-2 rounded-full border-2 border-sky-300 group-hover:scale-105 transition-transform">
                      {specialtyMap[doc.spId] || 'Unknown'}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Quick Actions - Specialties */}
        <div className="bg-gradient-to-br from-purple-50 via-purple-50 to-white rounded-2xl shadow-xl p-6 border-2 border-purple-400 border-l-[8px] border-l-purple-500 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 via-purple-500 to-fuchsia-600 mr-3 shadow-lg">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Specialties</span>
          </h2>
          <div className="space-y-3">
            {specialties.slice(0, 5).map(specialty => {
              const count = doctors.filter(d => d.spId === specialty.spId).length;
              return (
                <div key={specialty.spId} className="group relative bg-white rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-fuchsia-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors">{specialty.spName}</span>
                    <span className="flex items-center justify-center h-8 w-8 bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-700 rounded-full font-bold text-sm border-2 border-purple-300 group-hover:scale-110 transition-transform">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-white rounded-2xl shadow-lg p-6 border-2 border-sky-400 border-l-[8px] border-l-sky-500 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-3 transition-all"
              placeholder="Search doctors by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-3 transition-all"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              disabled={isLoadingSpecialties}
            >
              <option value="all">All Specialties</option>
              {isLoadingSpecialties ? (
                <option value="" disabled>Loading specialties...</option>
              ) : (
                specialties.map((specialty) => (
                  <option key={specialty.spId} value={specialty.spId}>
                    {specialty.spName}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No doctors found
          </div>
        ) : (
          filteredDoctors.map(doctor => (
            <div key={doctor.drId} className="bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-lg border-2 border-sky-300 hover:border-sky-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {doctor.picture ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                        src={`http://localhost:8080${doctor.picture}`}
                        alt={doctor.drName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/64?text=Dr";
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                        <UserGroupIcon className="h-8 w-8 text-sky-600" />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-bold">{doctor.drName}</h3>
                      <p className="text-sm text-sky-100">Age: {doctor.age}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doctor)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Specialty Badge */}
                <div className="flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 border-2 border-emerald-300">
                    {specialtyMap[doctor.spId] || 'Unknown'}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <EnvelopeIcon className="h-5 w-5 text-sky-500 mr-3" />
                    <span className="truncate">{doctor.emailId}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <PhoneIcon className="h-5 w-5 text-sky-500 mr-3" />
                    <span>{doctor.mobileNo}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <ClockIcon className="h-5 w-5 text-sky-500 mr-3" />
                    <span className="font-semibold">{doctor.experience} years experience</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <AddDoctor
          onClose={() => setIsAddModalOpen(false)}
          onDoctorAdded={() => {
            fetchDoctors();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-red-300">
            <div className="flex items-center mb-4 text-red-600">
              <ExclamationTriangleIcon className="h-8 w-8 mr-2" />
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete Dr. {doctorToDelete?.drName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 border-2 border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;