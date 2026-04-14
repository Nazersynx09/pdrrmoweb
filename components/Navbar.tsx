"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import page from "@/app/resources/page"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [phTime, setPhTime] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
      })
      const date = new Date().toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      setPhTime(`${date} ${time}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsAboutOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-[#002E5D] text-white fixed top-0 w-full z-50 shadow-md" ref={mobileMenuRef}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
  <Image src="/pdrrmoLogo.png" alt="Logo" width={40} height={40} />
  <span className="font-bold tracking-tight hidden md:block text-sm">
    <Link href="/" className="hover:text-[#F58220] transition">
      PDRRMO ILOILO
    </Link>
  </span>
</div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wide">
          <Link href="/" className="hover:text-[#F58220] transition">
            Home
          </Link>

          {/* About Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className={`uppercase font-semibold tracking-wide transition-colors ${
                isAboutOpen ? "text-[#F58220]" : "text-white hover:text-[#F58220]"
              }`}
            >
              About
            </button>
            {isAboutOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#001f45] border border-white/10 rounded-md shadow-lg overflow-hidden">
                <Link
                  href="/about-pdrrmo"
                  onClick={() => setIsAboutOpen(false)}
                  className="block px-4 py-3 text-xs hover:bg-white/10 transition-colors border-b border-white/10 hover:text-[#F58220]"
                >
                  About PDRRMO
                </Link>
                <Link
                  href="/about-pdrrmc"
                  onClick={() => setIsAboutOpen(false)}
                  className="block px-4 py-3 text-xs hover:bg-white/10 transition-colors hover:text-[#F58220]"
                >
                  About PDRRMC
                </Link>
              </div>
            )}
          </div>

          <Link href="/news" className="hover:text-[#F58220] transition">
            News
          </Link>
          <Link href="/programs-services" className="hover:text-[#F58220] transition">
            Programs and Services
          </Link>
          <Link href="/resources" className="hover:text-[#F58220] transition">
            Resources
          </Link>
          <Link href="/operation-center" className="hover:text-[#F58220] transition">
            Operation Center
          </Link>
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
            className="hidden lg:inline-block bg-[#F58220] px-4 py-2 rounded font-bold text-xs uppercase hover:bg-orange-600"
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

            {/*Home link was missing */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-xs font-semibold uppercase tracking-wide hover:text-[#F58220] transition"
            >
              Home
            </Link>

              {/* Mobile About Dropdown */}
                <div className="py-3">
                  <button
                    onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                    className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wide hover:text-[#F58220] transition"
                  >
                    About
                    <span className="text-white/60">
                      {isMobileAboutOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isMobileAboutOpen && (
                    <div className="flex flex-col gap-4 pl-3 mt-2 border-l border-white/20">
                      <Link
                        href="/about-pdrrmo"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsMobileAboutOpen(false)
                        }}
                        className="text-xs font-semibold uppercase tracking-wide hover:text-[#F58220] transition"
                      >
                        About PDRRMO
                      </Link>

                      <Link
                        href="/about-pdrrmc"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsMobileAboutOpen(false)
                        }}
                        className="text-xs font-semibold uppercase tracking-wide hover:text-[#F58220] transition"
                      >
                        About PDRRMC
                      </Link>
                    </div>
                  )}
                </div>

            {[
              ["News", "/news"],
              ["Programs and Services", "/programs-services"],
              ["Resources", "/resources"],
              ["Operation Center", "/operation-center"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="py-3 text-xs font-semibold uppercase tracking-wide hover:text-[#F58220] transition"
              >
                {label}
              </Link>
            ))}

             {/* PH Time in mobile menu */}
      <div className="mt-4 flex items-center gap-2 text-white/60 text-xs py-2 border-t border-white/10">
        <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
        PH Time: <span className="font-semibold text-white">{phTime}</span>
      </div>

            {/*Emergency Contact was missing from mobile */}
            <Link
              href="/emergency"
              onClick={() => setIsMenuOpen(false)}
              className="mt-3 block bg-[#F58220] hover:bg-orange-600 text-white text-center py-2.5 rounded font-bold text-xs uppercase transition"
            >
              Emergency Contact
            </Link>

          </div>
        </div>
      )}
    </nav>
  )
}