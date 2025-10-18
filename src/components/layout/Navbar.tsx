'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, PenSquare, Search, User, LogOut, Settings, Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getGravatarUrl } from '@/lib/utils'

interface NavbarProps {
  user?: {
    id: string
    email: string
    username?: string
    displayName?: string | null
    avatarUrl?: string | null
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = user
    ? [
        { href: '/explore', label: 'Explorar', icon: Search },
        { href: '/following', label: 'Seguidos', icon: Heart },
        { href: '/dashboard', label: 'Dashboard', icon: User },
        { href: '/post/create', label: 'Crear Post', icon: PenSquare },
      ]
    : [
        { href: '/explore', label: 'Explorar', icon: Search },
      ]

  return (
    <nav className="sticky top-0 z-50 bg-[#dedff1]/95 backdrop-blur-xl border-b border-[#5f638f]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative group-hover:scale-105 transition-all duration-300 ease-out">
              <svg width="40" height="40" viewBox="0 0 40 40" className="relative z-10">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0c2b4d" />
                    <stop offset="50%" stopColor="#36234e" />
                    <stop offset="100%" stopColor="#5f638f" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                  </filter>
                </defs>
                <path d="M32 8 Q30 6 28 8 L12 28 Q10 30 8 32 L10 34 Q12 32 14 30 L34 10 Q36 8 34 6 Z" fill="url(#logoGradient)" filter="url(#glow)" className="group-hover:opacity-90 transition-opacity" />
                <path d="M8 32 L6 38 L12 36 L10 34 Z" fill="#000022" opacity="0.6" />
                <path d="M28 8 L32 12" stroke="#dedff1" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                <path d="M26 10 L30 14" stroke="#dedff1" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#0c2b4d] via-[#36234e] to-[#5f638f] bg-clip-text text-transparent group-hover:from-[#36234e] group-hover:via-[#5f638f] group-hover:to-[#0c2b4d] transition-all duration-300">
              LibreBlog
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0c2b4d]/10 to-[#36234e]/10 text-[#0c2b4d] shadow-sm'
                      : 'text-[#36234e] hover:text-[#0c2b4d] hover:bg-[#dedff1]/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="relative">
                    {link.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0c2b4d] to-[#36234e] rounded-full" />
                    )}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-[#dedff1]/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <Image
                      src={user.avatarUrl || getGravatarUrl(user.email)}
                      alt={`Foto de perfil de ${user.displayName || user.email}`}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-transparent group-hover:ring-[#5f638f]/50 transition-all duration-300"
                      priority
                      unoptimized
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-medium text-[#000022]">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-52 bg-[#dedff1]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#5f638f]/30 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                      <Link
                        href={`/profile/${user.username || user.email.split('@')[0]}`}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-[#000022] hover:bg-[#0c2b4d]/10 hover:text-[#0c2b4d] rounded-xl mx-2 transition-all duration-200 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Mi Perfil</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-[#000022] hover:bg-[#0c2b4d]/10 hover:text-[#0c2b4d] rounded-xl mx-2 transition-all duration-200 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Configuración</span>
                      </Link>
                      <hr className="my-2 border-[#5f638f]/30 mx-2" />
                      <a
                        onClick={(e) => {
                          e.preventDefault()
                          handleLogout()
                          setUserMenuOpen(false)
                        }}
                        role="button"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl mx-2 transition-all duration-200 group cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Cerrar Sesión</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-[#0c2b4d] to-[#36234e] hover:from-[#36234e] hover:to-[#5f638f]">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-[#dedff1]/50 transition-all duration-300 group"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#36234e] group-hover:text-[#0c2b4d] transition-colors duration-200" />
            ) : (
              <Menu className="w-6 h-6 text-[#36234e] group-hover:text-[#0c2b4d] transition-colors duration-200" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#5f638f]/20 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl mx-2 transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0c2b4d]/10 to-[#36234e]/10 text-[#0c2b4d] font-medium shadow-sm'
                        : 'text-[#36234e] hover:bg-[#dedff1]/50 hover:text-[#0c2b4d]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              
              <hr className="my-3 border-[#5f638f]/30 mx-2" />
              
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-4 border-b border-[#5f638f]/30 mx-2 rounded-xl bg-[#dedff1]/30">
                    <Image
                      src={user.avatarUrl || getGravatarUrl(user.email)}
                      alt={`Foto de perfil de ${user.displayName || user.email}`}
                      width={40}
                      height={40}
                      className="rounded-full ring-2 ring-[#5f638f]/50"
                      priority
                      unoptimized
                    />
                    <div>
                      <p className="font-semibold text-[#000022]">
                        {user.displayName || user.email.split('@')[0]}
                      </p>
                      <p className="text-sm text-[#5f638f]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-2 py-2 space-y-1">
                    <Link
                      href={`/profile/${user.username || user.email.split('@')[0]}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-[#000022] hover:bg-[#0c2b4d]/10 hover:text-[#0c2b4d] rounded-xl transition-all duration-200 group"
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Mi Perfil</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-[#000022] hover:bg-[#0c2b4d]/10 hover:text-[#0c2b4d] rounded-xl transition-all duration-200 group"
                    >
                      <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Configuración</span>
                    </Link>
                    <a
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      role="button"
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Cerrar Sesión</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="px-2 py-2 space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
