import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CheckIcon,
  CalendarIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  UserIcon,
  UserGroupIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { appointmentService, prescriptionService, patientService } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentCounts, setAppointmentCounts] = useState({
    today: 0,
    upcoming: 0,
    past: 0,
    total: 0
  });
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    specialty: '',
    patients: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    // Helper to fetch appointments first, then patients
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get doctor ID from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) throw new Error('User data not found');
        const userData = JSON.parse(userStr);
        if (!userData.id) throw new Error('Doctor ID not found');

        // Set basic doctor info
        setDoctorInfo({
          name: userData.name || 'Doctor',
          specialty: userData.specialty || 'Specialist',
          patients: Math.floor(Math.random() * 200) + 100 // Placeholder
        });

        // 1. Fetch Appointments first
        let appointments = [];
        try {
          const response = await appointmentService.getAppointmentsByDoctor(userData.id);
          if (response.data) {
            appointments = response.data;
            processAppointmentCounts(appointments);
          }
        } catch (err) {
          console.error('Error fetching appointments:', err);
        }

        // 2. Fetch Patients and enrich with appointment data
        try {
          const response = await patientService.getDoctorPatients(userData.id);
          if (response.data) {
            const enrichedPatients = response.data.slice(0, 3).map(patient => {
              // Find appointments for this patient
              const patientAppts = appointments.filter(a =>
                (a.pId && String(a.pId) === String(patient.pId)) ||
                (a.P_ID && String(a.P_ID) === String(patient.pId))
              );

              // Sort by date descending (Newest -> Oldest)
              patientAppts.sort((a, b) => {
                const dateA = new Date(a.appointmentDate || a.date);
                const dateB = new Date(b.appointmentDate || b.date);
                return dateB - dateA;
              });

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              // Find last visit (First past appointment in descending list = most recent past)
              const lastAppt = patientAppts.find(a => {
                const apptDate = new Date(a.appointmentDate || a.date);
                return apptDate < today;
              });

              // Find next appointment (Last future appointment in descending list = nearest future)
              // Filter for future dates, then take the last one (which is the oldest of the future dates, aka nearest to today)
              const futureAppts = patientAppts.filter(a => {
                const apptDate = new Date(a.appointmentDate || a.date);
                return apptDate >= today;
              });
              const nextAppt = futureAppts.length > 0 ? futureAppts[futureAppts.length - 1] : null;

              return {
                ...patient,
                lastVisit: lastAppt ? new Date(lastAppt.appointmentDate || lastAppt.date).toLocaleDateString() : 'N/A',
                nextAppointment: nextAppt ? new Date(nextAppt.appointmentDate || nextAppt.date).toLocaleDateString() : 'N/A'
              };
            });
            setRecentPatients(enrichedPatients);
          }
        } catch (err) {
          console.error('Error fetching patients:', err);
        }

        // 3. Fetch Prescriptions
        try {
          const response = await prescriptionService.getPrescriptionsByDoctor(userData.id);
          if (response.data) {
            setRecentPrescriptions(response.data.slice(0, 3));
          }
        } catch (err) {
          console.error('Error fetching prescriptions:', err);
        }

      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const processAppointmentCounts = (appointments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toDateString();

    const counts = { today: 0, upcoming: 0, past: 0, total: appointments.length };
    const recent = [];

    appointments.forEach(appt => {
      try {
        const apptDate = new Date(appt.appointmentDate || appt.appointment_date || appt.date);

        if (apptDate.toDateString() === todayStr) {
          counts.today++;
          if (recent.length < 3) addToRecent(recent, appt, apptDate);
        } else if (apptDate > today) {
          counts.upcoming++;
          if (recent.length < 3 && apptDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
            addToRecent(recent, appt, apptDate);
          }
        } else {
          counts.past++;
        }
      } catch (err) { console.error(err); }
    });

    setAppointmentCounts(counts);
    setRecentAppointments(recent);
  };

  const addToRecent = (recent, appt, date) => {
    recent.push({
      id: appt.apId || appt.id,
      patientName: appt.patientName || 'Patient', // Note: backend appt might not have name
      patientAge: appt.patientAge || 'N/A',
      time: appt.appointmentTime || '09:00 AM',
      status: appt.status || 'Scheduled',
      date: date.toLocaleDateString(),
      reason: appt.descript || 'General Consultation',
      type: appt.appointmentType || 'Check-up'
    });
  };

  const handleCardClick = (tabName) => {
    navigate('/doctor/appointments', { state: { selectedTab: tabName } });
  };

  const appointmentCards = [
    {
      id: 'today',
      title: "Today's Appointments",
      count: appointmentCounts.today,
      icon: <ClockIcon className="h-8 w-8 text-white" />,
      gradient: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-white',
      borderColor: 'border-blue-400 border-l-blue-500',
      textColor: 'text-blue-900',
      iconBg: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600'
    },
    {
      id: 'upcoming',
      title: 'Upcoming Appointments',
      count: appointmentCounts.upcoming,
      icon: <CalendarIcon className="h-8 w-8 text-white" />,
      gradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600',
      bgGradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white',
      borderColor: 'border-emerald-400 border-l-emerald-500',
      textColor: 'text-emerald-900',
      iconBg: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600'
    },
    {
      id: 'past',
      title: 'Past Appointments',
      count: appointmentCounts.past,
      icon: <CheckIcon className="h-8 w-8 text-white" />,
      gradient: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 via-fuchsia-50 to-white',
      borderColor: 'border-purple-400 border-l-purple-500',
      textColor: 'text-purple-900',
      iconBg: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'New Appointment',
      icon: <PlusCircleIcon className="h-6 w-6 text-blue-500" />,
      path: '/doctor/appointments/new',
      description: 'Schedule a new appointment'
    },
    {
      title: 'Write Prescription',
      icon: <DocumentTextIcon className="h-6 w-6 text-green-500" />,
      path: '/doctor/prescriptions/new',
      description: 'Create a new prescription'
    },
    {
      title: 'Patient Records',
      icon: <UserGroupIcon className="h-6 w-6 text-purple-500" />,
      path: '/doctor/patients',
      description: 'View patient records'
    }
  ];

  const recentNotifications = [
    {
      id: 1,
      message: 'New lab results available for Mary Johnson',
      time: '30 minutes ago',
      icon: <BellIcon className="h-5 w-5 text-blue-500" />
    },
    {
      id: 2,
      message: 'Appointment rescheduled by James Wilson to May 2',
      time: '2 hours ago',
      icon: <CalendarIcon className="h-5 w-5 text-orange-500" />
    },
    {
      id: 3,
      message: 'New message from Dr. Williams about patient referral',
      time: 'Yesterday',
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'checked in':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-xl shadow-xl mb-8 text-white p-6 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, Dr. {doctorInfo.name.split(' ')[0]}</h1>
            <p className="mt-1 text-emerald-100">{doctorInfo.specialty} • {doctorInfo.patients} Patients</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-1 text-white font-medium">Have a great day!</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-lg text-red-500 border border-red-200 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Appointment Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {appointmentCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`cursor-pointer rounded-2xl shadow-lg p-6 transition-all duration-300 ${card.bgGradient} border-2 ${card.borderColor} border-l-[8px] hover:shadow-2xl hover:scale-[1.02]`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">{card.title}</h3>
                    <p className={`text-5xl font-bold ${card.textColor}`}>{card.count}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.iconBg} shadow-md`}>
                    {card.icon}
                  </div>
                </div>
                <div className="mt-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                  <span className="text-sm font-medium">View details</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions and Patient Details (2 columns) */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-6 text-emerald-900">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className="flex flex-col items-center p-4 bg-white border-2 border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                      {React.cloneElement(action.icon, { className: 'h-6 w-6 text-white' })}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center">{action.title}</h3>
                    <p className="text-xs text-gray-500 text-center mt-1">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-emerald-900">Recent Patients</h2>
                <Link to="/doctor/patients" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {recentPatients.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">No recent patients.</div>
                ) : (
                  recentPatients.map(patient => (
                    <div key={patient.id} className="flex p-4 bg-white border-2 border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all duration-300">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center mr-4 shadow-md">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-gray-900">{patient.name}, {patient.age}</p>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Last: {patient.lastVisit || patient.last_visit || 'N/A'}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{patient.condition || patient.diagnosis || ''}</p>
                        {patient.nextAppointment && patient.nextAppointment !== 'N/A' && (
                          <div className="flex items-center mt-2">
                            <CalendarIcon className="h-4 w-4 text-emerald-500 mr-1" />
                            <span className="text-xs text-gray-600">Next: {patient.nextAppointment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 p-6 mt-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-emerald-900">Recent Prescriptions</h2>
              <Link to="/doctor/prescriptions" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</Link>
            </div>
            <div className="space-y-4">
              {recentPrescriptions.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No recent prescriptions.</div>
              ) : (
                recentPrescriptions.map(prescription => (
                  <div key={prescription.id} className="bg-white border-2 border-emerald-200 rounded-xl p-5 hover:border-emerald-400 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-md">
                          <DocumentTextIcon className="h-7 w-7 text-white" />
                        </div>
                        <span className="block text-xs text-gray-400 font-mono mt-2 text-center">#{prescription.id}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-semibold text-gray-900 text-base">
                              {prescription.patient?.name}
                            </span>
                            {prescription.patient?.age && (
                              <span className="ml-2 text-xs text-gray-500">({prescription.patient?.age} yrs)</span>
                            )}
                            <div className="text-xs text-gray-400 mt-1">Issued: {prescription.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString() : 'N/A'}</div>
                          </div>
                          <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200">
                            {prescription.diagnosis || prescription.description || 'No diagnosis'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-lg p-3">
                            <span className="block text-xs text-blue-600 font-semibold mb-1">Medicine</span>
                            <span className="block text-sm text-gray-900 font-medium">{prescription.medicine || '-'}</span>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-lg p-3">
                            <span className="block text-xs text-purple-600 font-semibold mb-1">Advice</span>
                            <span className="block text-sm text-gray-900 font-medium">{prescription.advice || '-'}</span>
                          </div>
                          <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-lg p-3">
                            <span className="block text-xs text-amber-600 font-semibold mb-1">Remark</span>
                            <span className="block text-sm text-gray-900">{prescription.remark || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Appointment Summary */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-6">Appointment Summary</h2>
            <div className="grid grid-cols-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-emerald-600">{appointmentCounts.total}</p>
                <p className="mt-2 text-gray-600">Total Appointments</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600">{appointmentCounts.today}</p>
                <p className="mt-2 text-gray-600">Today</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-green-600">{appointmentCounts.upcoming}</p>
                <p className="mt-2 text-gray-600">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-purple-600">{appointmentCounts.past}</p>
                <p className="mt-2 text-gray-600">Past</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 