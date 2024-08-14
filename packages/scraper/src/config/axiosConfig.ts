import axios from 'axios';

const baseURL = `${process.env.API_HOST}:${process.env.API_PORT}`;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
