import Link from 'next/link';
import { notFound } from 'next/navigation';
import LessonVisual from '@/components/LessonVisual';
import { getLesson } from '@/content/lessons';
import { getQuestionsForLesson } from '@/content/questions';

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

const quizTypes = [
  { type: 'easy',   label: 'Лёгкий',  color: 'bg-emerald-600 hover:bg-emerald-700' },
  { type: 'medium', label: 'Средний', color: 'bg-amber-500 hover:bg-amber-600' },
  { type: 'hard',   label: 'Сложный', color: 'bg-rose-600 hover:bg-rose-700' },
  { type: 'mixed',  label: 'Микс',    color: 'bg-slate-700 hover:bg-slate-900' },
] as const;

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  const lessonDomId = lesson.lessonId.replace('.', '-');
  const allQuestions = getQuestionsForLesson(lesson.lessonId);
  const byDiff = {
    easy:   allQuestions.filter(q => q.difficulty === 'easy').length,
    medium: allQuestions.filter(q => q.difficulty === 'medium').length,
    hard:   allQuestions.filter(q => q.difficulty === 'hard').length,
  };

  return (
    <div id={`lesson-page-${lessonDomId}`} data-testid={`lesson-page-${lessonDomId}`} className="space-y-6">
      <Link
        id={`lesson-back-link-${lessonDomId}`}
        data-testid={`lesson-back-link-${lessonDomId}`}
        href="/lessons"
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900"
      >
        ← Назад к урокам
      </Link>

      {/* Overview */}
      <section id={`lesson-overview-${lessonDomId}`} data-testid={`lesson-overview-${lessonDomId}`} className="math-card p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-sm font-bold text-white">{lesson.lessonId}</span>
          <p className="text-sm text-blue-700 font-medium">{lesson.chapter}</p>
          <span className="text-xs text-slate-400">⏱ {lesson.estimatedMinutes} мин</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">{lesson.simpleExplanation}</p>
      </section>

      {/* Rules */}
      <section id={`lesson-rules-${lessonDomId}`} data-testid={`lesson-rules-${lessonDomId}`} className="math-card p-6">
        <h2 className="text-lg font-bold text-slate-900">Простые правила</h2>
        <ol className="mt-4 space-y-3">
          {lesson.simpleRules.map((rule, index) => (
            <li
              key={rule}
              id={`lesson-rule-${lessonDomId}-${index + 1}`}
              data-testid={`lesson-rule-${lessonDomId}-${index + 1}`}
              className="flex gap-3 text-sm text-slate-700"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {index + 1}
              </span>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ol>
      </section>

      <LessonVisual lesson={lesson} />

      {/* Practice */}
      <section id={`lesson-practice-${lessonDomId}`} data-testid={`lesson-practice-${lessonDomId}`} className="math-card p-6">
        <h2 className="text-lg font-bold text-slate-900">Тренировка</h2>

        {/* Question counts by difficulty */}
        <div className="mt-3 flex flex-wrap gap-3">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-center">
            <p className="text-lg font-bold text-emerald-700">{byDiff.easy}</p>
            <p className="text-xs text-emerald-600">лёгких</p>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-center">
            <p className="text-lg font-bold text-amber-700">{byDiff.medium}</p>
            <p className="text-xs text-amber-600">средних</p>
          </div>
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-center">
            <p className="text-lg font-bold text-rose-700">{byDiff.hard}</p>
            <p className="text-xs text-rose-600">сложных</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-center">
            <p className="text-lg font-bold text-slate-700">{allQuestions.length}</p>
            <p className="text-xs text-slate-500">всего</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {quizTypes.map(({ type, label, color }) => (
            <Link
              key={type}
              id={`lesson-start-quiz-${lessonDomId}-${type}`}
              data-testid={`lesson-start-quiz-${lessonDomId}`}
              href={`/quiz/${lesson.lessonId}?type=${type}`}
              className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors ${color}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
