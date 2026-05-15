import { useEffect, useState } from 'react'
import api from '#/api/axios'
import { useUserInfoStore } from '#/store/userInfoStore'

export const useAuthInit = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data } = await api.post('/user/reset-token')
        const { accessToken, info } = data.data

        if (mounted) {
          useUserInfoStore.getState().setUserInfo({
            id: info.id,
            email: info.email,
            fullname: info.firstName + ' ' + info.lastName,
            accessToken,
          })
        }
      } catch (error) {
        if (mounted) {
          useUserInfoStore.getState().setUserInfo({
            id: undefined,
            email: undefined,
            fullname: undefined,
            accessToken: undefined,
          })
        }
        
        try {
          await api.post('/user/guestToken')
        } catch (guestError) {
          console.error("Failed to initialize guest session", guestError)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  return loading
}