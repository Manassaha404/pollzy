import { create } from 'zustand'

type userInfo = {
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

export const useUserInfoStore = create<userInfo>((set) => ({
  id: undefined,
  email: undefined,
  fullname: undefined,
  accessToken: undefined,
  setUserInfo: ({ id, email, fullname, accessToken }) => {
    set((state: userInfo) => ({
      ...state,
      id,
      email,
      fullname,
      accessToken,
    }))
  },
}))
