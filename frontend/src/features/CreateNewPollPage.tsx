import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  Clock,
  Globe,
  Lock,
  CalendarClock,
  FileText,
  Users,
  AlertCircle,
} from 'lucide-react'


import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'


import colors from '../constants/COLORS.js'
import { VISIBILITY_OPTIONS } from '../constants/VISIBILITY_OPTIONS'
import { DURATION_PRESETS } from '../constants/DURATION_PRESETS'

import { CreatePollSchema, type CreatePollType } from '../types/polls.js'
import api from '#/api/axios.js'
import { useNavigate } from '@tanstack/react-router'


export default function CreateNewPollPage() {
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [closedAt, setClosedAt] = useState<Date | null>(null)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<CreatePollType>({
    resolver: zodResolver(CreatePollSchema as any),
    defaultValues: {
      title: '',
      description: '',
      isPublic: true,
      closedAt: undefined,
    },
  })

  function handlePreset(label: string, fn: () => Date | null) {
    setSelectedPreset(label)
    const date = fn()
    setClosedAt(date)

    setValue('closedAt', date ? date.toISOString() : undefined, {
      shouldValidate: true,
    })
  }


  function handleVisibility(value: boolean) {
    setIsPublic(value)
    setValue('isPublic', value)
  }

  async function onSubmit(fromData: CreatePollType) {
    try {
      const { data } = await api.post('/poll/create', fromData)
      reset()
      setSelectedPreset(null)
      setClosedAt(null)
      setIsPublic(true)
      navigate({
        to: `/polls/draft/${data.data.id}`
      })
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Something went wrong'
      setError('root', { message })
    }
  }

  return (
    <div
      className="min-h-screen mt-5 text-white"
      style={{ backgroundColor: colors.black }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Create a Poll
          </h1>
          <p
            className="text-sm mt-1.5"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Configure your poll and share it with your audience.
          </p>
        </div>
        {errors.root && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border mb-6 text-sm"
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              borderColor: 'rgba(239,68,68,0.25)',
              color: 'rgba(252,165,165,1)',
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.root.message}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch">
            <div className="flex flex-col gap-5">
              <Card
                className="border-white/6 shadow-none rounded-2xl"
                style={{ backgroundColor: '#0d0d0d' }}
              >
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-center gap-2">
                    <FileText
                      className="w-4 h-4"
                      style={{ color: `${colors.sage}99` }}
                    />
                    <CardTitle
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Poll Details
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-5">
                  <div className="space-y-2">
                    <label
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      Title <span style={{ color: colors.sage }}>*</span>
                    </label>
                    <Input
                      {...register('title')}
                      placeholder="What would you like to ask?"
                      className="h-12 rounded-xl text-sm transition-colors text-white placeholder:text-white/15
                                 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0"
                      style={{
                        backgroundColor: '#060606',
                        borderColor: errors.title
                          ? 'rgba(239,68,68,0.5)'
                          : 'rgba(255,255,255,0.07)',
                      }}
                    />
                    {errors.title && (
                      <p
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: 'rgba(252,165,165,1)' }}
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      Description{' '}
                      <span
                        className="text-xs font-normal"
                        style={{ color: 'rgba(255,255,255,0.25)' }}
                      >
                        (optional)
                      </span>
                    </label>
                    <Textarea
                      {...register('description')}
                      placeholder="Give voters some context about your poll…"
                      rows={4}
                      className="rounded-xl resize-none text-sm transition-colors text-white placeholder:text-white/15
                                 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0"
                      style={{
                        backgroundColor: '#060606',
                        borderColor: errors.description
                          ? 'rgba(239,68,68,0.5)'
                          : 'rgba(255,255,255,0.07)',
                      }}
                    />
                    {errors.description && (
                      <p
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: 'rgba(252,165,165,1)' }}
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              
              <Card
                className="border-white/6 shadow-none rounded-2xl flex-1"
                style={{ backgroundColor: '#0d0d0d' }}
              >
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-center gap-2">
                    <Users
                      className="w-4 h-4"
                      style={{ color: `${colors.steel}99` }}
                    />
                    <CardTitle
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Visibility
                    </CardTitle>
                  </div>
                  <CardDescription
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    Control who can see and participate in this poll.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <input type="hidden" {...register('isPublic')} />
                  <div className="grid grid-cols-2 gap-3">
                    {VISIBILITY_OPTIONS.map(
                      ({ value, label, description, icon: Icon }) => {
                        const active = isPublic === value
                        const activeColor = value ? colors.sage : colors.steel
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleVisibility(value)}
                            className="relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200"
                            style={{
                              backgroundColor: active
                                ? `${activeColor}1A`
                                : '#060606',
                              borderColor: active
                                ? `${activeColor}66`
                                : 'rgba(255,255,255,0.06)',
                            }}
                          >
                            {active && (
                              <span
                                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                                style={{ backgroundColor: activeColor }}
                              />
                            )}
                            <div
                              className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors"
                              style={{
                                backgroundColor: active
                                  ? `${activeColor}26`
                                  : 'rgba(255,255,255,0.03)',
                                borderColor: active
                                  ? `${activeColor}4D`
                                  : 'rgba(255,255,255,0.07)',
                              }}
                            >
                              <Icon
                                className="w-4 h-4 transition-colors"
                                style={{
                                  color: active
                                    ? activeColor
                                    : 'rgba(255,255,255,0.3)',
                                }}
                              />
                            </div>
                            <div>
                              <p
                                className="text-sm font-medium transition-colors"
                                style={{
                                  color: active
                                    ? '#fff'
                                    : 'rgba(255,255,255,0.5)',
                                }}
                              >
                                {label}
                              </p>
                              <p
                                className="text-xs mt-0.5 leading-relaxed"
                                style={{ color: 'rgba(255,255,255,0.25)' }}
                              >
                                {description}
                              </p>
                            </div>
                          </button>
                        )
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-5">
              <Card
                className="border-white/6 shadow-none rounded-2xl"
                style={{ backgroundColor: '#0d0d0d' }}
              >
                <CardHeader className="pb-3 pt-6 px-6">
                  <div className="flex items-center gap-2">
                    <CalendarClock
                      className="w-4 h-4"
                      style={{ color: `${colors.lavender}80` }}
                    />
                    <CardTitle
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Closes In
                    </CardTitle>
                  </div>
                  <CardDescription
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    When should this poll stop accepting votes?
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-3">
                  <input type="hidden" {...register('closedAt')} />
                  <div className="grid grid-cols-2 gap-2">
                    {DURATION_PRESETS.map(({ label, fn }) => {
                      const active = selectedPreset === label
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handlePreset(label, fn)}
                          className="py-2.5 px-3 rounded-xl text-xs font-medium transition-all border text-left"
                          style={{
                            backgroundColor: active
                              ? `${colors.lavender}1A`
                              : '#060606',
                            borderColor: active
                              ? `${colors.lavender}4D`
                              : 'rgba(255,255,255,0.06)',
                            color: active
                              ? colors.lavender
                              : 'rgba(255,255,255,0.35)',
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>

                  {closedAt && selectedPreset !== 'No limit' && (
                    <div
                      className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border"
                      style={{
                        backgroundColor: `${colors.lavender}0F`,
                        borderColor: `${colors.lavender}33`,
                      }}
                    >
                      <Clock
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: `${colors.lavender}99` }}
                      />
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: `${colors.lavender}80` }}
                        >
                          Closes on
                        </p>
                        <p
                          className="text-xs font-medium mt-0.5"
                          style={{ color: colors.lavender }}
                        >
                          {format(closedAt, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPreset === 'No limit' && (
                    <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-white/2 bg-white/20">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-white/20" />
                      <span className="text-xs text-white/30">
                        Stays open indefinitely
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card
                className="border-white/6 shadow-none rounded-2xl flex-1"
                style={{ backgroundColor: '#0d0d0d' }}
              >
                <CardContent className="px-6 py-6 flex flex-col h-full space-y-4">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    Summary
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        Visibility
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 flex items-center gap-1"
                        style={{
                          borderColor: isPublic
                            ? `${colors.sage}4D`
                            : `${colors.steel}4D`,
                          color: isPublic ? colors.sage : colors.steel,
                          backgroundColor: isPublic
                            ? `${colors.sage}1A`
                            : `${colors.steel}1A`,
                        }}
                      >
                        {isPublic ? (
                          <>
                            <Globe className="w-3 h-3" /> Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" /> Private
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        Duration
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 flex items-center gap-1"
                        style={{
                          borderColor: `${colors.lavender}33`,
                          color: `${colors.lavender}99`,
                          backgroundColor: `${colors.lavender}0D`,
                        }}
                      >
                        <Clock className="w-3 h-3" />
                        {selectedPreset ?? 'Not set'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1" />

                  <Separator
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-semibold h-11 rounded-xl transition-all text-black disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.sage }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Creating…
                      </span>
                    ) : (
                      'Create Poll'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
