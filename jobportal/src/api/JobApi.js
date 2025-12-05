import axios from "axios";
// const API = "http://localhost:8080/jobportal/jobs";
// const BASE_URL = "https://jobportalapplication-production.up.railway.app";
const API = "https://jobportalserver-production-0346.up.railway.app/jobportal/jobs";
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
