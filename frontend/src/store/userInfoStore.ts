import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserInfo = {
  id: string | undefined
  email: string | undefined
  fullname: string | undefined
  accessToken: string | undefined
  setUserInfo: (userInfo: {
    id?: string
    email?: string
    fullname?: string
    accessToken?: string
  }) => void
}

export const useUserInfoStore = create<UserInfo>()(
  persist(
    (set) => ({
      id: undefined,
      email: undefined,
      fullname: undefined,
      accessToken: undefined,
      setUserInfo: ({ id, email, fullname, accessToken }) => {
        set((state) => ({
          ...state,
          id,
          email,
          fullname,
          accessToken,
        }))
      },
    }),
    {
      name: 'user-info', // key in localStorage
      partialize: (state) => ({
     
        id: state.id,
        email: state.email,
        fullname: state.fullname,
        accessToken: state.accessToken,
      }),
    },
  ),
)