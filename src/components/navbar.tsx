import DiscoverIcon from '@/assets/icons/layout-dashboard.svg?react'
import PromotionsIcon from '@/assets/icons/megaphone.svg?react'
import PublishIcon from '@/assets/icons/plus.svg?react'
import FavoritesIcon from '@/assets/icons/star.svg?react'
import { useMobile } from '@/hooks/use-mobile'
import { isAuthenticatedAtom, userAtom } from '@/store/atoms'
import { cn } from '@/utils/cn'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { Avatar } from './avatar'
import { Button } from './Button'
import styles from './navbar.module.scss'

export function Navbar() {
  const [user, setUser] = useAtom(userAtom)
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isMedium } = useMobile()

  const isAuthRoutes = pathname === '/register' || pathname === '/login'

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    navigate({ to: '/' })
  }

  const HeaderTag = isMedium ? 'div' : 'header'

  if (isAuthRoutes) return null

  return (
    <HeaderTag className={styles.header}>
      <div className={styles.container}>
        {!isMedium && (
          <Link
            to='/'
            className={styles.logo}
            style={{ display: !isAuthenticated ? 'inline' : isMedium ? 'none' : 'unset' }}
          >
            <h1>Kubito</h1>
          </Link>
        )}

        <nav className={styles.nav}>
          {isAuthenticated && (
            <>
              <Link
                to='/'
                className={styles.navLink}
                activeProps={{ className: styles.active }}
              >
                <DiscoverIcon />
                <span>Discover</span>
              </Link>
              <Link
                to='/favorites'
                className={styles.navLink}
                activeProps={{ className: styles.active }}
              >
                <FavoritesIcon />
                <span>Favorites</span>
              </Link>
              <Link
                to='/publish'
                className={styles.navLink}
                activeProps={{ className: styles.active }}
              >
                <PublishIcon />
                <span>Publish</span>
              </Link>
              <Link
                to='/promotions'
                className={styles.navLink}
                activeProps={{ className: styles.active }}
              >
                <PromotionsIcon />
                <span>Promotions</span>
              </Link>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Avatar
                    user={user}
                    className={styles.profileButton}
                    placeholderProps={{ className: styles.avatarPlaceholder }}
                  />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content className={styles.dropdownContent}>
                    <DropdownMenu.Item
                      className={styles.dropdownItem}
                      onClick={() => navigate({ to: `/profile/${user?.id}` })}
                    >
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={styles.dropdownItem}
                      onClick={() => navigate({ to: '/settings' })}
                    >
                      Settings
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={styles.dropdownItem}
                      onClick={() => navigate({ to: '/subscription' })}
                    >
                      Subscription
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className={styles.separator} />
                    <DropdownMenu.Item
                      className={cn(styles.dropdownItem, styles.logout)}
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Button
                variant='ghost'
                onClick={() => navigate({ to: '/login' })}
              >
                Login
              </Button>
              <Button onClick={() => navigate({ to: '/register' })}>Sign Up</Button>
            </>
          )}
        </nav>
      </div>
    </HeaderTag>
  )
}
