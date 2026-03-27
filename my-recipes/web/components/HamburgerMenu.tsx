'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/recipes', label: 'Home' },
  { href: '/recipes/favourites', label: 'Saved Recipes' },
  { href: '#', label: 'About' },
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger / X button — sits above the overlay via z-[60] */}
      <button
        className="sm:hidden relative z-[60] flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {/* Top bar */}
        <span
          className={`block w-6 h-0.5 bg-stone-800 transition-all duration-300 origin-center ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        {/* Middle bar */}
        <span
          className={`block w-6 h-0.5 bg-stone-800 transition-all duration-300 ${
            isOpen ? 'opacity-0 scale-x-0' : ''
          }`}
        />
        {/* Bottom bar */}
        <span
          className={`block w-6 h-0.5 bg-stone-800 transition-all duration-300 origin-center ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Full-screen overlay — slides in from the right */}
      <div
        className={`sm:hidden fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-10">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === '/recipes'
                ? pathname === '/recipes'
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-medium tracking-widest uppercase transition-colors ${
                  isActive
                    ? 'text-amber-700'
                    : 'text-stone-500 hover:text-amber-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
