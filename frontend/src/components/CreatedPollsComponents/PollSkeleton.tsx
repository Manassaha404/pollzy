export function PollSkeleton() {
  return (
    <div
      className="rounded-2xl border px-5 py-5 space-y-4 animate-pulse"
      style={{
        backgroundColor: '#0d0d0d',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div
            className="h-3.5 rounded-md w-2/3"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
          />
          <div
            className="h-3 rounded-md w-1/2"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
          />
        </div>
        <div
          className="h-5 w-14 rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        />
      </div>
      <div
        className="h-px"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      />
      <div className="flex gap-3">
        <div
          className="h-3 w-14 rounded-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        />
        <div
          className="h-3 w-20 rounded-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        />
        <div
          className="h-3 w-16 rounded-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        />
      </div>
    </div>
  )
}