// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Call backend and expect PDF
export const createResume = async (resumeData) => {
  const response = await API.post("/generate_resume", resumeData, {
    responseType: "blob", // important for PDF
  });
  return response;
};

export default API;
