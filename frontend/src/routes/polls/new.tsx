import CreateNewPollPage from '#/features/CreateNewPollPage'
import { useUserInfoStore } from '#/store/userInfoStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/polls/new')({
  beforeLoad: async () => {
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
      <CreateNewPollPage />
    </>
  )
}
