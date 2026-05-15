export function NoMoreData() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <div
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      />
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
        You've reached the end
      </p>
    </div>
  )
}
