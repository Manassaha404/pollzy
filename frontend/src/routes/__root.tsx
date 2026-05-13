import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar.tsx'
import appCss from '../styles.css?url'
import { useRefreshToken } from '#/hooks/useRefreshToken.ts'
import PageLoader from '#/components/PageLoader.tsx'
import { useGuestToken } from '../hooks/useGuestToken.ts'
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Pollzy' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  let loading = useRefreshToken()
  let guestTokenloading = useGuestToken()
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-black text-white antialiased">
        {loading && guestTokenloading ? (
          <PageLoader />
        ) : (
          <>
            <Navbar />
            {children}
          </>
        )}
        <Scripts />
      </body>
    </html>
  )
}
