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

          const recruiterStatus = await isRecruiter(supabase);
          const companyStatus = await isCompanyAdmin(supabase);

          setIsRecruiterUser(recruiterStatus);
          setIsCompanyUser(companyStatus);

          let companyProfile = null;

          if (companyStatus) {
            const { data: adminCompanyData, error: companyError } =
              await supabase
                .from("companies")
                .select("*")
                .eq("user_id", session.user.id)
                .single();

            if (!companyError) {
              companyProfile = adminCompanyData;
            }
          }

          if (recruiterStatus) {
            const { data: recruiterProfile } = await supabase
              .from("recruiter_profiles")
              .select("full_name")
              .eq("id", session.user.id)
              .single();
            setHasCompletedProfile(!!recruiterProfile?.full_name);
          } else if (companyStatus) {
            setHasCompletedProfile(!!companyProfile?.company_name);
          } else {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", session.user.id)
              .single();
            setHasCompletedProfile(!!profile?.full_name);
          }
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
          setIsRecruiterUser(false);
          setIsCompanyUser(false);
          setHasCompletedProfile(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
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
      setScrolled(offset > 50);

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
    handleScroll();

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
      const yOffset = -80;
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

  const Spinner = () => (
    <div className="flex items-center justify-center w-8 h-8">
      <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "py-3 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.04]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-20 group">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Image
                src="/logo.png"
                alt="HireVision Logo"
                width={scrolled ? 75 : 85}
                height={scrolled ? 30 : 35}
                className="rounded-md transition-all duration-300"
                priority
              />
              <div className="absolute -inset-2 bg-amber-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Nav Pills Container */}
            <div className="relative flex items-center p-1 bg-white/[0.03] backdrop-blur-sm rounded-full border border-white/[0.04]">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
                    activeItem === item.key
                      ? "text-white"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                  aria-current={activeItem === item.key ? "page" : undefined}
                >
                  {activeItem === item.key && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-500/10 rounded-full border border-amber-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center ml-6 gap-3">
              {loading ? (
                <Spinner />
              ) : isLoggedIn ? (
                <div className="relative">
                  <motion.button
                    id="user-avatar"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-haspopup="menu"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <span className="text-white text-sm font-semibold">
                        {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <motion.svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ rotate: userDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        id="user-dropdown"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-3 w-72 bg-[#0f0f0f]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-white/[0.06] overflow-hidden"
                        tabIndex={-1}
                        role="menu"
                        aria-label="User menu"
                      >
                        {/* User Info Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-white/[0.04]">
                          <p className="text-sm text-white font-medium truncate">
                            {userEmail}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/20">
                              {isCompanyUser
                                ? "Company"
                                : isRecruiterUser
                                  ? "Recruiter"
                                  : "Candidate"}
                            </span>
                          </div>
                        </div>

                        {/* Profile Status */}
                        <div className="px-5 py-3 border-b border-white/[0.04]">
                          <div
                            className={`text-sm flex items-center gap-2 ${
                              hasCompletedProfile
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${hasCompletedProfile ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
                            {hasCompletedProfile
                              ? "Profile Complete"
                              : "Profile Incomplete"}
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href={
                              isCompanyUser
                                ? "/companies"
                                : isRecruiterUser
                                  ? "/recruiters"
                                  : "/candidates"
                            }
                            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5 text-neutral-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            Dashboard
                          </Link>

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => handleAuthClick("login")}
                    className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Log In
                  </motion.button>
                  <motion.button
                    onClick={() => handleAuthClick("signup")}
                    className="relative px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-500 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.06]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center">
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full origin-left"
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? -1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full"
                animate={{ opacity: mobileMenuOpen ? 0 : 1, scaleX: mobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full origin-left"
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-2xl flex flex-col"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ delay: 0.1 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.06] text-white"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Mobile Nav Content */}
            <div className="flex flex-col items-center justify-center flex-1 gap-2 px-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  onClick={() => scrollToSection(item.key)}
                  className={`text-2xl font-medium px-8 py-3 rounded-2xl transition-all duration-300 ${
                    activeItem === item.key
                      ? "text-white bg-white/[0.04]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* User Section in Mobile */}
              {isLoggedIn && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-sm mt-8 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.04] p-5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <span className="text-white text-lg font-semibold">
                        {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium truncate max-w-[180px]">
                        {userEmail}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/20 mt-1">
                        {isCompanyUser
                          ? "Company"
                          : isRecruiterUser
                            ? "Recruiter"
                            : "Candidate"}
                      </span>
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
                    className="block w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium rounded-xl transition-colors text-center mb-2 border border-white/[0.04]"
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="block w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors text-center border border-red-500/10"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}

              {/* Auth Buttons for Mobile */}
              {!isLoggedIn && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-3 w-full max-w-sm mt-8"
                >
                  <button
                    onClick={() => handleAuthClick("login")}
                    className="w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium rounded-xl transition-colors border border-white/[0.06]"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleAuthClick("signup")}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-amber-500/25"
                  >
                    Get Started
                  </button>
                </motion.div>
              )}

              {/* Quick Links */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 mt-8"
              >
                <Link
                  href="/recruiters"
                  className="px-6 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-full text-amber-400 text-sm font-medium transition-colors border border-amber-500/20"
                >
                  For Recruiters
                </Link>
                <Link
                  href="/candidates"
                  className="px-6 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-full text-white text-sm font-medium transition-colors border border-white/[0.06]"
                >
                  For Candidates
                </Link>
              </motion.div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className="bg-[#0f0f0f]/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 max-w-md w-full mx-auto overflow-hidden border border-white/[0.06]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-white/[0.04] bg-gradient-to-r from-amber-500/10 to-transparent">
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                  {authMode === "login" ? "Welcome Back" : "Get Started"}
                </h3>
                <p className="text-neutral-400 mt-1">Choose how you&apos;d like to continue</p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-3">
                {/* Candidate Option */}
                <motion.button
                  onClick={() => handleUserTypeSelect("candidate")}
                  className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-amber-500/20 transition-all duration-300 p-5 rounded-2xl flex items-center gap-4 group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                    <svg
                      className="w-7 h-7 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-medium text-white">Candidate</h4>
                    <p className="text-sm text-neutral-400">
                      Find jobs and ace your interviews
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>

                {/* Recruiter Option */}
                <motion.button
                  onClick={() => handleUserTypeSelect("recruiter")}
                  className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-amber-500/20 transition-all duration-300 p-5 rounded-2xl flex items-center gap-4 group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                    <svg
                      className="w-7 h-7 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-medium text-white">Recruiter</h4>
                    <p className="text-sm text-neutral-400">
                      Post jobs and evaluate candidates
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>

                {/* Company Option */}
                <motion.button
                  onClick={() => handleUserTypeSelect("company")}
                  className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-amber-500/20 transition-all duration-300 p-5 rounded-2xl flex items-center gap-4 group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                    <svg
                      className="w-7 h-7 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-medium text-white">Company</h4>
                    <p className="text-sm text-neutral-400">
                      Manage your organization
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-4 bg-white/[0.01] border-t border-white/[0.04] flex justify-end">
                <button
                  onClick={() => setUserTypeModalOpen(false)}
                  className="px-5 py-2 text-neutral-400 hover:text-white text-sm font-medium transition-colors"
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
