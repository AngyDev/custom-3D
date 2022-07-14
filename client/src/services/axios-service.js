import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const axiosService = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// let refresh = false;

// axiosService.interceptors.response.use(
//   (response) => {
//     console.log("response", response);
//     return response;
//   },
//   async (error) => {
//     console.log("error", error);
//     if (error.response.status === 401 && !refresh) {
//       refresh = true;
//       const response = await axiosService.post("/refresh", {}, { withCredentials: true });

//       if (response.status === 200) {
//         // axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
//         return axiosService(error.config); // contains all the information of the previous request that failed
//       }
//     }

//     refresh = false;
//     return error;
//   },
// );

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
