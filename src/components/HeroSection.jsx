import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";

const HeroSection = ({ onLearnMoreClick }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-hero-pattern">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500 rounded-full filter blur-2xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="inline-flex items-center space-x-2 bg-blue-900/40 border border-blue-700/50 rounded-full px-3 py-1 mb-6 text-xs sm:text-sm text-blue-200">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <span>Empowering Careers & Staffing Excellence</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6">
          Find the Right Talent, <span className="text-blue-400">Faster.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
          HirePinnacle50 connects skilled professionals with the right opportunities 
          through a smart, streamlined recruitment process.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/apply"
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 group text-base"
          >
            Apply for a Job
            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={onLearnMoreClick}
            className="w-full sm:w-auto border border-slate-400 hover:border-white text-slate-200 hover:text-white hover:bg-white/5 font-semibold px-8 py-3.5 rounded-lg transition text-base"
          >
            Learn More
          </button>
        </div>

        {/* Floating statistics preview */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-700/50 pt-10">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-blue-400">500+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">Placed Candidates</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-blue-400">50+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">Hiring Partners</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-blue-400">10+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">Industries Served</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-blue-400">95%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">Client Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
