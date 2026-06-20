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
    <div id="home-page" className="overflow-hidden bg-brand-light">
      {/* Hero Section */}
      <HeroSection onLearnMoreClick={handleLearnMore} />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-24 relative overflow-hidden bg-brand-light border-y border-slate-200">
        {/* Subtle geometric circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full border border-brand-primary -translate-y-1/2 -translate-x-1/3"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full border border-brand-accent -translate-y-1/2 translate-x-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm text-brand-primary font-semibold tracking-widest uppercase">Value Proposition</h2>
            <p className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900">
              Why PlaceIO?
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-brand-primary to-brand-accent mx-auto rounded-full"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glassmorphism glassmorphism-hover p-8 rounded-2xl text-center group">
              <div className="bg-slate-50 group-hover:bg-brand-primary/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-slate-200 transition-all duration-300">
                <Briefcase className="w-8 h-8 text-brand-primary group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">500+</p>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest">Candidates Placed</p>
            </div>

            <div className="glassmorphism glassmorphism-hover p-8 rounded-2xl text-center group">
              <div className="bg-slate-50 group-hover:bg-indigo-500/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-slate-200 transition-all duration-300">
                <Building className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">50+</p>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest">Hiring Partners</p>
            </div>

            <div className="glassmorphism glassmorphism-hover p-8 rounded-2xl text-center group">
              <div className="bg-slate-50 group-hover:bg-purple-500/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-slate-200 transition-all duration-300">
                <Award className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">10+</p>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest">Industries Served</p>
            </div>

            <div className="glassmorphism glassmorphism-hover p-8 rounded-2xl text-center group">
              <div className="bg-slate-50 group-hover:bg-brand-accent/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-slate-200 transition-all duration-300">
                <Smile className="w-8 h-8 text-brand-accent group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">95%</p>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Process Works */}
      <HowItWorks />

      {/* Careers Section */}
      <section id="careers" className="py-32 relative overflow-hidden bg-slate-50 border-t border-slate-200">
        {/* Dynamic mesh gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full filter blur-[120px] -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-brand-accent/10 rounded-full filter blur-[120px] -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
            Ready for your next move?
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            Join the PlaceIO network. Let our intelligent matching algorithms connect you with roles that accelerate your trajectory.
          </p>
          <div className="flex justify-center">
            <Link
              to="/apply"
              className="btn-primary flex items-center text-lg px-10 py-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
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
