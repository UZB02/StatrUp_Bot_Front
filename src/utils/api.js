// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.bonly.uz/api',
  // baseURL: 'https://startupbot-cashback.onrender.com/api',
  // baseURL: 'http://localhost:3030/api',
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
