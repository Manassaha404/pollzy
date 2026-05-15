import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar.tsx'
import { useAuthInit } from '#/hooks/useAuthInit.ts' // <-- Use the new hook
import PageLoader from '#/components/PageLoader.tsx'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const loading = useAuthInit();

  if (loading) return <PageLoader />

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}