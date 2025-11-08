import { cn } from '@/utils/cn'
import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import styles from './Button.module.scss'
import Spinner from './spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(styles.button, styles[variant], styles[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {children}
        <div className={cn(styles.spinner, !loading && styles.hiddenSpinner)}>
          <Spinner size='sm' />
        </div>
      </Comp>
    )
  }
)

Button.displayName = 'Button'
