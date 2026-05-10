import { BarChart2 } from 'lucide-react'

const VerticalLogo = () => {
  return (
    <div className="flex flex-1 items-center gap-2 shrink-0">
      <div className="w-8 h-8 rounded-lg bg-[#8FB3A1] flex items-center justify-center">
        <BarChart2 size={16} className="text-black" />
      </div>
      <span className="text-white font-bold text-base tracking-wide">
        Poll<span className="text-[#8FB3A1]">zy</span>
      </span>
    </div>
  )
}

export default VerticalLogo
