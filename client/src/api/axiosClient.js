import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://vaccination-tracker-7xqj.onrender.com',
  withCredentials: true,
});

export default axiosClient;
