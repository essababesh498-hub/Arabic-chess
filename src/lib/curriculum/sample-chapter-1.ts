import type { Chapter } from './types';

/** Sample beginner chapter demonstrating all five mandatory elements. */
export const sampleChapter1: Chapter = {
  id: 'ch-1-board-and-rook',
  number: 1,
  title: 'اللوحة والرخ',
  summary: 'تعرّف على لوحة الشطرنج وحركة الرخ.',
  steps: [
    {
      id: 'ch1-explain',
      kind: 'explanation',
      title: 'شرح',
      body:
        'لوحة الشطرنج مربّعة من ٦٤ مربعاً: ٨ صفوف و٨ أعمدة. الصفوف مرقّمة من ١ إلى ٨، والأعمدة من a إلى h.\n\n' +
        'الرخ قطعة قوية تتحرك أفقياً أو عمودياً أي عدد من المربعات الفارغة. لا يقفز فوق القطع. إذا وصلت إلى قطعة للخصم يمكنك أسرها.\n\n' +
        'تذكّر الاسم الكلاسيكي: الرخ — وليس «القلعة».',
    },
    {
      id: 'ch1-demo',
      kind: 'demo',
      title: 'عرض بصري',
      body: 'شاهد الرخ الأبيض يتحرك على العمود ثم يأسر بيدقاً أسود.',
      fen: '8/8/8/3p4/8/8/8/3R4 w - - 0 1',
      moves: [
        { from: 'd1', to: 'd4' },
        { from: 'd4', to: 'd5' },
      ],
    },
    {
      id: 'ch1-interactive',
      kind: 'interactive',
      title: 'درس تفاعلي',
      body: 'حرّك الرخ الأبيض إلى المربع e4 (نقلة أفقية قانونية).',
      fen: '8/8/8/8/8/8/8/4R3 w - - 0 1',
      goals: [{ from: 'e1', to: 'e4' }],
      successMessage: 'أحسنت! الرخ يتحرك أفقياً وعمودياً.',
    },
    {
      id: 'ch1-exercises',
      kind: 'exercises',
      title: 'تمارين',
      body: 'اضغط على المربعات التي يمكن للرخ الوصول إليها في نقلة واحدة.',
      items: [
        {
          id: 'ex1',
          prompt: 'الرخ على a1 — أيّ من هذه المربعات قانونية؟ اضغط a4.',
          fen: '8/8/8/8/8/8/8/R7 w - - 0 1',
          correctSquares: ['a4'],
          hint: 'الرخ يتحرك على العمود a إلى أعلى.',
        },
        {
          id: 'ex2',
          prompt: 'الرخ على d4 — اضغط المربع h4 (نفس الصف).',
          fen: '8/8/8/8/3R4/8/8/8 w - - 0 1',
          correctSquares: ['h4'],
          hint: 'الحركة الأفقية على الصف ٤.',
        },
      ],
    },
    {
      id: 'ch1-quiz',
      kind: 'quiz',
      title: 'اختبار',
      body: 'أجب عن الأسئلة. يجب أن تجيب بشكل صحيح على سؤالين على الأقل لفتح الفصل التالي.',
      passScore: 2,
      questions: [
        {
          id: 'q1',
          prompt: 'كيف يتحرك الرخ؟',
          options: [
            'أفقياً وعمودياً أي عدد من المربعات',
            'قطرياً فقط',
            'مربعاً واحداً في أي اتجاه',
            'قفزاً على شكل حرف L',
          ],
          correctIndex: 0,
        },
        {
          id: 'q2',
          prompt: 'ما الاسم الكلاسيكي لهذه القطعة في تطبيقنا؟',
          options: ['القلعة', 'الرخ', 'الجندي', 'الملكة'],
          correctIndex: 1,
        },
        {
          id: 'q3',
          prompt: 'هل يستطيع الرخ القفز فوق قطعة أخرى؟',
          options: ['نعم دائماً', 'لا', 'فقط عند التبييت', 'فقط في الافتتاح'],
          correctIndex: 1,
        },
      ],
    },
  ],
};
