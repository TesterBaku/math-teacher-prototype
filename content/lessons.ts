export type Lesson = {
  lessonId: string;
  chapter: string;
  title: string;
  subtitle: string;
  status: 'ready' | 'draft';
  estimatedMinutes: number;
  skills: string[];
  simpleExplanation: string;
  simpleRules: string[];
  visualType: 'number_line' | 'compare_digits' | 'rounding_place_value' | 'generic_concept';
};

function makeLesson(input: Omit<Lesson, 'status'>): Lesson {
  return { ...input, status: 'ready' };
}

export const lessons: Lesson[] = [
  makeLesson({
    lessonId: '1.1',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Натуральные числа',
    subtitle: 'Что такое натуральные числа и как читать большие числа.',
    estimatedMinutes: 8,
    skills: ['natural_numbers', 'place_value', 'reading_large_numbers'],
    simpleExplanation:
      'Натуральные числа — это числа, которые используют при счёте: 1, 2, 3, 4 и так далее. Самое маленькое натуральное число — 1.',
    simpleRules: [
      'Натуральные числа используют для счёта предметов.',
      'Самое маленькое натуральное число — 1.',
      'Если к натуральному числу прибавить 1, получится следующее натуральное число.',
      'Натуральных чисел бесконечно много.'
    ],
    visualType: 'number_line'
  }),
  makeLesson({
    lessonId: '1.2',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Сравнение и упорядочивание',
    subtitle: 'Как сравнивать большие натуральные числа.',
    estimatedMinutes: 10,
    skills: ['compare_numbers', 'order_numbers', 'digit_by_digit_comparison'],
    simpleExplanation:
      'Чтобы сравнить два натуральных числа, сначала сравни количество цифр. Если цифр одинаково, сравнивай цифры слева направо.',
    simpleRules: [
      'Если в одном числе больше цифр, это число больше.',
      'Если цифр одинаково, сравнивай цифры с самого левого разряда.',
      'Первый разряд, где цифры разные, показывает большее число.',
      'На числовой оси число справа больше числа слева.'
    ],
    visualType: 'compare_digits'
  }),
  makeLesson({
    lessonId: '1.3',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Округление натуральных чисел',
    subtitle: 'Как округлять числа до нужного разряда.',
    estimatedMinutes: 10,
    skills: ['rounding', 'place_value', 'round_up_down'],
    simpleExplanation:
      'Чтобы округлить число, найди нужный разряд и посмотри на цифру справа. Если эта цифра 0, 1, 2, 3 или 4 — оставь разряд без изменения. Если 5, 6, 7, 8 или 9 — увеличь разряд на 1. Все цифры справа замени нулями.',
    simpleRules: [
      'Найди разряд, до которого нужно округлить.',
      'Посмотри на цифру справа от этого разряда.',
      'Если справа 0–4, цифра разряда не меняется.',
      'Если справа 5–9, цифра разряда увеличивается на 1.',
      'Все цифры справа заменяются нулями.'
    ],
    visualType: 'rounding_place_value'
  }),
  makeLesson({
    lessonId: '1.4',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Сложение и вычитание натуральных чисел',
    subtitle: 'Как выполнять сложение и вычитание удобно и точно.',
    estimatedMinutes: 12,
    skills: ['addition', 'subtraction', 'estimation_check'],
    simpleExplanation: 'В этой теме ты повторяешь алгоритмы сложения и вычитания натуральных чисел и учишься проверять ответ прикидкой.',
    simpleRules: ['Складывай/вычитай по разрядам.', 'Следи за переносом и займами.', 'Проверяй результат обратным действием или оценкой.'],
    visualType: 'generic_concept'
  }),
  makeLesson({
    lessonId: '1.5',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Квадрат и куб натурального числа',
    subtitle: 'Что означают степень 2 и степень 3.',
    estimatedMinutes: 10,
    skills: ['powers', 'square', 'cube'],
    simpleExplanation: 'Квадрат числа — это число, умноженное само на себя два раза, а куб — три раза.',
    simpleRules: ['a^2 = a × a.', 'a^3 = a × a × a.', 'Полные квадраты и кубы удобно узнавать по таблицам.'],
    visualType: 'generic_concept'
  }),
  makeLesson({
    lessonId: '1.6',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Умножение и деление натуральных чисел',
    subtitle: 'Как применять свойства умножения и деления.',
    estimatedMinutes: 12,
    skills: ['multiplication', 'division', 'properties'],
    simpleExplanation: 'Тема закрепляет умножение и деление натуральных чисел, включая удобные свойства вычислений.',
    simpleRules: ['Используй переместительное и сочетательное свойства.', 'Деление проверяется умножением.', 'Сначала оцени ответ примерно.'],
    visualType: 'generic_concept'
  }),
  makeLesson({
    lessonId: '1.7',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Числовые выражения',
    subtitle: 'Порядок действий и роль скобок.',
    estimatedMinutes: 10,
    skills: ['expressions', 'order_of_operations', 'parentheses'],
    simpleExplanation: 'Числовое выражение нужно вычислять по правилам порядка действий.',
    simpleRules: ['Сначала действия в скобках.', 'Потом умножение и деление.', 'Затем сложение и вычитание.'],
    visualType: 'generic_concept'
  }),
  makeLesson({
    lessonId: '1.8',
    chapter: 'Chapter 1: Натуральные числа и действия с ними',
    title: 'Делители и кратные числа',
    subtitle: 'Как находить делители и кратные.',
    estimatedMinutes: 12,
    skills: ['factors', 'multiples', 'divisibility'],
    simpleExplanation: 'Делитель делит число без остатка, а кратное получается умножением числа на натуральные числа.',
    simpleRules: ['Проверяй делимость без остатка.', 'Кратные одного числа образуют последовательность.', 'Полезно использовать таблицу умножения.'],
    visualType: 'generic_concept'
  }),
  makeLesson({
    lessonId: '2.1',
    chapter: 'Chapter 2: Обыкновенные дроби',
    title: 'Правильные и неправильные дроби',
    subtitle: 'Как различать виды дробей и смешанные числа.',
    estimatedMinutes: 12,
    skills: ['fractions', 'proper_improper', 'mixed_numbers'],
    simpleExplanation: 'В правильной дроби числитель меньше знаменателя, в неправильной — не меньше.',
    simpleRules: ['Сравни числитель и знаменатель.', 'Неправильную дробь можно записать смешанным числом.', 'Смешанное число состоит из целой и дробной частей.'],
    visualType: 'generic_concept'
  }),
  makeLesson({ lessonId: '2.2', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Сравнение и упорядочивание', subtitle: 'Сравнение дробей и порядок дробей.', estimatedMinutes: 12, skills: ['fraction_compare', 'ordering'], simpleExplanation: 'Дроби сравнивают по общему знаменателю или с помощью визуальных моделей.', simpleRules: ['Приводи к общему знаменателю.', 'С одинаковыми знаменателями сравнивай числители.', 'Упорядочивай от меньшей к большей или наоборот.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.3', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Сложение и вычитание дробей с разными знаменателями', subtitle: 'Алгоритм действий с разными знаменателями.', estimatedMinutes: 14, skills: ['fraction_add_subtract'], simpleExplanation: 'Перед сложением и вычитанием дробей с разными знаменателями их приводят к общему знаменателю.', simpleRules: ['Найди общий знаменатель.', 'Преобразуй дроби.', 'Сложи или вычти числители, знаменатель оставь общий.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.4', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Сложение смешанных чисел', subtitle: 'Как складывать целые и дробные части.', estimatedMinutes: 12, skills: ['mixed_add'], simpleExplanation: 'Смешанные числа складывают по частям: отдельно целые части и отдельно дробные.', simpleRules: ['Сложи целые части.', 'Сложи дробные части.', 'При необходимости выдели целую часть из дроби.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.5', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Вычитание смешанных чисел', subtitle: 'Вычитание с возможным займом из целой части.', estimatedMinutes: 12, skills: ['mixed_subtract'], simpleExplanation: 'При вычитании смешанных чисел иногда нужно занять единицу из целой части.', simpleRules: ['Проверь, хватает ли дробной части.', 'Если не хватает, сделай заем.', 'Выполни вычитание по частям.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.6', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Задачи и примеры', subtitle: 'Применение дробей в текстовых задачах.', estimatedMinutes: 12, skills: ['word_problems_fractions'], simpleExplanation: 'В этой теме дроби применяются в практических задачах и вычислениях.', simpleRules: ['Определи, что известно и что нужно найти.', 'Выбери нужное действие с дробями.', 'Проверь ответ по смыслу задачи.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.7', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Умножение обыкновенных дробей', subtitle: 'Как умножать дробь на дробь.', estimatedMinutes: 12, skills: ['fraction_multiply'], simpleExplanation: 'При умножении дробей перемножают числители и знаменатели, затем сокращают результат.', simpleRules: ['Умножь числители.', 'Умножь знаменатели.', 'Сократи дробь, если можно.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.8', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Умножение смешанных чисел', subtitle: 'Переход к неправильным дробям перед умножением.', estimatedMinutes: 12, skills: ['mixed_multiply'], simpleExplanation: 'Смешанные числа обычно переводят в неправильные дроби и затем умножают.', simpleRules: ['Переведи в неправильные дроби.', 'Умножь дроби.', 'Запиши ответ в удобной форме.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.9', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Деление обыкновенных дробей', subtitle: 'Деление через обратную дробь.', estimatedMinutes: 12, skills: ['fraction_divide'], simpleExplanation: 'Чтобы разделить дробь на дробь, умножают первую дробь на обратную ко второй.', simpleRules: ['Найди обратную дробь делителя.', 'Замени деление умножением.', 'Сократи результат.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.10', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Деление смешанных чисел', subtitle: 'Деление смешанных чисел через преобразование.', estimatedMinutes: 12, skills: ['mixed_divide'], simpleExplanation: 'Смешанные числа для деления переводят в неправильные дроби, затем применяют правило деления дробей.', simpleRules: ['Переведи смешанные числа в дроби.', 'Умножь на обратную дробь.', 'Сократи и упрости ответ.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '2.11', chapter: 'Chapter 2: Обыкновенные дроби', title: 'Нахождение части числа и числа по его части', subtitle: 'Задачи на долю и целое.', estimatedMinutes: 12, skills: ['fraction_part_whole'], simpleExplanation: 'Эта тема учит находить часть от числа и восстанавливать целое по известной части.', simpleRules: ['Для части числа используйте умножение.', 'Для поиска целого по части используйте деление.', 'Внимательно читай, что задано в условии.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.1', chapter: 'Chapter 3: Десятичные дроби', title: 'Десятичные дроби', subtitle: 'Запись и чтение десятичных дробей.', estimatedMinutes: 12, skills: ['decimal_basics'], simpleExplanation: 'Десятичная дробь записывается с запятой и показывает целую и дробную часть.', simpleRules: ['Запятая разделяет целую и дробную части.', 'Каждый знак после запятой — это разряд дробной части.', 'Читай число слева направо с названием разрядов.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.2', chapter: 'Chapter 3: Десятичные дроби', title: 'Сравнение и упорядочивание', subtitle: 'Как сравнивать десятичные дроби.', estimatedMinutes: 12, skills: ['decimal_compare'], simpleExplanation: 'Сначала сравнивают целые части, затем дробные разряды по порядку.', simpleRules: ['Сравни целые части.', 'Если целые равны, сравни десятые, сотые и далее.', 'При необходимости допиши нули справа.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.3', chapter: 'Chapter 3: Десятичные дроби', title: 'Округление десятичных дробей', subtitle: 'Округление до нужного знака после запятой.', estimatedMinutes: 12, skills: ['decimal_rounding'], simpleExplanation: 'Правило округления десятичных дробей такое же: смотри цифру справа от нужного разряда.', simpleRules: ['Выбери разряд округления.', 'Посмотри следующую цифру.', 'Если 5 и больше — увеличь, иначе оставь.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.4', chapter: 'Chapter 3: Десятичные дроби', title: 'Перевод обыкновенной дроби в десятичную и наоборот', subtitle: 'Связь двух форм записи дробей.', estimatedMinutes: 14, skills: ['fraction_decimal_conversion'], simpleExplanation: 'Некоторые обыкновенные дроби можно записать как десятичные, и наоборот.', simpleRules: ['Деление числителя на знаменатель дает десятичную запись.', 'Десятичную дробь можно записать как обыкновенную по разряду.', 'Сокращай дробь в конце.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.5', chapter: 'Chapter 3: Десятичные дроби', title: 'Сложение и вычитание десятичных дробей', subtitle: 'Вычисления с выравниванием по запятой.', estimatedMinutes: 12, skills: ['decimal_add_subtract'], simpleExplanation: 'При сложении и вычитании десятичных дробей числа записывают так, чтобы запятые были строго друг под другом.', simpleRules: ['Выравни запятые.', 'Складывай/вычитай по разрядам.', 'Запятая в ответе идет под запятыми столбика.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.6', chapter: 'Chapter 3: Десятичные дроби', title: 'Задачи и примеры', subtitle: 'Практические задачи с десятичными дробями.', estimatedMinutes: 12, skills: ['decimal_word_problems'], simpleExplanation: 'Тема объединяет вычисления с десятичными дробями в прикладных задачах.', simpleRules: ['Определи величины и единицы.', 'Выбери действие.', 'Проверь правдоподобность ответа.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.7', chapter: 'Chapter 3: Десятичные дроби', title: 'Умножение и деление десятичных дробей на степени числа 10', subtitle: 'Сдвиг запятой при умножении и делении на 10, 100, 1000.', estimatedMinutes: 10, skills: ['decimal_powers_of_ten'], simpleExplanation: 'При умножении на 10, 100, 1000 запятая сдвигается вправо, при делении — влево.', simpleRules: ['Умножение на 10^n: сдвиг вправо на n знаков.', 'Деление на 10^n: сдвиг влево на n знаков.', 'При нехватке цифр дописывай нули.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.8', chapter: 'Chapter 3: Десятичные дроби', title: 'Умножение десятичной дроби на натуральное число', subtitle: 'Алгоритм умножения десятичной дроби на целое число.', estimatedMinutes: 12, skills: ['decimal_times_natural'], simpleExplanation: 'Умножают как целые числа, затем ставят запятую в соответствии с числом знаков после запятой.', simpleRules: ['Умножь как целые числа.', 'Посчитай знаки после запятой в множителе.', 'Поставь запятую в ответе.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.9', chapter: 'Chapter 3: Десятичные дроби', title: 'Умножение десятичных дробей', subtitle: 'Умножение дроби на дробь.', estimatedMinutes: 12, skills: ['decimal_multiply'], simpleExplanation: 'При умножении десятичных дробей итоговое количество знаков после запятой равно сумме знаков в множителях.', simpleRules: ['Выполни умножение как целых чисел.', 'Сложи количество знаков после запятой.', 'Поставь запятую по правилу.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.10', chapter: 'Chapter 3: Десятичные дроби', title: 'Деление десятичной дроби на натуральное число', subtitle: 'Деление столбиком с запятой.', estimatedMinutes: 12, skills: ['decimal_divide_natural'], simpleExplanation: 'Десятичную дробь делят на натуральное число по обычному алгоритму деления, учитывая положение запятой.', simpleRules: ['Деление выполняй по разрядам.', 'Поставь запятую в частном вовремя.', 'При необходимости добавляй нули.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.11', chapter: 'Chapter 3: Десятичные дроби', title: 'Деление числа на десятичную дробь', subtitle: 'Как убрать запятую в делителе.', estimatedMinutes: 14, skills: ['divide_by_decimal'], simpleExplanation: 'Чтобы делить на десятичную дробь, умножают делимое и делитель на одну и ту же степень 10.', simpleRules: ['Сделай делитель натуральным числом.', 'Одновременно изменяй делимое.', 'После этого дели привычным способом.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '3.12', chapter: 'Chapter 3: Десятичные дроби', title: 'Действия над обыкновенными и десятичными дробями', subtitle: 'Комбинированные вычисления с разными видами дробей.', estimatedMinutes: 14, skills: ['mixed_fraction_operations'], simpleExplanation: 'Иногда удобнее перевести дроби в одну форму и только потом выполнять вычисления.', simpleRules: ['Выбери удобную форму записи дробей.', 'Выполни действия по порядку.', 'Проверь результат в конце.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '4.1', chapter: 'Chapter 4: Проценты', title: 'Процент, обыкновенная дробь, десятичная дробь', subtitle: 'Связь процентов с дробями.', estimatedMinutes: 10, skills: ['percent_basics'], simpleExplanation: 'Процент — это одна сотая часть числа. Проценты связаны с обыкновенными и десятичными дробями.', simpleRules: ['1% = 1/100 = 0,01.', 'Переводи проценты в дроби и обратно.', 'Используй удобную форму для вычислений.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '4.2', chapter: 'Chapter 4: Проценты', title: 'Процент от числа', subtitle: 'Как находить часть числа в процентах.', estimatedMinutes: 12, skills: ['percent_of_number'], simpleExplanation: 'Чтобы найти p% от числа, переводят p% в дробь (или десятичную дробь) и умножают на число.', simpleRules: ['Переведи процент в дробь.', 'Умножь на данное число.', 'Сохрани единицы измерения.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '4.3', chapter: 'Chapter 4: Проценты', title: 'Нахождение числа по проценту', subtitle: 'Как восстановить целое по известной части.', estimatedMinutes: 12, skills: ['number_by_percent'], simpleExplanation: 'Если известен процент и его значение, можно найти все число через деление.', simpleRules: ['Запиши процент как дробь.', 'Раздели известную часть на эту дробь.', 'Проверь ответ подстановкой.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '4.4', chapter: 'Chapter 4: Проценты', title: 'Увеличение и уменьшение величины на определенный процент', subtitle: 'Изменение величин на проценты.', estimatedMinutes: 12, skills: ['percent_change'], simpleExplanation: 'Изменение на процент означает, что сначала находят процент от числа, затем прибавляют или вычитают его.', simpleRules: ['Найди процент от исходной величины.', 'Для увеличения прибавь, для уменьшения вычти.', 'Проверь реалистичность результата.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '5.1', chapter: 'Chapter 5: Выражения с переменной. Уравнение. Неравенство', title: 'Выражения с переменной', subtitle: 'Как записывать и вычислять выражения с переменной.', estimatedMinutes: 12, skills: ['variable_expressions', 'substitution'], simpleExplanation: 'Выражение с переменной содержит букву, вместо которой можно подставлять числа.', simpleRules: ['Обозначь неизвестное буквой.', 'Подставь заданное значение переменной.', 'Вычисли значение выражения.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '5.2', chapter: 'Chapter 5: Выражения с переменной. Уравнение. Неравенство', title: 'Упрощение выражений с одной переменной', subtitle: 'Как сокращать и упрощать выражения.', estimatedMinutes: 12, skills: ['simplify_expressions', 'distributive_property'], simpleExplanation: 'Упрощение помогает сделать выражение короче, но эквивалентным исходному.', simpleRules: ['Раскрывай скобки по правилу умножения.', 'Приводи подобные слагаемые.', 'Проверяй, что значение выражения не изменилось.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '5.3', chapter: 'Chapter 5: Выражения с переменной. Уравнение. Неравенство', title: 'Равенство и уравнение', subtitle: 'Основы решения уравнений.', estimatedMinutes: 14, skills: ['equation_solving', 'inverse_operations'], simpleExplanation: 'Уравнение — это равенство с неизвестным числом, которое нужно найти.', simpleRules: ['Выполняй одинаковые действия в обеих частях.', 'Используй обратные действия.', 'Проверь найденный корень подстановкой.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '5.4', chapter: 'Chapter 5: Выражения с переменной. Уравнение. Неравенство', title: 'Решение задач на составление уравнений', subtitle: 'Как переводить текст задачи в уравнение.', estimatedMinutes: 14, skills: ['word_problem_equations'], simpleExplanation: 'Текстовую задачу можно решить через уравнение, обозначив неизвестное переменной.', simpleRules: ['Выбери неизвестную величину.', 'Составь уравнение по условию.', 'Реши уравнение и проверь ответ.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '5.5', chapter: 'Chapter 5: Выражения с переменной. Уравнение. Неравенство', title: 'Неравенства', subtitle: 'Запись и чтение неравенств.', estimatedMinutes: 12, skills: ['inequalities', 'comparison_symbols'], simpleExplanation: 'Неравенство показывает, что одно выражение больше, меньше или не равно другому.', simpleRules: ['Используй знаки >, <, ≥, ≤, ≠.', 'Проверяй истинность числового неравенства.', 'Подбирай подходящие решения.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '5.6', chapter: 'Chapter 5: Выражения с переменной. Уравнение. Неравенство', title: 'Зависимые и независимые переменные', subtitle: 'Связь между величинами и переменными.', estimatedMinutes: 12, skills: ['dependent_independent_variables', 'tables'], simpleExplanation: 'Одна переменная может зависеть от другой. Это удобно показывать формулой и таблицей.', simpleRules: ['Определи независимую переменную.', 'Вырази зависимую через нее.', 'Построй таблицу значений.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '6.1', chapter: 'Chapter 6: Плоские фигуры', title: 'Конгруэнтные углы. Биссектриса угла', subtitle: 'Равные углы и деление угла пополам.', estimatedMinutes: 12, skills: ['angles', 'bisector'], simpleExplanation: 'Конгруэнтные углы имеют одинаковую меру, а биссектриса делит угол на два равных.', simpleRules: ['Сравнивай углы по градусной мере.', 'Биссектриса делит угол на две равные части.', 'Проверяй построение инструментами.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '6.2', chapter: 'Chapter 6: Плоские фигуры', title: 'Смежные и вертикальные углы', subtitle: 'Свойства углов при пересечении прямых.', estimatedMinutes: 12, skills: ['adjacent_angles', 'vertical_angles'], simpleExplanation: 'Смежные углы в сумме дают 180°, а вертикальные углы равны.', simpleRules: ['Сумма смежных углов равна 180°.', 'Вертикальные углы равны.', 'Используй свойства для нахождения неизвестного угла.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '6.3', chapter: 'Chapter 6: Плоские фигуры', title: 'Задачи', subtitle: 'Практические задачи по углам и фигурам.', estimatedMinutes: 12, skills: ['geometry_word_problems'], simpleExplanation: 'Эта тема тренирует применение свойств углов в задачах.', simpleRules: ['Сделай рисунок.', 'Запиши известные данные.', 'Применяй свойства пошагово.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '6.4', chapter: 'Chapter 6: Плоские фигуры', title: 'Площадь прямоугольного треугольника', subtitle: 'Формула площади через катеты.', estimatedMinutes: 12, skills: ['triangle_area'], simpleExplanation: 'Площадь прямоугольного треугольника равна половине произведения катетов.', simpleRules: ['Определи катеты.', 'Вычисли произведение катетов.', 'Раздели результат на 2.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '6.5', chapter: 'Chapter 6: Плоские фигуры', title: 'Площадь фигур, составленных из прямоугольника и прямоугольного треугольника', subtitle: 'Как находить площадь составных фигур.', estimatedMinutes: 14, skills: ['composite_area'], simpleExplanation: 'Составную фигуру разбивают на простые части и складывают их площади.', simpleRules: ['Разбей фигуру на простые элементы.', 'Найди площадь каждой части.', 'Сложи площади частей.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '6.6', chapter: 'Chapter 6: Плоские фигуры', title: 'Построение перпендикулярных и параллельных прямых', subtitle: 'Геометрические построения с линейкой и угольником.', estimatedMinutes: 12, skills: ['construct_perpendicular_parallel'], simpleExplanation: 'Перпендикулярные и параллельные прямые строят с помощью чертежных инструментов.', simpleRules: ['Используй угольник для прямого угла.', 'Проверяй параллельность по расстоянию.', 'Делай точные построения.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '6.7', chapter: 'Chapter 6: Плоские фигуры', title: 'Построение треугольника', subtitle: 'Условия и шаги построения треугольника.', estimatedMinutes: 12, skills: ['construct_triangle'], simpleExplanation: 'Треугольник можно построить по заданным сторонам и углам, соблюдая условия существования.', simpleRules: ['Нарисуй базовую сторону.', 'Построй остальные элементы по условию.', 'Проверь, что фигура замкнулась в треугольник.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '7.1', chapter: 'Chapter 7: Геометрические тела и измерения', title: 'Площадь поверхности куба и кубоида', subtitle: 'Как считать площадь поверхности объемных тел.', estimatedMinutes: 12, skills: ['surface_area_cube_cuboid'], simpleExplanation: 'Площадь поверхности — это сумма площадей всех граней тела.', simpleRules: ['Найди площадь каждой грани.', 'Учитывай одинаковые грани.', 'Сложи площади всех граней.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '7.2', chapter: 'Chapter 7: Геометрические тела и измерения', title: 'Площадь поверхности прямой призмы, в основании которой прямоугольный треугольник', subtitle: 'Площадь поверхности призмы с треугольным основанием.', estimatedMinutes: 14, skills: ['surface_area_prism'], simpleExplanation: 'Площадь поверхности призмы состоит из боковой поверхности и двух оснований.', simpleRules: ['Найди площадь основания.', 'Вычисли боковую поверхность.', 'Сложи все части поверхности.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '7.3', chapter: 'Chapter 7: Геометрические тела и измерения', title: 'Задачи', subtitle: 'Задачи на площадь поверхности и объем.', estimatedMinutes: 12, skills: ['solid_geometry_problems'], simpleExplanation: 'Тема объединяет формулы площади и объема в прикладных задачах.', simpleRules: ['Выбери подходящую формулу.', 'Подставь данные с единицами.', 'Проверь разумность ответа.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '7.4', chapter: 'Chapter 7: Геометрические тела и измерения', title: 'Объем прямой призмы', subtitle: 'Формула объема через площадь основания.', estimatedMinutes: 12, skills: ['prism_volume'], simpleExplanation: 'Объем призмы равен площади основания, умноженной на высоту.', simpleRules: ['Найди площадь основания.', 'Умножь на высоту.', 'Запиши ответ в кубических единицах.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '7.5', chapter: 'Chapter 7: Геометрические тела и измерения', title: 'Единицы площади', subtitle: 'Переходы между единицами площади.', estimatedMinutes: 10, skills: ['area_units'], simpleExplanation: 'Единицы площади переводятся с учетом квадратного масштаба.', simpleRules: ['Запомни соотношения между единицами.', 'Учитывай, что масштаб квадратный.', 'Проверяй порядок величины.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '7.6', chapter: 'Chapter 7: Геометрические тела и измерения', title: 'Единицы объема', subtitle: 'Переходы между единицами объема.', estimatedMinutes: 10, skills: ['volume_units'], simpleExplanation: 'Единицы объема переводятся с учетом кубического масштаба.', simpleRules: ['Используй таблицу единиц объема.', 'Учитывай кубический множитель.', 'Следи за обозначениями м³, см³ и т.д.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '8.1', chapter: 'Chapter 8: Статистика и анализ данных', title: 'Среднее арифметическое', subtitle: 'Как находить среднее значение набора чисел.', estimatedMinutes: 10, skills: ['mean_average'], simpleExplanation: 'Среднее арифметическое получают, когда сумму чисел делят на их количество.', simpleRules: ['Сложи все значения.', 'Раздели сумму на количество значений.', 'Проверь, что среднее лежит в разумном диапазоне.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '8.2', chapter: 'Chapter 8: Статистика и анализ данных', title: 'Круговая диаграмма', subtitle: 'Представление данных частями круга.', estimatedMinutes: 10, skills: ['pie_chart'], simpleExplanation: 'Круговая диаграмма показывает, какую долю от целого занимает каждая категория.', simpleRules: ['Найди долю каждой категории.', 'Преобразуй долю в проценты или углы.', 'Проверь, что сумма долей равна целому.'], visualType: 'generic_concept' }),
  makeLesson({ lessonId: '8.3', chapter: 'Chapter 8: Статистика и анализ данных', title: 'Представление информации', subtitle: 'Таблицы, диаграммы и чтение данных.', estimatedMinutes: 10, skills: ['data_representation'], simpleExplanation: 'Информацию можно представлять в таблицах и диаграммах, чтобы легче видеть закономерности.', simpleRules: ['Выбери подходящий способ представления.', 'Сравни значения между категориями.', 'Сделай вывод на основе данных.'], visualType: 'generic_concept' })
];

export function getLesson(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.lessonId === lessonId);
}
