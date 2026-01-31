import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BarsArrowDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { reviewService, doctorService } from '../services/api';
import { toast } from 'react-toastify';

// Default gradients for doctors (cycle through these)
const defaultGradients = [
  { gradient: 'from-red-500 to-orange-500', bgGradient: 'from-red-100/60 to-orange-50/50', borderColor: 'border-red-500' },
  { gradient: 'from-purple-500 to-pink-500', bgGradient: 'from-purple-100/60 to-pink-50/50', borderColor: 'border-purple-500' },
  { gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-100/60 to-cyan-50/50', borderColor: 'border-blue-500' },
  { gradient: 'from-green-500 to-emerald-500', bgGradient: 'from-green-100/60 to-emerald-50/50', borderColor: 'border-green-500' },
  { gradient: 'from-orange-500 to-amber-500', bgGradient: 'from-orange-100/60 to-amber-50/50', borderColor: 'border-orange-500' },
  { gradient: 'from-teal-500 to-cyan-500', bgGradient: 'from-teal-100/60 to-cyan-50/50', borderColor: 'border-teal-500' },
];

// Default doctor images
const defaultImages = [
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
];

// Helper function to map backend doctor to frontend format
const mapDoctorToDisplay = (doctor, index) => {
  const styleIndex = index % defaultGradients.length;
  const imageIndex = index % defaultImages.length;

  return {
    id: doctor.drId,
    name: doctor.drName || 'Dr. Unknown',
    speciality: 'General Practice', // Default, will need specialization lookup
    image: doctor.picture || defaultImages[imageIndex],
    education: 'Medical Professional',
    experience: doctor.experience ? `${doctor.experience} years` : 'Experienced',
    bio: `Dedicated healthcare professional specializing in patient care.`,
    languages: ['English'],
    availability: 'Mon-Fri, 9am-5pm',
    consultationFee: 'Rs.200',
    isAvailable: true,
    ...defaultGradients[styleIndex]
  };
};

const Doctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  // State for doctors and ratings
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorRatings, setDoctorRatings] = useState({});
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [allSpecialities, setAllSpecialities] = useState(['All']);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);
        const response = await doctorService.getAllDoctors();
        const mappedDoctors = response.data.map((doctor, index) => mapDoctorToDisplay(doctor, index));
        setDoctors(mappedDoctors);

        // Extract unique specialities
        const specialities = ['All', ...new Set(mappedDoctors.map(d => d.speciality))];
        setAllSpecialities(specialities);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch ratings when doctors are loaded
  useEffect(() => {
    if (doctors.length === 0) return;

    const fetchRatings = async () => {
      try {
        setRatingsLoading(true);
        const ratingsMap = {};
        for (const doctor of doctors) {
          try {
            const response = await reviewService.getDoctorRatingSummary(doctor.id);
            ratingsMap[doctor.id] = response.data;
          } catch (error) {
            console.error(`Error fetching rating for doctor ${doctor.id}`, error);
            ratingsMap[doctor.id] = { averageRating: 0, totalReviews: 0 };
          }
        }
        setDoctorRatings(ratingsMap);
      } catch (error) {
        console.error('Error in fetchRatings:', error);
        setDoctorRatings({});
      } finally {
        setRatingsLoading(false);
      }
    };
    fetchRatings();
  }, [doctors]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // No actual filtering happens here - just update the UI state
  };

  const handleSpecialityChange = (e) => {
    setSelectedSpeciality(e.target.value);
    // No actual filtering happens here - just update the UI state
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // No actual sorting happens here - just update the UI state
  };

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeciality = selectedSpeciality === 'All' || doctor.speciality === selectedSpeciality;
    return matchesSearch && matchesSpeciality;
  });

  return (
    <div className="bg-white w-full min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 pb-32 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
          <h1 className="text-5xl font-bold mb-6">Our Expert Doctors</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Meet our team of experienced healthcare professionals dedicated to providing exceptional care.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                value={selectedSpeciality}
                onChange={handleSpecialityChange}
              >
                <option value="All">All Specialities</option>
                {allSpecialities.map((speciality) => (
                  speciality !== 'All' && <option key={speciality} value={speciality}>{speciality}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <BarsArrowDownIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="name">Sort by Name</option>
                <option value="experience">Sort by Experience</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className={`flex-1 p-3 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} hover:bg-primary/90 transition-colors`}
                onClick={() => setViewMode('grid')}
              >
                <Squares2X2Icon className="h-5 w-5 mx-auto" />
              </button>
              <button
                className={`flex-1 p-3 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} hover:bg-primary/90 transition-colors`}
                onClick={() => setViewMode('list')}
              >
                <ListBulletIcon className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {doctorsLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No doctors found.</p>
          </div>
        ) : (
          <>
            {/* Doctors Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`relative overflow-hidden bg-gradient-to-br ${doctor.bgGradient} rounded-2xl border-2 ${doctor.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 group ${viewMode === 'list' ? 'flex hover:-translate-y-1' : 'h-full hover:-translate-y-3'
                    }`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${doctor.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`}></div>

                  <div className={viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}>
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-64 sm:h-72'
                        }`}
                    />
                  </div>
                  <div className={`p-8 ${viewMode === 'list' ? 'flex-1' : ''} flex flex-col h-full relative z-10`}>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                      <div className={`inline-block mt-2 px-3 py-1 rounded-lg bg-gradient-to-r ${doctor.gradient} text-white font-semibold text-sm shadow-md`}>
                        {doctor.speciality}
                      </div>

                      {/* Rating Display */}
                      <div className="flex items-center mt-3 gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid
                              key={star}
                              className={`h-5 w-5 ${star <= (doctorRatings[doctor.id]?.averageRating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {doctorRatings[doctor.id]?.averageRating
                            ? Number(doctorRatings[doctor.id].averageRating).toFixed(1)
                            : 'N/A'}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({doctorRatings[doctor.id]?.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6 flex-grow">
                      <p className="text-gray-700 font-medium">{doctor.education}</p>
                      <p className="text-gray-700"><span className="font-semibold">Experience:</span> {doctor.experience}</p>
                      <p className="text-gray-700"><span className="font-semibold">Languages:</span> {doctor.languages.join(', ')}</p>
                      <p className="text-gray-700"><span className="font-semibold">Availability:</span> {doctor.availability}</p>
                      <p className="text-gray-900 font-bold text-lg mt-3">Fee: {doctor.consultationFee}</p>
                    </div>
                    <button
                      onClick={() => handleBookAppointment(doctor)}
                      className={`w-full bg-gradient-to-r ${doctor.gradient} text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold mt-auto shadow-md`}
                    >
                      Book Appointment
                    </button>
                  </div>

                  {/* Decorative element */}
                  <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${doctor.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500">
          <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to book your appointment?</span>
                <span className="block text-xl mt-3 text-white/90">Our team is ready to provide the care you deserve.</span>
              </h2>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-full shadow">
                <a
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-white text-lg font-semibold rounded-full text-primary hover:bg-gray-100 transition-all duration-300"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Details Modal */}
        {showModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedDoctor.name}</h2>
                    <p className="text-primary text-xl font-medium">{selectedDoctor.speciality}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-5 w-5 mr-3 text-primary" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <EnvelopeIcon className="h-5 w-5 mr-3 text-primary" />
                        <span>{selectedDoctor.name.toLowerCase().replace(/\s+/g, '.')}@hospital.com</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-3 text-primary" />
                        <span>123 Medical Center Drive</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-5 w-5 mr-3 text-primary" />
                        <span>{selectedDoctor.availability}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-600 mb-6">{selectedDoctor.bio}</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Education</h3>
                      <p className="text-gray-600 mb-6">{selectedDoctor.education}</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Experience</h3>
                      <p className="text-gray-600 mb-6">{selectedDoctor.experience} of experience</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Languages</h3>
                      <p className="text-gray-600 mb-6">{selectedDoctor.languages.join(', ')}</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Consultation Fee</h3>
                      <p className="text-gray-600 mb-6">{selectedDoctor.consultationFee}</p>
                    </div>
                    <div className="mt-8">
                      <button
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors; 