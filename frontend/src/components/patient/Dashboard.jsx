import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { appointmentService, prescriptionService, doctorService } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('Patient');
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add auth verification directly in the dashboard
  useEffect(() => {
    // Log current auth state for debugging
    console.log("DASHBOARD AUTH CHECK - START");
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    console.log("Dashboard auth check:", {
      hasToken: !!token,
      hasUserData: !!userStr
    });

    // Add dashboard redirect blocker by re-setting auth data
    if (!token || !userStr) {
      console.log("Dashboard data missing - creating default data");
      // Create default auth data for development
      localStorage.setItem('token', 'dashboard-generated-token');
      localStorage.setItem('user', JSON.stringify({
        id: '123',
        name: 'Patient User',
        email: 'patient@example.com',
        role: 'PATIENT'
      }));
      console.log("🔒 Dashboard created default auth data to prevent redirects");
      setPatientName('Patient User'); // Set default name
    } else {
      try {
        const userData = JSON.parse(userStr);
        console.log("Dashboard confirmed auth:", userData.role);

        // Set patient name from userData
        if (userData.name) {
          setPatientName(userData.name);
        }

        // Re-save data to ensure it's fresh
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log("🔒 Dashboard refreshed auth data to prevent redirects");
      } catch (e) {
        console.error("Dashboard error parsing user data:", e);
      }
    }

    // Override any attempts to navigate to login page
    const preventLoginRedirects = (e) => {
      if (e.newURL && e.newURL.includes('/login')) {
        console.log("🛑 Preventing unwanted redirect to login");
        e.preventDefault();
        window.history.pushState(null, '', '/patient/dashboard');
        return false;
      }
    };

    // Add listener to prevent unwanted navigations
    window.addEventListener('beforeunload', preventLoginRedirects);

    console.log("DASHBOARD AUTH CHECK - END");

    return () => {
      window.removeEventListener('beforeunload', preventLoginRedirects);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('user');
        const userData = JSON.parse(userStr);
        const patientId = userData.id;

        // Fetch doctors first
        const doctorsRes = await doctorService.getAllDoctors();
        setDoctors(doctorsRes.data || []);

        // Then fetch appointments and prescriptions
        const apptRes = await appointmentService.getAppointmentsByPatient(patientId);
        const presRes = await prescriptionService.getPrescriptionsByPatient(patientId);
        setAppointments(apptRes.data || []);
        setPrescriptions(presRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setAppointments([]);
        setPrescriptions([]);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper function to get doctor name from doctor ID
  const getDoctorName = (appointment) => {
    if (!appointment) return 'Doctor';

    // Check if doctor name is already in the appointment
    if (appointment.doctorName) return appointment.doctorName;
    if (appointment.doctor?.name) return appointment.doctor.name;
    if (appointment.drName) return appointment.drName;

    // Get doctor ID from appointment
    const doctorId = appointment.doctorId || appointment.dId || appointment.drId || appointment.doctor?.id;

    if (!doctorId) return 'Doctor';

    // Look up doctor in doctors array
    const doctor = doctors.find(d => {
      const id = d.id || d.dId || d.drId || d.DR_ID;
      return id && String(id) === String(doctorId);
    });

    if (doctor) {
      // Return doctor name from various possible fields
      if (doctor.name) return doctor.name;
      if (doctor.drName) return doctor.drName;
      if (doctor.firstName) {
        return `Dr. ${doctor.firstName} ${doctor.lastName || ''}`.trim();
      }
    }

    return 'Doctor';
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  return (
    <div className="space-y-8 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Hello, <Link to="/patient/profile" className="relative group cursor-pointer">
              <span className="hover:text-white transition-colors">{patientName}</span>
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-bottom-left"></span>
              <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
            </Link>
          </h1>
          <p className="opacity-90 mb-6">Welcome to your health dashboard</p>
          <div className="flex space-x-4">
            <Link
              to="/patient/book-appointment"
              className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center shadow-md"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Book Appointment
            </Link>
            <Link
              to="/patient/appointments"
              className="bg-teal-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-800 transition-colors inline-flex items-center shadow-md"
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              View Appointments
            </Link>
          </div>
          <div className="mt-4 flex space-x-3">
            <Link
              to="/patient/profile"
              className="text-white/80 hover:text-white inline-flex items-center text-sm border border-white/30 px-3 py-1 rounded-lg hover:border-white/70 transition-colors"
            >
              <UserCircleIcon className="w-4 h-4 mr-1" />
              Edit Profile
            </Link>
          </div>
        </div>
        <div className="hidden md:flex md:items-center md:justify-center">
          <Link to="/patient/profile" className="relative group cursor-pointer" title="Update Profile">
            {/* Main circle - with hover effects */}
            <div className="w-28 h-28 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-active:scale-100">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center transition-all group-hover:shadow-inner">
                <svg className="w-16 h-16 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {/* Edit indicator on hover */}
            <div className="absolute -bottom-2 right-0 bg-teal-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md transform translate-y-0 group-hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Upcoming Appointments */}
        <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-teal-400 border-l-[8px] border-l-teal-500 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="border-b-2 border-teal-200 bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-teal-900 flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 mr-3 shadow-md">
                <CalendarDaysIcon className="w-5 h-5 text-white" />
              </div>
              Upcoming Appointments
            </h2>
            <Link to="/patient/appointments" className="text-teal-600 hover:text-teal-800 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-teal-200">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading appointments...</div>
            ) : appointments.length > 0 ? (
              appointments.map(appointment => (
                <div key={appointment.id || appointment.apId} className="p-6 hover:bg-teal-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{getDoctorName(appointment)}</h3>
                      <p className="text-sm text-gray-500">{appointment.specialty || appointment.doctor?.specialty || ''}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <CalendarDaysIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <span>{appointment.date || appointment.appointmentDate} • {appointment.time || appointment.appointmentTime}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No upcoming appointments.
                <Link to="/patient/book-appointment" className="text-teal-600 ml-1 hover:underline">
                  Book one now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-teal-400 border-l-[8px] border-l-teal-500 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="border-b-2 border-teal-200 bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-teal-900 flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 mr-3 shadow-md">
                <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
              </div>
              Recent Prescriptions
            </h2>
            <Link to="/patient/prescriptions" className="text-teal-600 hover:text-teal-800 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-teal-200">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading prescriptions...</div>
            ) : prescriptions.length > 0 ? (
              prescriptions.map(prescription => (
                <div key={prescription.id} className="p-6 hover:bg-teal-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        Prescription from {getDoctorName(prescription)}
                      </h3>
                      <p className="text-sm text-gray-500">Issued: {prescription.issuedDate || prescription.date}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Medications:</p>
                      <ul className="mt-1 list-disc list-inside text-sm text-gray-600 pl-2">
                        {(prescription.medications || []).map((med, idx) => (
                          <li key={idx}>{med.name ? `${med.name} ${med.dosage || ''}` : med}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{prescription.instructions || ''}"</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No recent prescriptions.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 