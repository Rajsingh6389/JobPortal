import axios from "axios";
// const API = "http://localhost:8080/jobportal/jobs";
// const BASE_URL = "https://jobportalapplication-production.up.railway.app";
const API = "http://65.1.132.98:8080/jobportal/jobs";
export const getAllJobs = async () => axios.get(API);

export const searchByTitle = async (title) =>
  axios.get(`${API}/title?q=${title}`);

export const filterByCompany = async (company) =>
  axios.get(`${API}/company/${company}`);

export const filterByExperience = async (exp) =>
  axios.get(`${API}/experience/${exp}`);

export const filterByLocation = async (loc) =>
  axios.get(`${API}/location/${loc}`);

export const filterByJobType = async (type) =>
  axios.get(`${API}/type/${type}`);


export const filterByJobId = async (id) =>
  axios.get(`${API}/${id}`);

export const saveApplication = (data) => {
  return axios.post(`${API}/apply`, data);
};

export const getExternalJobs = () => {
  return axios.get("https://jsearch.p.rapidapi.com/search", {
    params: { query: "developer in india", num_pages: 1 },
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_RAPID_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
  });
};

export const getInterships = () => {
  const response= axios.get("https://internships-api.p.rapidapi.com/active-jb-7d", {
    params: { query: "developer in india", num_pages: 1 },
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_RAPID_KEY,
      "X-RapidAPI-Host": "internships-api.p.rapidapi.comv",
    }
  });
  return response;   // <-- THIS is the array used by jobs.map
};


