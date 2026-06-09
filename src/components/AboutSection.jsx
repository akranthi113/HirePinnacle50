import React from "react";
import { Target, Zap, ShieldCheck } from "lucide-react";

const AboutSection = () => {
  const cards = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Targeted Hiring",
      description: "We match the right candidate to the right role with precision, understanding unique job requirements and cultural fits."
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Fast Process",
      description: "From application submission to coordinating interviews, our system streamlines the path in days, not weeks."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "Secure & Confidential",
      description: "Your personal details and resumes are safely encrypted, protecting candidate privacy and company security protocols."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Who We Are</h2>
          <p className="mt-2 text-3xl font-extrabold text-navy-800 sm:text-4xl">
            About HirePinnacle50
          </p>
          <div className="mt-4 h-1.5 w-16 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed font-light">
            HirePinnacle50 is a professional recruitment and staffing solutions company. 
            We specialize in identifying, evaluating, and placing top talent across industries. 
            Our technology-driven platform ensures a seamless experience for both candidates and recruiters.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 border border-slate-100 rounded-xl p-8 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="bg-white rounded-lg p-3 w-14 h-14 flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-navy-800 mb-3">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
