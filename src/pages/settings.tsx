import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { api } from '@/config/axios'
import { WithAuthentication } from '@/hocs/with-authentication'
import { useToast } from '@/hooks/use-toast'
import { userAtom } from '@/store/atoms'
import type { EditUserPayload } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { useState } from 'react'
import styles from './settings.module.scss'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  return (
    <WithAuthentication>
      <Component />
    </WithAuthentication>
  )
}

interface IOption {
  title: string
}

const OPTIONS: Array<IOption> = [{ title: 'Edit Profile' }]

function Component() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const user = useAtomValue(userAtom)

  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')

  const updateMutation = useMutation({
    mutationFn: async (payload: EditUserPayload) => {
      const { data } = await api.put('/users/profile', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast('Profile updated successfully', undefined, 'success')
    },
    onError: () => {
      toast('Failed to update profile', undefined, 'error')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({ username, bio, avatar_url: avatarUrl })
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>Manage your account settings</p>

      <section>
        <div className={styles.sidebar}>
          {OPTIONS.map(option => (
            <span key={option.title}>{option.title}</span>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <Input
            label='Username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
          />

          <div className={styles.field}>
            <label className={styles.label}>Bio</label>
            <textarea
              className={styles.textarea}
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              placeholder='Tell us about yourself...'
            />
          </div>

          <Input
            label='Avatar URL'
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            placeholder='https://example.com/avatar.jpg'
            fullWidth
          />

          <Button
            type='submit'
            size='lg'
            loading={updateMutation.isPending}
            className={styles.saveButton}
          >
            Save Changes
          </Button>
        </form>
      </section>
    </motion.div>
  )
}
