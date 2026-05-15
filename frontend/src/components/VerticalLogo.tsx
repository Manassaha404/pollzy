import { useNavigate } from '@tanstack/react-router'
import { BarChart2 } from 'lucide-react'

const VerticalLogo = () => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => {
        navigate({
          to: '/',
          replace: true,
        })
      }}
      className="flex flex-1 shrink-0 items-center gap-2 cursor-pointer"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8FB3A1]">
        <BarChart2 size={16} className="text-black" />
      </div>
      <span className="text-base font-bold tracking-wide text-white">
        Poll<span className="text-[#8FB3A1]">zy</span>
      </span>
    </div>
  )
}

export default VerticalLogo
