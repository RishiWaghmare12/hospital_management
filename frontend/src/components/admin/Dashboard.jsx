import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  BellAlertIcon,
  ClockIcon,
  ServerStackIcon,
  CircleStackIcon,
  CloudIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserPlusIcon,
  HomeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { doctorService, patientService, appointmentService } from '../../services/api';
import { format, isToday, isYesterday } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Total Doctors', value: '...', icon: UserGroupIcon, color: 'blue' },
    { name: 'Total Patients', value: '...', icon: UserGroupIcon, color: 'green' },
    { name: 'Appointments', value: '...', icon: CalendarIcon, color: 'purple' },
    { name: 'Revenue', value: 'N/A', icon: CurrencyDollarIcon, color: 'yellow' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
          doctorService.getAllDoctors(),
          patientService.getAllPatients(),
          appointmentService.getAllAppointments()
        ]);
        setStats([
          { name: 'Total Doctors', value: doctorsRes.data.length, icon: UserGroupIcon, color: 'blue' },
          { name: 'Total Patients', value: patientsRes.data.length, icon: UserGroupIcon, color: 'green' },
          { name: 'Appointments', value: appointmentsRes.data.length, icon: CalendarIcon, color: 'purple' },
          { name: 'Revenue', value: 'N/A', icon: CurrencyDollarIcon, color: 'yellow' }
        ]);
      } catch (err) {
        setError('Failed to fetch stats');
        setStats([
          { name: 'Total Doctors', value: 'Error', icon: UserGroupIcon, color: 'blue' },
          { name: 'Total Patients', value: 'Error', icon: UserGroupIcon, color: 'green' },
          { name: 'Appointments', value: 'Error', icon: CalendarIcon, color: 'purple' },
          { name: 'Revenue', value: 'N/A', icon: CurrencyDollarIcon, color: 'yellow' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // Fetch recent doctors and patients
    const fetchRecent = async () => {
      try {
        const [doctorsRes, patientsRes] = await Promise.all([
          doctorService.getAllDoctors(),
          patientService.getAllPatients()
        ]);
        setRecentDoctors(doctorsRes.data.slice(-3).reverse());
        setRecentPatients(patientsRes.data.slice(-3).reverse());
      } catch (err) {
        setRecentDoctors([]);
        setRecentPatients([]);
      }
    };
    fetchRecent();

    // Fetch recent appointments
    const fetchRecentAppointments = async () => {
      try {
        const res = await appointmentService.getAllAppointments();
        setRecentAppointments(res.data.slice(-5).reverse());
      } catch (err) {
        setRecentAppointments([]);
      }
    };
    fetchRecentAppointments();
  }, []);

  // Helper to get relative time
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  // Build a combined recent activities list
  const activities = [
    ...recentDoctors.map(doc => ({
      type: 'Doctor',
      name: doc.name || doc.drName || 'Unknown',
      date: doc.createdAt || doc.registrationDate || doc.date || '',
      details: doc.specialization || doc.specialty || '',
      email: doc.email || '',
      department: doc.department || doc.specialization || doc.specialty || '',
      contact: doc.phone || doc.contact || '',
    })),
    ...recentPatients.map(pat => ({
      type: 'Patient',
      name: pat.name || pat.Name || 'Unknown',
      date: pat.createdAt || pat.registrationDate || pat.date || '',
      details: pat.gender || pat.Gender || '',
      age: pat.age || '',
      contact: pat.phone || pat.contact || '',
    })),
    ...recentAppointments.map(app => ({
      type: 'Appointment',
      name: app.patientName || (app.patient && app.patient.name) || 'Unknown',
      date: app.appointmentDate || app.date || '',
      details: app.status || '',
      doctor: app.doctorName || (app.doctor && app.doctor.name) || '',
      time: app.time || app.appointmentTime || '',
      department: app.department || '',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const systemHealth = {
    server: {
      status: 'Online',
      uptime: '99.9%',
      lastCheck: '2 minutes ago'
    },
    database: {
      status: 'Connected',
      performance: 'Optimal',
      lastBackup: '1 hour ago'
    },
    storage: {
      used: '65%',
      total: '1 TB',
      warning: false
    }
  };

  const quickStats = {
    todayAppointments: 28,
    pendingApprovals: 5,
    activeStaff: 85,
    emergencyRoom: 'Available'
  };

  return (
    <div className="space-y-8 p-6">
      {/* Hospital Overview Card */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-600 to-cyan-700 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
        <div>
          <h1 className="text-3xl font-bold flex items-center"><HomeIcon className="h-8 w-8 mr-2 text-white" /> Hospital Overview</h1>
          <p className="mt-1 text-cyan-100">Welcome, Admin! Here's a quick overview of your hospital's activity.</p>
        </div>
        <div className="text-right">
          <p className="text-cyan-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="w-full flex justify-center mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-gray-500">Loading stats...</div>
          ) : error ? (
            <div className="col-span-3 text-center py-8 text-red-500">{error}</div>
          ) : (
            stats
              .filter(stat => !stat.name.includes('Revenue'))
              .map((stat) => {
                let linkTo = "/admin/dashboard";
                let gradientBg = "";
                let borderColor = "";
                let bgTint = "";
                if (stat.name.includes("Doctor")) {
                  linkTo = "/admin/doctors";
                  gradientBg = "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600";
                  borderColor = "border-[4px] border-sky-500";
                  bgTint = "bg-gradient-to-br from-sky-50 via-blue-50 to-white";
                } else if (stat.name.includes("Patient")) {
                  linkTo = "/admin/patients";
                  gradientBg = "bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600";
                  borderColor = "border-[4px] border-rose-500";
                  bgTint = "bg-gradient-to-br from-rose-50 via-pink-50 to-white";
                } else if (stat.name.includes("Appointment")) {
                  linkTo = "/admin/appointments";
                  gradientBg = "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600";
                  borderColor = "border-[4px] border-orange-500";
                  bgTint = "bg-gradient-to-br from-orange-50 via-orange-50 to-white";
                }
                return (
                  <Link to={linkTo} key={stat.name} className="block">
                    <div className={`${bgTint} rounded-2xl shadow-lg p-6 ${borderColor} hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center`}>
                      <div className={`p-4 rounded-xl ${gradientBg} mr-5 shadow-xl`}>
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </Link>
                );
              })
          )}
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-white rounded-2xl shadow-lg p-6 border-2 border-sky-400 border-l-[8px] border-l-sky-500">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 mr-3 shadow-md">
              <UserPlusIcon className="h-5 w-5 text-white" />
            </div>
            Recent Doctors
          </h2>
          <ul className="divide-y divide-sky-200">
            {recentDoctors.length === 0 ? (
              <li className="py-3 text-gray-500">No recent doctors.</li>
            ) : (
              recentDoctors.map(doc => (
                <li key={doc.id || doc.drId} className="py-3 flex items-center justify-between hover:bg-sky-100 transition-colors rounded px-2">
                  <span className="font-medium text-gray-900">{doc.name || doc.drName || 'Unknown'}</span>
                  <span className="text-xs text-sky-700 font-semibold bg-sky-100 px-2 py-1 rounded">{doc.specialization || doc.specialty || ''}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-white rounded-2xl shadow-lg p-6 border-2 border-rose-400 border-l-[8px] border-l-rose-500">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600 mr-3 shadow-md">
              <UserPlusIcon className="h-5 w-5 text-white" />
            </div>
            Recent Patients
          </h2>
          <ul className="divide-y divide-rose-200">
            {recentPatients.length === 0 ? (
              <li className="py-3 text-gray-500">No recent patients.</li>
            ) : (
              recentPatients.map(pat => (
                <li key={pat.id || pat.P_ID} className="py-3 flex items-center justify-between hover:bg-rose-100 transition-colors rounded px-2">
                  <span className="font-medium text-gray-900">{pat.name || pat.Name || 'Unknown'}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${(pat.gender || pat.Gender || '').toLowerCase() === 'male'
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-pink-200 text-pink-800'
                    }`}>
                    {pat.gender || pat.Gender || ''}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* System Health Card (styled) */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 border-2 border-gray-300 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 mr-3 shadow-md">
            <ServerStackIcon className="h-5 w-5 text-white" />
          </div>
          System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-5 bg-gradient-to-br from-sky-50 via-blue-50 to-white rounded-2xl border-2 border-sky-400 border-l-[8px] border-l-sky-500 hover:shadow-xl transition-all hover:scale-105 duration-300">
            <div className="p-3 rounded-lg bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 mr-4 shadow-md">
              <ServerStackIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Server Status</p>
              <p className="text-xs text-gray-500 mb-1">Uptime: 99.9%</p>
              <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-green-200 text-green-800">Online</span>
            </div>
          </div>
          <div className="flex items-center p-5 bg-gradient-to-br from-rose-50 via-pink-50 to-white rounded-2xl border-2 border-rose-400 border-l-[8px] border-l-rose-500 hover:shadow-xl transition-all hover:scale-105 duration-300">
            <div className="p-3 rounded-lg bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600 mr-4 shadow-md">
              <CircleStackIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Database</p>
              <p className="text-xs text-gray-500 mb-1">Last Backup: 1 hour ago</p>
              <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-green-200 text-green-800">Connected</span>
            </div>
          </div>
          <div className="flex items-center p-5 bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-2xl border-2 border-amber-400 border-l-[8px] border-l-amber-500 hover:shadow-xl transition-all hover:scale-105 duration-300">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 mr-4 shadow-md">
              <CloudIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Storage</p>
              <p className="text-xs text-gray-500 mb-1">Total: 1 TB</p>
              <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-amber-200 text-amber-800">65% Used</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* System Health */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border-2 border-gray-300 p-8 flex flex-col min-h-[340px] w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-900">
            <ServerStackIcon className="h-8 w-8 text-blue-500 mr-3" /> System Health
          </h2>
          <div className="space-y-6">
            {/* Server Status */}
            <div className="flex items-center bg-gradient-to-br from-sky-50 via-blue-50 to-white rounded-lg p-5 mb-2 border-2 border-sky-300">
              <ServerStackIcon className="h-7 w-7 text-sky-500 mr-4" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg">Server Status</div>
                <div className="text-sm text-gray-500">Uptime: 99.9%</div>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-green-200 text-green-800 font-bold text-sm">Online</span>
            </div>
            {/* Database */}
            <div className="flex items-center bg-gradient-to-br from-rose-50 via-pink-50 to-white rounded-lg p-5 mb-2 border-2 border-rose-300">
              <CircleStackIcon className="h-7 w-7 text-rose-500 mr-4" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg">Database</div>
                <div className="text-sm text-gray-500">Last Backup: 1 hour ago</div>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-green-200 text-green-800 font-bold text-sm">Connected</span>
            </div>
            {/* Storage */}
            <div className="flex items-center bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-lg p-5 border-2 border-amber-300">
              <CloudIcon className="h-7 w-7 text-amber-500 mr-4" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg">Storage</div>
                <div className="text-sm text-gray-500 mb-1">Total: 1 TB</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: '65%' }}></div>
                </div>
              </div>
              <span className="ml-4 font-bold text-gray-700 text-lg">65%</span>
            </div>
          </div>
        </div>
        {/* Recent Activities */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border-2 border-gray-300 p-8 flex flex-col min-h-[340px] w-full max-w-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center text-gray-900">
              <BellAlertIcon className="h-8 w-8 text-orange-600 mr-3" /> Recent Activities
            </h2>
            <Link to="/admin/activities" className="text-base text-orange-600 hover:text-orange-700 font-semibold">View All</Link>
          </div>
          <ul className="space-y-4">
            {activities.length === 0 ? (
              <li className="py-6 text-gray-500 text-lg">No recent activities.</li>
            ) : (
              activities.map((act, idx) => {
                let icon = <UserIcon className="h-7 w-7 text-gray-400" />;
                let borderColor = 'border-sky-500';
                let badgeColor = 'bg-sky-200 text-sky-800';
                let bgGradient = 'from-sky-50 via-blue-50 to-white';
                if (act.type === 'Doctor') {
                  icon = <UserGroupIcon className="h-7 w-7 text-sky-600" />;
                  borderColor = 'border-sky-500';
                  badgeColor = 'bg-sky-200 text-sky-800';
                  bgGradient = 'from-sky-50 via-blue-50 to-white';
                } else if (act.type === 'Patient') {
                  icon = <UserPlusIcon className="h-7 w-7 text-rose-600" />;
                  borderColor = 'border-rose-500';
                  badgeColor = 'bg-rose-200 text-rose-800';
                  bgGradient = 'from-rose-50 via-pink-50 to-white';
                } else if (act.type === 'Appointment') {
                  icon = <CalendarIcon className="h-7 w-7 text-orange-600" />;
                  borderColor = 'border-orange-500';
                  badgeColor = 'bg-orange-200 text-orange-800';
                  bgGradient = 'from-orange-50 via-orange-50 to-white';
                }
                return (
                  <li key={idx} className={`flex items-center bg-gradient-to-br ${bgGradient} rounded-lg p-4 border-l-[10px] ${borderColor} shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200`}>
                    <div className="mr-4">{icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>{act.type}</span>
                        <span className="font-bold text-gray-900 text-lg">{act.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {act.details && <span>{act.details}</span>}
                        {act.date && <span>{getRelativeTime(act.date)}</span>}
                      </div>
                      {/* Extra details */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                        {act.type === 'Doctor' && (
                          <>
                            {act.email && <span>Email: {act.email}</span>}
                            {act.department && <span>Dept: {act.department}</span>}
                            {act.contact && <span>Contact: {act.contact}</span>}
                          </>
                        )}
                        {act.type === 'Patient' && (
                          <>
                            {act.age && <span>Age: {act.age}</span>}
                            {act.contact && <span>Contact: {act.contact}</span>}
                          </>
                        )}
                        {act.type === 'Appointment' && (
                          <>
                            {act.doctor && <span>Doctor: {act.doctor}</span>}
                            {act.time && <span>Time: {act.time}</span>}
                            {act.department && <span>Dept: {act.department}</span>}
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 