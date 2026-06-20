import React from "react";
import { FileText, Eye, Video, UserCheck, ChevronRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: <FileText className="w-6 h-6 text-brand-primary" />,
      title: "Submit Application",
      description: "Upload your professional resume and fill in your details on our secure applicant page."
    },
    {
      step: "02",
      icon: <Eye className="w-6 h-6 text-amber-500" />,
      title: "Profile Review",
      description: "Our recruitment experts review your profile against active and upcoming mandates."
    },
    {
      step: "03",
      icon: <Video className="w-6 h-6 text-indigo-500" />,
      title: "Interview Coordination",
      description: "We handle scheduling and preparation check-ins between you and the client team."
    },
    {
      step: "04",
      icon: <UserCheck className="w-6 h-6 text-emerald-500" />,
      title: "Placement & Onboarding",
      description: "Receive contract details, join your new company, and kickstart onboarding."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-base text-brand-primary font-semibold tracking-wide uppercase">The Journey</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            How Our Recruitment Process Works
          </p>
          <div className="mt-4 h-1.5 w-16 bg-brand-primary mx-auto rounded-full"></div>
        </div>

        {/* Process Flow Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {steps.map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center px-4 group">
                {/* Step circle */}
                <div className="relative bg-white rounded-full p-5 w-16 h-16 flex items-center justify-center shadow-sm border border-slate-200 mb-6 group-hover:border-brand-primary transition-colors duration-300">
                  {item.icon}
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-xs font-extrabold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                  {item.description}
                </p>

                {/* Arrow connector */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full transform translate-x-8 text-slate-300 pointer-events-none">
                    <ChevronRight className="w-6 h-6 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
