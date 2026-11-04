import { PIECE_NAMES, TERMS } from '../glossary';

export type TutorRequest = {
  userMessage: string;
  fen: string;
  legalMoves: string[];
  chapterContext?: string;
};

export type TutorResponse = {
  text: string;
  source: 'llm' | 'fallback';
};

const SYSTEM_PROMPT = `أنت معلّم شطرنج بالعربية الفصحى لتطبيق Arabic Chess.
شخصيتك: معلّم ودود في بيت عربي هادئ — كرم ضيافة، بلا مبالغة أو كليشيهات «علاء الدين».
استخدم الأسماء الكلاسيكية فقط: الملك، الوزير، الرخ، الفيل، الحصان، البيدق.
المصطلحات: كش، كش مات، بات، التبييت، الأخذ بالتجاوز، الترقية، أسر، نقلة.
اجب باختصار ووضوح ودفء. لا تقترح نقلة غير موجودة في قائمة النقلات القانونية المعطاة.
اربط شرحك بوضع اللوحة (FEN) والسياق إن وُجد.`;

function buildFallback(req: TutorRequest): string {
  const inCheck = req.fen.includes(' k') || false;
  const movesHint =
    req.legalMoves.length > 0
      ? `من النقلات القانونية المتاحة الآن: ${req.legalMoves.slice(0, 5).join('، ')}${
          req.legalMoves.length > 5 ? '…' : ''
        }.`
      : 'لا توجد نقلات قانونية — ربما انتهت المباراة.';

  const glossaryHint = `تذكّر: ${PIECE_NAMES.q} و${PIECE_NAMES.r} و${PIECE_NAMES.p}. إن كان الملك تحت تهديد مباشر فهذه حالة ${TERMS.check}.`;

  return [
    'المعلّم يعمل في وضع محلي (لم يُضبط مفتاح واجهة اللغة).',
    glossaryHint,
    movesHint,
    inCheck ? `تحقق إن كان الملك تحت ${TERMS.check}.` : 'راجع سلامة الملك قبل أي هجوم.',
    req.chapterContext ? `سياق الفصل: ${req.chapterContext}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Calls an OpenAI-compatible chat completions API when
 * EXPO_PUBLIC_LLM_API_KEY is set; otherwise returns a grounded Arabic fallback.
 */
export async function askTutor(req: TutorRequest): Promise<TutorResponse> {
  const apiKey = process.env.EXPO_PUBLIC_LLM_API_KEY?.trim();
  const apiUrl =
    process.env.EXPO_PUBLIC_LLM_API_URL?.trim() ||
    'https://api.openai.com/v1/chat/completions';
  const model = process.env.EXPO_PUBLIC_LLM_MODEL?.trim() || 'gpt-4o-mini';

  if (!apiKey) {
    return { text: buildFallback(req), source: 'fallback' };
  }

  const userContent = [
    `FEN: ${req.fen}`,
    `النقلات القانونية (SAN): ${req.legalMoves.join(', ') || '(لا شيء)'}`,
    req.chapterContext ? `سياق المنهج: ${req.chapterContext}` : null,
    `سؤال المتعلّم: ${req.userMessage}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!res.ok) {
      return {
        text: `${buildFallback(req)}\n\n(تعذّر الاتصال بالمعلّم: ${res.status})`,
        source: 'fallback',
      };
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return { text: buildFallback(req), source: 'fallback' };
    }
    return { text, source: 'llm' };
  } catch {
    return {
      text: `${buildFallback(req)}\n\n(حدث خطأ في الشبكة — استُخدمت نصيحة محلية.)`,
      source: 'fallback',
    };
  }
}
