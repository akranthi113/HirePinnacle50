import { supabase } from "./config";
import { isMockActive } from "./firestore";

/**
 * Uploads a resume file to Supabase Storage resumes bucket.
 * @param {string} candidateId The ID of the candidate document
 * @param {File} file The file object from input
 * @returns {Promise<{downloadURL: string | null, error: string | null}>}
 */
export const uploadResume = async (candidateId, file) => {
  if (isMockActive()) {
    return { 
      downloadURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
      error: null 
    };
  }

  try {
    const fileExtension = file.name.split('.').pop();
    const filePath = `${candidateId}.${fileExtension}`;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(filePath, file, {
        upsert: false
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(filePath);
      
    return { downloadURL: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading resume:", error);
    return { downloadURL: null, error: error.message };
  }
};
