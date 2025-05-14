import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Show loader
    document.body.classList.add('loading');
    return config;
  },
  (error) => {
    document.body.classList.remove('loading');
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Hide loader
    document.body.classList.remove('loading');
    return response;
  },
  (error) => {
    // Hide loader
    document.body.classList.remove('loading');
    
    // Handle errors
    if (error.response) {
      toast.error(error.response.data.message || 'Something went wrong!');
    } else {
      toast.error('Network error! Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 