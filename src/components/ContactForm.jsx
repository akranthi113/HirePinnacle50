import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { addContactMessage } from "../firebase/firestore";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setStatus({ submitting: false, success: false, error: "Please fill in all fields." });
      return;
    }

    setStatus({ submitting: true, success: false, error: "" });

    try {
      const { id, error } = await addContactMessage(formData);
      if (error) {
        throw new Error(error);
      }

      setStatus({ submitting: false, success: true, error: "" });
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message || "Failed to submit your message." });
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Side */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <h2 className="text-base text-brand-primary font-semibold tracking-wide uppercase">Contact</h2>
              <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Get In Touch
              </p>
              <div className="mt-4 h-1.5 w-12 bg-brand-primary rounded-full mb-8"></div>
              <p className="text-slate-600 leading-relaxed font-light mb-8">
                Have open roles or looking for a custom staffing solution? Or perhaps you have a career query? 
                Reach out to us and our PlaceIO recruiters will get back to you shortly.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-lg mr-4">
                  <Mail className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email Us</h4>
                  <p className="text-brand-primary text-sm hover:underline mt-0.5">
                    <a href="mailto:contact@placeio.com">contact@placeio.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-lg mr-4">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Call Us</h4>
                  <p className="text-slate-600 text-sm mt-0.5">+91 80 4920 1800</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-lg mr-4">
                  <MapPin className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Our Office</h4>
                  <p className="text-slate-600 text-sm mt-0.5 leading-relaxed">
                    PlaceIO, 4th Block, Koramangala,<br />
                    Bangalore, Karnataka 560034, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Send Us A Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write details of your query..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                ></textarea>
              </div>

              {status.error && (
                <div className="text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-100 p-3 rounded-lg">
                  {status.error}
                </div>
              )}

              {status.success && (
                <div className="flex items-center text-emerald-700 text-sm font-semibold bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                    Your message was sent successfully. Our recruiters will contact you shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={status.submitting}
                className="w-full sm:w-auto btn-primary text-sm px-6 py-3 shadow-sm hover:shadow hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-50"
              >
                {status.submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
