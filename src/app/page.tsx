"use client";
import DefaultLayout from "./defaultlayout";
import { ArrowRight, Search, MapPin, BookOpen, FileText, Users, Star, Award, CheckCircle, MessageSquare, Phone, Briefcase, TrendingUp, Sparkles, Building2, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import Link from 'next/link';
import PartnerSlider from "./components/partener-slider";
import EnquiryForm from "./components/enquiry";

// --- Custom Data (for enhanced sections) ---

const featureData = [
  { icon: FileText, title: "Share Your Profile", description: "Enter your academic details and preferences for smart matching." },
  { icon: Search, title: "Get Personalized Matches", description: "Receive a curated list of top colleges, programs, fees, and placements." },
  { icon: Users, title: "Connect & Apply", description: "Connect directly with college reps and get exclusive application guidance." },
];

const testimonialData = [
  { initial: 'A', name: 'Test Student 1', course: 'B.Tech, Computer Science', quote: "Guru Mantra helped me find the perfect engineering college that matched my profile. Their personalized recommendations saved me so much time and stress!", placement: 'Placed at xyz with @ package' },
  { initial: 'R', name: 'Test Student 2', course: 'MBA, Finance', quote: "The counselors at Guru Mantra guided me through the entire admission process. I got into my dream business school with a scholarship!", placement: 'Got placed' },
  { initial: 'P', name: 'Test Student 3', course: 'MBBS', quote: "Finding a good medical college seemed impossible until I used Guru Mantra. Their expert guidance helped me navigate the complex admission process.", placement: 'Top medical College' },
];

const statsData = [
    { number: 25, suffix: "+", label: "Partner Colleges", icon: Building2, delay: "delay-100" },
    { number: 95, suffix: "%", label: "Admission Success", icon: TrendingUp, delay: "delay-300" },
    { number: 50, suffix: "+", label: "Expert Counselors", icon: UserCheck, delay: "delay-500" },
];

// Counter Animation Hook with trigger
const useCountUp = (end: number, shouldStart: boolean, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || !shouldStart) return;
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeOutQuart));
      
      if (progress === 1) {
        clearInterval(timer);
        setHasAnimated(true);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, start, hasAnimated, shouldStart]);

  return count;
};

// --- Main Component ---

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery} in course ${selectedCourse}`);
  };

  return (
    <>
      <DefaultLayout>
        {/* Hero Section - ALL CTAs and Forms Removed */}
        <div className="relative bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2] pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          {/* Decorative BG Elements */}
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 md:w-80 md:h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 -left-20 w-60 h-60 bg-purple-500 rounded-full opacity-10 blur-3xl animate-float"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          </div>

          {/* Main Container */}
          <div
            className={`container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-12">
              {/* Left Content (Expanded to fill space) */}
              <div className="md:w-full text-center">
                <span className="inline-block px-4 py-1 rounded-full bg-indigo-900/70 backdrop-blur-sm text-cyan-300 text-xl font-medium mb-6 border border-indigo-600/40 transform transition-all duration-300 hover:scale-105">
                  Discover Your Future
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                  Find the Right <span className="text-cyan-300">College</span> and Course
                </h1>
                <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
                  Explore top-rated colleges offering specialized **MBA, Engineering, and Management** programs across select states. Get matched to your perfect career path through expert guidance.
                </p>
                
                {/* Secondary CTA remains, linking directly to the main CTA section */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-[#0d47a1] py-3 px-8 rounded-lg transition-all hover:ring-4 hover:ring-white/50 shadow-lg font-semibold flex items-center justify-center space-x-2 w-fit mx-auto"
                    >
                        <span>Get Free Expert Counseling</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Hero Section End */}

        {/* Enhanced Why Choose Us / Stat Bar (Animated with Icons & Counter) */}
        <div id="stats-section" className="bg-white py-12">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                    {statsData.map((stat, index) => {
                        const Icon = stat.icon;
                        const count = useCountUp(stat.number, statsVisible, 2000, 0);
                        
                        return (
                            <div 
                                key={index} 
                                className={`relative group text-center p-6 md:p-4 transition-all duration-700 ease-out ${stat.delay} ${
                                    statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                } ${index < 2 ? 'md:border-r border-gray-200' : ''}`}
                            >
                                {/* Floating Icon */}
                                <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-[#0d47a1] to-[#1976d2] text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <Icon size={26} />
                                </div>
                                
                                {/* Animated Number */}
                                <h3 className="text-4xl md:text-5xl font-extrabold text-[#0d47a1] mb-2 relative inline-block">
                                    {statsVisible ? count : 0}{stat.suffix}
                                    {/* Sparkle Effect on Hover */}
                                    <span className="absolute -top-2 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Sparkles className="text-yellow-400 w-5 h-5" />
                                    </span>
                                </h3>
                                
                                {/* Label */}
                                <p className="text-lg font-medium text-gray-600">{stat.label}</p>
                                
                                {/* Hover Accent Line */}
                                <div className="mx-auto mt-3 h-1 w-0 group-hover:w-12 bg-gradient-to-r from-[#0d47a1] to-[#1976d2] rounded-full transition-all duration-500"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
        
        {/* Partner Slider Section (Visual cleanup) */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              Top Colleges You Can Trust
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore leading institutions renowned for quality education and excellent placement records.
            </p>
          </div>
          <div className="mt-10 overflow-hidden">
            <PartnerSlider />
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/colleges" className="flex items-center gap-2 px-6 py-3 border-2 border-[#1565c0] text-[#1565c0] rounded-lg shadow-sm hover:bg-[#1565c0] hover:text-white transition-all font-medium">
              <span>View All Partner Colleges</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <hr className="my-0 border-gray-200" />

        {/* About Us Reference Section */}
        <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              
              {/* Left - Image */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#0d47a1] to-[#1976d2] rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://res.cloudinary.com/dcdxwzbsi/image/upload/v1759906586/serious-teacher-checking-assignment-two-students_ggrb7e.jpg" 
                    alt="Students studying together" 
                    className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d47a1]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-400 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 rounded-full opacity-20 blur-2xl"></div>
              </div>

              {/* Right - Content */}
              <div>
                <span className="inline-block px-4 py-1 rounded-full bg-[#0d47a1]/10 text-[#0d47a1] text-sm font-semibold mb-4">
                  About Guru Mantra
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Your Trusted Partner in <span className="text-[#0d47a1]">Education Journey</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  At Guru Mantra, we believe every student deserves the right guidance to unlock their full potential. With years of experience in educational counseling, we've helped thousands of students find their perfect college match.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our team of expert counselors works tirelessly to understand your unique aspirations, academic background, and career goals to provide personalized recommendations that shape your future.
                </p>
                
                {/* Key highlights */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0d47a1]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={18} className="text-[#0d47a1]" />
                    </div>
                    <span className="text-gray-700 font-medium">Personalized College Matching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0d47a1]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={18} className="text-[#0d47a1]" />
                    </div>
                    <span className="text-gray-700 font-medium">Expert Admission Guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0d47a1]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={18} className="text-[#0d47a1]" />
                    </div>
                    <span className="text-gray-700 font-medium">Scholarship & Financial Aid Support</span>
                  </div>
                </div>

                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0d47a1] to-[#1976d2] text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold group"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </div>

        <hr className="my-0 border-gray-200" />
        
        {/* How Guru Mantra Works Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                Your 3-Step Journey to the Right College
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover a simple process to find the right college—powered by smart technology and expert guidance for confidence and ease.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {featureData.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg p-6 transition-all duration-500 hover:shadow-xl border border-gray-100 relative overflow-hidden group hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-all duration-500 group-hover:bg-blue-100 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0d47a1] to-[#1976d2] flex items-center justify-center mb-6 text-white transform transition-transform duration-300 group-hover:scale-110">
                      <step.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    <div className="flex items-center text-[#1565c0] font-bold text-xl">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span>{index + 1}</span>
                      </div>
                      <span className="text-base text-gray-500">Step {index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-0 border-gray-200" />

        {/* Sucess Stories/Testimonials */}
        <div className="py-16 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Students Say ✨</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from students who found their dream colleges through Guru Mantra and are now thriving.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonialData.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-[#0d47a1] to-[#1976d2] flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.initial}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.course}</p>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="mr-0.5" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center text-sm font-medium text-[#1976d2]">
                    <Award size={16} className="mr-2" />
                    <span>{testimonial.placement}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0d47a1] to-[#1976d2] text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium">
                <span>Read More Success Stories</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section - Free Consultation (Targeted by Hero CTA) */}
        <div id="cta-section" className="py-16 bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 md:w-80 md:h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-10 -left-20 w-60 h-60 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 md:p-12 border border-white/20">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                
                {/* Left Content */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Get <span className="text-cyan-300">Free Expert Counseling</span> to Find the Right College & Course.
                  </h2>
                  <p className="text-indigo-100 text-lg mb-6">
                    Personalized guidance for admissions in India & abroad — based on your academic profile, goals, and budget.
                  </p>
                  
                  {/* Key Benefits */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-white text-lg">
                      <CheckCircle size={20} className="mr-3 text-cyan-300 flex-shrink-0" />
                      **Free** 1-on-1 Consultation
                    </li>
                    <li className="flex items-center text-white text-lg">
                      <CheckCircle size={20} className="mr-3 text-cyan-300 flex-shrink-0" />
                      Admission & **Scholarship** Guidance
                    </li>
                    <li className="flex items-center text-white text-lg">
                      <CheckCircle size={20} className="mr-3 text-cyan-300 flex-shrink-0" />
                      Profile Evaluation & **College Shortlisting**
                    </li>
                  </ul>
                </div>
                
                {/* Right Form */}
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}