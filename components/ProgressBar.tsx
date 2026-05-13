type ProgressBarProps = {
  answered: number;
  total: number;
  correct: number;
};

export default function ProgressBar({ answered, total, correct }: ProgressBarProps) {
  const answeredPercent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const correctPercent = answered === 0 ? 0 : Math.round((correct / answered) * 100);

  const scoreColor =
    answered === 0
      ? 'bg-blue-500'
      : correctPercent >= 80
        ? 'bg-emerald-500'
        : correctPercent >= 60
          ? 'bg-amber-500'
          : 'bg-rose-500';

  const scoreLabel =
    answered === 0 ? '' : correctPercent >= 80 ? 'Отлично!' : correctPercent >= 60 ? 'Хорошо' : 'Стараемся';

  return (
    <div id="quiz-progress-card" data-testid="quiz-progress-card" className="math-card sticky top-4 z-10 p-4">
      <div id="quiz-progress-stats" data-testid="quiz-progress-stats" className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-4">
          <span id="quiz-progress-answered" data-testid="quiz-progress-answered" className="text-slate-600">
            Отвечено: <strong className="text-slate-900">{answered}</strong>/{total}
          </span>
          <span id="quiz-progress-correct" data-testid="quiz-progress-correct" className="text-slate-600">
            Верно: <strong className="text-emerald-700">{correct}</strong>
          </span>
          {answered > 0 && (
            <span className="font-semibold" style={{ color: correctPercent >= 80 ? '#059669' : correctPercent >= 60 ? '#d97706' : '#e11d48' }}>
              {correctPercent}% {scoreLabel}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">{answeredPercent}% вопросов отвечено</span>
      </div>
      <div id="quiz-progress-track" data-testid="quiz-progress-track" className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          id="quiz-progress-fill"
          data-testid="quiz-progress-fill"
          className={`h-full rounded-full transition-all duration-300 ${scoreColor}`}
          style={{ width: `${answeredPercent}%` }}
        />
      </div>
    </div>
  );
}
