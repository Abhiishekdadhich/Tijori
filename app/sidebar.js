// app/Sidebar.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const path = usePathname() || '/'
  const links = [
    { href: '/projects', label: 'Project Hub' },
    { href: '/time',     label: 'Time Tracker' },
    { href: '/hrms',     label: 'HRMS' },
    { href: '/quality',  label: 'Quality' },
  ]

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">BIMstream</h2>
      <nav className="space-y-2">
        {links.map(({ href, label }) => {
          const isActive = path === href || path.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={
                `block py-2 px-3 rounded transition ` +
                (isActive
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-700 hover:text-white')
              }
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}