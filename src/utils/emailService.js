/**
 * Sends an email notification using EmailJS REST API.
 * Supports a mock fallback if environment variables are not defined.
 */

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID_RECRUITER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RECRUITER || "";
const TEMPLATE_ID_CANDIDATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CANDIDATE || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.VITE_EMAILJS_USER_ID || "";

const isEmailJSConfigured = () => {
  return SERVICE_ID && (TEMPLATE_ID_RECRUITER || TEMPLATE_ID_CANDIDATE) && PUBLIC_KEY;
};

/**
 * Send email notification to recruiter when a new candidate applies.
 */
export const sendNewApplicationEmail = async (candidateData) => {
  const templateParams = {
    recruiter_email: "contact@hirepinnacle50.com",
    candidate_name: candidateData.fullName,
    candidate_email: candidateData.email,
    candidate_phone: candidateData.phone,
    candidate_qualification: candidateData.qualification,
    candidate_experience: candidateData.experience,
    candidate_location: candidateData.location,
    resume_url: candidateData.resumeURL
  };

  if (!isEmailJSConfigured()) {
    console.log("%c[MOCK EMAIL] New candidate applied! Notification sent to Recruiter:", "color: #1e3a8a; font-weight: bold;", {
      to: "contact@hirepinnacle50.com",
      subject: `New Candidate Application: ${candidateData.fullName}`,
      details: templateParams
    });
    return { success: true, isMock: true };
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID_RECRUITER,
        user_id: PUBLIC_KEY,
        template_params: templateParams
      })
    });

    if (response.ok) {
      return { success: true, error: null };
    } else {
      const text = await response.text();
      throw new Error(text);
    }
  } catch (error) {
    console.error("EmailJS sending error (Recruiter Notification):", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send status update email to the candidate (when status changes to Interview or Selected).
 */
export const sendCandidateStatusEmail = async (candidateEmail, candidateName, newStatus) => {
  const templateParams = {
    candidate_email: candidateEmail,
    candidate_name: candidateName,
    status: newStatus,
    company_name: "HirePinnacle50",
    message: newStatus === "Interview" 
      ? `Great news! Your profile has been shortlisted and we would like to coordinate an interview with you. Our recruitment team will reach out shortly to schedule a date and time.`
      : `Congratulations! We are pleased to inform you that you have been selected for the position. Our onboarding team will connect with you to discuss the final placement and onboarding details.`
  };

  if (!isEmailJSConfigured()) {
    console.log(`%c[MOCK EMAIL] Candidate Status Updated to ${newStatus}! Notification sent to Candidate:`, "color: green; font-weight: bold;", {
      to: candidateEmail,
      subject: `Application Update: ${newStatus} - HirePinnacle50`,
      details: templateParams
    });
    return { success: true, isMock: true };
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID_CANDIDATE,
        user_id: PUBLIC_KEY,
        template_params: templateParams
      })
    });

    if (response.ok) {
      return { success: true, error: null };
    } else {
      const text = await response.text();
      throw new Error(text);
    }
  } catch (error) {
    console.error("EmailJS sending error (Candidate Notification):", error);
    return { success: false, error: error.message };
  }
};
