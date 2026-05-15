import axios from 'axios'
import { useUserInfoStore } from '#/store/userInfoStore'

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})


const refreshApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
})

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = useUserInfoStore.getState().accessToken
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await refreshApi.post('/user/reset-token');
          const { accessToken, info } = data.data;

          useUserInfoStore.getState().setUserInfo({
            id: info.id,
            email: info.email,
            fullname: info.firstName + ' ' + info.lastName,
            accessToken,
          });

          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          resolve(api(originalRequest));
        } catch (refreshError) {
          try {
            await refreshApi.post('/user/guestToken');
          } catch (guestErr) {
             console.error("Guest session failed");
          }
          
          useUserInfoStore.getState().setUserInfo({
            id: undefined, email: undefined, fullname: undefined, accessToken: undefined 
          });
          
          processQueue(refreshError, null);
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;