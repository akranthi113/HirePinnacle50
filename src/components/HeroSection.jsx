import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = ({ onLearnMoreClick }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-hero-pattern min-h-screen flex items-center">
      
      {/* Animated geometric background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/20 rounded-full filter blur-[100px] animate-pulse-glow mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-accent/20 rounded-full filter blur-[100px] animate-pulse-glow mix-blend-screen" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white w-full">
        <div className="animate-fade-in inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-8 text-xs sm:text-sm text-slate-200 border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
          <span className="font-medium tracking-wide uppercase text-[11px]">The Future of Smart Placement</span>
        </div>
        
        <h1 className="animate-slide-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8">
          Accelerate your <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-400 to-brand-accent">
            career growth.
          </span>
        </h1>
        
        <p className="animate-slide-up max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed font-light" style={{ animationDelay: '0.1s' }}>
          PlaceIO bridges the gap between extraordinary talent and world-class opportunities through our intelligent, data-driven recruitment ecosystem.
        </p>
        
        <div className="animate-slide-up flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/apply"
            className="w-full sm:w-auto flex items-center justify-center btn-primary text-lg px-8 py-4 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          >
            Find Opportunities
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={onLearnMoreClick}
            className="w-full sm:w-auto glassmorphism hover:bg-white/10 text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 text-lg border border-white/20"
          >
            Hire Talent
          </button>
        </div>

        {/* Floating statistics preview */}
        <div className="animate-slide-up mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto glassmorphism rounded-2xl p-8 border border-white/10 relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-brand-primary to-blue-300">5k+</p>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">Placements</p>
          </div>
          <div className="relative z-10">
            <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-brand-accent to-emerald-300">200+</p>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">Partners</p>
          </div>
          <div className="relative z-10">
            <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-brand-primary to-blue-300">98%</p>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">Success Rate</p>
          </div>
          <div className="relative z-10">
            <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-brand-accent to-emerald-300">24/7</p>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
