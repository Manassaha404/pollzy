import { createFileRoute } from '@tanstack/react-router'
import HomePage from '../features/HomePage.tsx'
export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <HomePage />
    </>
  )
}
