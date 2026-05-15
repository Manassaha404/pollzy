import axios from 'axios'
import { useUserInfoStore } from '#/store/userInfoStore'
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: 'https://pollzy.onrender.com/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const refreshApi = axios.create({
  baseURL: 'https://pollzy.onrender.com/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useUserInfoStore.getState().accessToken
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      const { data } = await refreshApi.post('/user/reset-token')
      const { accessToken, info } = data.data

      useUserInfoStore.getState().setUserInfo({
        id: info.id,
        email: info.email,
        fullname: info.firstName + ' ' + info.lastName,
        accessToken,
      })

      original.headers['Authorization'] = `Bearer ${accessToken}`
      return api(original)

    } catch {
      useUserInfoStore.getState().setUserInfo({
        id: undefined,
        email: undefined,
        fullname: undefined,
        accessToken: undefined,
      })
      return Promise.reject(error)
    }
  }
)

export default api