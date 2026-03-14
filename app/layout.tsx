import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Slektsblogg",
  description: "Familiehistorier, bilder og slektstre",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className="min-h-screen bg-warm-50">
        <header className="bg-white border-b border-warm-200 shadow-sm">
          <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl font-semibold text-warm-800 hover:text-warm-600 transition-colors">
              Slektsblogg
            </Link>
            <ul className="flex gap-6 text-sm font-medium text-stone-600">
              <li>
                <Link href="/" className="hover:text-warm-700 transition-colors">
                  Hjem
                </Link>
              </li>
              <li>
                <Link href="/posts" className="hover:text-warm-700 transition-colors">
                  Blogg
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-warm-700 transition-colors">
                  Galleri
                </Link>
              </li>
              <li>
                <Link href="/family-tree" className="hover:text-warm-700 transition-colors">
                  Slektstre
                </Link>
              </li>
              <li>
                <Link href="/keystatic" className="hover:text-warm-700 transition-colors text-warm-600">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-warm-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-stone-400 font-serif italic">
            Med kjærlighet til familien
          </div>
        </footer>
      </body>
    </html>
  );
}
