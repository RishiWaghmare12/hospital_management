
import React, { useState, useEffect } from 'react';
import {
    ClipboardDocumentListIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    UserIcon,
    BeakerIcon
} from '@heroicons/react/24/outline';
import { prescriptionService, doctorService } from '../../services/api';
import { toast } from 'react-toastify';

const Prescriptions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
        fetchPrescriptions();
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

    const fetchPrescriptions = async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            const userData = JSON.parse(userStr);
            const patientId = userData.id;
            const response = await prescriptionService.getPrescriptionsByPatient(patientId);
            setPrescriptions(response.data || []);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            toast.error('Failed to load prescriptions');
            setPrescriptions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get doctor name from prescription
    const getDoctorName = (prescription) => {
        if (!prescription) return 'Unknown';

        console.log('🔍 Getting doctor name for prescription:', prescription);
        console.log('🔍 All prescription keys:', Object.keys(prescription));

        // Check if doctor name is already in the prescription
        if (prescription.doctorName) {
            console.log('✅ Found doctorName:', prescription.doctorName);
            return prescription.doctorName;
        }
        if (prescription.doctor?.name) {
            console.log('✅ Found doctor.name:', prescription.doctor.name);
            return prescription.doctor.name;
        }
        if (prescription.drName) {
            console.log('✅ Found drName:', prescription.drName);
            return prescription.drName;
        }

        // Get doctor ID from prescription - check ALL possible variations
        const doctorId = prescription.doctorId ||
            prescription.dId ||
            prescription.drId ||
            prescription.D_ID ||
            prescription.DR_ID ||
            prescription.doctor_id ||
            prescription.DOCTOR_ID ||
            prescription.doctor?.id;

        console.log('🔍 Doctor ID from prescription:', doctorId);
        console.log('🔍 Prescription doctorId field:', prescription.doctorId);
        console.log('🔍 Prescription dId field:', prescription.dId);
        console.log('🔍 Prescription drId field:', prescription.drId);
        console.log('🔍 Prescription D_ID field:', prescription.D_ID);
        console.log('🔍 Prescription DR_ID field:', prescription.DR_ID);
        console.log('🔍 Available doctors:', doctors);

        if (!doctorId) {
            console.log('❌ No doctor ID found in prescription');
            return 'Unknown';
        }

        // Look up doctor in doctors array
        const doctor = doctors.find(d => {
            const id = d.id || d.dId || d.drId || d.DR_ID || d.D_ID || d.doctor_id;
            console.log(`🔍 Comparing doctor ID ${id} with prescription doctor ID ${doctorId}`);
            return id && String(id) === String(doctorId);
        });

        console.log('🔍 Found doctor:', doctor);

        if (doctor) {
            // Return doctor name from various possible fields
            if (doctor.name) return doctor.name;
            if (doctor.drName) return doctor.drName;
            if (doctor.firstName) {
                return `${doctor.firstName} ${doctor.lastName || ''}`.trim();
            }
        }

        console.log('❌ No doctor found, returning Unknown');
        return 'Unknown';
    };

    const filteredPrescriptions = prescriptions.filter(prescription => {
        const doctorName = getDoctorName(prescription);
        const medications = (prescription.medications || []).map(med =>
            typeof med === 'string' ? med : med.name || ''
        ).join(' ');

        const searchLower = searchQuery.toLowerCase();
        return doctorName.toLowerCase().includes(searchLower) ||
            medications.toLowerCase().includes(searchLower);
    });

    return (
        <div className="space-y-8 p-6">
            {/* Vibrant Header */}
            <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 rounded-xl shadow-xl mb-8 text-white p-6 flex justify-between items-center hover:shadow-2xl transition-shadow duration-300">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <ClipboardDocumentListIcon className="h-8 w-8 mr-2 text-white" /> My Prescriptions
                    </h1>
                    <p className="mt-1 text-teal-100">View your medical prescriptions and medications</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg p-6 border-2 border-teal-400 border-l-[8px] border-l-teal-500 mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by doctor name or medication"
                        className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-teal-400 p-6 text-center text-gray-500">
                        Loading prescriptions...
                    </div>
                ) : filteredPrescriptions.length === 0 ? (
                    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-teal-400 p-6 text-center text-gray-500">
                        No prescriptions found
                    </div>
                ) : (
                    filteredPrescriptions.map((prescription) => (
                        <div
                            key={prescription.id}
                            className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-teal-400 border-l-[8px] border-l-teal-500 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Prescription Header */}
                            <div className="border-b-2 border-teal-200 bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 flex items-center justify-center shadow-md">
                                            <UserIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-teal-900">
                                                Dr. {getDoctorName(prescription)}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {prescription.doctor?.specialty || 'General Practice'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                            <span>{prescription.appointmentDate || prescription.issuedDate || prescription.date || prescription.prescriptionDate || prescription.createdAt?.split('T')[0] || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prescription Body */}
                            <div className="p-6">
                                {/* Medications */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <BeakerIcon className="h-5 w-5 mr-2 text-teal-600" />
                                        Medications
                                    </h4>
                                    <div className="space-y-2">
                                        {(prescription.medications || []).map((med, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white rounded-lg p-3 border-2 border-teal-200 hover:border-teal-400 transition-colors"
                                            >
                                                {typeof med === 'string' ? (
                                                    <p className="text-sm text-gray-900 font-medium">{med}</p>
                                                ) : (
                                                    <div>
                                                        <p className="text-sm text-gray-900 font-medium">{med.name || 'Unknown Medication'}</p>
                                                        {med.dosage && (
                                                            <p className="text-xs text-gray-600 mt-1">Dosage: {med.dosage}</p>
                                                        )}
                                                        {med.frequency && (
                                                            <p className="text-xs text-gray-600">Frequency: {med.frequency}</p>
                                                        )}
                                                        {med.duration && (
                                                            <p className="text-xs text-gray-600">Duration: {med.duration}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Instructions */}
                                {prescription.instructions && (
                                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Instructions</h4>
                                        <p className="text-sm text-gray-700 italic">"{prescription.instructions}"</p>
                                    </div>
                                )}

                                {/* Diagnosis */}
                                {prescription.diagnosis && (
                                    <div className="mt-4 bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                                        <h4 className="text-sm font-semibold text-amber-900 mb-2">Diagnosis</h4>
                                        <p className="text-sm text-gray-700">{prescription.diagnosis}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Prescriptions;
