import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Keep track of active section based on scroll position on the home page
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-navy-800 tracking-tight flex items-center">
              <span className="bg-navy-800 text-white px-2.5 py-1 rounded-md mr-1.5 font-extrabold text-sm tracking-wider">Hire</span>
              <span>Pinnacle50</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors hover:text-navy-800 py-1 ${
                  isLinkActive(item.id)
                    ? "text-navy-800 border-b-2 border-navy-800"
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA / Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/apply"
              className="bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-sm hover:shadow transition-all duration-150"
            >
              Apply Now
            </Link>

            {currentUser && !currentUser.isAnonymous ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <Link
                  to={userProfile?.role === "admin" ? "/admin" : "/dashboard"}
                  className="flex items-center text-slate-700 hover:text-navy-800 text-sm font-medium bg-slate-100 px-3 py-2 rounded-md transition"
                  title="Go to Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-md transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-slate-500 hover:text-navy-800 text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-50 transition"
              >
                Recruiter Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-navy-800 focus:outline-none p-2 rounded-md hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                isLinkActive(item.id)
                  ? "bg-slate-100 text-navy-800"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col space-y-2 px-3">
            <Link
              to="/apply"
              onClick={() => setIsOpen(false)}
              className="bg-navy-800 text-white text-center font-semibold py-2.5 rounded-md"
            >
              Apply Now
            </Link>
            {currentUser && !currentUser.isAnonymous ? (
              <>
                <Link
                  to={userProfile?.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center text-slate-700 bg-slate-100 py-2.5 rounded-md font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center text-rose-600 bg-rose-50 py-2.5 rounded-md font-semibold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-navy-800 text-center py-2.5 rounded-md hover:bg-slate-50 transition border border-slate-200 text-sm font-semibold"
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
