# Arabic Chess

تطبيق شطرنج عربي بالكامل (RTL) — تعلّم + لعب ضد الكمبيوتر + معلّم بالعربية.  
Working name: **Arabic Chess** (اسم العلامة التجارية النهائي TBD).

## التشغيل

```bash
npm install
npx expo start
```

ثم امسح رمز QR عبر Expo Go، أو اضغط `a` لأندرويد / `i` لـ iOS (محاكي) / `w` للويب.

### Desktop web simulator (Windows-friendly)

Run the app in a desktop browser — no phone or Expo Go required.

**PowerShell / Command Prompt (Windows):**

```bat
cd path\to\Arabic-chess
npm install
npm run web
```

Or equivalently:

```bat
npx expo start --web
```

- The first run opens the default browser (usually `http://localhost:8081`).
- On a wide desktop window you get a **centered phone frame** with RTL Arabic UI.
- Narrow the window (or use DevTools device mode) to see the full-bleed mobile layout.
- If the page looks stale: `npx expo start --web --clear`
- Need Node.js LTS from [nodejs.org](https://nodejs.org/) if `npm` is missing.

**macOS / Linux:**

```bash
npm install
npm run web
```

أوامر مفيدة:

```bash
npm run typecheck
npx expo start --clear
npx expo export --platform web
```

## المتغيرات البيئية

انسخ `.env.example` إلى `.env` (الملف مُتجاهَل في Git):

| المتغير | الغرض |
|---|---|
| `EXPO_PUBLIC_LLM_API_KEY` | مفتاح واجهة محادثة متوافقة مع OpenAI (اختياري) |
| `EXPO_PUBLIC_LLM_API_URL` | عنوان الـ API (افتراضي: OpenAI chat completions) |
| `EXPO_PUBLIC_LLM_MODEL` | اسم النموذج (افتراضي: `gpt-4o-mini`) |

بدون مفتاح: مصباح المعلّم يعمل بنصيحة عربية محلية مبنية على FEN والنقلات القانونية.

**لا تضع أسراراً في المستودع.**

## البنية

```
src/
  app/                 # Expo Router (tabs + screens)
  components/
    board/             # BoardStage → 3D لاحقاً؛ Board2DFallback مؤقت
    tutor/             # GenieLampTutor (مصباح منزلي + معلّم)
  lib/
    chess/             # chess.js + خصم بسيط
    curriculum/        # هيكل الفصل الخماسي + فصل عيّنة
    tutor/             # عميل LLM
    glossary.ts        # قاموس كلاسيكي مقفول
    theme.ts           # ألوان/مزاج الضيافة
```

التنقّل (RTL): **الرئيسية · تعلّم · العب · الإعدادات** — ضيف فقط، بلا حسابات.

## القاموس الكلاسيكي (مقفول)

| English | العربية |
|---|---|
| King | الملك |
| Queen | **الوزير** (لا الملكة كافتراضي) |
| Rook | **الرخ** (لا القلعة) |
| Bishop | الفيل |
| Knight | الحصان |
| Pawn | **البيدق** (لا الجندي) |

كش · كش مات · بات · التبييت · الأخذ بالتجاوز · الترقية · أسر · نقلة · فصل · تمرين · اختبار

## هيكل كل فصل (إلزامي)

1. شرح  
2. عرض بصري  
3. درس تفاعلي  
4. تمارين  
5. اختبار (بوابة قبل الفصل التالي)

Scaffold: مشغّل الفصول + **فصل عيّنة واحد** («اللوحة والرخ»). باقي المنهج لاحقاً (AC-3).

## اتجاه التصميم (مهم)

- **IA:** قريبة من Chess.com (تعلّم / لعب / نصائح) — لكن **المظهر ليس سطحياً مسطحاً**.
- **اللوحة:** مائلة من أعلى + قطع **ثلاثية الأبعاد** (لاحقاً). الآن: `BoardStage` + لوحة ٢ب مؤقتة مع شارة TODO.
- **المعلّم:** استعارة **مصباح منزلي** دافئ — امسحه لنصيحة؛ معلّم ودود (ليس محاكاة علاء الدين).
- **المزاج:** عربي يومي وضيافة — خشب زيتون، نحاس هادئ، كتان/جبص دافئ. **ليس** كيتش «شرقي» مفتعلاً.
- التفاصيل في `src/lib/theme.ts` و`DESIGN.md`.

## ما هو متعمّد كـ stub (متابعة لاحقة)

| العنصر | الوضع |
|---|---|
| لوحة ٣ب + قطع ٣ب | TODO في `BoardStage` — ٢ب كافية للـ PR الأول |
| فن المصباح / حركة المسح | placeholder في `GenieLampTutor` |
| منهج كامل | فصل عيّنة فقط |
| محرّك قوي (Stockfish) | خصم قانوني عشوائي / ضعيف حسب المستوى |
| ألغاز / تاريخ ألعاب مفصّل | خارج الـ scaffold |
| حسابات / دفع / متعدد لاعبين | خارج النطاق عمداً |

## الرخصة

انظر `LICENSE`.
