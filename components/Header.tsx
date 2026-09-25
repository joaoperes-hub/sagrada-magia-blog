'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/blog/categoria/espiritualidade', label: 'Espiritualidade' },
  { href: '/blog/categoria/cristais', label: 'Cristais' },
  { href: '/blog/categoria/meditacao', label: 'Meditação' },
  { href: '/blog/categoria/tarot', label: 'Tarô' },
];

const LOJA_URL = 'https://sagradamagia.com';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Don't render on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-amiko font-bold text-sagrada-magenta group-hover:text-sagrada-magenta-dark transition-colors">
              Sagrada Magia
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/blog' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-amiko font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-sagrada-magenta text-white shadow-sm'
                      : 'text-sagrada-gray-dark hover:text-sagrada-magenta hover:bg-sagrada-magenta/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={LOJA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-5 py-2 bg-gradient-to-r from-sagrada-magenta to-sagrada-magenta-dark text-white rounded-full text-sm font-amiko font-semibold hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              Loja
            </a>
          </nav>

          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full text-sagrada-magenta hover:bg-sagrada-magenta/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
        >
          <div className="border-t border-sagrada-magenta/10 pt-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/blog' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-amiko font-semibold transition-all ${
                    isActive
                      ? 'bg-sagrada-magenta text-white'
                      : 'text-sagrada-gray-dark hover:text-sagrada-magenta hover:bg-sagrada-magenta/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={LOJA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 px-4 py-3 bg-gradient-to-r from-sagrada-magenta to-sagrada-magenta-dark text-white rounded-xl text-sm font-amiko font-semibold text-center"
            >
              Loja
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
