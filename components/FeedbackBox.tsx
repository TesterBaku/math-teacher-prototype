'use client';

type FeedbackBoxProps = {
  isCorrect: boolean;
  message: string;
  boxId?: string;
};

export default function FeedbackBox({ isCorrect, message, boxId }: FeedbackBoxProps) {
  return (
    <div
      id={boxId}
      data-testid={boxId}
      className={`flex gap-3 rounded-xl border p-4 text-sm ${
        isCorrect
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-amber-200 bg-amber-50 text-amber-950'
      }`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        isCorrect ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
      }`}>
        {isCorrect ? '✓' : '!'}
      </span>
      <div>
        <p className="font-semibold">{isCorrect ? 'Правильно!' : 'Разберём ошибку'}</p>
        <p className="mt-0.5 leading-6 text-inherit opacity-90">{message}</p>
      </div>
    </div>
  );
}
