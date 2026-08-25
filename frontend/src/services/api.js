import axios from 'axios';

// Real backend client.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true, // Send cookies for HTTP-only auth
});

api.interceptors.request.use((config) => {
  // Attach Bearer token from localStorage as fallback (dual auth: cookie + header)
  const session = JSON.parse(localStorage.getItem('sch_hub_session') || 'null');
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Request failed';

    // On 401 Unauthorized, clear local session
    if (status === 401) {
      try {
        localStorage.removeItem('sch_hub_session');
      } catch { /* ignore */ }
    }

    return Promise.reject(Object.assign(new Error(message), { status }));
  }
);

export const USE_MOCK_API = (import.meta.env.VITE_USE_MOCK_API ?? 'true') === 'true';
