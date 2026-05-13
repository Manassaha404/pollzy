import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import colors from '#/constants/COLORS'

export function PollNavigation({
  currentIndex,
  total,
  canGoNext,
  canSubmit,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting,
}: {
  currentIndex: number
  total: number
  canGoNext: boolean
  canSubmit: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
}) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onPrev}
        disabled={isFirst}
        className="h-10 px-4 rounded-xl text-sm border transition-colors disabled:opacity-30"
        style={{
          color: 'rgba(255,255,255,0.4)',
          borderColor: 'rgba(255,255,255,0.08)',
          backgroundColor: 'transparent',
        }}
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      {isLast ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="h-10 px-6 rounded-xl text-sm font-semibold text-black transition-colors disabled:opacity-50"
          style={{ backgroundColor: colors.sage }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Submitting…
            </span>
          ) : (
            'Submit Answers'
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="h-10 px-5 rounded-xl text-sm font-semibold text-black transition-colors disabled:opacity-40"
          style={{
            backgroundColor: canGoNext ? colors.sage : 'rgba(255,255,255,0.1)',
          }}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  )
}
