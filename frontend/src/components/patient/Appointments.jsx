
import React, { useState, useEffect } from 'react';
import {
    CalendarIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ClockIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { appointmentService, doctorService, reviewService } from '../../services/api';
import { toast } from 'react-toastify';

const Appointments = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: '',
        doctorId: null,
        doctorName: ''
    });

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await doctorService.getAllDoctors();
            setDoctors(response.data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        }
    };

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            const userData = JSON.parse(userStr);
            const patientId = userData.id;
            const response = await appointmentService.getAppointmentsByPatient(patientId);
            setAppointments(response.data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Failed to load appointments');
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

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
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'cancelled':
            case 'canceled':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'confirmed':
            case 'scheduled':
                return <CheckCircleIcon className="h-4 w-4" />;
            case 'pending':
                return <ClockIcon className="h-4 w-4" />;
            case 'cancelled':
            case 'canceled':
                return <XCircleIcon className="h-4 w-4" />;
            case 'completed':
                return <CheckCircleIcon className="h-4 w-4" />;
            default:
                return <ExclamationTriangleIcon className="h-4 w-4" />;
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const doctorName = getDoctorName(appointment);
        const matchesSearch = doctorName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || (appointment.status || '').toLowerCase() === selectedFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const openReviewModal = (appointment) => {
        const doctorName = getDoctorName(appointment);
        const doctorId = appointment.doctorId || appointment.dId || appointment.drId || appointment.doctor?.id || appointment.doctor?.drId;

        console.log("Opening review modal for appointment:", appointment);
        console.log("Extracted Initial Doctor ID:", doctorId);

        if (!doctorId) {
            toast.error("Cannot review: Doctor information missing");
            return;
        }

        // Find doctor to get the correct ID if possible
        const doctor = doctors.find(d => {
            const id = d.id || d.dId || d.drId || d.DR_ID;
            return id && String(id) === String(doctorId);
        });

        // Backend Doctor entity uses 'drId', also checking other variants
        const finalDoctorId = doctor ? (doctor.drId || doctor.id || doctor.dId || doctor.DR_ID) : doctorId;
        console.log("Final Doctor ID to use:", finalDoctorId);

        setReviewData({
            rating: 5,
            comment: '',
            doctorId: finalDoctorId,
            doctorName: doctorName
        });
        setShowReviewModal(true);
    };

    const submitReview = async () => {
        try {
            const userStr = localStorage.getItem('user');
            const userData = JSON.parse(userStr);

            if (!userData || !userData.id) {
                toast.error("User session invalid. Please login again.");
                return;
            }

            const pId = parseInt(userData.id, 10);
            const dId = parseInt(reviewData.doctorId, 10);
            const ratingVal = parseInt(reviewData.rating, 10);

            if (isNaN(pId)) {
                console.error("Invalid Patient ID:", userData.id);
                toast.error("Error: Invalid Patient ID");
                return;
            }
            if (isNaN(dId)) {
                console.error("Invalid Doctor ID:", reviewData.doctorId);
                toast.error("Error: Invalid Doctor ID. Cannot submit review.");
                return;
            }

            const payload = {
                patientId: pId,
                doctorId: dId,
                rating: ratingVal,
                comment: reviewData.comment
            };
            console.log("Sending review payload:", payload);

            await reviewService.addReview(payload);

            toast.success('Review submitted successfully!');
            setShowReviewModal(false);
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    return (
        <div className="space-y-8 p-6">
            {/* Vibrant Header */}
            <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <CalendarIcon className="h-8 w-8 mr-2 text-white" /> My Appointments
                    </h1>
                    <p className="mt-1 text-teal-100">View and manage your appointments</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg p-6 border-2 border-teal-400 border-l-[8px] border-l-teal-500 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by doctor name"
                            className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FunnelIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                            className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 transition-all"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-teal-400 border-l-[8px] border-l-teal-500 overflow-hidden">
                <div className="border-b-2 border-teal-200 bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-teal-900 flex items-center">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 mr-3 shadow-md">
                            <CalendarIcon className="w-5 h-5 text-white" />
                        </div>
                        Appointments List
                    </h2>
                </div>
                <div className="divide-y divide-teal-200">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading appointments...</div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No appointments found
                        </div>
                    ) : (
                        filteredAppointments.map((appointment) => (
                            <div key={appointment.id || appointment.apId} className="p-6 hover:bg-teal-100 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-teal-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">
                                                {getDoctorName(appointment)}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {appointment.specialty || appointment.doctor?.specialty || 'General Practice'}
                                            </p>
                                            <div className="mt-2 flex items-center text-sm text-gray-600">
                                                <CalendarIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                                                <span>{appointment.date || appointment.appointmentDate}</span>
                                                <ClockIcon className="flex-shrink-0 ml-4 mr-2 h-4 w-4 text-gray-400" />
                                                <span>{appointment.time || appointment.appointmentTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                                        {getStatusIcon(appointment.status)}
                                        {appointment.status || 'Pending'}
                                    </span>
                                </div>

                                {appointment.status && appointment.status.toLowerCase() === 'completed' && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => openReviewModal(appointment)}
                                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium rounded-lg flex items-center shadow-md transition-colors"
                                        >
                                            <StarIconSolid className="h-4 w-4 mr-1" />
                                            Write Review
                                        </button>
                                    </div>
                                )}

                                {appointment.notes && (
                                    <div className="mt-4 p-3 bg-white rounded-lg border border-teal-200">
                                        <p className="text-sm text-gray-600 italic">"{appointment.notes}"</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div >

            {/* Review Modal */}
            {
                showReviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Review Dr. {reviewData.doctorName}</h3>
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <XCircleIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                className="focus:outline-none"
                                            >
                                                {star <= reviewData.rating ? (
                                                    <StarIconSolid className="h-8 w-8 text-yellow-400" />
                                                ) : (
                                                    <StarIcon className="h-8 w-8 text-gray-300" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                    <textarea
                                        rows={4}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2"
                                        placeholder="Share your experience..."
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowReviewModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitReview}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Appointments;
