import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Математика 5 класс',
  description: 'Интерактивные уроки и задания по математике для 5 класса'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <header id="app-header" data-testid="app-header" className="border-b border-slate-200 bg-white shadow-sm">
          <nav id="main-nav" data-testid="main-nav" className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link id="nav-home-link" data-testid="nav-home-link" href="/" className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-slate-900">Математика 5 класс</span>
              <span className="text-xs text-slate-500">Уроки и тренировочные задания</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                id="nav-lessons-link"
                data-testid="nav-lessons-link"
                href="/lessons"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Уроки
              </Link>
            </div>
          </nav>
        </header>
        <main id="main-content" data-testid="main-content" className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
