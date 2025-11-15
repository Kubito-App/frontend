import { Link, useLocation } from '@tanstack/react-router'
import styles from './mobile-header.module.scss'

export const MobileHeader = () => {
  const { pathname } = useLocation()

  return (
    <header className={styles.header}>
      <Link
        to='/'
        disabled={pathname === '/'}
      >
        <h1 className={styles.logo}>Kubito</h1>
      </Link>
    </header>
  )
}
