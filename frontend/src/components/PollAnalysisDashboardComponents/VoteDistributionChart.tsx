import colors from '../../constants/COLORS'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

import { BarChart3 } from 'lucide-react'

interface Option {
  text: string
  votes: number
}

interface Question {
  id: string
  text: string
  options: Option[]
}

interface Props {
  questions: Question[]
}

const PIE_COLORS = [colors.sage, colors.steel, colors.lavender, '#A7F3D0', '#C4B5FD']

export default function VoteDistributionChart({ questions }: Props) {
  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => {
        const totalVotes = question.options.reduce((acc, curr) => acc + curr.votes, 0)
        
        
        const chartData = question.options.map((option) => ({
          name: option.text,
          value: totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100),
          votes: option.votes,
        }))

        const hasNoVotes = totalVotes === 0

        return (
          <Card
            key={question.id}
            className="rounded-3xl border shadow-none"
            style={{
              backgroundColor: '#0d0d0d',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs tracking-wider uppercase"
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    Question {questionIndex + 1}
                  </p>

                  <CardTitle className="mt-1 text-xl leading-relaxed text-white">
                    {question.text}
                  </CardTitle>
                </div>

                <div
                  className="shrink-0 rounded-xl px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {totalVotes} votes
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {hasNoVotes ? (
                <div
                  className="flex flex-col items-center justify-center rounded-3xl px-6 py-20 text-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <BarChart3
                      className="h-8 w-8"
                      style={{
                        color: 'rgba(255,255,255,0.35)',
                      }}
                    />
                  </div>

                  <h3 className="text-lg font-medium text-white">No votes yet</h3>

                  <p
                    className="mt-2 max-w-md text-sm"
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    Vote distribution will appear here once people start participating in
                    this poll.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={60}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {chartData.map((item, i) => (
                      <div
                        key={item.name}
                        className="rounded-2xl p-4"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="h-3 w-3 shrink-0 rounded-full"
                              style={{
                                backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                              }}
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm text-white">{item.name}</p>

                              <p
                                className="mt-1 text-xs"
                                style={{
                                  color: 'rgba(255,255,255,0.35)',
                                }}
                              >
                                {item.votes} votes
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <p
                              className="text-xl font-semibold"
                              style={{
                                color: PIE_COLORS[i % PIE_COLORS.length],
                              }}
                            >
                              {item.value}%
                            </p>
                          </div>
                        </div>

                        <div
                          className="mt-4 h-2 overflow-hidden rounded-full"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.value}%`,
                              backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
