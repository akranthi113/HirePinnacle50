import React, { useState } from "react";
import { checkDuplicateCandidate, addCandidate } from "../firebase/firestore";
import { uploadResume } from "../firebase/storage";
import { sendNewApplicationEmail } from "../utils/emailService";
import { CheckCircle2, Upload, AlertCircle, FileText } from "lucide-react";

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    phone: "",
    alternativeNumber: "",
    email: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    aadharNumber: "",
    qualification: "",
    address: "",
    languages: "",
    experience: "",
    joiningTimeline: "",
    consent: false
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: ""
  });

  const [validationErrors, setValidationErrors] = useState({});

  const qualifications = ["10th", "12th", "Diploma", "Graduate", "Post Graduate", "Doctorate"];
  const experiences = ["Fresher", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"];
  const joiningTimelines = ["Immediate", "15 Days", "30 Days", "60 Days", "90 Days"];
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (type !== "checkbox") {
      if (name === "phone" || name === "alternativeNumber") {
        // Strip all non-digit characters
        let digits = value.replace(/\D/g, "");
        // If it starts with 91 and is 12 digits, strip the 91
        if (digits.length === 12 && digits.startsWith("91")) {
          digits = digits.slice(2);
        }
        // If it starts with 0 and is 11 digits, strip the 0
        if (digits.length === 11 && digits.startsWith("0")) {
          digits = digits.slice(1);
        }
        // Limit to 10 digits
        if (digits.length > 10) {
          digits = digits.slice(0, 10);
        }
        finalValue = digits;
      } else if (name === "aadharNumber") {
        // Strip all non-digit characters
        let digits = value.replace(/\D/g, "");
        // Limit to 12 digits
        if (digits.length > 12) {
          digits = digits.slice(0, 12);
        }
        finalValue = digits;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue
    }));
    // Clear validation error on type
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };



  const validateForm = () => {
    const errors = {};
    
    // Sanitize values
    let cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
      cleanPhone = cleanPhone.slice(2);
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.slice(1);
    }

    let cleanAlt = formData.alternativeNumber.replace(/\D/g, "");
    if (cleanAlt.length === 12 && cleanAlt.startsWith("91")) {
      cleanAlt = cleanAlt.slice(2);
    } else if (cleanAlt.length === 11 && cleanAlt.startsWith("0")) {
      cleanAlt = cleanAlt.slice(1);
    }

    const cleanAadhar = formData.aadharNumber.replace(/\D/g, "");

    if (!formData.fullName.trim()) errors.fullName = "Name is required.";
    if (!formData.fatherName.trim()) errors.fatherName = "Father's name is required.";
    
    if (!cleanPhone) {
      errors.phone = "Phone number is required.";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    if (cleanAlt && cleanAlt.length !== 10) {
      errors.alternativeNumber = "Alternative number must be exactly 10 digits.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email ID is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = "Invalid email format.";
    }

    if (!formData.dob) errors.dob = "Date of birth is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (!formData.maritalStatus) errors.maritalStatus = "Marital status is required.";

    if (!cleanAadhar) {
      errors.aadharNumber = "Aadhar number is required.";
    } else if (cleanAadhar.length !== 12) {
      errors.aadharNumber = "Aadhar number must be exactly 12 digits.";
    }

    if (!formData.qualification) errors.qualification = "Highest qualification is required.";
    if (!formData.address.trim()) errors.address = "Residential address with pincode is required.";
    if (!formData.languages.trim()) errors.languages = "Spoken languages are required.";
    if (!formData.experience) errors.experience = "Experience level is required.";
    if (!formData.joiningTimeline) errors.joiningTimeline = "Joining timeline option is required.";
    if (!formData.consent) errors.consent = "You must agree to the data collection policy.";

    setValidationErrors(errors);
    
    return {
      isValid: Object.keys(errors).length === 0,
      cleanedData: {
        phone: cleanPhone,
        alternativeNumber: cleanAlt,
        aadharNumber: cleanAadhar
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: false, success: false, error: "" });

    const { isValid, cleanedData } = validateForm();

    if (!isValid) {
      setFormStatus({
        submitting: false,
        success: false,
        error: "Please fill in all required fields and correct the errors below."
      });
      // Scroll to the first error element
      setTimeout(() => {
        const errorElement = document.querySelector(".text-rose-500");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    // Sync cleaned data back to form state
    setFormData((prev) => ({
      ...prev,
      ...cleanedData
    }));

    setFormStatus({ submitting: true, success: false, error: "" });

    try {
      // 1. Perform duplicate check (Email + Phone)
      const dupCheck = await checkDuplicateCandidate(formData.email.toLowerCase(), cleanedData.phone);
      if (dupCheck.error) {
        throw new Error(`Database check failed: ${dupCheck.error}`);
      }
      if (dupCheck.isDuplicate) {
        setFormStatus({
          submitting: false,
          success: false,
          error: `An application with this ${dupCheck.field} already exists.`
        });
        return;
      }

      // Helper to generate UUID client-side for Supabase
      const generateUUID = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          return crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      const candidateId = generateUUID();

      // 2. Save Candidate details in one single operation
      const candidatePayload = {
        fullName: formData.fullName.trim(),
        fatherName: formData.fatherName.trim(),
        phone: cleanedData.phone,
        alternativeNumber: cleanedData.alternativeNumber || "N/A",
        email: formData.email.toLowerCase().trim(),
        dob: formData.dob,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        aadharNumber: cleanedData.aadharNumber,
        qualification: formData.qualification,
        address: formData.address.trim(),
        languages: formData.languages.trim(),
        experience: formData.experience,
        joiningTimeline: formData.joiningTimeline,
        resumeFileName: null,
        resumeURL: null
      };

      const candidateSaveRes = await addCandidate(candidatePayload, candidateId);
      if (candidateSaveRes.error) {
        throw new Error(`Failed to save candidate: ${candidateSaveRes.error}`);
      }

      // 3. Trigger EmailJS recruiter notification
      const fullCandidateData = { ...candidatePayload, resumeURL: null };
      await sendNewApplicationEmail(fullCandidateData);

      // Successful Submission
      setFormStatus({ submitting: false, success: true, error: "" });
      
      // Reset form
      setFormData({
        fullName: "",
        fatherName: "",
        phone: "",
        alternativeNumber: "",
        email: "",
        dob: "",
        gender: "",
        maritalStatus: "",
        aadharNumber: "",
        qualification: "",
        address: "",
        languages: "",
        experience: "",
        joiningTimeline: "",
        consent: false
      });

    } catch (err) {
      console.error(err);
      setFormStatus({
        submitting: false,
        success: false,
        error: err.message || "An unexpected error occurred during submission. Please try again."
      });
    }
  };

  if (formStatus.success) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm text-center max-w-xl mx-auto my-12">
        <div className="bg-emerald-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-navy-800 mb-3">Application Submitted!</h3>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          Thank you for applying to HirePinnacle50. Your profile has been saved successfully. 
          A notification has been sent to our recruiters. We will contact you if your skills match our open roles.
        </p>
        <button
          onClick={() => setFormStatus({ submitting: false, success: false, error: "" })}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition"
        >
          Submit Another Profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto my-8">
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-extrabold text-navy-800">Job Application Form</h2>
        <p className="text-slate-500 text-sm mt-1">Please provide accurate information. Fields marked with * are required.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Personal Details */}
        <div>
          <h3 className="text-md font-bold text-blue-600 uppercase tracking-wider mb-4 border-l-4 border-blue-500 pl-2">
            1. Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.fullName ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.fullName && <p className="text-rose-500 text-xs mt-1">{validationErrors.fullName}</p>}
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Father's Name *</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Enter father's name"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.fatherName ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.fatherName && <p className="text-rose-500 text-xs mt-1">{validationErrors.fatherName}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.dob ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.dob && <p className="text-rose-500 text-xs mt-1">{validationErrors.dob}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                  validationErrors.gender ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.gender && <p className="text-rose-500 text-xs mt-1">{validationErrors.gender}</p>}
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Marital status *</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                  validationErrors.maritalStatus ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              >
                <option value="">Select Marital Status</option>
                {maritalStatuses.map((ms) => (
                  <option key={ms} value={ms}>{ms}</option>
                ))}
              </select>
              {validationErrors.maritalStatus && <p className="text-rose-500 text-xs mt-1">{validationErrors.maritalStatus}</p>}
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Aadhar Number *</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                placeholder="12-digit Aadhar number"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.aadharNumber ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.aadharNumber && <p className="text-rose-500 text-xs mt-1">{validationErrors.aadharNumber}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-md font-bold text-blue-600 uppercase tracking-wider mb-4 border-l-4 border-blue-500 pl-2">
            2. Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit primary number"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.phone ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.phone && <p className="text-rose-500 text-xs mt-1">{validationErrors.phone}</p>}
            </div>

            {/* Alternative Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Alternative Number</label>
              <input
                type="tel"
                name="alternativeNumber"
                value={formData.alternativeNumber}
                onChange={handleInputChange}
                placeholder="10-digit alternative number"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.alternativeNumber ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.alternativeNumber && <p className="text-rose-500 text-xs mt-1">{validationErrors.alternativeNumber}</p>}
            </div>

            {/* Email ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email ID *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.email ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.email && <p className="text-rose-500 text-xs mt-1">{validationErrors.email}</p>}
            </div>

            {/* Residential Address with Pincode */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Residential address with pincode *</label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your complete residential address including city, state, and pincode"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.address ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.address && <p className="text-rose-500 text-xs mt-1">{validationErrors.address}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Qualifications & Job Details */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-md font-bold text-blue-600 uppercase tracking-wider mb-4 border-l-4 border-blue-500 pl-2">
            3. Qualification & Professional Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highest Qualification */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Highest Qualification *</label>
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                  validationErrors.qualification ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              >
                <option value="">Select Qualification</option>
                {qualifications.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              {validationErrors.qualification && <p className="text-rose-500 text-xs mt-1">{validationErrors.qualification}</p>}
            </div>

            {/* Spoken Languages */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Spoken Languages *</label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                placeholder="e.g. English, Hindi, Telugu"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.languages ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              />
              {validationErrors.languages && <p className="text-rose-500 text-xs mt-1">{validationErrors.languages}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Experience *</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                  validationErrors.experience ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              >
                <option value="">Select Experience</option>
                {experiences.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              {validationErrors.experience && <p className="text-rose-500 text-xs mt-1">{validationErrors.experience}</p>}
            </div>

            {/* How often will you be able to join? */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">How often will you be able to join? *</label>
              <select
                name="joiningTimeline"
                value={formData.joiningTimeline}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                  validationErrors.joiningTimeline ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
                }`}
              >
                <option value="">Select Joining Timeline</option>
                {joiningTimelines.map((np) => (
                  <option key={np} value={np}>{np}</option>
                ))}
              </select>
              {validationErrors.joiningTimeline && <p className="text-rose-500 text-xs mt-1">{validationErrors.joiningTimeline}</p>}
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start">
          <input
            type="checkbox"
            name="consent"
            id="consent"
            checked={formData.consent}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
          />
          <label htmlFor="consent" className="ml-2 text-sm text-slate-600 select-none cursor-pointer">
            I agree to HirePinnacle50 collecting and storing my data for recruitment purposes. *
          </label>
        </div>
        {validationErrors.consent && <p className="text-rose-500 text-xs">{validationErrors.consent}</p>}

        {/* Global Error Banner */}
        {formStatus.error && (
          <div className="flex items-start text-rose-800 text-sm font-semibold bg-rose-50 border border-rose-100 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5 text-rose-500 mr-2 flex-shrink-0" />
            <span>{formStatus.error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={formStatus.submitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50 flex items-center justify-center text-sm"
          >
            {formStatus.submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                 Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
