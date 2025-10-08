"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import Slider from "react-slick"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin, Star, AlertCircle } from "lucide-react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface College {
  id: number
  name: string
  location: string
  college_logo: string
  college_image: string
  details_url: string
  apply_url: string
  placement: string
  courses: string
  rating: number
}

const PrevArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 shadow-lg text-gray-700 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-gray-200 lg:left-4"
      onClick={onClick}
      aria-label="Previous colleges"
      type="button"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  )
}

const NextArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 shadow-lg text-gray-700 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-gray-200 lg:right-4"
      onClick={onClick}
      aria-label="Next colleges"
      type="button"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  )
}

const SkeletonCard = () => (
  <div className="p-3 outline-none">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-[200px] sm:h-[220px] md:h-[240px] bg-gray-200"></div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-[45px] h-[45px] bg-gray-200 rounded-md flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
              <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load colleges</h3>
      <p className="text-gray-600 mb-4">Something went wrong while fetching college data.</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
)

const PartnerSlider = () => {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const trackCollegeClick = useCallback((collegeId: number, action: "apply" | "details", collegeName: string) => {
    // Analytics tracking - replace with your analytics service
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "college_interaction", {
        college_id: collegeId,
        college_name: collegeName,
        action: action,
        event_category: "engagement",
      })
    }
  }, [])

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from("partner-slider")
        .select("*")
        .order("id", { ascending: true })

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      setColleges(data || [])
    } catch (err) {
      console.error("Error fetching colleges:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchColleges()
  }, [fetchColleges])

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: colleges.length > 2,
      speed: 700,
      slidesToShow: Math.min(2, colleges.length),
      slidesToScroll: 1,
      autoplay: colleges.length > 2,
      autoplaySpeed: 4000,
      cssEase: "cubic-bezier(0.45, 0, 0.55, 1)",
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
      pauseOnHover: true,
      accessibility: true,
      focusOnSelect: false,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: Math.min(2, colleges.length),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(2, colleges.length),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
          },
        },
      ],
      dotsClass: "slick-dots custom-dots",
    }),
    [colleges.length],
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-0">
        <div className="slider-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState onRetry={fetchColleges} />
  }

  if (colleges.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>No partner colleges available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-0 relative">
      <div className="slider-container" role="region" aria-label="Partner colleges carousel">
        <Slider {...sliderSettings}>
          {colleges.map((college, index) => (
            <div key={college.id} className="p-3 outline-none focus:outline-none">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-gray-200 group focus-within:ring-2 focus-within:ring-blue-500">
                <div className="flex flex-col">
                  <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden">
                    <Image
                      src={college.college_image || "/placeholder.svg?height=240&width=400"}
                      alt={`${college.name} campus view`}
                      fill
                      priority={index < 2}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-[45px] h-[45px] relative flex-shrink-0 mt-1 rounded-md overflow-hidden border border-gray-100 bg-white p-1 shadow-sm">
                        <Image
                          src={college.college_logo || "/placeholder.svg?height=45&width=45"}
                          alt={`${college.name} logo`}
                          fill
                          className="object-contain"
                          sizes="45px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                          {college.name}
                        </h3>

                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{college.location}</span>
                        </div>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-200">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="ml-1 font-medium text-sm text-yellow-700">{college.rating}</span>
                            <span className="text-yellow-600 text-xs ml-0.5">/ 5</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4 max-h-[60px] overflow-y-auto scrollbar-thin">
                          {college.courses
                            .split(",")
                            .slice(0, 4)
                            .map((course, i) => (
                              <span
                                key={i}
                                className="bg-[#e3f2fd] text-[#1565c0] text-xs px-3 py-1 rounded-full border border-[#bbdefb] whitespace-nowrap"
                              >
                                {course.trim()}
                              </span>
                            ))}
                          {college.courses.split(",").length > 4 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{college.courses.split(",").length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3 mt-3">
                          <a
                            href={college.apply_url}
                            onClick={() => trackCollegeClick(college.id, "apply", college.name)}
                            className="flex-1 bg-[#1565c0] text-white py-2.5 text-center rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[#0d47a1] hover:shadow-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Details
                          </a>
                          {/* <a
                            href={college.details_url}
                            onClick={() => trackCollegeClick(college.id, "details", college.name)}
                            className="flex-1 bg-white border border-[#bbdefb] text-[#1565c0] py-2.5 text-center rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[#e3f2fd] hover:border-[#90caf9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Details
                          </a> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        .custom-dots {
          bottom: -40px !important;
        }
        .custom-dots li button:before {
          font-size: 12px;
          color: #cbd5e1;
          opacity: 1;
        }
        .custom-dots li.slick-active button:before {
          color: #1565c0;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}

export default PartnerSlider
