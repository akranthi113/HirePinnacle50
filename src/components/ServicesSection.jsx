import React from "react";
import { UserCheck, RefreshCw, GraduationCap, Building } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <UserCheck className="w-8 h-8 text-blue-600" />,
      title: "Permanent Staffing",
      description: "Secure long-term growth by onboarding full-time, vetted professionals tailored to match your company values and performance needs."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-indigo-500" />,
      title: "Contract Hiring",
      description: "Scale your staff dynamically with specialized project-based talent, giving you agility and control over seasonal and temporary milestones."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-emerald-500" />,
      title: "Fresher Recruitment",
      description: "Infuse fresh energy and new perspectives. We partner with universities to source talented entry-level candidates for your early projects."
    },
    {
      icon: <Building className="w-8 h-8 text-violet-500" />,
      title: "Executive Search",
      description: "Targeted, confidential leadership procurement. We identify, engage, and place board-ready executives and top-tier visionaries."
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Services</h2>
          <p className="mt-2 text-3xl font-extrabold text-navy-800 sm:text-4xl">
            What We Do
          </p>
          <div className="mt-4 h-1.5 w-16 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
            We deliver highly targeted staffing options across all layers of the organization, 
            ensuring growth matching, speed, and absolute confidentiality.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="bg-slate-50 group-hover:bg-blue-50 rounded-lg p-3 w-14 h-14 flex items-center justify-center border border-slate-100 mb-6 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-3 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
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
