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

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [brandName, setBrandName] = useState('Brand')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const fetchBrand = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: brand } = await supabase
          .from('brands')
          .select('name')
          .eq('profile_id', user.id)
          .single()

        if (brand?.name) {
          setBrandName(brand.name)
        }
      }
    }

    fetchBrand()
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
            <Link href="/brand/dashboard" className="flex items-center">
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
              <NavLink href="/brand/dashboard" currentPath={pathname}>
                Dashboard
              </NavLink>
              <NavLink href="/brand/opportunities" currentPath={pathname}>
                Opportunities
              </NavLink>
              <NavLink href="/brand/stores" currentPath={pathname}>
                Stores
              </NavLink>
              <NavLink href="/brand/profile" currentPath={pathname}>
                Profile
              </NavLink>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 text-sm text-grey-warm hover:text-charcoal transition-all duration-300"
              >
                <span className="hidden sm:block max-w-[150px] truncate font-medium tracking-luxury-wide">{brandName}</span>
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
                        href="/brand/profile"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-ivory-warm transition-colors duration-300"
                        onClick={() => setShowMenu(false)}
                      >
                        Brand Profile
                      </Link>
                      <Link
                        href="/brand/settings"
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
          <MobileNavLink href="/brand/dashboard" currentPath={pathname}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink href="/brand/opportunities" currentPath={pathname}>
            Opportunities
          </MobileNavLink>
          <MobileNavLink href="/brand/stores" currentPath={pathname}>
            Stores
          </MobileNavLink>
          <MobileNavLink href="/brand/profile" currentPath={pathname}>
            Profile
          </MobileNavLink>
          <MobileNavLink href="/brand/settings" currentPath={pathname}>
            Settings
          </MobileNavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-ivory-light shadow-subtle py-8 mt-auto">
        <div className="mx-auto max-w-7xl px-comfortable flex flex-col items-center gap-4">
          <Image
            src="/brand/logo-wordmark.png"
            alt="Tailor Shift"
            width={120}
            height={30}
            className="h-6 w-auto opacity-60"
          />
          <p className="text-caption text-grey-warm">
            © {new Date().getFullYear()} Tailor Shift. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
