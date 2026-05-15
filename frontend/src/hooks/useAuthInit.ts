import { useEffect } from 'react'
import api from '#/api/axios'
import { useUserInfoStore } from '#/store/userInfoStore'

export const useAuthInit = () => {
  const setInitialized = useUserInfoStore((state) => state.setInitialized)
  const isInitialized = useUserInfoStore((state) => state.isInitialized)

  useEffect(() => {
    const init = async () => {
      try {
        await api.post('/user/reset-token')
      } catch (e) {
      } finally {
        setInitialized(true)
      }
    }
    init()
  }, [setInitialized])

  return !isInitialized // returns loading status
}