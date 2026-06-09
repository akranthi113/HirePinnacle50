import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Linkedin, Instagram, Phone, MessageSquare } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    navigate("/", { state: { scrollToSection: sectionId } });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md mr-1.5 font-extrabold text-sm tracking-wider">Hire</span>
              <span>Pinnacle50</span>
            </Link>
            <p className="mt-4 text-slate-400 max-w-sm text-sm leading-relaxed">
              Connecting Talent with Opportunity. HirePinnacle50 is a professional recruitment 
              and staffing solutions partner committed to accelerating your career or business growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNavClick("home")} className="hover:text-white transition">Home</button>
              </li>
              <li>
                <button onClick={() => handleNavClick("about")} className="hover:text-white transition">About Us</button>
              </li>
              <li>
                <button onClick={() => handleNavClick("services")} className="hover:text-white transition">Services</button>
              </li>
              <li>
                <Link to="/apply" className="hover:text-white transition">Apply for Jobs</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Recruiter Login</Link>
              </li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-5">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition text-slate-400 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition text-slate-400 hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition text-slate-400 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link> | <span className="cursor-pointer hover:underline" onClick={() => handleNavClick("contact")}>Contact Support</span>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2025 HirePinnacle50. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">Recruitment & Staffing Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
