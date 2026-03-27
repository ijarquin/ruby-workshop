"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import HamburgerMenu from "../components/HamburgerMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navLinks = [
  { href: "/recipes", label: "Home" },
  { href: "/recipes/favourites", label: "Saved Recipes" },
  { href: "#", label: "About" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-stone-50 flex flex-col">
          <header>
            <nav className="bg-white border-b border-stone-200">
              <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex justify-between h-20">
                  <div className="shrink-0 flex items-center">
                    <Link
                      href="/recipes"
                      className="text-2xl font-serif font-bold text-amber-800 tracking-wide italic"
                    >
                      MyRecipes
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navLinks.map(({ href, label }) => {
                      const isActive =
                        href === "/recipes"
                          ? pathname === "/recipes"
                          : pathname.startsWith(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          className={`tracking-wide uppercase inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                              ? "border-amber-700 text-stone-900"
                              : "border-transparent text-stone-500 hover:border-amber-300 hover:text-stone-800"
                            }`}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="flex items-center sm:hidden">
                    <HamburgerMenu />
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <Providers>{children}</Providers>
          <footer className="bg-stone-100 border-t border-stone-200 py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-stone-500">
              <p>&copy; 2026 MyRecipes. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
