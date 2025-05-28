// app/layout.js
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import Sidebar from './sidebar'  // our new client component

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata = {
  title: 'BIMstream Management',
  description: 'Your all-in-one project dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}
      >
        {/* Sidebar */}
        <aside className="w-60 bg-gray-800 text-gray-100 min-h-screen p-4">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white text-gray-900 p-6">
          {children}
        </main>
      </body>
    </html>
  )
}