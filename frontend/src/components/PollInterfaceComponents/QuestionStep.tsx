import { Badge } from '@/components/ui/badge'
import { OptionButton } from './OptionButton'
import colors from '../../constants/COLORS'

export interface OptionData {
  id: string
  text: string
  orderIndex: number
  voteCount: number
}

export interface QuestionData {
  id: string
  text: string
  isRequired: boolean
  orderIndex: number
  options: OptionData[]
}

interface QuestionStepProps {
  question: QuestionData
  selectedOptionId: string | null
  showResult: boolean          
  onSelect: (optionId: string) => void
  animating: boolean
}

export function QuestionStep({
  question,
  selectedOptionId,
  showResult,
  onSelect,
  animating,
}: QuestionStepProps) {
  const totalVotes = question.options.reduce((acc, o) => acc + o.voteCount, 0)
  const sorted     = [...question.options].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div
      className="space-y-5 transition-all duration-300"
      style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(10px)' : 'translateY(0)' }}
    >
      
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <p className="text-lg font-semibold text-white leading-snug flex-1">
            {question.text}
          </p>
          {question.isRequired && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 shrink-0 font-semibold uppercase tracking-wider rounded-md mt-0.5"
              style={{
                color: colors.lavender,
                backgroundColor: `${colors.lavender}12`,
                borderColor: `${colors.lavender}30`,
              }}
            >
              Required
            </Badge>
          )}
        </div>

        {showResult && totalVotes > 0 && (
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''} so far
          </p>
        )}
      </div>


      <div className="space-y-2.5">
        {sorted.map((option, i) => (
          <OptionButton
            key={option.id}
            label={option.text}
            index={i}
            selected={selectedOptionId === option.id}
            showResult={showResult && selectedOptionId !== null}
            voteCount={option.voteCount}
            totalVotes={totalVotes}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  )
}