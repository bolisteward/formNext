import {Providers} from "./providers";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Visa form',
  description: 'LOTERIA DE VISAS - VISA FORM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='light'>
      <body className="flex w-screen h-screen justify-center">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
