import SavedPollsPage from '#/features/SavedPollsPage'
import { useUserInfoStore } from '#/store/userInfoStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/polls/savedPolls')({
  beforeLoad: () => {
    const accessToken = useUserInfoStore.getState().accessToken
    if (!accessToken) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <SavedPollsPage />
}
