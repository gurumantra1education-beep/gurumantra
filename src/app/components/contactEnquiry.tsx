"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Send } from "lucide-react";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    course: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.from("enquiries").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        course: formData.course,
      },
    ]);

    setLoading(false);
    if (error) {
      alert("❌ Error submitting form: " + error.message);
    } else {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", state: "", course: "" });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Schedule Your Free Consultation
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
        />

        {/* State Dropdown */}
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
        >
          <option value="">Select State</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Other">Other</option>
        </select>

        {/* Course Dropdown */}
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
        >
          <option value="">Select Course</option>
          <option value="MBA">MBA</option>
          <option value="PGDM">PGDM</option>
          <option value="B.Tech">B.Tech</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold shadow-md transition-all focus:ring-4 focus:ring-cyan-300 focus:outline-none"
        >
          <Send size={18} />
          <span>{loading ? "Submitting..." : "Submit"}</span>
        </button>
      </form>

      {success && (
        <div className="mt-4 text-center text-green-600 font-medium animate-fade-in">
          ✅ Enquiry submitted successfully!
        </div>
      )}
    </div>
  );
}
