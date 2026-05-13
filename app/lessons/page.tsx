import Link from 'next/link';
import { lessons } from '@/content/lessons';

const quizTypeConfig = {
  easy:   { label: 'Лёгкий',  bg: 'bg-emerald-600 hover:bg-emerald-700' },
  medium: { label: 'Средний', bg: 'bg-amber-500 hover:bg-amber-600' },
  hard:   { label: 'Сложный', bg: 'bg-rose-600 hover:bg-rose-700' },
  mixed:  { label: 'Микс',    bg: 'bg-slate-700 hover:bg-slate-900' },
} as const;

export default function LessonsPage() {
  const lessonsByChapter = lessons.reduce<Record<string, typeof lessons>>((acc, lesson) => {
    if (!acc[lesson.chapter]) acc[lesson.chapter] = [];
    acc[lesson.chapter].push(lesson);
    return acc;
  }, {});

  const chapterEntries = Object.entries(lessonsByChapter);

  return (
    <div id="lessons-page" data-testid="lessons-page" className="space-y-6">
      <div id="lessons-header" data-testid="lessons-header">
        <p className="text-sm font-semibold text-blue-700">5-й класс · Части 1–2</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Уроки</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          {lessons.length} уроков по главам 1–8. Читай урок, затем тренируйся в квизе.
        </p>
      </div>

      <div id="lessons-chapters" data-testid="lessons-chapters" className="space-y-3">
        {chapterEntries.map(([chapter, chapterLessons], chapterIndex) => {
          const chapterDomId = chapter.split(':')[0].toLowerCase().replace(/\s+/g, '-');
          const totalMinutes = chapterLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

          return (
            <details
              key={chapter}
              id={`chapter-group-${chapterDomId}`}
              data-testid={`chapter-group-${chapterDomId}`}
              className="math-card overflow-hidden"
              open={chapterIndex === 0}
            >
              <summary
                id={`chapter-summary-${chapterDomId}`}
                data-testid={`chapter-summary-${chapterDomId}`}
                className="cursor-pointer list-none bg-gradient-to-r from-slate-50 to-slate-100/60 px-5 py-4 hover:from-blue-50 hover:to-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold text-slate-900">{chapter}</h2>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs text-slate-600">
                      ~{totalMinutes} мин
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {chapterLessons.length} уроков
                    </span>
                  </div>
                </div>
              </summary>

              <div id={`chapter-grid-${chapterDomId}`} data-testid={`chapter-grid-${chapterDomId}`} className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
                {chapterLessons.map((lesson) => {
                  const domId = lesson.lessonId.replace('.', '-');
                  return (
                    <article
                      key={lesson.lessonId}
                      id={`lesson-card-${domId}`}
                      data-testid={`lesson-card-${domId}`}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                          {lesson.lessonId}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">⏱ {lesson.estimatedMinutes} мин</span>
                          <span
                            id={`lesson-status-${domId}`}
                            data-testid={`lesson-status-${domId}`}
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${lesson.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {lesson.status === 'ready' ? 'готов' : 'черновик'}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug">{lesson.title}</h3>
                      <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{lesson.subtitle}</p>

                      {/* Action buttons */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <Link
                          id={`lesson-learn-link-${domId}`}
                          data-testid={`lesson-learn-link-${domId}`}
                          href={`/lessons/${lesson.lessonId}`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          📖 Учиться
                        </Link>
                        {(['easy', 'medium', 'hard', 'mixed'] as const).map((type) => (
                          <Link
                            key={type}
                            id={`lesson-quiz-link-${domId}-${type}`}
                            data-testid={`lesson-quiz-link-${domId}-${type}`}
                            href={`/quiz/${lesson.lessonId}?type=${type}`}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${quizTypeConfig[type].bg}`}
                          >
                            {quizTypeConfig[type].label}
                          </Link>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
