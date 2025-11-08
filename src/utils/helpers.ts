/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { User } from '@/types'

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value

  let stringified = ''
  try {
    stringified = JSON.stringify(value)
  } catch {
    stringified = '[Unable to stringify the thrown value]'
  }

  const error = new Error(`This value was thrown as is, not through an Error: ${stringified}`)
  return error
}

export function getUserInfo(authUser: any): User {
  const { app_metadata, identities, ...user } = authUser
  return { ...user, username: user.user_metadata.username }
}
