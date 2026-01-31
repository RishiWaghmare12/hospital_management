import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  ArrowRightIcon,
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import Card from './common/Card';
import Button from './common/Button';
import { BsBorderAll } from 'react-icons/bs';

// Static data
const services = [
  {
    name: 'General Consultation',
    description: 'Regular checkups and medical consultations for common health issues.',
    icon: UserIcon,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-200/60 via-cyan-100/50 to-blue-100/40',
    borderColor: 'border-blue-600',
    shadowColor: 'shadow-blue-400/60'
  },
  {
    name: 'Specialist Appointments',
    description: 'Connect with specialists in cardiology, dermatology, orthopedics, and more.',
    icon: CalendarIcon,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-200/60 via-pink-100/50 to-purple-100/40',
    borderColor: 'border-purple-600',
    shadowColor: 'shadow-purple-400/60'
  },
  {
    name: 'Emergency Care',
    description: '24/7 emergency services with priority treatment for critical conditions.',
    icon: ClockIcon,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-200/60 via-orange-100/50 to-red-100/40',
    borderColor: 'border-red-600',
    shadowColor: 'shadow-red-400/60'
  },
  {
    name: 'Online Consultation',
    description: 'Virtual appointments from the comfort of your home via video calls.',
    icon: ChatBubbleLeftRightIcon,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-200/60 via-emerald-100/50 to-green-100/40',
    borderColor: 'border-green-600',
    shadowColor: 'shadow-green-400/60'
  },
  {
    name: 'Lab Tests',
    description: 'Comprehensive diagnostic tests with quick and accurate results.',
    icon: MagnifyingGlassIcon,
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-200/60 via-amber-100/50 to-orange-100/40',
    borderColor: 'border-orange-600',
    shadowColor: 'shadow-orange-400/60'
  },
  {
    name: 'Specialized Treatments',
    description: 'Advanced medical treatments using cutting-edge technology.',
    icon: BuildingOffice2Icon,
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-200/60 via-cyan-100/50 to-teal-100/40',
    borderColor: 'border-teal-600',
    shadowColor: 'shadow-teal-400/60'
  },
];

const testimonials = [
  {
    quote: "The online consultation feature saved me so much time. I got medical advice from a specialist without leaving my home.",
    author: "Priyanka Sharma",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "The doctors are extremely knowledgeable and caring. They took the time to understand my concerns and provided personalized care.",
    author: "Krishna Kumar",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "Booking appointments was seamless, and the reminder system ensures I never miss a scheduled visit. Highly recommended!",
    author: "Atharva Gupta",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const stats = [
  { label: 'Patients Treated', value: 50000, suffix: '+' },
  { label: 'Specialist Doctors', value: 200, suffix: '+' },
  { label: 'Years of Service', value: 25, suffix: '+' },
  { label: 'Satisfaction Rate', value: 98, suffix: '%' },
];

// Custom hook for counting animation
const useCountUp = (end, start = 0, duration = 2000) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const timeRef = useRef(null);

  useEffect(() => {
    // Reset counter when the end value changes
    countRef.current = start;
    setCount(start);

    const step = Math.ceil((end - start) / (duration / 16));
    let currentCount = start;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        // Calculate the new count value based on progress
        currentCount = Math.min(
          start + Math.floor((end - start) * (progress / duration)),
          end
        );

        if (currentCount !== countRef.current) {
          countRef.current = currentCount;
          setCount(currentCount);
        }

        timeRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we reach exactly the end value
        setCount(end);
      }
    };

    timeRef.current = requestAnimationFrame(animate);

    return () => {
      if (timeRef.current) {
        cancelAnimationFrame(timeRef.current);
      }
    };
  }, [end, start, duration]);

  return count;
};

// Intersection Observer hook to trigger animations when element is visible
const useIntersectionObserver = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef, isVisible];
};

// Animated counter component
const StatCounter = ({ value, suffix, label }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const count = useCountUp(
    isVisible ? value : 0,
    0,
    2000
  );

  const formattedCount = value >= 1000
    ? count.toLocaleString()
    : count;

  return (
    <div ref={ref} className="text-center transform transition-all duration-500 hover:scale-105 group">
      <div className="text-5xl font-bold text-white relative inline-block">
        <span className="inline-block">{formattedCount}</span>
        <span className="inline-block">{suffix}</span>
        <div className="absolute -bottom-2 left-0 w-full h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
        </div>
      </div>
      <div className="mt-4 text-lg font-medium text-primary-100">{label}</div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="bg-white w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 -z-10"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 -ml-20 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 -mb-20 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 font-medium text-sm mb-8 animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
                #1 Healthcare Provider
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-dark-900 mb-6 leading-tight">
                Your Health, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Our Priority</span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience healthcare that puts you first. Book appointments, consult with top specialists,
                and manage your health records all in one secure place.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary-500/20">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary-500/20">
                    Browse Doctors
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 text-left">
                {[
                  { text: '24/7 Support', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-200/70 to-cyan-50/50', borderColor: 'border-blue-500' },
                  { text: 'Expert Specialists', gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-200/70 to-pink-50/50', borderColor: 'border-purple-500' },
                  { text: 'Secure Records', gradient: 'from-green-500 to-emerald-500', bg: 'from-green-200/70 to-emerald-50/50', borderColor: 'border-green-500' },
                  { text: 'Easy Booking', gradient: 'from-orange-500 to-amber-500', bg: 'from-orange-200/70 to-amber-50/50', borderColor: 'border-orange-500' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-4 rounded-xl bg-gradient-to-r ${item.bg} border-2 ${item.borderColor} shadow-md hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/10 border-8 border-white animate-float">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
                  alt="Doctor with patient"
                  className="w-full h-full object-cover"
                />

                {/* Floating Cards */}
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-xs animate-float-delayed hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <ShieldCheckIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Verified Doctors</p>
                      <p className="text-xs text-gray-500">100% Certified Specialists</p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Decorative dots */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pattern-dots opacity-20 -z-10"></div>
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-pattern-dots opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <div className="py-32 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl font-display">
              Comprehensive Healthcare
            </p>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              We offer a wide range of medical services to cater to your healthcare needs with precision and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                hover={true}
                variant="custom"
                className={`relative overflow-hidden p-8 rounded-2xl border-2 ${service.borderColor} shadow-xl bg-gradient-to-br ${service.bgGradient} text-center group hover:-translate-y-3 hover:shadow-2xl transition-all duration-300`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">{service.name}</h3>
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>

                  {/* Decorative corner accent */}
                  <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${service.gradient} rounded-full opacity-15 group-hover:opacity-25 transition-opacity duration-500`}></div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/services">
              <Button variant="outline" size="lg" className="group">
                View All Services
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Process</h2>
            <p className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl font-display">
              How It Works
            </p>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Get the healthcare you need in three simple steps
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: 1,
                  title: 'Create an Account',
                  desc: 'Sign up and complete your medical profile to help us understand your needs.',
                  gradient: 'from-blue-500 to-cyan-500',
                  bgGradient: 'from-blue-200/60 via-cyan-100/50 to-blue-100/40',
                  borderColor: 'border-blue-400',
                  shadowColor: 'shadow-blue-400/60'
                },
                {
                  step: 2,
                  title: 'Book an Appointment',
                  desc: 'Choose a doctor and schedule a convenient time for your consultation.',
                  gradient: 'from-purple-500 to-pink-500',
                  bgGradient: 'from-purple-200/60 via-pink-100/50 to-purple-100/40',
                  borderColor: 'border-purple-400',
                  shadowColor: 'shadow-purple-400/60'
                },
                {
                  step: 3,
                  title: 'Get Treatment',
                  desc: 'Visit for your appointment or join a video consultation for remote care.',
                  gradient: 'from-green-500 to-emerald-500',
                  bgGradient: 'from-green-200/60 via-emerald-100/50 to-green-100/40',
                  borderColor: 'border-green-400',
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

      {/* Testimonials - Commented out as per user request */}
      {/* 
      <div className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl font-display">
              What Our Patients Say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const gradients = [
                {
                  bg: 'from-violet-100/70 via-purple-50/50 to-white',
                  accent: 'from-violet-500 to-purple-600',
                  border: 'border-violet-400',
                  shadow: 'shadow-violet-400/60'
                },
                {
                  bg: 'from-rose-100/70 via-pink-50/50 to-white',
                  accent: 'from-rose-500 to-pink-600',
                  border: 'border-rose-400',
                  shadow: 'shadow-rose-400/60'
                },
                {
                  bg: 'from-sky-100/70 via-blue-50/50 to-white',
                  accent: 'from-sky-500 to-blue-600',
                  border: 'border-sky-400',
                  shadow: 'shadow-sky-400/60'
                }
              ];
              const theme = gradients[index % gradients.length];

              return (
                <Card
                  key={index}
                  variant="custom"
                  className={`relative p-8 border-2 ${theme.border} shadow-xl ${theme.shadow} hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${theme.bg} group overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}></div>

                  <div className="absolute top-6 left-6 z-20">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-gray-100 group-hover:ring-4 group-hover:ring-gray-200 transition-all duration-300">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="absolute top-6 right-8 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                    <svg className="h-20 w-20 transform rotate-180" fill={`url(#gradient-quote-${index})`} viewBox="0 0 32 32" aria-hidden="true">
                      <defs>
                        <linearGradient id={`gradient-quote-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: index === 0 ? '#a855f7' : index === 1 ? '#f43f5e' : '#0ea5e9' }} />
                          <stop offset="100%" style={{ stopColor: index === 0 ? '#8b5cf6' : index === 1 ? '#ec4899' : '#06b6d4' }} />
                        </linearGradient>
                      </defs>
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>

                  <div className="flex mb-4 relative z-10 mt-24">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-amber-500 fill-current drop-shadow-sm" />
                    ))}
                  </div>

                  <p className="text-gray-800 italic mb-6 relative z-10 leading-relaxed font-medium">"{testimonial.quote}"</p>

                  <div className="relative z-10">
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.author}</h4>
                    <p className={`text-sm font-bold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>{testimonial.role}</p>
                  </div>

                  <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${theme.accent} rounded-full opacity-10 group-hover:opacity-15 transition-opacity duration-500`}></div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      */}

      {/* CTA Section */}
      <div className="relative bg-primary-700 py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-primary-800 mix-blend-multiply" />
          <div className="absolute -top-24 left-0 -translate-x-1/2 transform">
            <div className="h-96 w-96 rounded-full bg-gradient-to-b from-white to-transparent opacity-10 blur-3xl" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-display">
            Ready to prioritize your health?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Join thousands of satisfied patients who trust us with their healthcare needs.
            Schedule your appointment today.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-white text-white-700 hover:bg-gray-50 shadow-lg">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="border-white text-white hover:bg-gray-50 shadow-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Home;