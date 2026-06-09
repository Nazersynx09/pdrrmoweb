'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Newspaper, AlertTriangle,
  Map, FileText, FileUp, LogOut, Menu, X,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/news', label: 'News & Updates', icon: Newspaper },
  { href: '/admin/advisories', label: 'Advisories', icon: AlertTriangle },
  { href: '/admin/hazard-maps', label: 'Hazard Maps', icon: Map },
  { href: '/admin/resources', label: 'Resources', icon: FileText },
  { href: '/admin/issuances', label: 'Issuances', icon: FileUp },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [phTime, setPhTime] = useState('');
  const [checking, setChecking] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-PH', {
        timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit',
      });
      const date = new Date().toLocaleDateString('en-PH', {
        timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric',
      });
      setPhTime(`${date} ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#002E5D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-0 z-40 lg:hidden">
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-[#002E5D] text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Image src="/pdrrmoLogo.png" alt="PDRRMO Logo" width={32} height={32} className="bg-white rounded p-0.5" />
            <span className="text-sm font-bold">PDRRMO Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold uppercase tracking-wide ${
                  isActive ? 'bg-[#F58220] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3 text-xs text-white/50">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span>PH Time: <span className="text-white font-semibold">{phTime}</span></span>
          </div>
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xs text-white/70 hover:text-[#F58220] transition-colors">
              ← Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-[#002E5D] border-b border-white/10 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs text-white/70 font-semibold uppercase tracking-wide">Admin Panel</span>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}