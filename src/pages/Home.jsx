import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import ContactForm from "../components/ContactForm";
import { Award, Briefcase, Smile, Building, ArrowRight } from "lucide-react";

const Home = () => {
  const handleLearnMore = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home-page" className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection onLearnMoreClick={handleLearnMore} />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Value Proposition</h2>
            <p className="mt-2 text-3xl font-extrabold text-navy-800 sm:text-4xl">
              Why HirePinnacle50?
            </p>
            <div className="mt-4 h-1.5 w-16 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-xl text-center group hover:bg-slate-900 hover:text-white transition-all duration-300">
              <div className="bg-white group-hover:bg-slate-800 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-slate-100 transition-colors">
                <Briefcase className="w-6 h-6 text-blue-600 group-hover:text-blue-400" />
              </div>
              <p className="text-4xl font-extrabold text-navy-800 group-hover:text-white transition-colors">500+</p>
              <p className="text-slate-500 group-hover:text-slate-400 text-xs font-semibold uppercase mt-2 tracking-wider">Candidates Placed</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-xl text-center group hover:bg-slate-900 hover:text-white transition-all duration-300">
              <div className="bg-white group-hover:bg-slate-800 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-slate-100 transition-colors">
                <Building className="w-6 h-6 text-indigo-500 group-hover:text-indigo-400" />
              </div>
              <p className="text-4xl font-extrabold text-navy-800 group-hover:text-white transition-colors">50+</p>
              <p className="text-slate-500 group-hover:text-slate-400 text-xs font-semibold uppercase mt-2 tracking-wider">Hiring Partners</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-xl text-center group hover:bg-slate-900 hover:text-white transition-all duration-300">
              <div className="bg-white group-hover:bg-slate-800 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-slate-100 transition-colors">
                <Award className="w-6 h-6 text-violet-500 group-hover:text-violet-400" />
              </div>
              <p className="text-4xl font-extrabold text-navy-800 group-hover:text-white transition-colors">10+</p>
              <p className="text-slate-500 group-hover:text-slate-400 text-xs font-semibold uppercase mt-2 tracking-wider">Industries Served</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-xl text-center group hover:bg-slate-900 hover:text-white transition-all duration-300">
              <div className="bg-white group-hover:bg-slate-800 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-slate-100 transition-colors">
                <Smile className="w-6 h-6 text-emerald-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-4xl font-extrabold text-navy-800 group-hover:text-white transition-colors">95%</p>
              <p className="text-slate-500 group-hover:text-slate-400 text-xs font-semibold uppercase mt-2 tracking-wider">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Process Works */}
      <HowItWorks />

      {/* Careers Section */}
      <section id="careers" className="py-20 bg-hero-pattern text-white relative overflow-hidden">
        {/* Subtle geometric circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full border-4 border-slate-400 -translate-y-1/2 -translate-x-1/3"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full border-4 border-slate-400 -translate-y-1/2 translate-x-1/3"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Looking for Your Next Opportunity?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl mx-auto font-light">
            Browse open roles or submit your profile and our recruiters will reach out 
            when a matching position opens.
          </p>
          <div className="flex justify-center">
            <Link
              to="/apply"
              className="bg-white hover:bg-slate-100 text-navy-800 font-bold px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition flex items-center text-sm uppercase tracking-wider group"
            >
              Apply Now
              <ArrowRight className="w-4.5 h-4.5 ml-2 text-navy-800 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
};

export default Home;
