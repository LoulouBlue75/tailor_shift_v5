'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { H2, Text } from '@/components/ui'

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
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-charcoal' : 'text-soft-grey hover:text-matte-gold'
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
      className={`text-sm font-medium whitespace-nowrap transition-colors ${
        isActive ? 'text-charcoal' : 'text-soft-grey'
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
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="border-b border-concrete bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-comfortable">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/talent/dashboard">
              <H2 className="text-xl">Tailor Shift</H2>
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
                className="flex items-center gap-2 text-sm text-soft-grey hover:text-charcoal transition-colors"
              >
                <span className="hidden sm:block">{firstName}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`}
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-concrete z-20">
                    <div className="py-1">
                      <Link
                        href="/talent/profile"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-off-white"
                        onClick={() => setShowMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/talent/settings"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-off-white"
                        onClick={() => setShowMenu(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-1 border-concrete" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-soft-grey hover:bg-off-white"
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
      <nav className="md:hidden border-b border-concrete bg-white overflow-x-auto">
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
