'use client'

import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowRight } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRegisterSchema } from '../types/userLogin'
import type { UserRegisterType } from '../types/userLogin'
import Logo from '#/components/HorizontalLogo.tsx'
import colors from '#/constants/color'
import api from '#/api/axios'
import { useNavigate } from '@tanstack/react-router'

export default function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterType>({
    resolver: zodResolver(UserRegisterSchema as any),
  })

  const onSubmit: SubmitHandler<UserRegisterType> = async (fromData) => {
    const { firstName, lastName, email, password } = fromData
    try {
      await api.post('/user/register', {
        firstName,
        lastName,
        email,
        password,
      })
      navigate({ to: '/login' })
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Registration failed',
      })
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
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <Label
                  htmlFor="firstName"
                  className="text-[#888] text-xs uppercase tracking-widest"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="bg-[#111] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-0 focus-visible:border-[#8FB3A1] h-11 rounded-lg transition-colors"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <Label
                  htmlFor="lastName"
                  className="text-[#888] text-xs uppercase tracking-widest"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="bg-[#111] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-0 focus-visible:border-[#8FB3A1] h-11 rounded-lg transition-colors"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
              <Label
                htmlFor="password"
                className="text-[#888] text-xs uppercase tracking-widest"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-[#111] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-0 focus-visible:border-[#8FB3A1] h-11 rounded-lg transition-colors"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-1 font-medium text-black rounded-lg gap-2"
              style={{ backgroundColor: colors.sage }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
              <ArrowRight size={15} />
            </Button>
          </form>
          {errors.root && (
            <p className="text-sm text-red-400 mt-1">{errors.root.message}</p>
          )}

          <div className="flex items-center gap-3 my-6">
            <Separator className="flex-1 bg-[#1e1e1e]" />
            <span className="text-[#444] text-xs">or</span>
            <Separator className="flex-1 bg-[#1e1e1e]" />
          </div>

          <Button
            onClick={() => {
              navigate({ to: '/login' })
            }}
            variant="outline"
            className="w-full h-11 border-[#222] bg-transparent text-[#888] hover:text-white hover:bg-[#111] hover:border-[#333] rounded-lg font-normal"
          >
            Log in instead
          </Button>
        </div>
      </div>
    </main>
  )
}
