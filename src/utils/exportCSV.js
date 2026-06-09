/**
 * Utility to export a list of candidates to a CSV file.
 * @param {Array} candidatesList List of candidate objects to export
 * @param {string} filename Name of the downloaded file
 */
export const exportToCSV = (candidatesList, filename = "candidates.csv") => {
  if (!candidatesList || candidatesList.length === 0) return;

  const headers = [
    "Name",
    "Father's Name",
    "Phone Number",
    "Alternative Number",
    "Email ID",
    "Date of Birth",
    "Gender",
    "Marital Status",
    "Aadhar Number",
    "Highest Qualification",
    "Residential Address",
    "Spoken Languages",
    "Experience",
    "Joining Timeline",
    "Applied Date",
    "Status",
    "Resume URL"
  ];

  const rows = candidatesList.map(candidate => {
    let appliedDate = "";
    if (candidate.timestamp) {
      if (candidate.timestamp.toDate) {
        appliedDate = candidate.timestamp.toDate().toLocaleDateString();
      } else if (candidate.timestamp.seconds) {
        appliedDate = new Date(candidate.timestamp.seconds * 1000).toLocaleDateString();
      } else {
        appliedDate = new Date(candidate.timestamp).toLocaleDateString();
      }
    }
      
    return [
      candidate.fullName || "",
      candidate.fatherName || "",
      candidate.phone || "",
      candidate.alternativeNumber || "",
      candidate.email || "",
      candidate.dob || "",
      candidate.gender || "",
      candidate.maritalStatus || "",
      candidate.aadharNumber || "",
      candidate.qualification || "",
      candidate.address || "",
      candidate.languages || "",
      candidate.experience || "",
      candidate.joiningTimeline || "",
      appliedDate,
      candidate.status || "",
      candidate.resumeURL || ""
    ];
  });

  // Convert array to CSV string structure (handling commas and quotes)
  const csvContent = [
    headers.join(","),
    ...rows.map(row => 
      row.map(value => {
        const stringVal = String(value).replace(/"/g, '""');
        return stringVal.includes(",") || stringVal.includes("\n") || stringVal.includes('"')
          ? `"${stringVal}"`
          : stringVal;
      }).join(",")
    )
  ].join("\n");

  // Create browser download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
