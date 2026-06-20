import React from "react";
import { Target, Zap, ShieldCheck } from "lucide-react";

const AboutSection = () => {
  const cards = [
    {
      icon: <Target className="w-8 h-8 text-brand-primary" />,
      title: "Precision Matching",
      description: "Our algorithms and expert curators ensure candidates perfectly align with your technical requirements and culture."
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "Accelerated Hiring",
      description: "Streamlined pipelines cut time-to-hire by 40%. Go from application to offer in days, not months."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-accent" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption protects candidate data and proprietary company information at every step."
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-darker via-brand-dark to-brand-darker z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm text-brand-primary font-medium tracking-wide">
            <span>Discover PlaceIO</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Redefining Talent Acquisition
          </h2>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
            PlaceIO is more than a recruitment platform. It's an intelligent ecosystem designed to connect visionary companies with the top 1% of global talent through data-driven matching.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="glassmorphism glassmorphism-hover rounded-2xl p-8 relative overflow-hidden group"
            >
              {/* Decorative background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-16 h-16 flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-wide">{card.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed font-light">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
