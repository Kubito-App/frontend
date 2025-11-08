import { api } from '@/config/axios'
import { isAuthenticatedAtom, sessionLoadingAtom, userAtom } from '@/store/atoms'
import { useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

export const useAuth = () => {
  const setUser = useSetAtom(userAtom)
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom)
  const setSessionLoading = useSetAtom(sessionLoadingAtom)

  const navigate = useNavigate()

  const token = localStorage.getItem('auth_token')
  const user = localStorage.getItem('user')

  useEffect(() => {
    validateSession()
  }, [])

  async function validateSession() {
    try {
      if (!token || !user) throw Error('No auth token')
      const { data } = await api.get('/auth/me')
      if (data.error) throw Error(data.error)
      console.log('data: ', data)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (err) {
      console.error('Error validating session', err)
      navigate({ to: '/', replace: true })
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
    } finally {
      setSessionLoading(false)
    }
  }
}
