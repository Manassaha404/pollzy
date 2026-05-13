import { GripVertical, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { OptionItem } from './OptionItem.js'
import colors from '../../constants/COLORS.js'

export interface OptionDraft {
  id: string        
  text: string
  orderIndex: number
}

export interface QuestionDraft {
  id: string
  text: string
  isRequired: boolean
  orderIndex: number
  options: OptionDraft[]
}

interface QuestionCardProps {
  question: QuestionDraft
  index: number
  totalQuestions: number
  onChange: (updated: QuestionDraft) => void
  onDelete: () => void
}

export function QuestionCard({
  question,
  index,
  totalQuestions,
  onChange,
  onDelete,
}: QuestionCardProps) {

  function updateText(text: string) {
    onChange({ ...question, text })
  }

  function toggleRequired() {
    onChange({ ...question, isRequired: !question.isRequired })
  }

  function addOption() {
    const newOption: OptionDraft = {
      id: crypto.randomUUID(),
      text: '',
      orderIndex: question.options.length,
    }
    onChange({ ...question, options: [...question.options, newOption] })
  }

  function updateOption(optionId: string, text: string) {
    onChange({
      ...question,
      options: question.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
    })
  }

  function deleteOption(optionId: string) {
    onChange({
      ...question,
      options: question.options
        .filter((o) => o.id !== optionId)
        .map((o, i) => ({ ...o, orderIndex: i })),
    })
  }

  return (
    <Card
      className="border shadow-none rounded-2xl transition-all duration-200 group/card"
      style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <CardContent className="px-5 py-5 space-y-4">

        <div className="flex items-start gap-3">
          <div className="cursor-grab opacity-0 group-hover/card:opacity-100 transition-opacity pt-0.5 shrink-0">
            <GripVertical className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>

          <span
            className="flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 mt-0.5"
            style={{ backgroundColor: `${colors.sage}20`, color: colors.sage }}
          >
            {index + 1}
          </span>

          <input
            type="text"
            value={question.text}
            onChange={(e) => updateText(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-white/15"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          />

          <button
            type="button"
            onClick={toggleRequired}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all shrink-0"
            style={{
              color: question.isRequired ? colors.lavender : 'rgba(255,255,255,0.25)',
              backgroundColor: question.isRequired ? `${colors.lavender}12` : 'transparent',
              borderColor: question.isRequired ? `${colors.lavender}35` : 'rgba(255,255,255,0.07)',
            }}
          >
            {question.isRequired
              ? <ToggleRight className="w-3.5 h-3.5" />
              : <ToggleLeft className="w-3.5 h-3.5" />
            }
            Required
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={totalQuestions === 1}
            className="p-1.5 rounded-lg border transition-all shrink-0 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              color: 'rgba(252,165,165,0.6)',
              borderColor: 'rgba(239,68,68,0.15)',
              backgroundColor: 'rgba(239,68,68,0.05)',
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <Separator style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />

        
        <div className="space-y-2.5 pl-9">
          {question.options.map((option, i) => (
            <OptionItem
              key={option.id}
              index={i}
              value={option.text}
              onChange={(text) => updateOption(option.id, text)}
              onDelete={() => deleteOption(option.id)}
              canDelete={question.options.length > 2}
            />
          ))}

         
          <button
            type="button"
            onClick={addOption}
            disabled={question.options.length >= 10}
            className="flex items-center gap-2 mt-1 text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: `${colors.sage}99` }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add option
            {question.options.length >= 10 && (
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                (max 10)
              </span>
            )}
          </button>
        </div>

      </CardContent>
    </Card>
  )
}