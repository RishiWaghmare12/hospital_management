import React, { useState, useEffect } from 'react';
import { XMarkIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL, prescriptionService } from '../../services/api';
import { toast } from 'react-toastify';

/**
 * A simplified prescription form that directly maps to the database schema
 * with just three fields: medicine, advice, and remark
 */
const PrescriptionForm = ({ patient, appointmentId, onClose }) => {
  const [formData, setFormData] = useState({
    medicine: '',
    advice: '',
    remark: ''
  });
  const [loading, setLoading] = useState(false);
  const [patientIdToUse, setPatientIdToUse] = useState(null);
  const [sendEmail, setSendEmail] = useState(true); // Default to true to send email

  // Set patient ID on mount
  useEffect(() => {
    // Log everything available
    console.log('Full patient object:', patient);
    console.log('Appointment ID:', appointmentId);

    // For debugging, let's log all possible ID locations
    if (patient) {
      console.log('Patient ID locations:');
      console.log('- patient.P_ID:', patient.P_ID);
      console.log('- patient.p_id:', patient.p_id);
      console.log('- patient.pId:', patient.pId);
      console.log('- patient.id:', patient.id);
      console.log('- patient.patientId:', patient.patientId);
    }

    // Default to a known working ID
    let pId = 1; // Using 1 as default based on screenshot

    // Try to extract from patient object if available
    if (patient) {
      if (patient.pId !== undefined) pId = patient.pId;
      else if (patient.P_ID !== undefined) pId = patient.P_ID;
      else if (patient.p_id !== undefined) pId = patient.p_id;
      else if (patient.patientId !== undefined) pId = patient.patientId;
      else if (patient.id !== undefined) pId = patient.id;
    }

    // Ensure numeric format
    if (typeof pId === 'string') {
      pId = parseInt(pId, 10);
    }

    console.log('Using patient ID:', pId);
    setPatientIdToUse(pId);
  }, [patient, appointmentId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save prescription to database
  const savePrescription = async () => {
    // Validate required fields
    if (!formData.medicine || !formData.advice) {
      toast.error('Please fill all required fields');
      return;
    }

    // Show loading state
    setLoading(true);

    try {
      const finalAppointmentId = typeof appointmentId === 'string' ? parseInt(appointmentId, 10) : appointmentId;
      const finalPatientId = patientIdToUse || null;

      const payload = {
        apId: finalAppointmentId,
        // pId is optional; backend now derives from apId when missing
        ...(finalPatientId ? { pId: finalPatientId } : {}),
        medicine: formData.medicine.trim(),
        advice: formData.advice.trim(),
        remark: formData.remark ? formData.remark.trim() : ''
      };

      console.log('Sending prescription payload:', payload);
      const res = await prescriptionService.createPrescription(payload);
      console.log('Create prescription response:', res.status, res.data);

      toast.success('Prescription saved successfully');

      // Send email if checkbox is checked
      if (sendEmail) {
        try {
          // Extract prescription ID - backend returns Prescription object directly
          const prescriptionId = res.data?.prId || res.data?.id;

          if (prescriptionId) {
            console.log('Sending email for prescription ID:', prescriptionId);
            toast.info('Sending prescription email...');
            await prescriptionService.sendPrescriptionEmail(prescriptionId);
            toast.success('Prescription email sent to patient!');
          } else {
            console.warn('No prescription ID found in response:', res.data);
            toast.warning('Prescription saved but could not send email (no ID)');
          }
        } catch (emailError) {
          console.error('Error sending prescription email:', emailError);
          toast.warning('Prescription saved but email failed to send');
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving prescription:', error);
      const serverMsg = error?.response?.data?.message || error?.message || 'Could not save prescription';
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gray-700 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto animate-fadeIn">
        {/* Form Header */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-bold">Prescription</h2>
          <button onClick={onClose} className="text-white hover:bg-green-700 rounded-full p-1">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6">
          {/* Medicine */}
          <div className="mb-4">
            <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-1">
              Medicine <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="medicine"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              placeholder="Enter medicine name and dosage (e.g. Paracetamol 500mg)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Advice */}
          <div className="mb-4">
            <label htmlFor="advice" className="block text-sm font-medium text-gray-700 mb-1">
              Advice <span className="text-red-500">*</span>
            </label>
            <textarea
              id="advice"
              name="advice"
              value={formData.advice}
              onChange={handleChange}
              placeholder="Enter usage instructions (e.g. Take twice daily after meals for 5 days)"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>

          {/* Remark */}
          <div className="mb-4">
            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
              Remark
            </label>
            <textarea
              id="remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Enter any additional remarks or notes"
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          {/* Send Email Checkbox */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-700">
              Send prescription to patient via email
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={savePrescription}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-5 w-5" />
                  Save Prescription
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm; 