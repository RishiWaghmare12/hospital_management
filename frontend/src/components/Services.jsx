import {
  HeartIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    name: 'Emergency Care',
    description: '24/7 emergency medical care for critical conditions with immediate attention from our specialists.',
    icon: HeartIcon,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-200/60 via-orange-100/50 to-red-100/40',
    borderColor: 'border-red-600',
    shadowColor: 'shadow-red-400/60'
  },
  {
    name: 'Laboratory Services',
    description: 'Comprehensive lab testing with state-of-the-art equipment for accurate and timely results.',
    icon: BeakerIcon,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-200/60 via-pink-100/50 to-purple-100/40',
    borderColor: 'border-purple-600',
    shadowColor: 'shadow-purple-400/60'
  },
  {
    name: 'Medical Check-ups',
    description: 'Routine health examinations to prevent illness and promote overall wellness.',
    icon: ClipboardDocumentListIcon,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-200/60 via-cyan-100/50 to-blue-100/40',
    borderColor: 'border-blue-600',
    shadowColor: 'shadow-blue-400/60'
  },
  {
    name: 'Specialized Consultations',
    description: 'Expert consultations with specialists in various medical fields to address specific health concerns.',
    icon: UserGroupIcon,
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-200/60 via-cyan-100/50 to-teal-100/40',
    borderColor: 'border-teal-600',
    shadowColor: 'shadow-teal-400/60'
  },
  {
    name: 'Health Education',
    description: 'Educational programs and resources to help patients understand and manage their health conditions.',
    icon: AcademicCapIcon,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-200/60 via-emerald-100/50 to-green-100/40',
    borderColor: 'border-green-600',
    shadowColor: 'shadow-green-400/60'
  },
  {
    name: 'Online Appointments',
    description: 'Convenient online scheduling system for booking appointments with healthcare providers.',
    icon: ClockIcon,
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-200/60 via-amber-100/50 to-orange-100/40',
    borderColor: 'border-orange-600',
    shadowColor: 'shadow-orange-400/60'
  },
];

const Services = () => {
  return (
    <div className="bg-white w-full">
      {/* Header section */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-primary-500 py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white">
              Our Services
            </h1>
            <p className="mt-8 text-xl text-white/90 max-w-3xl mx-auto">
              Comprehensive healthcare services designed to meet all your medical needs with excellence and compassion.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-base font-semibold text-primary uppercase tracking-wide">What We Offer</p>
            <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
              Comprehensive Healthcare Services
            </h2>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
              Our hospital provides a range of services to ensure comprehensive care for all patients.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className={`relative overflow-hidden p-8 rounded-2xl border-2 ${service.borderColor} shadow-xl ${service.shadowColor} bg-gradient-to-br ${service.bgGradient} text-center group hover:-translate-y-3 hover:shadow-2xl transition-all duration-300`}
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">{service.name}</h3>
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>

                  {/* Decorative corner accent */}
                  <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${service.gradient} rounded-full opacity-15 group-hover:opacity-25 transition-opacity duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-base font-semibold text-primary uppercase tracking-wide">Our Process</p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Getting the care you need is simple and straightforward with our streamlined process.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: 1,
                  title: 'Book Appointment',
                  desc: 'Schedule your appointment online or by calling our reception desk.',
                  gradient: 'from-blue-500 to-cyan-500',
                  bgGradient: 'from-blue-200/60 via-cyan-100/50 to-blue-100/40',
                  borderColor: 'border-blue-600',
                  shadowColor: 'shadow-blue-400/60'
                },
                {
                  step: 2,
                  title: 'Consultation',
                  desc: 'Meet with our healthcare professionals for diagnosis and treatment plans.',
                  gradient: 'from-purple-500 to-pink-500',
                  bgGradient: 'from-purple-200/60 via-pink-100/50 to-purple-100/40',
                  borderColor: 'border-purple-600',
                  shadowColor: 'shadow-purple-400/60'
                },
                {
                  step: 3,
                  title: 'Treatment & Follow-up',
                  desc: 'Receive personalized care and schedule follow-up appointments as needed.',
                  gradient: 'from-green-500 to-emerald-500',
                  bgGradient: 'from-green-200/60 via-emerald-100/50 to-green-100/40',
                  borderColor: 'border-green-600',
                  shadowColor: 'shadow-green-400/60'
                }
              ].map((item, index) => (
                <div key={index} className={`relative overflow-hidden bg-gradient-to-br ${item.bgGradient} p-8 rounded-2xl border-2 ${item.borderColor} shadow-xl ${item.shadowColor} text-center group hover:-translate-y-3 hover:shadow-2xl transition-all duration-300`}>
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}></div>

                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-bold absolute top-6 left-1/2 transform -translate-x-1/2 shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10`}>
                    {item.step}
                  </div>

                  <div className="mt-24 relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Decorative circles */}
                  <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full opacity-15 group-hover:opacity-25 transition-opacity duration-500`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-base font-semibold text-primary-600 uppercase tracking-wide">Coverage Options</p>
            <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
              Insurance Coverage
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We work with a variety of insurance providers to ensure that you can access the care you need.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Insurance Providers Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Accepted Insurance Providers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Blue Cross Blue Shield', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-100/70 to-cyan-50/50', border: 'border-blue-500' },
                  { name: 'Aetna', gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-100/70 to-pink-50/50', border: 'border-purple-500' },
                  { name: 'UnitedHealthcare', gradient: 'from-orange-500 to-amber-500', bg: 'from-orange-100/70 to-amber-50/50', border: 'border-orange-500' },
                  { name: 'Cigna', gradient: 'from-green-500 to-emerald-500', bg: 'from-green-100/70 to-emerald-50/50', border: 'border-green-500' },
                  { name: 'Medicare', gradient: 'from-red-500 to-orange-500', bg: 'from-red-100/70 to-orange-50/50', border: 'border-red-500' },
                  { name: 'Medicaid', gradient: 'from-teal-500 to-cyan-500', bg: 'from-teal-100/70 to-cyan-50/50', border: 'border-teal-500' }
                ].map((insurance, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden flex items-center p-4 rounded-xl bg-gradient-to-r ${insurance.bg} border-2 ${insurance.border} shadow-md hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${insurance.gradient} flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-800 font-semibold">{insurance.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Our administrative team can help verify your coverage and explain any out-of-pocket costs.
              </p>
            </div>

            {/* Contact Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-100/60 via-primary-50/50 to-white p-8 rounded-2xl border-2 border-primary-500 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Need Help with Insurance?</h3>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Our dedicated team is here to help you navigate insurance coverage and billing questions.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-primary-200 hover:border-primary-400 transition-colors duration-300">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Phone Support</p>
                      <p className="text-primary-600 font-medium">91+ 9420020598</p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-primary-200 hover:border-primary-400 transition-colors duration-300">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-primary-600 font-medium">insurance@hospitalms.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to book your appointment?</span>
              <span className="block text-xl mt-2 text-white/90">Our team is ready to provide the care you deserve.</span>
            </h2>
          </div>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-full shadow">
              <a
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-lg font-semibold rounded-full text-primary shadow-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 