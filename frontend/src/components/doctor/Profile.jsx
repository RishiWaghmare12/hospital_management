import { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { doctorService, authService } from '../../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [profile, setProfile] = useState({
    id: 1,
    name: "",
    specialty: "",
    email: "",
    phone: "",
    license: "",
    age: "",
    gender: "",
    address: "",
    education: [],
    experience: "",
    languages: [],
    profileImage: "",
    certifications: [],
    hospitalAffiliations: [],
    spId: "",
    status: "Active",
    consultationFee: "",
    availableDays: "",
    availableHours: "",
    password: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const [specialtyName, setSpecialtyName] = useState("");

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch all specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await doctorService.getAllSpecializations();
        if (response && response.data) {
          console.log('Specializations:', response.data);
          setSpecializations(response.data);
        }
      } catch (err) {
        console.error('Error fetching specializations:', err);
      }
    };

    fetchSpecializations();
  }, []);

  // Get specialty name based on spId
  const getSpecialtyName = (spId) => {
    if (!spId || !specializations.length) return '';

    const specialty = specializations.find(sp =>
      sp.spId === spId || sp.id === spId || sp.spNo === spId
    );

    return specialty ?
      (specialty.spName || specialty.name || specialty.specialization || '') :
      '';
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      setIsLoading(true);
      try {
        // Get doctor ID from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const doctorId = user?.id;

        if (!doctorId) {
          toast.error('Doctor ID not found. Please log in again.');
          setIsLoading(false);
          return;
        }

        // Fetch doctor profile from backend
        const response = await doctorService.getDoctorById(doctorId);
        console.log('Doctor API response:', response.data);

        // Map backend response to our component's state
        const doctorData = response.data;

        const formattedProfile = {
          id: doctorData.drId || doctorData.id,
          name: doctorData.drName || doctorData.name,
          specialty: doctorData.specialization || doctorData.specialty || '',
          email: doctorData.emailId || doctorData.email || '',
          phone: doctorData.mobileNo || doctorData.phone || '',
          license: doctorData.license || '',
          age: doctorData.age || '',
          gender: doctorData.gender || '',
          address: doctorData.address || '',
          education: doctorData.education ?
            (Array.isArray(doctorData.education) ? doctorData.education : [{ degree: doctorData.education, institution: '', year: '' }]) :
            [],
          experience: doctorData.experience || '',
          languages: doctorData.languages ?
            (Array.isArray(doctorData.languages) ? doctorData.languages : doctorData.languages.split(',')) :
            ['English'],
          profileImage: doctorData.picture || doctorData.profileImage || doctorData.image || "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
          certifications: doctorData.certifications ?
            (Array.isArray(doctorData.certifications) ? doctorData.certifications : [doctorData.certifications]) :
            [],
          hospitalAffiliations: doctorData.hospitalAffiliations ?
            (Array.isArray(doctorData.hospitalAffiliations) ? doctorData.hospitalAffiliations : [doctorData.hospitalAffiliations]) :
            [],
          spId: doctorData.spNo || doctorData.spId || doctorData.specialtyId || '',
          status: doctorData.status || 'Active',
          consultationFee: doctorData.consultationFee || doctorData.fee || '',
          availableDays: doctorData.availableDays || '',
          availableHours: doctorData.availableHours || '',
          password: doctorData.password || ''
        };

        console.log('Formatted profile data:', formattedProfile);
        console.log('Specialty ID extracted:', formattedProfile.spId);

        setProfile(formattedProfile);
        setEditedProfile({ ...formattedProfile });

        // Set specialty name based on spId
        if (formattedProfile.spId) {
          const spName = getSpecialtyName(formattedProfile.spId);
          setSpecialtyName(spName);
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        toast.error('Failed to load doctor profile. Please try again later.');
      }
      setIsLoading(false);
    };

    fetchDoctorProfile();
  }, [specializations]); // Re-run when specializations are loaded

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });

    // Update specialty name when spId changes
    if (name === 'spId') {
      const spName = getSpecialtyName(value);
      setSpecialtyName(spName);
    }
  };

  // Handle specialty selection change
  const handleSpecialtyChange = (e) => {
    const selectedSpId = e.target.value;
    console.log("Selected specialty ID:", selectedSpId);

    const selectedSpecialty = specializations.find(sp =>
      sp.spId === parseInt(selectedSpId) ||
      sp.id === parseInt(selectedSpId) ||
      sp.spNo === parseInt(selectedSpId) ||
      sp.spId === selectedSpId ||
      sp.id === selectedSpId ||
      sp.spNo === selectedSpId
    );

    console.log("Found specialty:", selectedSpecialty);

    setEditedProfile({
      ...editedProfile,
      spId: selectedSpId,
      specialty: selectedSpecialty ? (selectedSpecialty.spName || selectedSpecialty.name || '') : ''
    });

    setSpecialtyName(selectedSpecialty ? (selectedSpecialty.spName || selectedSpecialty.name || '') : '');
  };

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      // Show loading toast
      const loadingToastId = toast.loading('Saving profile changes...');

      // Get doctor ID from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;

      // Prepare updated profile data for backend
      const updatedProfileData = {
        drId: doctorId,
        drName: editedProfile.name,
        specialization: editedProfile.specialty,
        spNo: parseInt(editedProfile.spId) || 0, // Convert to number and ensure it's sent correctly
        spId: parseInt(editedProfile.spId) || 0, // Include both formats to ensure compatibility
        emailId: editedProfile.email,
        mobileNo: editedProfile.phone,
        age: editedProfile.age,
        gender: editedProfile.gender,
        experience: editedProfile.experience,
        password: profile.password || "placeholder" // Add password to prevent backend validation error
      };

      console.log("Sending update data:", updatedProfileData);

      // Send update to backend
      await doctorService.updateDoctor(doctorId, updatedProfileData);

      // Update local state
      const updatedProfile = { ...editedProfile };
      if (previewImage) {
        updatedProfile.profileImage = previewImage;
      }
      setProfile(updatedProfile);
      setIsEditing(false);
      setPreviewImage(null);

      // Update success toast
      toast.update(loadingToastId, {
        render: 'Profile updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
    setPreviewImage(null);
  };

  // Password change handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength for new password
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;

      await authService.changePassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength(0);
      setShowPasswordSection(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Vibrant Header */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-xl shadow-xl text-white p-6 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-1 text-emerald-100">Manage your professional information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl shadow-lg border-2 border-emerald-400 border-l-[8px] border-l-emerald-500 overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 h-32 md:h-48">
          <div className="absolute inset-0 opacity-20 bg-pattern-dots"></div>
        </div>

        <div className="relative px-6 pb-6">
          {isEditing ? (
            // Edit mode - enhanced form with better styling
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile image */}
              <div className="col-span-2 flex justify-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform hover:scale-105 duration-300">
                  <img
                    src={previewImage || editedProfile.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <label className="cursor-pointer bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md">
                      <CameraIcon className="h-6 w-6 text-primary-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Sections with titles */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-primary-600 mb-4 border-b border-primary-100 pb-2">Basic Information</h3>
              </div>

              {/* Basic Info */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="spId" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                {specializations.length > 0 ? (
                  <div className="relative">
                    <select
                      id="spId"
                      name="spId"
                      value={editedProfile.spId}
                      onChange={handleSpecialtyChange}
                      className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 appearance-none transition-all duration-200"
                    >
                      <option value="">Select Specialty</option>
                      {specializations.map((specialty) => (
                        <option key={specialty.spId || specialty.id} value={specialty.spId || specialty.id}>
                          {specialty.spName || specialty.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={editedProfile.specialty}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="Enter your specialty"
                  />
                )}
              </div>

              {/* Section title for Contact Info */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-primary-600 mb-4 border-b border-primary-100 pb-2 mt-2">Contact Information</h3>
              </div>

              {/* Contact Info */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedProfile.email}
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editedProfile.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>

              {/* Section title for Personal Details */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-primary-600 mb-4 border-b border-primary-100 pb-2 mt-2">Personal Details</h3>
              </div>

              {/* Personal Details */}
              <div className="group">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <div className="relative">
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={editedProfile.age}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={editedProfile.gender}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 appearance-none transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <div className="relative">
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={editedProfile.experience}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="Years of experience"
                  />
                </div>
              </div>
            </div>
          ) : (
            // View mode - remains the same with all sections
            <div>
              <div className="flex flex-col md:flex-row">
                {/* Profile Image */}
                <div className="relative -mt-16 md:-mt-24 mb-4 md:mb-0 flex justify-center md:block">
                  <div className="relative h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="md:ml-8 md:mt-4">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-lg text-primary-600 font-medium">
                    {specialtyName || profile.specialty || 'No specialty specified'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.languages.map((language, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {language}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {profile.experience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border-2 border-blue-300 border-l-[6px] border-l-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {profile.email && (
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <p className="flex items-center text-gray-700">
                          <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-900">{profile.email}</span>
                        </p>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                        <p className="flex items-center text-gray-700">
                          <svg className="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-900">{profile.phone}</span>
                        </p>
                      </div>
                    )}
                    {profile.address && (
                      <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                        <p className="flex items-center text-gray-700">
                          <svg className="h-5 w-5 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span className="text-gray-900">{profile.address}</span>
                        </p>
                      </div>
                    )}
                    {profile.license && (
                      <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                        <p className="flex items-center text-gray-700">
                          <svg className="h-5 w-5 text-amber-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <span className="font-semibold text-amber-700 mr-2">License:</span>
                          <span className="text-gray-900">{profile.license}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing || (profile.hospitalAffiliations && profile.hospitalAffiliations.length > 0) ? (
                  <div className="bg-white rounded-xl p-6 border-2 border-purple-300 border-l-[6px] border-l-purple-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                      <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Hospital Affiliations
                    </h3>
                    <ul className="space-y-2">
                      {profile.hospitalAffiliations && profile.hospitalAffiliations.map((hospital, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg className="h-5 w-5 text-purple-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {hospital}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <div className="mt-8 bg-white rounded-xl p-6 border-2 border-emerald-300 border-l-[6px] border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Education & Training
                  </h3>
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-primary-200 pl-4">
                        <p className="font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-gray-600">{edu.institution ? `${edu.institution}, ` : ''}{edu.year || ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="mt-8 bg-white rounded-xl p-6 border-2 border-amber-300 border-l-[6px] border-l-amber-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Certifications
                  </h3>
                  <ul className="space-y-2">
                    {profile.certifications.map((certification, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 text-primary-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {certification}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Personal Details */}
              <div className="mt-8 bg-white rounded-xl p-6 border-2 border-teal-300 border-l-[6px] border-l-teal-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center">
                  <svg className="h-6 w-6 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.age && (
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 flex items-start">
                        <span className="font-semibold text-blue-700 mr-2">Age:</span>
                        <span className="text-gray-900">{profile.age}</span>
                      </p>
                    </div>
                  )}
                  {profile.gender && (
                    <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                      <p className="text-gray-700 flex items-start">
                        <span className="font-semibold text-purple-700 mr-2">Gender:</span>
                        <span className="text-gray-900">{profile.gender}</span>
                      </p>
                    </div>
                  )}
                  {profile.experience && (
                    <div className="bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-500">
                      <p className="text-gray-700 flex items-start">
                        <span className="font-semibold text-emerald-700 mr-2">Experience:</span>
                        <span className="text-gray-900">{profile.experience}</span>
                      </p>
                    </div>
                  )}
                  {profile.consultationFee && (
                    <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                      <p className="text-gray-700 flex items-start">
                        <span className="font-semibold text-amber-700 mr-2">Consultation Fee:</span>
                        <span className="text-gray-900">{profile.consultationFee}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              {profile.availableDays || profile.availableHours ? (
                <div className="mt-8 bg-white rounded-xl p-6 border-2 border-indigo-300 border-l-[6px] border-l-indigo-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Availability
                  </h3>
                  <div className="space-y-2">
                    {profile.availableDays && <p className="text-gray-700"><span className="font-semibold text-indigo-700 mr-2">Days:</span> {profile.availableDays}</p>}
                    {profile.availableHours && <p className="text-gray-700"><span className="font-semibold text-indigo-700 mr-2">Hours:</span> {profile.availableHours}</p>}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-2xl shadow-lg border-2 border-blue-400 border-l-[8px] border-l-blue-500 overflow-hidden">
        <div
          className="border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-blue-200 transition-colors"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
        >
          <h2 className="text-lg font-semibold text-blue-900 flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 mr-3 shadow-md">
              <LockClosedIcon className="w-5 h-5 text-white" />
            </div>
            Change Password
          </h2>
          {showPasswordSection ? (
            <ChevronUpIcon className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-blue-600" />
          )}
        </div>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="p-6">
            <div className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-3 transition-all"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPasswords.current ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-3 transition-all"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPasswords.new ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-semibold ${passwordStrength <= 1 ? 'text-red-600' :
                        passwordStrength === 2 ? 'text-yellow-600' :
                          passwordStrength === 3 ? 'text-blue-600' :
                            'text-green-600'
                        }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-3 transition-all"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center disabled:opacity-50"
              >
                <CheckIcon className="w-5 h-5 mr-2" />
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile; 