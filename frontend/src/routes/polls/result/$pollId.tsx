import PollResultsPage from '#/features/PollResultsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/polls/result/$pollId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <PollResultsPage/>
  </>
}
