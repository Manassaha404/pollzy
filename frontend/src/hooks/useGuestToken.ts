import api from "#/api/axios"
import { useEffect, useState } from "react"

export const useGuestToken = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function createGuestToken() {
      try {
        await api.post('/user/guestToken')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    createGuestToken()

    return () => {
      mounted = false
    }
  }, [])

  return loading
}