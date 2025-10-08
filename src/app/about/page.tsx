"use client"
import DefaultLayout from "../defaultlayout"
import {
  Users,
  Award,
  BookOpen,
  Globe,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Heart,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState({
    students: 0,
    colleges: 0,
    success: 0,
    states: 0,
  })

  useEffect(() => {
    setIsVisible(true)

    // Animate counters
    const animateCounter = (target: number, key: keyof typeof counters) => {
      let current = 0
      const increment = target / 100
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
      }, 20)
    }

    const timeout = setTimeout(() => {
      animateCounter(1000, "students")
      animateCounter(50, "colleges")
      animateCounter(95, "success")
      animateCounter(15, "states")
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  const processSteps = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "Free career assessment and goal mapping session with our expert counselors.",
    },
    {
      step: "02",
      title: "Personalized Plan",
      description: "Custom roadmap with college recommendations based on your profile and preferences.",
    },
    {
      step: "03",
      title: "Application Support",
      description: "End-to-end assistance with applications, essays, and documentation.",
    },
    {
      step: "04",
      title: "Success & Beyond",
      description: "Admission confirmation and continued support for your academic journey.",
    },
  ]

  return (
    <DefaultLayout>
      {/* Enhanced Hero Section */}
      <div className="relative py-32 bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>

        <div
          className={`container max-w-6xl mx-auto px-4 text-center relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <Star className="w-4 h-4 text-yellow-300" />
            <span>India's Trusted Education Partner</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            About Guru Mantra
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
            A one-stop platform bridging students and top-tier colleges in India & abroad.
          </p>
          <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto mb-8 leading-relaxed">
            From career confusion to college clarity — Guru Mantra is your trusted admission partner. Whether you're
            looking for personal guidance, verified institutes, or end-to-end admission support, we've got you covered.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="group px-8 py-4 border-2 border-white/30 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 hover:bg-white/10">
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-semibold backdrop-blur-sm">
              Watch Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Animated Statistics Section */}
      <div className="py-20 bg-white relative">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-[#0d47a1] mb-2 group-hover:scale-110 transition-transform duration-300">
                {counters.students.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Students Guided</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-[#0d47a1] mb-2 group-hover:scale-110 transition-transform duration-300">
                {counters.colleges}+
              </div>
              <div className="text-gray-600 font-medium">Partner Colleges</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-[#0d47a1] mb-2 group-hover:scale-110 transition-transform duration-300">
                {counters.success}%
              </div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-[#0d47a1] mb-2 group-hover:scale-110 transition-transform duration-300">
                {counters.states}+
              </div>
              <div className="text-gray-600 font-medium">States</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced What We Do Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive educational guidance and support services to help students achieve their academic
              dreams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Personalized Counseling",
                description:
                  "We assess each student's interests, strengths, and goals to provide the most suitable academic path and college suggestions.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Globe,
                title: "India & Abroad Admissions",
                description:
                  "Whether you're aiming for a college in India or planning overseas studies, our experts help you through every step of the application process.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: Users,
                title: "Direct College Connect",
                description:
                  "Get in touch with trusted institutions directly through Guru Mantra. No middlemen. Transparent processes.",
                color: "from-purple-500 to-purple-600",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="text-white" size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#0d47a1] transition-colors">
                  {service.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Process Section */}
      <div className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, transparent 4-step process to guide you from confusion to clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#0d47a1] to-[#1565c0] rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {step.step}
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#0d47a1] to-transparent transform -translate-x-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Mission & Vision */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0d47a1] to-[#1565c0] rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl md:text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At Guru Mantra, our mission is to simplify the college admission journey for every student. We empower
                  them with accurate guidance, tailored suggestions, and direct links to trusted institutions — all
                  under one platform.
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl md:text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We envision a future where every student, regardless of background, gets access to the best
                  educational opportunities that align with their goals, dreams, and financial plans.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Core Values</h3>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: "Transparency in every interaction" },
                  { icon: Heart, text: "Student-first approach always" },
                  { icon: CheckCircle, text: "Quality over quantity mindset" },
                  { icon: TrendingUp, text: "Continuous improvement culture" },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <value.icon className="text-[#0d47a1]" size={20} />
                    <span className="text-gray-700 font-medium">{value.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Enhanced Why Choose Us */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-4xl font-bold mb-6 text-gray-900">Why Students Trust Guru Mantra</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built our reputation on trust, expertise, and proven results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Expert Counselors",
                description:
                  "Our experienced team provides personalized support for every stream — from engineering and medical to MBA and international studies.",
                highlight: "10+ Years Experience",
              },
              {
                icon: BookOpen,
                title: "Verified Colleges",
                description:
                  "We only work with trusted colleges and universities. No misleading claims, just real guidance and authentic connections.",
                highlight: "50+ Partner Institutions",
              },
              {
                icon: Award,
                title: "Proven Results",
                description:
                  "Hundreds of students have already secured admissions and placements via Guru Mantra. Their success stories speak for us.",
                highlight: "95% Success Rate",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 overflow-hidden"
              >
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0d47a1] to-[#1565c0] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <div className="inline-block bg-blue-100 text-[#0d47a1] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {feature.highlight}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#0d47a1] transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#0d47a1] to-[#1565c0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Call to Action */}
      <div className="relative py-24 bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="container max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Join Thousands of Successful Students
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Whether you need help with college selection, admissions, or career mapping — Guru Mantra is here for you.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
  <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#0d47a1] rounded-lg shadow-md hover:shadow-lg transition-all font-medium">
    <Clock size={18} />
    <span>Get Free Counseling</span>
  </button>
  {/* <button className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all">
    <Users size={18} />
    <span>Talk to Alumni</span>
  </button> */}
</div>

          <div className="mt-12 flex justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>No Hidden Charges</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Expert Guidance</span>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
