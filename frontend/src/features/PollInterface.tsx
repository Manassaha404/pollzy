import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useRouter } from '@tanstack/react-router'
import api from '#/api/axios'
import { useUserInfoStore } from '#/store/userInfoStore'
import socket from '#/socket/socket.io'
import { Bookmark, BookmarkCheck, Globe, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PollProgressBar } from '#/components/PollInterfaceComponents/PollProgressBar'

import PageLoader from '#/components/PageLoader'
import { PollCompleteScreen } from '#/components/PollInterfaceComponents/PollCompleteScreen'
import { PollClosedScreen } from '#/components/PollInterfaceComponents/PollClosedScreen'
import { PollNavigation } from '#/components/PollInterfaceComponents/PollNavigation'
import {
  QuestionStep,
  type QuestionData,
} from '#/components/PollInterfaceComponents/QuestionStep'

import colors from '../constants/COLORS'

interface PollOption {
  id: string
  text: string
  orderIndex: number
  voteCount: number
}

interface PollQuestion extends QuestionData {
  id: string
  text: string
  isRequired: boolean
  orderIndex: number
  options: PollOption[]
}

type ResultVisibility = 'always' | 'after_vote' | 'creator_only'

interface PollData {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  resultVisibility: ResultVisibility
  questions: PollQuestion[]
  isClosed: boolean
  closedAt?: string | null
  totalVotes?: number
}

export default function PollInterface() {
  const { pollId } = useParams({
    from: '/polls/$pollId',
  })
  const isInitialized = useUserInfoStore((state) => state.isInitialized)
  const router = useRouter()
  const navigate = useNavigate()
  const [poll, setPoll] = useState<PollData | null>(null)
  const [isAlreadyVoted, setAlreadyVoted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [animating, setAnimating] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    if (!isInitialized) return 

    let ignore = false
    async function getPollData() {
      try {
        const [pollRes, votedRes, savedRes] = await Promise.all([
          api.get(`/poll/interface/${pollId}`),
          api.get(`/poll/is-already-voted/${pollId}`),
          api.get(`/poll/isSaved/${pollId}`),
          api.post(`/poll/viwe-poll/${pollId}`),
        ])
        if (ignore) return
        setPoll(pollRes.data.data)
        setAlreadyVoted(votedRes.data.data.alreadyVoted)
        setIsSaved(savedRes.data.data.isSaved)
      } catch (error) {
        console.error(error)
      }
    }

    getPollData()
    return () => { ignore = true }
  }, [pollId, isInitialized])

  const sorted = useMemo(() => {
    if (!poll?.questions) return []

    return [...poll.questions].sort((a, b) => a.orderIndex - b.orderIndex)
  }, [poll])

  if (!poll) {
    return <PageLoader />
  }

  const current = sorted[currentIndex]

  const selected = current ? (answers[current.id] ?? null) : null

  const showResult =
    poll.resultVisibility === 'always' ||
    (poll.resultVisibility === 'after_vote' && selected !== null)

  const canGoNext = current ? !current.isRequired || selected !== null : false

  const requiredQuestions = sorted.filter((q) => q.isRequired)

  const canSubmit =
    requiredQuestions.length > 0
      ? requiredQuestions.every((q) => answers[q.id])
      : Object.keys(answers).length > 0

  function handleNavigate(dir: 'next' | 'prev') {
    setAnimating(true)

    setTimeout(() => {
      setCurrentIndex((prev) => (dir === 'next' ? prev + 1 : prev - 1))

      setAnimating(false)
    }, 200)
  }

  function handleSelect(optionId: string) {
    if (!current) return

    setAnswers((prev) => ({
      ...prev,
      [current.id]: optionId,
    }))
  }

  async function handleSubmit() {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const requestData = Object.keys(answers).map((questionId) => ({
        questionId,
        optionId: answers[questionId],
      }))
      socket.emit('submit_vote', {pollId, pollData: requestData});
      
      await api.post(`/poll/submit-vote/${pollId}`, {
        answers: requestData,
      })

      setCompleted(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSave() {
    if (isSaving) return

    const accessToken = useUserInfoStore.getState().accessToken

    if (!accessToken) {
      router.navigate({
        to: '/login',
      })

      return
    }

    try {
      setIsSaving(true)

      setIsSaved((prev) => !prev)

      await api.post(`/poll/save-poll/${pollId}`)
    } catch (error) {
      console.error(error)

      setIsSaved((prev) => !prev)
    } finally {
      setIsSaving(false)
    }
  }

  function handleViewResults() {
    navigate({
      to: `/polls/result/${pollId}`,
    })
  }

  function handleShare() {
    navigator.clipboard.writeText(`${window.location.origin}/polls/${poll?.id}`)
  }

  if (isAlreadyVoted) {
    return (
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-5 py-4 sm:py-6 space-y-5 sm:space-y-7">
        <Card
          className="border shadow-none rounded-3xl overflow-hidden"
          style={{
            backgroundColor: '#0d0d0d',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg mb-3"
                  style={{
                    color: poll.isPublic ? colors.sage : colors.steel,

                    backgroundColor: poll.isPublic
                      ? `${colors.sage}15`
                      : `${colors.steel}15`,
                  }}
                >
                  {poll.isPublic ? (
                    <>
                      <Globe className="w-3 h-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Private
                    </>
                  )}
                </span>

                <h1 className="text-lg sm:text-2xl font-semibold text-white leading-tight break-words">
                  {poll.title}
                </h1>

                {poll.description && (
                  <p
                    className="mt-3 text-sm sm:text-[15px] leading-relaxed"
                    style={{
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {poll.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border transition-all duration-200 shrink-0 active:scale-95"
                style={{
                  backgroundColor: isSaved
                    ? `${colors.lavender}12`
                    : 'rgba(255,255,255,0.03)',

                  borderColor: isSaved
                    ? `${colors.lavender}35`
                    : 'rgba(255,255,255,0.08)',
                }}
              >
                {isSaved ? (
                  <BookmarkCheck
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{
                      color: colors.lavender,
                    }}
                  />
                ) : (
                  <Bookmark
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{
                      color: 'rgba(255,255,255,0.35)',
                    }}
                  />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border shadow-none rounded-3xl overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',

            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <CardContent className="p-4 sm:p-6 md:p-8">
            <PollCompleteScreen
              pollTitle={poll.title}
              onViewResults={handleViewResults}
              onShare={handleShare}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundColor: colors.black,
      }}
    >
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <Card
          className="border shadow-none rounded-2xl"
          style={{
            backgroundColor: '#0d0d0d',

            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <CardContent className="px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{
                    color: poll.isPublic ? colors.sage : colors.steel,

                    backgroundColor: poll.isPublic
                      ? `${colors.sage}15`
                      : `${colors.steel}15`,
                  }}
                >
                  {poll.isPublic ? (
                    <>
                      <Globe className="w-3 h-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Private
                    </>
                  )}
                </span>

                <h1 className="text-lg font-semibold text-white leading-snug">
                  {poll.title}
                </h1>

                {poll.description && (
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {poll.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all shrink-0"
                style={{
                  backgroundColor: isSaved
                    ? `${colors.lavender}12`
                    : 'rgba(255,255,255,0.03)',

                  borderColor: isSaved
                    ? `${colors.lavender}35`
                    : 'rgba(255,255,255,0.08)',
                }}
              >
                {isSaved ? (
                  <BookmarkCheck
                    className="w-4 h-4"
                    style={{
                      color: colors.lavender,
                    }}
                  />
                ) : (
                  <Bookmark
                    className="w-4 h-4"
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {poll.isClosed ? (
          <PollClosedScreen
            pollTitle={poll.title}
            closedAt={poll.closedAt}
            totalVotes={poll.totalVotes}
            onViewResults={handleViewResults}
            onShare={handleShare}
          />
        ) : !completed ? (
          <Card
            className="border shadow-none rounded-2xl"
            style={{
              backgroundColor: '#0d0d0d',

              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <CardContent className="px-5 py-6 space-y-6">
              <PollProgressBar
                current={currentIndex + 1}
                total={sorted.length}
              />

              <Separator
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              />

              {current && (
                <QuestionStep
                  question={current}
                  selectedOptionId={selected}
                  showResult={showResult}
                  onSelect={handleSelect}
                  animating={animating}
                />
              )}

              <Separator
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              />

              <PollNavigation
                currentIndex={currentIndex}
                total={sorted.length}
                canGoNext={canGoNext}
                canSubmit={canSubmit}
                onPrev={() => handleNavigate('prev')}
                onNext={() => handleNavigate('next')}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        ) : (
          <Card
            className="border shadow-none rounded-2xl"
            style={{
              backgroundColor: '#0d0d0d',

              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <CardContent className="px-5 py-6">
              <PollCompleteScreen
                pollTitle={poll.title}
                onViewResults={handleViewResults}
                onShare={handleShare}
              />
            </CardContent>
          </Card>
        )}

        {!completed && !poll.isClosed && (
          <p
            className="text-center text-xs"
            style={{
              color: 'rgba(255,255,255,0.15)',
            }}
          >
            {sorted.filter((q) => q.isRequired).length} required question
            {sorted.filter((q) => q.isRequired).length !== 1 ? 's' : ''}
            {' · '}
            {Object.keys(answers).length} of {sorted.length} answered
          </p>
        )}
      </div>
    </div>
  )
}
