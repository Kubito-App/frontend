import { Navbar } from '@/components/navbar'
import { ToastProvider } from '@/components/Toast'
import { useMobile } from '@/hooks/use-mobile'
import '@/styles/globals.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import styles from './__root.module.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { isMedium } = useMobile()

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className={styles.layout}>
          {!isMedium && <Navbar />}
          <main>
            <Outlet />
          </main>
          {isMedium && <Navbar />}
        </div>
      </ToastProvider>
    </QueryClientProvider>
  )
}
