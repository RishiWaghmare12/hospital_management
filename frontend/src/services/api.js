import axios from 'axios';

// Prefer env override, fallback to 8081 for dev (backend runs on 8081)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// If your backend is running on a different port, update the URL above
// For example: const API_BASE_URL = 'http://localhost:9090/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});


// REQUEST INTERCEPTOR (JWT FIX)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, etc)
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if needed
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export this function for backward compatibility with Register.jsx
export const registerUser = (userData) => {
  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Transform frontend data to backend schema
  const patientData = {
    name: userData.username,
    dob: userData.dateOfBirth,
    age: userData.age || calculateAge(userData.dateOfBirth),
    gender: userData.gender,
    bloodGroup: userData.bloodGroup,
    mobileNo: userData.phoneNumber,
    email: userData.email,
    address: userData.address,
    password: userData.password
  };

  return api.post('/patients', patientData);
};

// Auth services
export const authService = {
  patientLogin: (credentials) => {
    return api.post('/auth/patient/login', credentials)
      .then(response => {
        // Check if response is successful but doesn't have expected data
        if (!response.data.token || !response.data.success) {
          throw new Error(response.data.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        // If there's a response from server with error message
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  doctorLogin: (credentials) => {
    return api.post('/auth/doctor/login', credentials)
      .then(response => {
        if (!response.data.token || !response.data.success) {
          throw new Error(response.data.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  adminLogin: (credentials) => {
    return api.post('/auth/admin/login', credentials)
      .then(response => {
        if (!response.data.token || !response.data.success) {
          throw new Error(response.data.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  logout: () => api.post('/auth/logout'),
  validateToken: () => api.get('/auth/validate'),
  changePassword: (userId, passwordData) => {
    // Get user role from localStorage to determine correct endpoint
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'PATIENT';

    // Use appropriate endpoint based on role
    const endpoint = role === 'DOCTOR'
      ? `/doctors/${userId}/change-password`
      : `/patients/${userId}/change-password`;

    return api.put(endpoint, passwordData);
  }
};

// Patient services
export const patientService = {
  getAllPatients: () => api.get('/patients'),
  getPatientById: (id) => api.get(`/patients/${id}`),
  createPatient: (data) => api.post('/patients', data),
  updatePatient: (id, data) => api.put(`/patients/${id}`, data),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  searchPatientsByName: (name) => api.get(`/patients/search?name=${name}`),
  findPatientByEmail: (email) => api.get(`/patients/email?email=${email}`),
  findPatientsByContact: (contact) => api.get(`/patients/search-contact?contact=${contact}`),
  getPatientDetails: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch patient:", error);
      throw error;
    }
  },
  getDoctorPatients: (doctorId) => api.get(`/patients/doctor/${doctorId}`),
  changePassword: (patientId, passwordData) => api.put(`/patients/${patientId}/change-password`, passwordData),
  forgotPassword: (email) => api.post('/patients/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/patients/reset-password', { token, newPassword }),
};

// Doctor services
export const doctorService = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  addDoctor: (doctorData) => api.post('/doctors', doctorData),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
  getDoctorsBySpecialty: (specialtyId) => api.get(`/doctors/specialization/${specialtyId}`),
  getAllSpecializations: () => api.get('/specializations'),
  // New methods for doctor dashboard
  getDoctorStats: (id) => api.get(`/doctors/${id}/stats`),
  getDoctorTodayAppointments: (id) => {
    const today = new Date().toISOString().split('T')[0];
    return api.get(`/appointments/doctor/${id}/date/${today}`);
  },
  getDoctorPatientCount: (id) => api.get(`/doctors/${id}/patients/count`),
  getDoctorUpcomingAppointments: (id) => {
    const today = new Date().toISOString().split('T')[0];
    return api.get(`/appointments/doctor/${id}/upcoming?from=${today}`);
  },
  // This is a fallback method if your backend doesn't support the endpoints above
  calculateDoctorStats: async (id) => {
    try {
      // Get all appointments for this doctor
      const appointmentsResponse = await appointmentService.getAppointmentsByDoctor(id);
      const appointments = appointmentsResponse.data || [];

      // Current date for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate stats
      const todayAppointments = appointments.filter(app => {
        const appDate = new Date(app.appointmentDate || app.appointment_date || app.date);
        return appDate.toDateString() === today.toDateString();
      });

      // Get unique patients
      const uniquePatients = new Set();
      appointments.forEach(app => {
        uniquePatients.add(app.pId || app.P_ID);
      });

      return {
        data: {
          totalAppointments: appointments.length,
          todayAppointments: todayAppointments.length,
          patientCount: uniquePatients.size,
          todayAppointmentsList: todayAppointments
        }
      };
    } catch (error) {
      console.error('Error calculating doctor stats:', error);
      throw error;
    }
  },
};

// Specialty services
// Helpers to normalize specialty data coming from various backend shapes
const normalizeSpecialties = (data) => {
  if (!data) return [];
  // If backend sends { data: [...] }
  const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
  return list.map((item, idx) => {
    // Accept multiple possible field names
    const spId =
      item.spId ??
      item.specializationId ??
      item.specialityId ??
      item.id ??
      item.sp_id ??
      idx; // fallback index if missing
    const spName =
      item.spName ??
      item.specializationName ??
      item.specialityName ??
      item.name ??
      item.title ??
      String(item);
    return { spId, spName };
  }).filter(s => s.spName && s.spName !== 'undefined');
};

// Default specialties fallback to avoid empty dropdowns when backend is empty/unavailable
const DEFAULT_SPECIALTIES = [
  { spId: 1, spName: 'Cardiology' },
  { spId: 2, spName: 'Dermatology' },
  { spId: 3, spName: 'Neurology' },
  { spId: 4, spName: 'Orthopedics' },
  { spId: 5, spName: 'Pediatrics' },
  { spId: 6, spName: 'Oncology' },
  { spId: 7, spName: 'Gynecology' }
];

export const specialtyService = {
  getAllSpecialties: () => api.get('/specializations'),
  // Normalized convenience method that never returns an empty array silently.
  getAllSpecialtiesNormalized: async () => {
    try {
      const res = await api.get('/specializations');
      const normalized = normalizeSpecialties(res.data);
      if (normalized.length > 0) return normalized;
      // If API returns 200 but empty or mismatched keys, provide safe defaults
      return DEFAULT_SPECIALTIES;
    } catch (error) {
      console.error('Failed to fetch specialties, using defaults:', error);
      return DEFAULT_SPECIALTIES;
    }
  }
};

// Appointment services
export const appointmentService = {
  getAllAppointments: () => api.get('/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  getAppointmentsByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getAppointmentsByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getAppointmentsByStatus: (status) => api.get(`/appointments/status/${status}`),
  getAppointmentsByDate: (date) => api.get(`/appointments/date/${date}`),
  getAppointmentsByDoctorAndDate: (doctorId, date) => api.get(`/appointments/doctor/${doctorId}/date/${date}`),
  updateAppointmentStatus: (id, status) => {
    console.log(`Updating appointment ${id} status to ${status}`);

    // Try both endpoint formats since backends can vary
    try {
      return api.put(`/appointments/${id}/status?status=${status}`)
        .catch(error => {
          console.log('First endpoint attempt failed, trying alternative format');
          // If the first format fails, try the second common format
          return api.put(`/appointments/${id}`, { status: status });
        });
    } catch (error) {
      console.error('Error in updateAppointmentStatus:', error);
      throw error;
    }
  },
  checkAvailability: (doctorId, date, time) =>
    api.get(`/appointments/check?doctorId=${doctorId}&date=${date}&time=${time}`),
  getDoctorPatients: (doctorId) => api.get(`/appointments/${doctorId}/patients`),
};

// Prescription services
export const prescriptionService = {
  getAllPrescriptions: () => api.get('/prescriptions'),
  getPrescriptionById: (id) => api.get(`/prescriptions/${id}`),
  getPrescriptionsByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getPrescriptionsByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
  getPrescriptionsByAppointment: (appointmentId) => api.get(`/prescriptions/appointment/${appointmentId}`),
  createPrescription: (prescriptionData) => {
    console.log('Sending prescription data:', prescriptionData);
    return api.post('/prescriptions', prescriptionData);
  },
  updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
  sendPrescriptionEmail: (prescriptionId) => api.post(`/prescriptions/${prescriptionId}/send-email`)
};

// ChatGPT services
export const chatService = {
  sendMessage: (prompt) => api.post('/chat', { prompt })
};

// Review services
export const reviewService = {
  addReview: (reviewData) => api.post('/reviews', reviewData),
  getDoctorReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
  getDoctorRatingSummary: (doctorId) => api.get(`/reviews/doctor/${doctorId}/summary`)
};

export default api;

