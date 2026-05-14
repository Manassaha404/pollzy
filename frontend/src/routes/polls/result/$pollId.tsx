import PollResultsPage from '#/features/PollResultsPage'
import { useUserInfoStore } from '#/store/userInfoStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/polls/result/$pollId')({
  beforeLoad: () => {
    const accessToken = useUserInfoStore.getState().accessToken
    if (!accessToken) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PollResultsPage />
    </>
  )
}
