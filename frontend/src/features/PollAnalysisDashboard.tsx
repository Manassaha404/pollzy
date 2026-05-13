import AnalyticsHeader from '../components/PollAnalysisDashboardComponents/AnalyticsHeader'
import StatsGrid from '../components/PollAnalysisDashboardComponents/StatsGrid'
import VoteDistributionChart from '../components/PollAnalysisDashboardComponents/VoteDistributionChart'
import SharePollCard from '../components/PollAnalysisDashboardComponents/SharePollCard'
import PollDetailsCard from '#/components/PollAnalysisDashboardComponents/PollDetailsCard'
import { useEffect, useState } from 'react'
import api from '#/api/axios'
import { useParams } from '@tanstack/react-router'
import PageLoader from '#/components/PageLoader'




export default function PollAnalyticsPage() {
  const { pollId } = useParams({ from: '/polls/dashboard/$pollId' })
  const [pollData, setPollData] = useState()
  const [questionsData, setQuestionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get(`/poll/dashboard/${pollId}`)
        console.log(data.data)
        setQuestionData(data.data.questionData)
        setPollData({
          ...data.data.polldata,
          shareUrl: `http://localhost:3000/polls/${pollId}`,
        })
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }
    getData()
  }, [pollId])


  return isLoading ? (
  <PageLoader/>
) : (
  <div className="min-h-screen px-4 md:px-6 py-8">
    <div className="max-w-[93.75rem] mx-auto space-y-6">
      <AnalyticsHeader poll={pollData} />

      <StatsGrid poll={pollData} />

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        <div className="space-y-6 min-w-0">
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
);
  
}
