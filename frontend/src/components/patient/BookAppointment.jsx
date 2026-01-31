
import React, { useState, useEffect } from 'react';
import {
    CalendarIcon,
    ClockIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import { appointmentService, doctorService } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: 'Consultation',
        notes: ''
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Fetch booked slots when doctor or date changes
    useEffect(() => {
        if (formData.doctorId && formData.appointmentDate) {
            fetchBookedSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [formData.doctorId, formData.appointmentDate]);

    const generateTimeSlots = () => {
        const slots = [];
        let start = 9 * 60; // 9:00 AM in minutes
        const end = 17 * 60; // 5:00 PM in minutes
        const interval = 30; // 30 minutes

        while (start < end) {
            const hours = Math.floor(start / 60);
            const minutes = start % 60;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const displayTime = new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            slots.push({
                time: timeString + ':00', // Format HH:mm:ss
                display: displayTime,
                available: true
            });
            start += interval;
        }
        return slots;
    };

    const fetchBookedSlots = async () => {
        setIsLoadingSlots(true);
        try {
            // Generate all possible slots first
            const allSlots = generateTimeSlots();

            // Fetch existing appointments
            const response = await appointmentService.getAppointmentsByDoctorAndDate(
                formData.doctorId,
                formData.appointmentDate
            );

            const bookedApps = response.data || [];

            // Mark booked slots as unavailable
            const updatedSlots = allSlots.map(slot => {
                // Check if this slot time matches any booked appointment time
                // Backend returns HH:mm:ss, our slot.time is HH:mm:ss
                const isBooked = bookedApps.some(app => {
                    const appTime = app.appointmentTime || app.appointment_time;
                    // Robust check: match HH:mm part
                    return appTime && appTime.substring(0, 5) === slot.time.substring(0, 5);
                });

                return {
                    ...slot,
                    available: !isBooked
                };
            });

            setAvailableSlots(updatedSlots);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
            toast.error('Failed to check availability');
            // Fallback: show slots but don't know availability
            setAvailableSlots(generateTimeSlots());
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const response = await doctorService.getAllDoctors();
            setDoctors(response.data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to load doctors');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const userStr = localStorage.getItem('user');
            const userData = JSON.parse(userStr);
            const patientId = userData.id;

            // Ensure time has seconds format (HH:mm:ss)
            const timeWithSeconds = formData.appointmentTime.includes(':') && formData.appointmentTime.split(':').length === 2
                ? `${formData.appointmentTime}:00`
                : formData.appointmentTime;

            // Map frontend field names to backend field names
            const appointmentData = {
                pId: patientId,                          // Backend expects pId
                drId: parseInt(formData.doctorId),       // Backend expects drId
                appointmentDate: formData.appointmentDate,
                appointmentTime: timeWithSeconds,         // Ensure HH:mm:ss format
                descript: formData.notes || formData.appointmentType, // Backend expects descript
                status: 'PENDING'                         // Backend expects uppercase
            };

            console.log('Sending appointment data:', appointmentData); // Debug log
            await appointmentService.createAppointment(appointmentData);
            toast.success('Appointment booked successfully');
            navigate('/patient/appointments');
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 p-6">
            {/* Vibrant Header */}
            <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <PlusCircleIcon className="h-8 w-8 mr-2 text-white" /> Book Appointment
                    </h1>
                    <p className="mt-1 text-teal-100">Schedule a new appointment with a doctor</p>
                </div>
            </div>

            {/* Appointment Form */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-teal-400 border-l-[8px] border-l-teal-500 overflow-hidden">
                <div className="border-b-2 border-teal-200 bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-teal-900 flex items-center">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 mr-3 shadow-md">
                            <CalendarIcon className="w-5 h-5 text-white" />
                        </div>
                        Appointment Details
                    </h2>
                </div>

                {isLoading ? (
                    <div className="p-6 text-center text-gray-500">Loading doctors...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Doctor Selection */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Doctor
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <UserGroupIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="doctorId"
                                        value={formData.doctorId}
                                        onChange={handleChange}
                                        className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 transition-all"
                                        required
                                    >
                                        <option value="">Choose a doctor</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.id || doctor.drId} value={doctor.id || doctor.drId}>
                                                {doctor.name || doctor.drName} - {doctor.specialization || doctor.specialty || 'General Practice'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Appointment Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // Reset time when date changes ensures user picks a new valid slot
                                            setFormData(prev => ({ ...prev, appointmentTime: '' }));
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Appointment Time (Slots) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Time (30 min slots)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <ClockIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleChange}
                                        disabled={!formData.doctorId || !formData.appointmentDate || isLoadingSlots}
                                        className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 transition-all disabled:bg-gray-100 disabled:text-gray-400"
                                        required
                                    >
                                        <option value="">
                                            {!formData.doctorId || !formData.appointmentDate
                                                ? "Select Doctor & Date first"
                                                : isLoadingSlots
                                                    ? "Loading slots..."
                                                    : "Choose a time slot"}
                                        </option>
                                        {availableSlots.map((slot) => (
                                            <option
                                                key={slot.time}
                                                value={slot.time}
                                                disabled={!slot.available}
                                                className={!slot.available ? "text-gray-400 bg-gray-50" : ""}
                                            >
                                                {slot.display} {!slot.available ? '(Booked)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Appointment Type */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Type
                                </label>
                                <select
                                    name="appointmentType"
                                    value={formData.appointmentType}
                                    onChange={handleChange}
                                    className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition-all"
                                    required
                                >
                                    <option value="Consultation">Consultation</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Routine Checkup">Routine Checkup</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="4"
                                        className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 transition-all"
                                        placeholder="Enter any additional information or symptoms"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/patient/appointments')}
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center disabled:opacity-50"
                            >
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                {isSubmitting ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Information Card */}
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-blue-400 border-l-[8px] border-l-blue-500 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Please arrive 10 minutes before your scheduled appointment time</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Bring any relevant medical records or test results</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>You will receive a confirmation notification once the doctor approves your appointment</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>For emergencies, please contact the hospital directly</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default BookAppointment;
