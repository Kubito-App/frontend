import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { api } from '@/config/axios'
import { WithAuthentication } from '@/hocs/with-authentication'
import { useToast } from '@/hooks/use-toast'
import { isAuthenticatedAtom, userAtom } from '@/store/atoms'
import { ensureError, getUserInfo } from '@/utils/helpers'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { useSetAtom } from 'jotai'
import { motion } from 'motion/react'
import { useState } from 'react'
import styles from './login.module.scss'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <WithAuthentication inverse>
      <Component />
    </WithAuthentication>
  )
}

function Component() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useSetAtom(userAtom)
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { session, user: _user } = data

      if (session?.access_token) {
        const user = getUserInfo(_user)
        localStorage.setItem('auth_token', session.access_token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        setIsAuthenticated(true)
        navigate({ to: '/' })
      }
    } catch (error) {
      const err = ensureError(error)
      const errorTitle =
        error instanceof AxiosError
          ? error?.response?.data?.error
          : err.message || 'Invalid credentials'
      toast('Login failed', errorTitle, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to your Kubito account</p>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <Input
            type='email'
            label='Email'
            placeholder='you@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            disabled={isLoading}
          />

          <Input
            type='password'
            label='Password'
            placeholder='••••••••'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            disabled={isLoading}
          />

          <Button
            type='submit'
            loading={isLoading}
            size='lg'
            className={styles.submitButton}
          >
            Log In
          </Button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <button
            type='button'
            className={styles.link}
            onClick={() => navigate({ to: '/register' })}
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  )
}
