"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/app/defaultlayout";
import { supabase } from "@/utils/supabaseClient";
import { Trash2, Search } from "lucide-react";

// ======================
// CONFIGURABLE CREDENTIALS
// ======================
const AUTH_EMAIL = "gurumantra871@gmail.com";
const AUTH_PASSWORD = "Gurumantra_Lead_Page_890@#";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  course: string;
  created_at: string;
}

export default function EnquiryPage() {
  // --------------------
  // LOGIN STATE
  // --------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Check local storage for existing auth
    const storedAuth = localStorage.getItem("gurumantra_auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginData.email === AUTH_EMAIL &&
      loginData.password === AUTH_PASSWORD
    ) {
      localStorage.setItem("gurumantra_auth", "true");
      setIsAuthenticated(true);
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gurumantra_auth");
    setIsAuthenticated(false);
  };

  // --------------------
  // ENQUIRY MANAGEMENT
  // --------------------
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [marked, setMarked] = useState<number[]>([]);

  const fetchEnquiries = async () => {
    let query = supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;
    if (error) console.error(error);
    else setEnquiries(data as Enquiry[]);
  };

  const deleteEnquiry = async (id: number) => {
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) console.error(error);
    else fetchEnquiries();
  };

  const toggleMark = (id: number) => {
    setMarked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
    }
  }, [search, isAuthenticated]);

  // --------------------
  // RENDER
  // --------------------
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            🔒 Gurumantra Lead Access
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Enter email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="password"
              placeholder="Enter password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------
  // ENQUIRY PAGE
  // --------------------
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Enquiries</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
          >
            Logout
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <Search className="w-6 h-6 text-gray-500" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">✔</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">State</th>
                <th className="py-2 px-4 text-left">Course</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className={`border-b hover:bg-gray-50 ${
                    marked.includes(enquiry.id)
                      ? "bg-green-50 text-gray-600"
                      : ""
                  }`}
                >
                  <td className="py-2 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={marked.includes(enquiry.id)}
                      onChange={() => toggleMark(enquiry.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-2 px-4">{enquiry.name}</td>
                  <td className="py-2 px-4">{enquiry.email}</td>
                  <td className="py-2 px-4">{enquiry.phone}</td>
                  <td className="py-2 px-4">{enquiry.state}</td>
                  <td className="py-2 px-4">{enquiry.course}</td>
                  <td className="py-2 px-4">
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-center flex justify-center">
                    <button
                      onClick={() => deleteEnquiry(enquiry.id)}
                      className="text-red-500 hover:text-red-700 flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
