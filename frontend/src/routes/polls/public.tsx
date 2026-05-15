import PublicPollsPage from '#/features/PublicPollsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/polls/public')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PublicPollsPage/>
}