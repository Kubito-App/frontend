import LoadingView from '@/components/loading-view'
import { isAuthenticatedAtom, sessionLoadingAtom } from '@/store/atoms'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import type { ReactNode } from 'react'

interface Props {
  inverse?: boolean
  children: ReactNode
}

export const WithAuthentication = ({ inverse, children }: Props) => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const sessionLoading = useAtomValue(sessionLoadingAtom)
  const navigate = useNavigate()

  const renderBlocked = !inverse && !isAuthenticated
  const renderBlockedInverse = inverse && isAuthenticated

  if (sessionLoading && !isAuthenticated) return <LoadingView />

  if (renderBlocked) {
    navigate({ to: '/login', replace: true })
    return null
  }
  if (renderBlockedInverse) {
    navigate({ to: '/', replace: true })
    return null
  }

  return children
}
