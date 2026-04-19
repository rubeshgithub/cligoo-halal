import axios from 'axios';

const BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${BASE}/api`;

const client = axios.create({
  baseURL: API,
  withCredentials: true, // for Emergent Google cookie
});

// Attach Bearer JWT if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('cligoo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;

// ---------- Auth ----------
export const authApi = {
  register: (email, password, name) => client.post('/auth/register', { email, password, name }).then(r => r.data),
  login:    (email, password)       => client.post('/auth/login',    { email, password }).then(r => r.data),
  googleSession: (sessionId)        => client.post('/auth/google/session', null, { headers: { 'X-Session-ID': sessionId } }).then(r => r.data),
  me:       ()                      => client.get('/auth/me').then(r => r.data),
  logout:   ()                      => client.post('/auth/logout').then(r => r.data),
};

// ---------- Restaurants ----------
export const restaurantApi = {
  list: (params = {}) => client.get('/restaurants', { params }).then(r => r.data),
  get:  (id)          => client.get(`/restaurants/${id}`).then(r => r.data),
  menu: (id)          => client.get(`/restaurants/${id}/menu`).then(r => r.data),
  categories: ()      => client.get('/categories').then(r => r.data),
};

// ---------- Orders ----------
export const orderApi = {
  create: (payload)    => client.post('/orders', payload).then(r => r.data),
  get:    (id)         => client.get(`/orders/${id}`).then(r => r.data),
  list:   ()           => client.get('/orders').then(r => r.data),
  setStatus: (id, s)   => client.patch(`/orders/${id}/status`, { status: s }).then(r => r.data),
};
