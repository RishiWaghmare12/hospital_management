import React, { useState, useEffect } from 'react';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  BeakerIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { prescriptionService, patientService } from '../../services/api';
import { toast } from 'react-toastify';

const Prescriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientMap, setPatientMap] = useState({});
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [formData, setFormData] = useState({
    medicine: '',
    advice: '',
    remark: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (editingPrescription) {
      setFormData({
        medicine: editingPrescription.medicine || '',
        advice: editingPrescription.advice || '',
        remark: editingPrescription.remark || ''
      });
    } else {
      setFormData({
        medicine: '',
        advice: '',
        remark: ''
      });
    }
  }, [editingPrescription]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (prescription) => {
    setEditingPrescription(prescription);
  };

  const handleEditClose = () => {
    setEditingPrescription(null);
  };

  const handleSaveEdit = async () => {
    if (!formData.medicine || !formData.advice) {
      toast.error('Medicine and advice are required');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        ...editingPrescription,
        medicine: formData.medicine.trim(),
        advice: formData.advice.trim(),
        remark: formData.remark ? formData.remark.trim() : ''
      };

      await prescriptionService.updatePrescription(editingPrescription.prId, updateData);
      toast.success('Prescription updated successfully');
      setEditingPrescription(null);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error updating prescription:', error);
      toast.error('Failed to update prescription');
    } finally {
      setSaving(false);
    }
  };

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await prescriptionService.getAllPrescriptions();
      const prescriptionData = response.data || [];

      const patientIds = [...new Set(prescriptionData.map(p => p.pId))];
      const patientInfo = {};

      for (const patientId of patientIds) {
        try {
          const patientResponse = await patientService.getPatientById(patientId);
          if (patientResponse && patientResponse.data) {
            patientInfo[patientId] = patientResponse.data;
          }
        } catch (error) {
          console.error(`Error fetching patient ${patientId}:`, error);
        }
      }

      setPatientMap(patientInfo);
      setPrescriptions(prescriptionData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionService.deletePrescription(id);
        toast.success('Prescription deleted successfully');
        fetchPrescriptions();
      } catch (error) {
        console.error('Error deleting prescription:', error);
        toast.error('Failed to delete prescription');
      }
    }
  };

  const handleSendEmail = async (prescriptionId) => {
    try {
      toast.info('Sending prescription email...');
      await prescriptionService.sendPrescriptionEmail(prescriptionId);
      toast.success('Prescription email sent successfully!');
    } catch (error) {
      console.error('Error sending prescription email:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send prescription email';
      toast.error(errorMessage);
    }
  };

  const handlePrint = (prescription) => {
    const patientName = getPatientName(prescription.pId);
    const printContent = `
      <html>
        <head>
          <title>Prescription #${prescription.prId}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { text-align: center; color: #10b981; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px; }
            .patient-info { margin-bottom: 15px; background: #f0fdf4; padding: 15px; border-radius: 8px; }
            .section { margin-bottom: 15px; padding: 10px; border-left: 4px solid #10b981; }
            .section-title { font-weight: bold; margin-bottom: 5px; color: #059669; }
            .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescription</h1>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="patient-info">
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Patient ID:</strong> ${prescription.pId}</p>
            <p><strong>Prescription ID:</strong> ${prescription.prId}</p>
          </div>
          <div class="section">
            <div class="section-title">Medicine:</div>
            <p>${prescription.medicine}</p>
          </div>
          <div class="section">
            <div class="section-title">Advice:</div>
            <p>${prescription.advice}</p>
          </div>
          ${prescription.remark ? `
          <div class="section">
            <div class="section-title">Remarks:</div>
            <p>${prescription.remark}</p>
          </div>` : ''}
          <div class="footer">
            <p>Hospital Management System</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const getPatientName = (patientId) => {
    const patient = patientMap[patientId];
    if (patient) {
      return patient.name || patient.firstName + ' ' + patient.lastName || 'Patient ' + patientId;
    }
    return 'Patient ' + patientId;
  };

  const getPatientAge = (patientId) => {
    const patient = patientMap[patientId];
    return patient?.age || 'N/A';
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const patientName = getPatientName(prescription.pId).toLowerCase();
    const query = searchQuery.toLowerCase();

    const statusMatch = selectedStatus === 'all' ||
      (prescription.status && prescription.status.toLowerCase() === selectedStatus.toLowerCase());

    return statusMatch && (
      patientName.includes(query) ||
      (prescription.medicine && prescription.medicine.toLowerCase().includes(query)) ||
      (prescription.advice && prescription.advice.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-8 p-6">
      {/* Vibrant Header */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-xl shadow-xl mb-8 text-white p-6 hover:shadow-2xl transition-shadow duration-300">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8 mr-2 text-white" /> Prescriptions
          </h1>
          <p className="mt-1 text-emerald-100">Manage patient prescriptions and medications</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg p-6 border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => fetchPrescriptions()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg p-8 text-center border-2 border-emerald-400">
          <div className="animate-spin h-10 w-10 mx-auto mb-4 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Loading prescriptions...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && prescriptions.length === 0 && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg p-8 text-center border-2 border-emerald-400">
          <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions found</h3>
          <p className="text-gray-600">Create prescriptions from the appointment page</p>
        </div>
      )}

      {/* Prescriptions List */}
      {!loading && prescriptions.length > 0 && (
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.prId} className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Prescription Header */}
              <div className="border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-md">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900">
                        {getPatientName(prescription.pId)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Age: {getPatientAge(prescription.pId)} | Prescription ID: {prescription.prId}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {prescription.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Prescription Body */}
              <div className="p-6">
                {/* Medication Details */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2 flex items-center">
                    <BeakerIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    Medication
                  </h4>
                  <div className="bg-white p-4 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-colors">
                    <p className="font-medium text-gray-900">{prescription.medicine}</p>
                  </div>
                </div>

                {/* Advice */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">Advice</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-gray-700">{prescription.advice}</p>
                  </div>
                </div>

                {/* Remarks */}
                {prescription.remark && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-2">Remarks</h4>
                    <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                      <p className="text-sm text-gray-600 italic">"{prescription.remark}"</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleSendEmail(prescription.prId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    Send Email
                  </button>
                  <button
                    onClick={() => handleEditClick(prescription)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prescription.prId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => handlePrint(prescription)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Prescription Modal */}
      {editingPrescription && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Prescription</h2>
              <button onClick={handleEditClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Patient Info */}
            <div className="bg-emerald-50 p-4 flex items-center border-b-2 border-emerald-200">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center mr-4 shadow-md">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">{getPatientName(editingPrescription.pId)}</h3>
                <p className="text-sm text-gray-600">
                  ID: {editingPrescription.pId} | Prescription ID: {editingPrescription.prId}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6">
              {/* Medicine */}
              <div className="mb-6">
                <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="medicine"
                  name="medicine"
                  value={formData.medicine}
                  onChange={handleInputChange}
                  placeholder="Enter medicine name and dosage"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              {/* Advice */}
              <div className="mb-6">
                <label htmlFor="advice" className="block text-sm font-medium text-gray-700 mb-2">
                  Advice <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="advice"
                  name="advice"
                  value={formData.advice}
                  onChange={handleInputChange}
                  placeholder="Enter usage instructions"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                ></textarea>
              </div>

              {/* Remark */}
              <div className="mb-6">
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  id="remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  placeholder="Enter any additional remarks or notes"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleEditClose}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;