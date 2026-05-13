import { useEffect, useState } from 'react'
import { useParams, useRouter } from '@tanstack/react-router'
import colors from '../constants/COLORS.js'
import { PollHeader } from '../components/DraftPollComponents/PollHeader.js'
import type { Poll } from '#/types/polls.js'
import {
  QuestionCard,
  type QuestionDraft,
} from '../components/DraftPollComponents/QuestionCard.js'
import { AddQuestionButton } from '../components/DraftPollComponents/AddQuestionButton.js'
import { SidebarSummary } from '#/components/DraftPollComponents/SidebarSummary.js'
import api from '#/api/axios.js'
import { PollSkeleton } from '#/components/CreatedPollsComponents/PollSkeleton.js'

function makeQuestion(orderIndex: number): QuestionDraft {
  return {
    id: crypto.randomUUID(),
    text: '',
    isRequired: false,
    orderIndex,
    options: [
      { id: crypto.randomUUID(), text: '', orderIndex: 0 },
      { id: crypto.randomUUID(), text: '', orderIndex: 1 },
    ],
  }
}

export function DraftPollPage() {
  const [poll, setPoll] = useState<Poll>()
  const [isPublishing, setIsPublishing] = useState(false)
  const [questions, setQuestions] = useState<QuestionDraft[]>([makeQuestion(0)])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { pollId } = useParams({ from: '/polls/draft/$pollId' })
  const router = useRouter()
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const responce = await api.get(`/poll/polldata/${pollId}`)
        setPoll(responce.data.data)
      } catch (error) {
        throw error
      } finally {
        setIsLoading(false)
      }
    }
    fetchPoll()
  }, [])

  function addQuestion() {
    setQuestions((prev) => [...prev, makeQuestion(prev.length)])
  }

  function updateQuestion(id: string, updated: QuestionDraft) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)))
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) =>
      prev.filter((q) => q.id !== id).map((q, i) => ({ ...q, orderIndex: i })),
    )
  }

  async function handlePublish() {
    setIsPublishing(true)
    try {
      const { data } = await api.post('/poll/publishpoll', {
        pollId: poll?.id,
        questionsData: questions,
      })
      if (data.success) {
        router.navigate({
          to: `/polls/dashboard/${pollId}`,
          replace: true
        })
      }
    } finally {
      setIsPublishing(false)
    }
  }
  async function handelDelete() {
    try {
      await api.delete(`/poll/deletepoll/${pollId}`)
      router.history.back()
    } catch (error) {}
  }

  if (isLoading) {
    return <PollSkeleton />
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.black }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <PollHeader
          title={poll?.title || ''}
          description={poll?.description}
          isPublic={poll?.isPublic || true}
          isPublishing={isPublishing}
          onEdit={() => console.log('edit')}
          onDelete={handelDelete}
          onPublish={handlePublish}
          onPreview={() => console.log('preview')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6 items-start">
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                totalQuestions={questions.length}
                onChange={(updated) => updateQuestion(question.id, updated)}
                onDelete={() => deleteQuestion(question.id)}
              />
            ))}

            <AddQuestionButton
              onClick={addQuestion}
              disabled={questions.length >= 20}
            />

            {questions.length >= 20 && (
              <p
                className="text-center text-xs"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                Maximum 20 questions per poll.
              </p>
            )}
          </div>

          <SidebarSummary questions={questions} />
        </div>
      </div>
    </div>
  )
}
