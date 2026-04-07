"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [phTime, setPhTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
      })
      setPhTime(time)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="bg-[#002E5D] text-white fixed top-0 w-full z-50 shadow-md mb-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/PDRRMO Logo.png" alt="Logo" width={40} height={40} />
          <span className="font-bold tracking-tight hidden md:block text-sm">
            PDRRMO ILOILO
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wide">
          <Link href="/">Home</Link>
          <Link href="/about-pdrrmo">About PDRRMO</Link>
          <Link href="/about-pdrrmc">About PDRRMC</Link>
          <Link href="/programs-services">Programs and Services</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/operation-center">Operation Center</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <div className="hidden lg:flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-3 py-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <div>
              <p className="text-[9px] uppercase text-white/50">PH Time</p>
              <p className="text-[11px] font-semibold">{phTime}</p>
            </div>
          </div>

          <Link
            href="/emergency"
            className="hidden lg:inline-block bg-[#F58220] px-4 py-2 rounded font-bold text-xs uppercase"
          >
            Emergency Contact
          </Link>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#001f45] border-t border-white/10 px-4 py-4">
          <div className="flex flex-col divide-y divide-white/10">
            {[
              ["Home", "/"],
              ["About PDRRMO", "/about-pdrrmo"],
              ["About PDRRMC", "/about-pdrrmc"],
              ["Programs and Services", "/programs-services"],
              ["Resources", "/resources"],
              ["Operation Center", "/operation-center"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="py-3 text-xs font-semibold uppercase tracking-wide"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}