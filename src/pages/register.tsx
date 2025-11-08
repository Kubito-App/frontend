import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { api } from '@/config/axios'
import { WithAuthentication } from '@/hocs/with-authentication'
import { useToast } from '@/hooks/use-toast'
import { isAuthenticatedAtom, userAtom } from '@/store/atoms'
import { ensureError } from '@/utils/helpers'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { useSetAtom } from 'jotai'
import { motion } from 'motion/react'
import { useState } from 'react'
import styles from './login.module.scss'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
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
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useSetAtom(userAtom)
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        username,
      })
      const { session, user } = response.data

      if (session?.access_token) {
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
          ? error.response?.data?.error
          : err.message || 'Please try again'
      toast('Registration failed', errorTitle, 'error')
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
        <h1 className={styles.title}>Join Kubito</h1>
        <p className={styles.subtitle}>Discover trending products</p>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <Input
            type='text'
            label='Username'
            placeholder='johndoe'
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            disabled={isLoading}
          />

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
            Create Account
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <button
            type='button'
            className={styles.link}
            onClick={() => navigate({ to: '/login' })}
            disabled={isLoading}
          >
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  )
}
