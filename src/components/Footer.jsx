import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Linkedin, Instagram, Phone, MessageSquare } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    navigate("/", { state: { scrollToSection: sectionId } });
  };

  return (
    <footer className="bg-brand-darker text-slate-300 border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Tagline */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center">
              <span className="text-brand-primary mr-1">❖</span>
              <span>Place</span>
              <span className="text-brand-accent">IO</span>
            </Link>
            <p className="mt-6 text-slate-400 max-w-sm text-sm leading-relaxed">
              Connecting top talent with extraordinary opportunities. PlaceIO is your intelligent partner for modern recruitment and career advancement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => handleNavClick("home")} className="text-slate-400 hover:text-brand-primary transition">Home</button>
              </li>
              <li>
                <button onClick={() => handleNavClick("about")} className="text-slate-400 hover:text-brand-primary transition">About Us</button>
              </li>
              <li>
                <button onClick={() => handleNavClick("services")} className="text-slate-400 hover:text-brand-primary transition">Services</button>
              </li>
              <li>
                <Link to="/apply" className="text-slate-400 hover:text-brand-primary transition">Apply for Jobs</Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-brand-primary transition">Recruiter Login</Link>
              </li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">Connect</h3>
            <div className="flex space-x-4 mb-8">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-white/5 hover:bg-brand-primary/20 p-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-brand-primary border border-white/5 hover:border-brand-primary/30"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-white/5 hover:bg-brand-accent/20 p-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-brand-accent border border-white/5 hover:border-brand-accent/30"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-white/5 hover:bg-pink-500/20 p-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-pink-500 border border-white/5 hover:border-pink-500/30"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              <Link to="/privacy-policy" className="hover:text-slate-300 transition">Privacy Policy</Link> | <span className="cursor-pointer hover:text-slate-300 transition" onClick={() => handleNavClick("contact")}>Contact Support</span>
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PlaceIO. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">Smart Placement & Recruitment</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
