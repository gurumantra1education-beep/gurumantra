"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ChevronUp, GraduationCap } from "lucide-react"
import { Button } from "./ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false)
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false)
  const [mobileProgramDropdown, setMobileProgramDropdown] = useState(false)
  const [mobileExamDropdown, setMobileExamDropdown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  const handleMouseLeave = () => {
    setIsProgramDropdownOpen(false)
    setIsExamDropdownOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full shadow-sm transition-all duration-300 ${
        isScrolled ? "bg-white shadow-xl" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container flex h-16 items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/gm_logo.svg"
              alt="GuruMantra Logo"
              width={100}
              height={100}
              className="h-15 w-15"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-lg" onMouseLeave={handleMouseLeave}>
          <Link href="/" className="font-medium text-blue-900 hover:text-blue-600 transition-colors">
            Home
          </Link>

          {/* Program Dropdown */}
          {/* <div className="relative" onMouseEnter={() => setIsProgramDropdownOpen(true)}>
            <button className="font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              Program
              <ChevronDown size={16} className={`transition-transform ${isProgramDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isProgramDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50"
                >
                  <Link
                    href="/mba"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    MBA
                  </Link>
                  <Link
                    href="/engineering"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Engineering
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}

          {/* Exams Dropdown */}
          {/* <div className="relative" onMouseEnter={() => setIsExamDropdownOpen(true)}>
            <button className="font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              Exams
              <ChevronDown size={16} className={`transition-transform ${isExamDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isExamDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50"
                >
                  <Link
                    href="/exams/ielts"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    IELTS
                  </Link>
                  <Link
                    href="/exams/gre"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    GRE
                  </Link>
                  <Link
                    href="/exams/gmat"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    GMAT
                  </Link>
                  <Link
                    href="/exams/sat"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    SAT
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}

          <Link href="/about" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link href="/about" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">
            MBA
          </Link>
          <Link href="/contact" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hidden md:flex border-blue-700 text-blue-700 hover:bg-blue-700 bg-transparent"
          >
            Log in
          </Button>
          {/* <Button className="hidden md:flex bg-blue-700 hover:bg-blue-600">Get Started</Button> */}
          <motion.button
            className="md:hidden z-50 text-blue-700"
            onClick={() => setIsOpen(!isOpen)}
            animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.2 : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-lg z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%", borderRadius: "50% 0 0 50%" }}
              animate={{ x: "0%", borderRadius: "0" }}
              exit={{ x: "-100%", borderRadius: "50% 0 0 50%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-4/5 h-screen bg-[#0d47a1] backdrop-blur-md shadow-lg flex flex-col items-center justify-center text-lg z-50"
            >
              <motion.div>
                <Link href="/" className="text-3xl font-bold text-white mb-6" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-white" />
                    <span>GuruMantra</span>
                  </div>
                </Link>
              </motion.div>

              <nav className="flex flex-col items-center space-y-6">
                {/* Home */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.65,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href="/"
                    className="text-white hover:text-yellow-400 text-xl font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>

                {/* Program Dropdown */}
                {/* <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.35,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-white hover:text-yellow-400 text-xl font-semibold">Program</span>
                    <button onClick={() => setMobileProgramDropdown(!mobileProgramDropdown)} className="text-white">
                      {mobileProgramDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {mobileProgramDropdown && (
                      <motion.ul
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="pl-6 space-y-2 text-white mt-2"
                      >
                        <li>
                          <Link
                            href="/mba"
                            className="block px-4 py-2 hover:bg-blue-700/80 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            MBA
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/engineering"
                            className="block px-4 py-2 hover:bg-blue-700/80 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            Engineering
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div> */}

                {/* Exams Dropdown */}
                {/* <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-white hover:text-yellow-400 text-xl font-semibold">Exams</span>
                    <button onClick={() => setMobileExamDropdown(!mobileExamDropdown)} className="text-white">
                      {mobileExamDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {mobileExamDropdown && (
                      <motion.ul
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="pl-6 space-y-2 text-white mt-2"
                      >
                        <li>
                          <Link
                            href="/exams/ielts"
                            className="block px-4 py-2 hover:bg-blue-700/80 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            IELTS
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/exams/gre"
                            className="block px-4 py-2 hover:bg-blue-700/80 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            GRE
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/exams/gmat"
                            className="block px-4 py-2 hover:bg-blue-700/80 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            GMAT
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/exams/sat"
                            className="block px-4 py-2 hover:bg-blue-700/80 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            SAT
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div> */}

                {/* About Us */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.65,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href="/about"
                    className="text-white hover:text-yellow-400 text-xl font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.65,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href="/about"
                    className="text-white hover:text-yellow-400 text-xl font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    MBA
                  </Link>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href="/contact"
                    className="text-white hover:text-yellow-400 text-xl font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </motion.div>
              </nav>

              {/* <div className="mt-8 flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-800 bg-transparent"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Button>
                <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-400/90" onClick={() => setIsOpen(false)}>
                  Get Started
                </Button>
              </div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}