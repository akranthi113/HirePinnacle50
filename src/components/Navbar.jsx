import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Keep track of active section based on scroll position on the home page
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (location.pathname !== "/") return;

      const sections = ["home", "about", "services", "why-us", "how-it-works", "careers", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollToSection: sectionId } });
    }
  };

  // Listen to scrollToSection from other pages
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollToSection) {
      const sectionId = location.state.scrollToSection;
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isLinkActive = (sectionId) => {
    if (location.pathname !== "/") return false;
    return activeSection === sectionId;
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Careers", id: "careers" },
    { label: "Contact", id: "contact" }
  ];

  const isJobsRoute = location.pathname === "/jobs";
  const isBlogRoute = location.pathname.startsWith("/blog");

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glassmorphism border-b border-slate-200' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight flex items-center group">
              <span className="text-brand-primary mr-1 animate-pulse-glow">❖</span>
              <span>Place</span>
              <span className="text-brand-accent">IO</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-all hover:text-brand-primary py-2 relative group ${
                  isLinkActive(item.id) ? "text-brand-primary" : "text-slate-600"
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary transform origin-left transition-transform duration-300 ${isLinkActive(item.id) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
            ))}
            <Link
              to="/jobs"
              className={`text-sm font-medium transition-all hover:text-brand-primary py-2 relative group ${
                isJobsRoute ? "text-brand-primary" : "text-slate-600"
              }`}
            >
              Jobs
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary transform origin-left transition-transform duration-300 ${isJobsRoute ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
            <Link
              to="/blog"
              className={`text-sm font-medium transition-all hover:text-brand-primary py-2 relative group ${
                isBlogRoute ? "text-brand-primary" : "text-slate-600"
              }`}
            >
              Blog
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary transform origin-left transition-transform duration-300 ${isBlogRoute ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
          </div>

          {/* CTA / Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/apply" className="btn-primary">
              Apply Now
            </Link>

            {currentUser && !currentUser.isAnonymous ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <Link
                  to={userProfile?.role === "admin" ? "/admin" : "/dashboard"}
                  className="flex items-center text-slate-700 hover:text-slate-900 text-sm font-medium bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition"
                  title="Go to Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 p-2 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                Recruiter Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-md hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glassmorphism border-t border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition ${
                isLinkActive(item.id)
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-slate-200 flex flex-col space-y-3 px-2">
            <Link
              to="/jobs"
              onClick={() => setIsOpen(false)}
              className="bg-slate-100 text-slate-800 text-center font-medium py-3 rounded-md hover:bg-slate-200 transition"
            >
              Browse Jobs
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className="bg-slate-100 text-slate-800 text-center font-medium py-3 rounded-md hover:bg-slate-200 transition"
            >
              Our Blog
            </Link>
            <Link
              to="/apply"
              onClick={() => setIsOpen(false)}
              className="btn-primary text-center py-3"
            >
              Apply Now
            </Link>
            {currentUser && !currentUser.isAnonymous ? (
              <>
                <Link
                  to={userProfile?.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center text-slate-800 bg-slate-100 py-3 rounded-md font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center text-rose-400 bg-rose-500/10 py-3 rounded-md font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-slate-900 text-center py-3 rounded-md hover:bg-slate-100 transition border border-slate-200 text-sm font-medium"
              >
                Recruiter Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
