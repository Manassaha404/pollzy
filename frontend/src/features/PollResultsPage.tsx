// PollResultsPage.tsx

import { useEffect, useMemo, useState } from 'react'

import PollResultsScreen from '../components/PollResultsScreen'
import { useParams } from '@tanstack/react-router'
import PageLoader from '#/components/PageLoader'
import api from '#/api/axios'

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

export default function PollResultsPage() {
  const { pollId } = useParams({ from: '/polls/result/$pollId' })

  const [isLoading, setIsLoading] = useState(true)
  const [polldata, setPollData] = useState<PollData | null>(null)
  const [questionData, setQuestionData] = useState<PollQuestionResult[]>([])

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get(`/poll/dashboard/${pollId}`)
        console.log(data.data)
        setQuestionData(data.data.questionData)
        setPollData({
          ...data.data.polldata,
        })
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }
    getData()
  }, [pollId])

  const analytics = useMemo(() => {
    const mostVotedOptionPerQuestion = questionData.map((question) => {
      const topOption = [...question.options].sort(
        (a, b) => b.votes - a.votes,
      )[0]

      return {
        questionId: question.id,
        questionText: question.text,
        topOption,
      }
    })

    const totalQuestionVotes = questionData.map((question) => ({
      questionId: question.id,
      totalVotes: question.options.reduce((acc, curr) => acc + curr.votes, 0),
    }))

    return {
      mostVotedOptionPerQuestion,
      totalQuestionVotes,
    }
  }, [questionData])

  console.log('poll analytics', analytics)

  if (!polldata) {
    return <PageLoader />
  }
  return (
    <div className="w-full px-4 py-6">
      <PollResultsScreen polldata={polldata} questionData={questionData} />
    </div>
  )
}
