"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/auth";
import { isRecruiter, isCompanyAdmin } from "@/utils/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userTypeModalOpen, setUserTypeModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // User auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isRecruiterUser, setIsRecruiterUser] = useState(false);
  const [isCompanyUser, setIsCompanyUser] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle auth button clicks
  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setUserTypeModalOpen(true);
  };

  // Handle user type selection
  const handleUserTypeSelect = (
    type: "candidate" | "recruiter" | "company"
  ) => {
    setUserTypeModalOpen(false);
    if (type === "recruiter") {
      router.push(
        authMode === "login" ? "/recruiters/login" : "/recruiters/signup"
      );
    } else if (type === "company") {
      router.push(
        authMode === "login" ? "/companies/login" : "/companies/signup"
      );
    } else {
      router.push(authMode === "login" ? "/login" : "/signup");
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userTypeModalOpen) {
        const target = event.target as HTMLElement;
        // Only close if clicking on the backdrop (the element with modal-backdrop class)
        if (target.classList.contains("modal-backdrop")) {
          setUserTypeModalOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userTypeModalOpen]);

  useEffect(() => {
    // Check authentication status and profile completeness
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setIsLoggedIn(true);
          setUserEmail(session.user.email || null);

          // Check user roles
          const recruiterStatus = await isRecruiter(supabase);
          const companyStatus = await isCompanyAdmin(supabase); // This checks the role

          setIsRecruiterUser(recruiterStatus);
          setIsCompanyUser(companyStatus); // Directly use the role status

          let companyProfile = null;

          // Fetch company profile ONLY if the user is a company admin
          if (companyStatus) {
            console.log(
              "Fetching company profile for user ID:",
              session.user.id
            );

            const { data: adminCompanyData, error: companyError } =
              await supabase
                .from("companies")
                .select("*")
                .eq("user_id", session.user.id) // Fetch using the admin's user_id
                .single();

            if (companyError) {
              console.error("Error fetching company profile:", companyError);

              // Try logging the full error object and code
              console.error("Error code:", companyError.code);
              console.error("Error message:", companyError.message);
              console.error("Error details:", companyError.details);

              // Check if the error is because no rows were returned
              if (companyError.code === "PGRST116") {
                console.log(
                  "No company profile found - may need to be created"
                );
                // We could redirect to company profile creation here if needed
              }
            } else {
              console.log(
                "Successfully fetched company profile:",
                adminCompanyData
              );
              companyProfile = adminCompanyData;
            }
          }

          // Check profile completeness based on user type
          if (recruiterStatus) {
            // Check recruiter profile
            const { data: recruiterProfile } = await supabase
              .from("recruiter_profiles")
              .select("full_name") // Only select necessary field
              .eq("id", session.user.id)
              .single();
            setHasCompletedProfile(!!recruiterProfile?.full_name);
          } else if (companyStatus) {
            // Company profile completeness depends on the fetched companyProfile
            setHasCompletedProfile(!!companyProfile?.company_name);
          } else {
            // Check candidate profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name") // Only select necessary field
              .eq("id", session.user.id)
              .single();
            setHasCompletedProfile(!!profile?.full_name);
          }
        } else {
          // Reset states if no session
          setIsLoggedIn(false);
          setUserEmail(null);
          setIsRecruiterUser(false);
          setIsCompanyUser(false);
          setHasCompletedProfile(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Reset states on error
        setIsLoggedIn(false);
        setUserEmail(null);
        setIsRecruiterUser(false);
        setIsCompanyUser(false);
        setHasCompletedProfile(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // Update scrolled state based on scroll position
      setScrolled(offset > 50);

      // Determine which section is currently in view
      const sections = ["features", "how-it-works", "testimonials", "faq"];
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveItem(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { key: "features", label: "Features" },
    { key: "how-it-works", label: "How It Works" },
    { key: "testimonials", label: "Testimonials" },
    { key: "faq", label: "FAQ" },
  ];

  const scrollToSection = (key: string) => {
    setActiveItem(key);
    const element = document.getElementById(key);
    if (element) {
      const yOffset = -80; // Offset for the fixed navbar
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownOpen) {
        const target = event.target as HTMLElement;
        if (
          !target.closest("#user-dropdown") &&
          !target.closest("#user-avatar")
        ) {
          setUserDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${scrolled
            ? "h-16 bg-[#0D1321]/70 backdrop-blur-md shadow-sm"
            : "h-20 bg-transparent"
          }`}
      >
        <div className="max-w-screen-xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-20">
            <div className="transition-all duration-300 flex items-center">
              <Image
                src="/logo.png"
                alt="HireVision Logo"
                width={scrolled ? 110 : 130}
                height={scrolled ? 28 : 33}
                className="rounded-md"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative py-1 px-2 bg-[#1A2333]/0 rounded-full transition-all duration-300 ease-in-out">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={`relative px-4 py-2 text-sm transition-colors duration-200 ${activeItem === item.key
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                    }`}
                >
                  {activeItem === item.key && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 bg-[#F48C06]/10 rounded-full"
                      style={{ borderRadius: 9999 }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            {/* User Avatar (Desktop) */}
            {isLoggedIn && !loading && (
              <div className="relative ml-6">
                <button
                  id="user-avatar"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F48C06]"
                >
                  <span className="text-white font-bold">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
                  </span>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700"
                  >
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-white font-medium truncate">
                        {userEmail}
                      </p>
                      <p className="text-xs text-gray-400">
                        Role:{" "}
                        {isCompanyUser
                          ? "Company"
                          : isRecruiterUser
                            ? "Recruiter"
                            : "Candidate"}
                      </p>
                    </div>

                    <div className="px-4 py-2 border-b border-gray-700">
                      <div
                        className={`text-sm flex items-center ${hasCompletedProfile
                            ? "text-green-400"
                            : "text-yellow-400"
                          }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {hasCompletedProfile ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          )}
                        </svg>
                        {hasCompletedProfile
                          ? "Profile Complete"
                          : "Profile Incomplete"}
                      </div>
                    </div>

                    <div className="px-2 py-2">
                      <Link
                        href={
                          isCompanyUser
                            ? "/companies"
                            : isRecruiterUser
                              ? "/recruiters"
                              : "/candidates"
                        }
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-2 opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Dashboard
                        </div>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-2 opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show login/signup buttons when not logged in */}
            {!isLoggedIn && !loading && (
              <div className="flex items-center ml-4 space-x-2">
                <button
                  onClick={() => handleAuthClick("login")}
                  className="px-4 py-1 text-sm text-white/80 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick("signup")}
                  className="px-4 py-1.5 bg-[#F48C06] hover:bg-[#F48C06]/90 text-white text-sm rounded-full transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-20 p-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#F48C06]/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-between items-center">
              <span
                className={`w-5 h-0.5 bg-white rounded-full transform transition-all duration-300 origin-left ${mobileMenuOpen ? "rotate-45 translate-x-px" : ""
                  }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transform transition-all duration-300 origin-left ${mobileMenuOpen ? "-rotate-45 translate-x-px" : ""
                  }`}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-gradient-to-b from-[#0D1321] to-[#1A2333]/95 backdrop-blur-lg flex flex-col pt-20"
          >
            <div className="flex flex-col items-center gap-6 pt-10">
              {navItems.map((item) => (
                <motion.button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className="text-lg font-light px-8 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className={
                      activeItem === item.key ? "text-[#F48C06]" : "text-white"
                    }
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}

              {/* User info in mobile menu */}
              {isLoggedIn && !loading && (
                <div className="w-full max-w-[90%] mx-auto mt-4 bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium truncate">
                        {userEmail}
                      </p>
                      <p className="text-xs text-gray-400">
                        {isCompanyUser
                          ? "Company"
                          : isRecruiterUser
                            ? "Recruiter"
                            : "Candidate"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={
                      isCompanyUser
                        ? "/companies"
                        : isRecruiterUser
                          ? "/recruiters"
                          : "/candidates"
                    }
                    className="block w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-white text-sm rounded-md transition-colors text-center mb-2"
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="block w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-md transition-colors text-center"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* Login/signup buttons for mobile */}
              {!isLoggedIn && !loading && (
                <>
                  <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-gray-600/30 to-transparent my-4" />
                  <div className="flex flex-col gap-3 w-[90%] max-w-[250px]">
                    <button
                      onClick={() => handleAuthClick("login")}
                      className="w-full py-2.5 border border-gray-600 text-white text-center text-sm rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleAuthClick("signup")}
                      className="w-full py-2.5 bg-[#F48C06] hover:bg-[#F48C06]/90 text-white text-center text-sm rounded-md transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
              {!isLoggedIn && !loading && (
                <div className="flex items-center ml-4 space-x-2">
                  <button
                    onClick={() => handleAuthClick("login")}
                    className="px-4 py-1 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleAuthClick("signup")}
                    className="px-4 py-1.5 bg-[#F48C06] hover:bg-[#F48C06]/90 text-white text-sm rounded-full transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => router.push("/companies/login")}
                    className="px-4 py-1 text-sm text-white/80 hover:text-white transition-colors border border-gray-600 rounded-md"
                  >
                    Companies
                  </button>
                </div>
              )}
              <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-gray-600/30 to-transparent my-4" />
              <div className="flex gap-4 mt-4">
                <Link
                  href="/recruiters"
                  className="px-6 py-2 bg-[#F48C06]/90 hover:bg-[#F48C06] rounded-full text-white text-sm font-medium transition-colors duration-300"
                >
                  For Recruiters
                </Link>
                <Link
                  href="/candidates"
                  className="px-6 py-2 border border-[#F48C06]/50 hover:border-[#F48C06] rounded-full text-[#F48C06] text-sm font-medium transition-colors duration-300"
                >
                  For Candidates
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Type Selection Modal */}
      <AnimatePresence>
        {userTypeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">
                  {authMode === "login" ? "Log In" : "Sign Up"} as
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-300">
                  Please select how you want to continue
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleUserTypeSelect("candidate")}
                    className="bg-[#1A2333] hover:bg-[#232D40] transition-colors p-5 rounded-lg flex flex-col items-center"
                  >
                    <div className="bg-blue-500/20 p-3 rounded-full mb-3">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-white">
                      Candidate
                    </h4>
                    <p className="text-sm text-gray-400 mt-1 text-center">
                      Find jobs and practice interviews
                    </p>
                  </button>

                  <button
                    onClick={() => handleUserTypeSelect("recruiter")}
                    className="bg-[#1A2333] hover:bg-[#232D40] transition-colors p-5 rounded-lg flex flex-col items-center"
                  >
                    <div className="bg-[#F48C06]/20 p-3 rounded-full mb-3">
                      <svg
                        className="w-8 h-8 text-[#F48C06]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-white">
                      Recruiter
                    </h4>
                    <p className="text-sm text-gray-400 mt-1 text-center">
                      Post jobs and evaluate candidates
                    </p>
                  </button>

                  <button
                    onClick={() => handleUserTypeSelect("company")}
                    className="bg-[#1A2333] hover:bg-[#232D40] transition-colors p-5 rounded-lg flex flex-col items-center"
                  >
                    <div className="bg-green-500/20 p-3 rounded-full mb-3">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 21V9h18v12M3 9l9-7 9 7"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-white">Company</h4>
                    <p className="text-sm text-gray-400 mt-1 text-center">
                      Manage your company and post jobs
                    </p>
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-900/40 flex justify-end">
                <button
                  onClick={() => setUserTypeModalOpen(false)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
