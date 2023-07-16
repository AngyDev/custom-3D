import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

console.log(API_URL);

const axiosService = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // headers for test with localtunnel
  headers: {
    "Bypass-Tunnel-Reminder": true,
  },
});

axiosService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response !== undefined) {
      if (error.response.status === 401) {
        // window.location = "/";
        const response = await axiosService.post("/refresh", {});

        if (response.status === 200) {
          return axiosService(error.config); // contains all the information of the previous request that failed
        }
      } else if (error.response.status === 403) {
        // in case the refresh token is expired
        window.location = "/";
      }
    }

    // Use promise reject to have, in the api call, the error in the "catch" and not a response in the "then"
    return Promise.reject(error);
  },
);

export default axiosService;
