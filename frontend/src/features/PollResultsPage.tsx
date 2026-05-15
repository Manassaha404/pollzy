import { useEffect, useState } from 'react'

import { useParams } from '@tanstack/react-router'

import PollResultsScreen from '../components/PollResultsScreen'

import PageLoader from '#/components/PageLoader'
import api from '#/api/axios'
import socket from '#/socket/socket.io'

interface PollOptionResult {
  id: string
  text: string
  votes: number
}

interface PollQuestionResult {
  id: string
  text: string
  isRequired: boolean
  options: PollOptionResult[]
}

interface PollData {
  title: string
  totalViews: number
  totalVotes: number
  totalQuestions: number
  totalOptions: number
}

interface PollResultsResponse {
  polldata: PollData
  questionData: PollQuestionResult[]
}

interface GetSubmitData {
  questionId: string
  optionId: string
}

export default function PollResultsPage() {
  const { pollId } = useParams({
    from: '/polls/result/$pollId',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [polldata, setPollData] = useState<PollData | null>(null)
  const [questionData, setQuestionData] = useState<PollQuestionResult[]>([])

  useEffect(() => {
    let ignore = false

    async function getData() {
      try {
        if (!socket.connected) {
          socket.connect()
        }

        socket.emit('join_poll', pollId)

        const { data } = await api.get<{
          data: PollResultsResponse
        }>(`/poll/dashboard/${pollId}`)

        if (ignore) return

        setQuestionData(data.data.questionData)

        setPollData({
          ...data.data.polldata,
        })
      } catch (error) {
        console.error('Failed to fetch poll results:', error)
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    getData()

    const handleVoteUpdated = ({
      pollData,
    }: {
      pollData: GetSubmitData[]
    }) => {
      setQuestionData((prev) => {
        return prev.map((question) => {
          const matchedVotes = pollData.filter(
            (vote) => vote.questionId === question.id,
          )

          if (matchedVotes.length === 0) {
            return question
          }

          return {
            ...question,
            options: question.options.map((option) => {
              const shouldIncrease = matchedVotes.some(
                (vote) => vote.optionId === option.id,
              )

              if (!shouldIncrease) {
                return option
              }

              return {
                ...option,
                votes: option.votes + 1,
              }
            }),
          }
        })
      })

      setPollData((prev) =>
        prev
          ? {
              ...prev,
              totalVotes: prev.totalVotes + 1,
            }
          : prev,
      )
    }

    const handleViewUpdated = () => {
      setPollData((prev) =>
        prev
          ? {
              ...prev,
              totalViews: prev.totalViews + 1,
            }
          : prev,
      )
    }

    socket.off('vote_updated', handleVoteUpdated)
    socket.on('vote_updated', handleVoteUpdated)

    socket.off('view_updated', handleViewUpdated)
    socket.on('view_updated', handleViewUpdated)

    return () => {
      ignore = true

      socket.emit('leave_poll', pollId)

      socket.off('vote_updated', handleVoteUpdated)
      socket.off('view_updated', handleViewUpdated)
    }
  }, [pollId])

  



  if (isLoading || !polldata) {
    return <PageLoader />
  }

  return (
    <div className="w-full px-4 py-6">
      <PollResultsScreen
        polldata={polldata}
        questionData={questionData}
      />
    </div>
  )
}