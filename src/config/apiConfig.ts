import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * A configured Axios instance for interacting with the ATR API backend.
 *
 * Base URL defaults to `process.env.URL_BACKEND`, or falls back to `'http://10.212.139.163:8080/'` if not set.
 *
 * Default headers include:
 * - 'Content-Type': 'application/json'
 */
const atrApi = axios.create({
  baseURL:  process.env.URL_BACKEND || 'http://10.212.139.163:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default atrApi;