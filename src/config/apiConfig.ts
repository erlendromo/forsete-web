import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const atrApi = axios.create({
  baseURL:  process.env.URL_BACKEND || 'http://129.241.150.71:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default atrApi;