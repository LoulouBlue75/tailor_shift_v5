'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  currentPath: string
}

function NavLink({ href, children, currentPath }: NavLinkProps) {
  const isActive = currentPath === href || currentPath.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`text-sm font-medium tracking-luxury-wide transition-all duration-300 ${
        isActive ? 'text-charcoal' : 'text-grey-warm hover:text-gold'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, currentPath }: NavLinkProps) {
  const isActive = currentPath === href || currentPath.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`text-sm font-medium whitespace-nowrap tracking-luxury-wide transition-all duration-300 ${
        isActive ? 'text-charcoal' : 'text-grey-warm'
      }`}
    >
      {children}
    </Link>
  )
}

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [firstName, setFirstName] = useState('Talent')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: talent } = await supabase
          .from('talents')
          .select('first_name')
          .eq('profile_id', user.id)
          .single()

        if (talent?.first_name) {
          setFirstName(talent.first_name)
        }
      }
    }

    fetchUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="bg-ivory-light shadow-subtle sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-comfortable">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/talent/dashboard" className="flex items-center">
              <Image
                src="/brand/logo-monogram.png"
                alt="Tailor Shift"
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink href="/talent/dashboard" currentPath={pathname}>
                Dashboard
              </NavLink>
              <NavLink href="/talent/opportunities" currentPath={pathname}>
                Opportunities
              </NavLink>
              <NavLink href="/talent/assessment" currentPath={pathname}>
                Assessment
              </NavLink>
              <NavLink href="/talent/learning" currentPath={pathname}>
                Learning
              </NavLink>
              <NavLink href="/talent/projection" currentPath={pathname}>
                Career
              </NavLink>
              <NavLink href="/talent/profile" currentPath={pathname}>
                Profile
              </NavLink>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 text-sm text-grey-warm hover:text-charcoal transition-all duration-300"
              >
                {/* User Avatar/Icon */}
                <div className="w-8 h-8 rounded-full bg-ivory-warm flex items-center justify-center border border-stone">
                  <svg 
                    className="w-5 h-5 text-grey-warm" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden sm:block font-medium tracking-luxury-wide">{firstName}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-ivory-light rounded-lg shadow-elevated z-20">
                    <div className="py-1">
                      <Link
                        href="/talent/profile"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-ivory-warm transition-colors duration-300"
                        onClick={() => setShowMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/talent/settings"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-ivory-warm transition-colors duration-300"
                        onClick={() => setShowMenu(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-1 border-stone" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-grey-warm hover:bg-ivory-warm transition-colors duration-300"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-ivory-light shadow-subtle overflow-x-auto">
        <div className="flex px-comfortable py-2 gap-6">
          <MobileNavLink href="/talent/dashboard" currentPath={pathname}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink href="/talent/opportunities" currentPath={pathname}>
            Opportunities
          </MobileNavLink>
          <MobileNavLink href="/talent/assessment" currentPath={pathname}>
            Assessment
          </MobileNavLink>
          <MobileNavLink href="/talent/learning" currentPath={pathname}>
            Learning
          </MobileNavLink>
          <MobileNavLink href="/talent/projection" currentPath={pathname}>
            Career
          </MobileNavLink>
          <MobileNavLink href="/talent/profile" currentPath={pathname}>
            Profile
          </MobileNavLink>
          <MobileNavLink href="/talent/settings" currentPath={pathname}>
            Settings
          </MobileNavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
