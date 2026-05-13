import { Plus } from 'lucide-react'
import colors from '../../constants/COLORS.js'

interface AddQuestionButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function AddQuestionButton({ onClick, disabled }: AddQuestionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed
                 text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
                 hover:border-opacity-60"
      style={{
        borderColor: `${colors.sage}35`,
        color: `${colors.sage}80`,
        backgroundColor: `${colors.sage}06`,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = `${colors.sage}0F`
          e.currentTarget.style.color = colors.sage
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `${colors.sage}06`
        e.currentTarget.style.color = `${colors.sage}80`
      }}
    >
      <Plus className="w-4 h-4" />
      Add Question
    </button>
  )
}