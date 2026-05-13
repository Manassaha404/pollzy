// PollResultsScreen.tsx

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Eye, Vote, ListChecks } from 'lucide-react'

import colors from '#/constants/COLORS'

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

interface PollResultsScreenProps {
  polldata: PollData
  questionData: PollQuestionResult[]
}

function VoteProgress({
  value,
}: {
  value: number
}) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden bg-white/10">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          backgroundColor: colors.sage,
        }}
      />
    </div>
  )
}

export default function PollResultsScreen({
  polldata,
  questionData,
}: PollResultsScreenProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <Card
        className="rounded-2xl border shadow-none"
        style={{
          backgroundColor: '#0d0d0d',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <CardContent className="p-5 space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {polldata.title}
            </h1>

            <p
              className="text-sm mt-1"
              style={{ color: colors.steel }}
            >
              Poll Results Dashboard
            </p>
          </div>

          <Separator className="bg-white/10" />

          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <Vote size={16} color={colors.sage} />
                <span
                  className="text-sm"
                  style={{ color: colors.steel }}
                >
                  Total Votes
                </span>
              </div>

              <p className="text-2xl font-bold text-white mt-2">
                {polldata.totalVotes}
              </p>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <Eye size={16} color={colors.sage} />
                <span
                  className="text-sm"
                  style={{ color: colors.steel }}
                >
                  Total Views
                </span>
              </div>

              <p className="text-2xl font-bold text-white mt-2">
                {polldata.totalViews}
              </p>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <ListChecks size={16} color={colors.sage} />
                <span
                  className="text-sm"
                  style={{ color: colors.steel }}
                >
                  Questions
                </span>
              </div>

              <p className="text-2xl font-bold text-white mt-2">
                {polldata.totalQuestions}
              </p>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <ListChecks size={16} color={colors.sage} />
                <span
                  className="text-sm"
                  style={{ color: colors.steel }}
                >
                  Options
                </span>
              </div>

              <p className="text-2xl font-bold text-white mt-2">
                {polldata.totalOptions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      {questionData.map((question, index) => {
        const totalQuestionVotes = question.options.reduce(
          (acc, curr) => acc + curr.votes,
          0,
        )

        return (
          <Card
            key={question.id}
            className="rounded-2xl border shadow-none"
            style={{
              backgroundColor: '#0d0d0d',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <CardContent className="p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-white font-medium text-base">
                    Q{index + 1}. {question.text}
                  </h2>

                  {question.isRequired && (
                    <div
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: colors.lavender,
                        color: colors.black,
                      }}
                    >
                      Required
                    </div>
                  )}
                </div>

                <p
                  className="text-sm mt-2"
                  style={{ color: colors.steel }}
                >
                  {totalQuestionVotes} votes
                </p>
              </div>

              <div className="space-y-4">
                {question.options.map((option) => {
                  const percentage =
                    totalQuestionVotes === 0
                      ? 0
                      : Math.round(
                          (option.votes / totalQuestionVotes) * 100,
                        )

                  return (
                    <div
                      key={option.id}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white">
                          {option.text}
                        </p>

                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.sage }}
                        >
                          {percentage}%
                        </p>
                      </div>

                      <VoteProgress value={percentage} />

                      <div className="flex justify-between">
                        <span
                          className="text-xs"
                          style={{ color: colors.steel }}
                        >
                          {option.votes} votes
                        </span>

                        <span
                          className="text-xs"
                          style={{ color: colors.steel }}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}