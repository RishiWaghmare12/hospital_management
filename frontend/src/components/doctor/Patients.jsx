import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { patientService } from '../../services/api';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../services/api';

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let doctorId = user?.id;
        if (typeof doctorId === 'string') {
          doctorId = doctorId.trim().replace(/\.$/, '');
        }
        if (typeof doctorId === 'number') {
          doctorId = doctorId.toString();
        }
        if (!doctorId) {
          toast.error('Doctor ID not found.');
          setPatients([]);
          setIsLoading(false);
          return;
        }
        const url = `${API_BASE_URL}/patients/doctor/${doctorId}`;
        console.log('Fetching patients from:', url);
        const res = await fetch(url);
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Fetch failed:', errorText);
          throw new Error(`Status: ${res.status}, Response: ${errorText}`);
        }
        if (!contentType || !contentType.includes('application/json')) {
          const errorText = await res.text();
          console.error('Non-JSON response:', errorText);
          throw new Error(`Expected JSON, got: ${errorText.substring(0, 100)}`);
        }
        const data = await res.json();
        console.log('Fetched patient data:', data);
        const mappedPatients = (data || []).map(p => ({
          id: p.pId,
          name: p.name,
          email: p.email,
          phone: p.mobileNo,
          age: p.age,
          dob: p.dob,
          gender: p.gender,
          bloodGroup: p.bloodGroup,
          address: p.address,
          status: 'Active',
          lastVisit: '-',
          appointments: '-'
        }));
        setPatients(mappedPatients);
      } catch (err) {
        let message = 'Failed to fetch patients for this doctor.';
        if (err instanceof Error) {
          message += ` (${err.message})`;
        }
        toast.error(message);
        setPatients([]);
      }
      setIsLoading(false);
    };
    fetchPatients();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      const updatedPatients = patients.filter(patient => patient.id !== id);
      setPatients(updatedPatients);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Vibrant Header */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <UserIcon className="h-8 w-8 mr-2 text-white" /> Patient Management
          </h1>
          <p className="mt-1 text-emerald-100">View and manage your patients</p>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg p-6 border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[150px]"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 border-b-2 border-emerald-300">
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Name</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Email</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Phone</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Age</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">DOB</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Gender</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Blood Group</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Address</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-500">No patients found.</td></tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-emerald-50 transition-colors duration-150">
                    <td className="px-4 py-4 text-sm text-gray-900">{patient.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{patient.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{patient.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{patient.age}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{patient.dob}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{patient.gender}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{patient.bloodGroup}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={patient.address}>{patient.address}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Patients; 