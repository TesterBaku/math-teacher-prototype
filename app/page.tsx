import Link from 'next/link';

export default function HomePage() {
  return (
    <div id="home-page" data-testid="home-page" className="space-y-8">
      <section id="home-hero" data-testid="home-hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-8 text-white shadow-lg">
        {/* Decorative math symbols */}
        <div className="pointer-events-none absolute right-8 top-4 select-none text-6xl font-black opacity-10 leading-none">
          ÷ × + =
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">5-й класс · Математика</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Уроки и тренировочные задания
        </h1>
        <p className="mt-3 max-w-xl text-base text-blue-100 leading-relaxed">
          Читай объяснение, смотри визуальный пример, отвечай на вопросы — и узнавай, почему ответ именно такой.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            id="home-open-lessons-link"
            data-testid="home-open-lessons-link"
            href="/lessons"
            className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow hover:bg-blue-50 transition-colors"
          >
            Открыть уроки
          </Link>
          <Link
            id="home-try-rounding-quiz-link"
            data-testid="home-try-rounding-quiz-link"
            href="/quiz/1.3"
            className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Попробовать тест: Округление
          </Link>
        </div>
      </section>

      <section id="home-features" data-testid="home-features" className="grid gap-4 md:grid-cols-3">
        {([
          ['1', '📖', 'Понятные объяснения', 'Каждый урок — короткое, ясное объяснение правила для ученика 5 класса.'],
          ['2', '👁', 'Визуальные примеры', 'Числовые оси и таблицы разрядов помогают увидеть математику.'],
          ['3', '💡', 'Разбор ошибок', 'Каждый неверный ответ имеет своё объяснение — не просто «неверно».',],
        ] as [string, string, string, string][]).map(([step, emoji, title, text]) => (
          <div key={step} id={`home-feature-card-${step}`} data-testid={`home-feature-card-${step}`} className="math-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-xl">{emoji}</span>
            <h2 className="mt-4 text-base font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      <section className="math-card p-6 bg-gradient-to-r from-slate-50 to-blue-50">
        <h2 className="text-lg font-bold text-slate-800">Что охвачено в этом прототипе</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Гл. 1', 'Натуральные числа'],
            ['Гл. 2', 'Обыкновенные дроби'],
            ['Гл. 3', 'Десятичные дроби'],
            ['Гл. 4', 'Проценты'],
            ['Гл. 5', 'Уравнения и неравенства'],
            ['Гл. 6', 'Плоские фигуры'],
            ['Гл. 7', 'Тела и измерения'],
            ['Гл. 8', 'Статистика'],
          ].map(([ch, name]) => (
            <div key={ch} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm border border-slate-100">
              <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">{ch}</span>
              <span className="text-slate-700">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
