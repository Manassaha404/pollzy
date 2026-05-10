'use client'

import { useForm } from 'react-hook-form'
import { UserLoginSchema } from '../types/userLogin'
import type { UserLoginType } from '../types/userLogin'
import type { SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserInfoStore } from '../store/userInfoStore.js'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowRight } from 'lucide-react'

import Logo from '#/components/HorizontalLogo.tsx'
import colors from '#/constants/color'
import api from '#/api/axios'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginType>({
    resolver: zodResolver(UserLoginSchema as any),
  })

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<UserLoginType> = async (fromData) => {
    try {
      const { data } = await api.post('/user/login', {
        email: fromData.email,
        password: fromData.password,
      })
      const accessToken = data.data.accessToken
      const id = data.data.info.id
      const email = data.data.info.email
      const fullname = data.data.info.firstName + ' ' + data.data.info.lastName
      useUserInfoStore.getState().setUserInfo({
        id,
        email,
        fullname,
        accessToken,
      })
      navigate({ to: '/' })
    } catch (error) {
      console.log(error)

      setError('root', { message: 'Invalid email or password' })
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Logo />

        <div className="rounded-2xl border border-[#1e1e1e] bg-[#0a0a0a] p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-[#888] text-xs uppercase tracking-widest"
              >
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-[#111] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-0 focus-visible:border-[#8FB3A1] h-11 rounded-lg transition-colors"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-[#888] text-xs uppercase tracking-widest"
                >
                  Password
                </Label>

                <p
                  className="text-xs transition-colors"
                  style={{ color: colors.steel }}
                >
                  Forgot password?
                </p>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                required
                className="bg-[#111] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-0 focus-visible:border-[#8FB3A1] h-11 rounded-lg transition-colors"
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {errors.root && (
              <p className="text-sm text-red-400 mt-1">{errors.root.message}</p>
            )}
            <Button
              type="submit"
              className="w-full h-11 mt-1 font-medium text-black rounded-lg gap-2"
              style={{ backgroundColor: colors.sage }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
              <ArrowRight size={15} />
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <Separator className="flex-1 bg-[#1e1e1e]" />
            <span className="text-[#444] text-xs">or</span>
            <Separator className="flex-1 bg-[#1e1e1e]" />
          </div>

          <Button
            onClick={() => navigate({ to: '/register' })}
            variant="outline"
            className="w-full h-11 border-[#222] bg-transparent text-[#888] hover:text-white hover:bg-[#111] hover:border-[#333] rounded-lg font-normal cursor-pointer"
          >
            Create an account
          </Button>
        </div>
      </div>
    </main>
  )
}
