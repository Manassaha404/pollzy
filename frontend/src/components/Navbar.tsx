'use client'

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUserInfoStore } from '#/store/userInfoStore'
import {
  LayoutGrid,
  Bookmark,
  Plus,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import VerticalLogo from './VerticalLogo'
import { useLogout } from '#/hooks/useLogout'

const NAV_LINKS = [
  { label: 'View public polls', icon: LayoutGrid, to: '/' },
  { label: 'Saved', icon: Bookmark, to: '/saved' },
]

export const Navbar = () => {
  const accessToken = useUserInfoStore((state) => state.accessToken)
  const [activeNav, setActiveNav] = useState('View public polls')
  const navigate = useNavigate()
  const logout = useLogout()

  return (
    <div className="px-4 sticky top-4 z-50">
      <nav className="mx-auto max-w-3xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between px-5 h-12 gap-4">
          <VerticalLogo />
          <div className="flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ label, icon: Icon, to }) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveNav(label)
                  navigate({ to })
                }}
                className={cn(
                  'gap-2 text-[#888] hover:text-white hover:bg-white/5 text-xs',
                  activeNav === label &&
                    'text-[#B8C8D9] bg-white/5 hover:bg-white/5 hover:text-[#B8C8D9] border border-white/10',
                )}
              >
                <Icon size={13} />
                {label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => {
                navigate({ to: '/polls/new' })
              }}
              size="sm"
              className="gap-2 bg-[#8FB3A1] text-black hover:bg-[#a3c4b5] text-xs h-8"
            >
              <Plus size={13} />
              Create a poll
            </Button>

            <Separator orientation="vertical" className="h-4 bg-white/10" />

            {accessToken ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-white/10 bg-transparent text-[#888] hover:text-white hover:bg-white/5 hover:border-white/20 cursor-pointer text-xs h-8"
                  onClick={async () => await logout()}
                >
                  <LogOut size={13} />
                  Log out
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate({
                      to: '/polls/createdpolls',
                    })
                  }}
                  className="gap-2 border-white/10 bg-transparent text-[#888] hover:text-white hover:bg-white/5 hover:border-white/20 cursor-pointer text-xs h-8"
                >
                  See Your Polls
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-white/10 bg-transparent text-[#888] hover:text-white hover:bg-white/5 hover:border-white/20 cursor-pointer text-xs h-8"
                  onClick={() => navigate({ to: '/login' })}
                >
                  <LogIn size={13} />
                  Log in
                </Button>

                <Button
                  size="sm"
                  className="gap-2 bg-[#E9DFF2] text-black hover:bg-[#f0e8ff] cursor-pointer text-xs h-8"
                  onClick={() => navigate({ to: '/register' })}
                >
                  <UserPlus size={13} />
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
