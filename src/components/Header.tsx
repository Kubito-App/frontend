import { Link, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { userAtom, isAuthenticatedAtom } from '@/store/atoms';
import { Button } from './Button';
import styles from './Header.module.scss';

export function Header() {
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>Kubito</h1>
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link to="/" className={styles.navLink}>
                Discover
              </Link>
              <Link to="/favorites" className={styles.navLink}>
                Favorites
              </Link>
              <Link to="/promotions" className={styles.navLink}>
                Promotions
              </Link>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className={styles.profileButton}>
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username || 'User'}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
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
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Button variant="ghost" onClick={() => navigate({ to: '/login' })}>
                Login
              </Button>
              <Button onClick={() => navigate({ to: '/register' })}>
                Sign Up
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
