import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'react'
import styles from './spinner.module.scss'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'size'> {
  size?: SpinnerSize
}

const Spinner = ({ size = 'md', ...props }: Props) => {
  return (
    <div
      {...props}
      className={cn(styles.spinner, styles[size], props.className)}
    />
  )
}

export default Spinner
