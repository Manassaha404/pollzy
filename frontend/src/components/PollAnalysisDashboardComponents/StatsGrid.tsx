
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Vote, Layers3, ListChecks } from 'lucide-react'

const stats = [
  {
    label: 'Total Views',
    key: 'totalViews',
    icon: Eye,
    color: '#8FB3A1',
  },
  {
    label: 'Total Votes',
    key: 'totalVotes',
    icon: Vote,
    color: '#E9DFF2',
  },
  {
    label: 'Questions',
    key: 'totalQuestions',
    icon: Layers3,
    color: '#B8C8D9',
  },
  {
    label: 'Options',
    key: 'totalOptions',
    icon: ListChecks,
    color: '#8FB3A1',
  },
]

export default function StatsGrid({ poll }: any) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon

        return (
          <Card
            key={s.key}
            className="rounded-3xl border shadow-none"
            style={{
              backgroundColor: '#0d0d0d',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-sm"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    {s.label}
                  </p>

                  <h2 className="text-3xl font-semibold mt-2 text-white">
                    {poll[s.key]}
                  </h2>
                </div>

                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${s.color}15`,
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: s.color,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}