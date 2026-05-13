export default function RoundingVisual() {
  return (
    <section id="visual-rounding-place-value" data-testid="visual-rounding-place-value" className="math-card p-6">
      <h2 className="text-xl font-bold text-slate-900">Визуальный пример</h2>
      <p className="mt-2 text-slate-600">Округлим число 26 458 120 до десятков миллионов.</p>

      <div className="mt-6 overflow-x-auto rounded-xl bg-slate-50 p-4">
        <div className="grid min-w-[560px] grid-cols-8 gap-2 text-center font-mono text-lg">
          {['2', '6', '4', '5', '8', '1', '2', '0'].map((digit, index) => (
            <div
              key={`${digit}-${index}`}
              id={`visual-rounding-digit-${index + 1}`}
              data-testid={`visual-rounding-digit-${index + 1}`}
              className={`rounded-lg border p-3 ${
                index === 0
                  ? 'border-blue-400 bg-blue-100 font-bold text-blue-900'
                  : index === 1
                  ? 'border-amber-400 bg-amber-100 font-bold text-amber-900'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {digit}
            </div>
          ))}
        </div>
        <div className="mt-3 grid min-w-[560px] grid-cols-8 gap-2 text-center text-xs text-slate-500">
          <span>десятки млн</span>
          <span>миллионы</span>
          <span>сотни тыс.</span>
          <span>десятки тыс.</span>
          <span>тысячи</span>
          <span>сотни</span>
          <span>десятки</span>
          <span>единицы</span>
        </div>
      </div>

      <ol className="mt-5 space-y-2 text-sm leading-6 text-slate-700">
        <li><strong>1.</strong> Нужный разряд — десятки миллионов. Это цифра <strong>2</strong>.</li>
        <li><strong>2.</strong> Смотрим на цифру справа: это <strong>6</strong>.</li>
        <li><strong>3.</strong> 6 больше или равно 5, значит 2 становится 3.</li>
        <li><strong>4.</strong> Все цифры справа заменяем нулями.</li>
      </ol>

      <div className="mt-5 rounded-xl bg-blue-50 p-4 text-blue-950">
        <p className="text-lg font-bold">26 458 120 ≈ 30 000 000</p>
      </div>
    </section>
  );
}
