import React from "react";
import { UserCheck, RefreshCw, GraduationCap, Building } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <UserCheck className="w-8 h-8 text-brand-primary" />,
      title: "Permanent Placement",
      description: "Secure core team members with our extensive vetting process, ensuring long-term retention and immediate impact."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-blue-400" />,
      title: "Agile Contracting",
      description: "Scale your engineering and product teams dynamically with pre-vetted contractors ready to deploy in 48 hours."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-brand-accent" />,
      title: "Early Career",
      description: "Partner with top-tier universities globally to source high-potential graduates for your junior and associate roles."
    },
    {
      icon: <Building className="w-8 h-8 text-purple-400" />,
      title: "Executive Search",
      description: "Discreet, highly-targeted procurement of board-ready executives and C-suite leaders who drive organizational vision."
    }
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-white">
      {/* Decorative gradient mesh */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-brand-primary/5 via-brand-accent/5 to-transparent rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-brand-primary font-semibold tracking-widest uppercase mb-4 text-sm">Our Ecosystem</h2>
          <p className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Comprehensive Solutions
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-brand-primary to-brand-accent mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
            From scaling engineering squads to securing your next CTO, PlaceIO provides modular recruitment solutions tailored to modern tech enterprises.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="glassmorphism glassmorphism-hover rounded-2xl p-8 group relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
              
              <div className="bg-slate-50 rounded-xl p-4 w-16 h-16 flex items-center justify-center border border-slate-200 mb-8 group-hover:bg-brand-primary/10 transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
