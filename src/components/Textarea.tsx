import { cn } from '@/utils/cn'
import type { TextareaHTMLAttributes } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import styles from './Textarea.module.scss'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  autoGrow?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, autoGrow = true, onChange, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => textareaRef.current!)

    const adjustHeight = () => {
      const textarea = textareaRef.current
      if (textarea && autoGrow) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight + 2}px`
      }
    }

    useEffect(() => {
      adjustHeight()
    }, [props.value, autoGrow])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight()
      onChange?.(e)
    }

    return (
      <div className={styles.wrapper}>
        {label && (
          <label
            className={styles.label}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <textarea
          className={cn(styles.textarea, error && styles.error, className)}
          ref={textareaRef}
          onChange={handleChange}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
