import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import DefaultLayout from "../../../defaultlayout";
import EnquiryForm from "../../../components/contactEnquiry"; // Import your form component

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
);

export const dynamic = "force-dynamic";

interface CollegeData {
  id: number;
  course: string;
  clg_fees: string;
  specialization: string;
  highest_placement: string;
  college_id: number;
  year: number;
}

interface City {
  id: number;
  name: string;
  slug: string;
}

interface College {
  id: number;
  name: string;
  slug: string;
}

interface CollegePageProps {
  params: Promise<{ 
    citySlug?: string; 
    collegeSlug?: string; 
  }>;
}

const formatFees = (fees: string): string => {
  if (!fees || fees.toLowerCase() === 'not available' || fees === '-') {
    return 'Contact College';
  }
  return fees;
};

const formatPlacement = (placement: string): string => {
  if (!placement || placement.toLowerCase() === 'not available' || placement === '-') {
    return 'Data not available';
  }
  return placement;
};

export default async function CollegePage({ params }: CollegePageProps) {
  const { citySlug, collegeSlug } = await params;

  if (!citySlug || !collegeSlug) {
    return notFound();
  }

  try {
    const { data: city, error: cityError } = await supabase
      .from("cities")
      .select("id, name, slug")
      .ilike("slug", citySlug)
      .single();

    if (cityError || !city) {
      console.error("City fetch error:", cityError);
      return notFound();
    }

    const { data: college, error: collegeError } = await supabase
      .from("colleges")
      .select("id, name, slug")
      .eq("slug", collegeSlug)
      .eq("city_id", city.id)
      .single();

    if (collegeError || !college) {
      console.error("College fetch error:", collegeError);
      return notFound();
    }

    const { data: collegeData, error: dataError } = await supabase
      .from("college_data")
      .select("id, course, clg_fees, specialization, highest_placement, college_id, year")
      .eq("college_id", college.id)
      .order("course", { ascending: true });

    if (dataError) {
      console.error("College data fetch error:", dataError);
    }

    const hasPlacementData = collegeData?.some(
      item => item.highest_placement && 
      item.highest_placement !== '-' && 
      !item.highest_placement.toLowerCase().includes('not available')
    );

    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            
            {/* College Header */}
            <header className="mb-8 sm:mb-12">
              <div className="bg-gradient-to-r from-[#0d47a1] to-[#1565c0] rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                      {college.name}
                    </h1>
                    <div className="flex items-center text-sm sm:text-base lg:text-lg">
                      <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="opacity-95">{city.name}</span>
                    </div>
                  </div>
                  
                  {collegeData && collegeData.length > 0 && (
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-5 sm:py-3 border border-white/20">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                          {collegeData.length}
                        </div>
                        <div className="text-xs sm:text-sm opacity-90">Programs</div>
                      </div>
                      {hasPlacementData && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-5 sm:py-3 border border-white/20">
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {collegeData.filter(item => 
                              item.highest_placement && 
                              item.highest_placement !== '-' && 
                              !item.highest_placement.toLowerCase().includes('not available')
                            ).length}
                          </div>
                          <div className="text-xs sm:text-sm opacity-90">Placements</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Academic Programs Section */}
            <section className="mb-12 sm:mb-16 lg:mb-20">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Academic Programs & Courses
                </h2>
                <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-[#0d47a1] to-[#1565c0] rounded-full"></div>
              </div>

              {collegeData && collegeData.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 lg:gap-8">
                  {collegeData.map((program: CollegeData) => (
                    <article
                      key={program.id}
                      className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-xl hover:border-[#0d47a1]/30 transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 lg:p-8">
                        
                        {/* Course Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100">
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">Course</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0d47a1] mb-3 sm:mb-4">
                              {program.course}
                            </h3>
                            
                            {program.specialization && program.specialization !== '-' && (
                              <div className="mt-3">
                                <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-2">Specialization</span>
                                <p className="text-sm sm:text-base text-gray-700 flex items-start">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#0d47a1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <span className="font-medium">{program.specialization}</span>
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="inline-flex flex-col items-center justify-center px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 self-start">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Established</span>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700">{program.year}</span>
                            </div>
                          </div>
                        </div>

                        {/* Course Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          
                          {/* Annual Fees */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-green-200">
                            <div className="flex items-center mb-2 sm:mb-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-medium text-gray-600">Annual Fees</h4>
                              </div>
                            </div>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 ml-11 sm:ml-13">
                              {formatFees(program.clg_fees)}
                            </p>
                          </div>

                          {/* Highest Placement */}
                          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-purple-200">
                            <div className="flex items-center mb-2 sm:mb-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-medium text-gray-600">Highest Placement</h4>
                              </div>
                            </div>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 ml-11 sm:ml-13">
                              {formatPlacement(program.highest_placement)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 max-w-md mx-auto border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      No Course Information Available
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Course details for {college.name} are currently being updated. Please check back later.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Enquiry Form Section */}
            <section className="mb-8 sm:mb-12">
              <div className="mb-6 sm:mb-8 text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Interested in {college.name}?
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Fill out the form below and our counselors will get in touch with you
                </p>
              </div>
              
              <EnquiryForm />
            </section>
          </div>
        </div>
      </DefaultLayout>
    );
  } catch (error) {
    console.error("Unexpected error in CollegePage:", error);
    return notFound();
  }
}