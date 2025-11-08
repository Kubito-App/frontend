import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import LoadingView from './components/loading-view'
import { useAuth } from './hooks/use-auth'
import { routeTree } from './routeTree.gen'
import { sessionLoadingAtom } from './store/atoms'

// Create the router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingView,
  defaultPendingMs: 0,
  defaultPendingMinMs: 0,
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
  const sessionLoading = useAtomValue(sessionLoadingAtom)
  useAuth()
  if (sessionLoading) return <LoadingView />
  return <RouterProvider router={router} />
}

export default App
