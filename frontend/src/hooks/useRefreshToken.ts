import { useEffect, useState } from 'react'
import api from '#/api/axios'
import { useUserInfoStore } from '#/store/userInfoStore'

export const useRefreshToken = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const refresh = async () => {
      try {
        const { data } = await api.post('/user/reset-token')
        const { accessToken, info } = data.data

        useUserInfoStore.getState().setUserInfo({
          id: info.id,
          email: info.email,
          fullname: info.firstName + ' ' + info.lastName,
          accessToken,
        })
      } catch {
        useUserInfoStore.getState().setUserInfo({
          id: undefined,
          email: undefined,
          fullname: undefined,
          accessToken: undefined,
        })
      } finally {
        setLoading(false)
      }
    }
    refresh()
  }, [])
  return loading
}
