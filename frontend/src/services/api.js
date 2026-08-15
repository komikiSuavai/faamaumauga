// src/services/api.js
// Small axios wrapper for API calls. Adds Authorization header when a token exists in localStorage.
import axios from 'axios'

// Vite exposes env vars that start with VITE_. Allow override or default to localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor: attach JWT token to every request if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if(token){
    cfg.headers = cfg.headers || {}
    cfg.headers.Authorization = `Bearer ${token}`
  }
  return cfg
})

export default api
