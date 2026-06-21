import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Apply from "./pages/Apply";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import JobDetails from "./pages/JobDetails";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import BlogForm from "./components/BlogForm";
import TrackApplication from "./pages/TrackApplication";

const NotFound = () => (
  <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div className="text-center max-w-md">
      <h1 className="text-6xl font-extrabold text-slate-900 mb-4">404</h1>
      <p className="text-lg text-slate-600 mb-8 font-light">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn-primary px-6 py-2.5 rounded-lg shadow-sm transition inline-block">
        Back to Home
      </Link>
    </div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-navy-800 mb-6">Privacy Policy</h1>
      <p className="text-xs text-slate-400 mb-4 font-mono">Last Updated: June 2026</p>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-light">
        <p>
          PlaceIO respects your privacy and is committed to protecting the personal data you share with us. This policy describes how we collect, store, and process candidate profiles and resumes.
        </p>

        <h3 className="text-base font-bold text-navy-800 uppercase mt-4 tracking-wider">1. Information We Collect</h3>
        <p>
          We collect personal data submitted via our public application forms, including your full name, email, phone number, qualification, work experience, location, and uploaded resume files.
        </p>

        <h3 className="text-base font-bold text-navy-800 uppercase mt-4 tracking-wider">2. How We Use Your Data</h3>
        <p>
          Your information is solely utilized to evaluate candidate profiles for recruitment, staffing placements, and contacting you regarding interviews or hiring outcomes.
        </p>

        <h3 className="text-base font-bold text-navy-800 uppercase mt-4 tracking-wider">3. Storage & Protection</h3>
        <p>
          All candidate data is stored in Firestore, and uploaded resumes are locked inside Firebase Storage. Access to candidate lists is strictly restricted to authenticated recruiters and system administrators.
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router basename="/HirePinnacle50">
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/apply/:jobId" element={<Apply />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* Optional route for creating a blog post (protected) */}
           <Route path="/dashboard/blog/new" element={<BlogForm />} />
           <Route path="/track-application" element={<TrackApplication />} />
           <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
