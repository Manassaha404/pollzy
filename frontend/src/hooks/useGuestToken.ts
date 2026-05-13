import api from "#/api/axios"
import { useEffect, useState } from "react"

export const useGuestToken = () => {
  const [guestTokenloading, setGuestTokenloading] = useState(true)
  useEffect(() => {
    const refresh = async () => {
      try {
        await api.post('/user/guestToken')
      } finally {
        setGuestTokenloading(false)
      }
    }
    refresh()
  }, [])
  return guestTokenloading;
}