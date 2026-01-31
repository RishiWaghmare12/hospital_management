import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Contact = () => {
  // Mock form submission with no actual functionality
  const handleSubmit = (e) => {
    e.preventDefault();
    // No actual form submission or state reset
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ['91+ 9876543210', '91+ 1234567890'],
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-100/60 to-cyan-50/50',
      borderColor: 'border-blue-500',
      shadowColor: 'shadow-blue-400/60'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['hospital@gmail.com', 'support@gmail.com'],
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-100/60 to-pink-50/50',
      borderColor: 'border-purple-500',
      shadowColor: 'shadow-purple-400/60'
    },
    {
      icon: MapPinIcon,
      title: 'Location',
      details: ['Hospital', 'Pune, Maharashtra, India'],
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-100/60 to-orange-50/50',
      borderColor: 'border-red-500',
      shadowColor: 'shadow-red-400/60'
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      details: ['Monday to Friday: 8:00 AM - 8:00 PM', 'Saturday: 9:00 AM - 5:00 PM'],
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-100/60 to-emerald-50/50',
      borderColor: 'border-green-500',
      shadowColor: 'shadow-green-400/60'
    },
  ];

  return (
    <div className="bg-white w-full">
      {/* Header section */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-primary-500 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto">
              We're here to help. Reach out to us with any questions or concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className={`relative overflow-hidden bg-gradient-to-br ${item.bgGradient} p-8 rounded-2xl border-2 ${item.borderColor} shadow-xl ${item.shadowColor} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`}></div>

                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">{item.title}</h3>
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 font-medium mb-1">
                      {detail}
                    </p>
                  ))}
                </div>

                {/* Decorative element */}
                <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Map Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-primary-500/20 ring-4 ring-primary-50/50">
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <h2 className="text-3xl font-bold mb-3 relative z-10">Get In Touch</h2>
                <p className="text-white/90 text-lg relative z-10">
                  We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      placeholder="How can we help you?"
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      placeholder="Write your message here..."
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all duration-300 resize-none placeholder-gray-400"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary-500/30 hover:from-primary-700 hover:to-primary-600 transform hover:-translate-y-1 transition-all duration-300 ring-4 ring-primary-50"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Map and Address */}
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <p className="text-lg font-bold text-primary uppercase tracking-wide">Visit Us</p>
                <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
                  Our Location
                </h2>
              </div>

              {/* Map placeholder */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-primary-100 ring-4 ring-primary-50/50 flex-grow min-h-[400px] relative group">
                <div className="absolute inset-0 bg-primary-50/30">
                  <div className="absolute inset-0 bg-[linear-gradient(#e6e6e6_1px,transparent_1px),linear-gradient(90deg,#e6e6e6_1px,transparent_1px)] bg-[length:20px_20px] opacity-60"></div>

                  {/* Simulated Map Elements */}
                  <div className="absolute top-1/2 left-0 right-0 h-16 bg-white transform -translate-y-1/2 shadow-sm"></div>
                  <div className="absolute top-0 bottom-0 left-1/3 w-16 bg-white transform -translate-x-1/2 shadow-sm"></div>

                  {/* Location Pin */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-black/20 rounded-[100%] blur-sm"></div>
                      <div className="bg-gradient-to-br from-red-500 to-pink-600 h-20 w-20 rounded-full flex items-center justify-center shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-300 border-[6px] border-white z-10 ring-4 ring-red-100">
                        <MapPinIcon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-2xl shadow-xl whitespace-nowrap border-2 border-gray-100 text-center">
                        <p className="font-bold text-gray-900 text-lg">HealthConnect Hospital</p>
                        <p className="text-sm text-gray-500 font-medium">Medical District, Pune</p>
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-t-2 border-l-2 border-gray-100"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex items-center group">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-5 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                    <PhoneIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Call Us</h3>
                    <p className="text-gray-500 font-medium">24/7 Support Available</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex items-center group">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-5 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                    <EnvelopeIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Email Us</h3>
                    <p className="text-gray-500 font-medium">Response within 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-base font-semibold text-primary uppercase tracking-wide">Common Questions</p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Find answers to common questions about our services and facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "What are your visiting hours?",
                a: "Our general visiting hours are from 10:00 AM to 8:00 PM daily. Specialized wards may have different visiting hours, please check with the specific department.",
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-100/60 to-cyan-50/50',
                borderColor: 'border-blue-500',
                shadowColor: 'shadow-blue-400/60'
              },
              {
                q: "How do I schedule an appointment?",
                a: "You can schedule appointments through our online portal, by calling our reception desk, or by visiting us in person. Emergency cases do not require prior appointments.",
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-100/60 to-pink-50/50',
                borderColor: 'border-purple-500',
                shadowColor: 'shadow-purple-400/60'
              },
              {
                q: "What insurance plans do you accept?",
                a: "We accept a wide range of insurance plans. Please contact our insurance verification department for specific information about your coverage.",
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-100/60 to-emerald-50/50',
                borderColor: 'border-green-500',
                shadowColor: 'shadow-green-400/60'
              },
              {
                q: "Can I access my medical records online?",
                a: "Yes, registered patients can access their medical records through our secure patient portal. You'll need to set up an account with valid identification.",
                gradient: 'from-orange-500 to-amber-500',
                bgGradient: 'from-orange-100/60 to-amber-50/50',
                borderColor: 'border-orange-500',
                shadowColor: 'shadow-orange-400/60'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className={`relative overflow-hidden bg-gradient-to-br ${faq.bgGradient} p-8 rounded-2xl border-2 ${faq.borderColor} shadow-xl ${faq.shadowColor} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${faq.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">{faq.q}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </div>

                {/* Decorative element */}
                <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${faq.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-6">
            Need Emergency Help?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Our emergency services are available 24/7. Don't hesitate to contact us immediately for urgent medical care.
          </p>
          <div className="inline-flex rounded-full bg-white px-8 py-4 shadow-lg">
            <a href="tel:+919876543210" className="text-2xl font-bold text-primary">
              Emergency: +91 9876543210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 