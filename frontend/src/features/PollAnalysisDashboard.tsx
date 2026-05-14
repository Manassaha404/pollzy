import AnalyticsHeader from '../components/PollAnalysisDashboardComponents/AnalyticsHeader'
import StatsGrid from '../components/PollAnalysisDashboardComponents/StatsGrid'
import VoteDistributionChart from '../components/PollAnalysisDashboardComponents/VoteDistributionChart'
import SharePollCard from '../components/PollAnalysisDashboardComponents/SharePollCard'
import PollDetailsCard from '#/components/PollAnalysisDashboardComponents/PollDetailsCard'

import { useEffect, useState } from 'react'
import api from '#/api/axios'
import { useParams } from '@tanstack/react-router'

import PageLoader from '#/components/PageLoader'
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

interface GetSubmitData {
  questionId: string
  optionId: string
}

export default function PollAnalyticsPage() {
  const { pollId } = useParams({
    from: '/polls/dashboard/$pollId',
  })

  const [pollData, setPollData] = useState<any>()
  const [questionsData, setQuestionData] = useState<PollQuestionResult[]>([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      try {
        socket.connect()

        socket.emit('join_poll', pollId)

        const { data } = await api.get(`/poll/dashboard/${pollId}`)

        setQuestionData(data.data.questionData)

        setPollData({
          ...data.data.polldata,
          shareUrl: `http://localhost:3000/polls/${pollId}`,
        })
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    getData()

    const handleVoteUpdated = ({ pollData }: { pollData: GetSubmitData[] }) => {
      setQuestionData((prev) => {
        const updated = prev.map((question) => {
          const matchedVotes = pollData.filter((vote) => vote.questionId === question.id)

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

        return updated
      })
      setPollData((prev:any) => ({...prev, totalVotes: prev?.totalVotes + 1}))
    }
    const handelViewUpdated = () => {
      
      
      setPollData((prev:any) => ({...prev, totalViews: prev?.totalViews + 1}))
    }
    socket.on('view_updated', handelViewUpdated)
    socket.on('vote_updated', handleVoteUpdated)

    return () => {
      socket.off('vote_updated', handleVoteUpdated)
      socket.off('view_updated', handelViewUpdated)
      socket.emit('leave_poll', pollId)
      socket.disconnect()
    }
  }, [pollId])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-[93.75rem] space-y-6">
        <AnalyticsHeader poll={pollData} />

        <StatsGrid poll={pollData} />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0 space-y-6">
            <VoteDistributionChart questions={questionsData} />
          </div>

          <div className="xl:sticky xl:top-6">
            <div className="space-y-6">
              <SharePollCard poll={pollData} />

              <PollDetailsCard poll={pollData as any} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
