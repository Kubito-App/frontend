import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          isLoading && styles.loading,
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className={styles.spinner} />
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
