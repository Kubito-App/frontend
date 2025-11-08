import type { User } from '@/types'
import styles from './avatar.module.scss'
import { forwardRef, type ForwardedRef, type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface Props extends HTMLAttributes<HTMLDivElement> {
  user: User | null
  imageProps?: HTMLAttributes<HTMLImageElement>
  placeholderProps?: HTMLAttributes<HTMLDivElement>
}

export const Avatar = forwardRef(
  (
    { user, imageProps = {}, placeholderProps = {}, ...props }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        {...props}
        className={cn(styles.container, props.className)}
        ref={ref}
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            onDragStart={e => e.preventDefault()}
            {...imageProps}
            className={cn(styles.avatar, imageProps.className)}
          />
        ) : (
          <div
            {...placeholderProps}
            className={cn(styles.placeholder, props.className, placeholderProps.className)}
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
    )
  }
)
