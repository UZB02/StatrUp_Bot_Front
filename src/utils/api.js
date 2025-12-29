// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://startupbot-cashback.onrender.com',
  // baseURL: 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
