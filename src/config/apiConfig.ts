import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const atrApi = axios.create({
  baseURL:  process.env.URL_BACKEND || 'http://10.212.139.163:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default atrApi;