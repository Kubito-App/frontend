import { MobileHeader } from '@/components/mobile-header'
import { Navbar } from '@/components/navbar'
import { ToastProvider } from '@/components/Toast'
import { useMobile } from '@/hooks/use-mobile'
import '@/styles/globals.scss'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import styles from './__root.module.scss'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { isMedium } = useMobile()

  return (
    <ToastProvider>
      <div className={styles.layout}>
        {isMedium ? <MobileHeader /> : <Navbar />}
        <main>
          <Outlet />
        </main>
        {isMedium && <Navbar />}
      </div>
    </ToastProvider>
  )
}
