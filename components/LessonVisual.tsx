import type { Lesson } from '@/content/lessons';
import RoundingVisual from './RoundingVisual';

function getVisualExamples(lesson: Lesson): string[] {
  if (lesson.lessonId.startsWith('1.')) {
    return [
      'Пример: 4 305 + 2 198 = 6 503 (сложение по разрядам).',
      'Пример: 90 000 - 27 450 = 62 550 (вычитание с займами).',
      'Пример: делители числа 18 — 1, 2, 3, 6, 9, 18.'
    ];
  }

  if (lesson.lessonId.startsWith('2.')) {
    return [
      'Пример: 3/8 < 5/8, потому что знаменатели равны и 3 < 5.',
      'Пример: 1 1/3 + 2 2/3 = 4.',
      'Пример: 3/4 : 1/2 = 3/4 × 2/1 = 3/2 = 1 1/2.'
    ];
  }

  if (lesson.lessonId.startsWith('3.')) {
    return [
      'Пример: 2,45 + 0,7 = 3,15 (запятые под запятыми).',
      'Пример: 3,6 × 10 = 36 (запятая сдвигается вправо).',
      'Пример: 7,2 : 0,3 = 72 : 3 = 24.'
    ];
  }

  if (lesson.lessonId.startsWith('4.')) {
    return [
      'Пример: 25% от 80 = 0,25 × 80 = 20.',
      'Пример: если 30% числа равны 12, то число 12 : 0,3 = 40.',
      'Пример: увеличение 200 на 10%: 200 + 20 = 220.'
    ];
  }

  if (lesson.lessonId.startsWith('5.')) {
    return [
      'Пример: при x = 4 выражение 3x + 2 равно 14.',
      'Пример: 2x + 5 = 17, тогда 2x = 12 и x = 6.',
      'Пример: неравенство x + 3 > 7 имеет решения x > 4.'
    ];
  }

  if (lesson.lessonId.startsWith('6.')) {
    return [
      'Пример: вертикальные углы 65° и 65° равны.',
      'Пример: смежные углы 110° и 70° дают 180°.',
      'Пример: S прямоугольного треугольника с катетами 6 и 4: S = 6 × 4 / 2 = 12.'
    ];
  }

  if (lesson.lessonId.startsWith('7.')) {
    return [
      'Пример: объем призмы V = Sосн × h.',
      'Пример: площадь поверхности куба a = 3: S = 6a² = 54.',
      'Пример: 1 м³ = 1 000 000 см³.'
    ];
  }

  return [
    'Пример: среднее арифметическое чисел 4, 6, 8 равно (4 + 6 + 8) / 3 = 6.',
    'Пример: круговая диаграмма показывает доли категорий от целого.',
    'Пример: таблица помогает сравнивать данные по строкам и столбцам.'
  ];
}

function GenericConceptVisual({ lesson }: { lesson: Lesson }) {
  const examples = getVisualExamples(lesson);

  return (
    <section id={`visual-generic-${lesson.lessonId.replace('.', '-')}`} data-testid={`visual-generic-${lesson.lessonId.replace('.', '-')}`} className="math-card p-6">
      <h2 className="text-xl font-bold">Визуальный пример</h2>
      <p className="mt-2 text-slate-600">Ключевая идея темы: {lesson.title}</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-700">{lesson.simpleExplanation}</p>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {examples.map((example, index) => (
          <li key={example} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <strong>{index + 1}.</strong> {example}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NumberLineVisual() {
  return (
    <section id="visual-number-line" data-testid="visual-number-line" className="math-card p-6">
      <h2 className="text-xl font-bold">Визуальный пример</h2>
      <p className="mt-2 text-slate-600">Натуральные числа идут одно за другим.</p>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-lg font-semibold">
        {['1', '2', '3', '4', '5', '...'].map((item, index) => (
          <span key={item} id={`visual-number-line-point-${index + 1}`} data-testid={`visual-number-line-point-${index + 1}`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">{item}</span>
        ))}
      </div>
    </section>
  );
}

function CompareDigitsVisual() {
  return (
    <section id="visual-compare-digits" data-testid="visual-compare-digits" className="math-card p-6">
      <h2 className="text-xl font-bold">Визуальный пример</h2>
      <p className="mt-2 text-slate-600">Сравним 54 678 345 и 54 795 876.</p>
      <div id="visual-compare-digits-panel" data-testid="visual-compare-digits-panel" className="mt-5 rounded-xl bg-slate-50 p-4 font-mono text-lg">
        <p>54 <span className="rounded bg-amber-100 px-1 font-bold">6</span>78 345</p>
        <p>54 <span className="rounded bg-amber-100 px-1 font-bold">7</span>95 876</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700">Первые цифры одинаковые: 5 = 5 и 4 = 4. Затем сравниваем 6 и 7. Так как 6 меньше 7, первое число меньше второго.</p>
      <p className="mt-3 rounded-xl bg-blue-50 p-4 font-bold text-blue-950">54 678 345 &lt; 54 795 876</p>
    </section>
  );
}

export default function LessonVisual({ lesson }: { lesson: Lesson }) {
  if (lesson.visualType === 'rounding_place_value') return <RoundingVisual />;
  if (lesson.visualType === 'compare_digits') return <CompareDigitsVisual />;
  if (lesson.visualType === 'number_line') return <NumberLineVisual />;
  return <GenericConceptVisual lesson={lesson} />;
}
