import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar.tsx'
import { useRefreshToken } from '#/hooks/useRefreshToken.ts'
import { useGuestToken } from '../hooks/useGuestToken.ts'
import PageLoader from '#/components/PageLoader.tsx'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const refreshLoading = useRefreshToken()
  const guestLoading = useGuestToken()

  const loading = refreshLoading || guestLoading

  if (loading) return <PageLoader />

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}