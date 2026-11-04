# Design direction — Arabic Chess

Working name until brand is locked.

## Information architecture

Chess.com-like: **تعلّم / العب / نصائح (مصباح المعلّم)** + إعدادات الضيف.  
Visuals are **not** flat Chess.com chrome.

## Board & pieces

- Target: tilted top-down **3D board + 3D pieces**.
- Scaffold: `BoardStage` hosts play/learn; `Board2DFallback` is temporary.
- Do not polish the flat board as if it were final art.

## Tutor metaphor

- **Genie lamp** as a warm **household object** + friendly mentor.
- Interaction: rub lamp → short tip / mentor reply (LLM behind it).
- Avoid Aladdin parody, cartoon magic kitsch, or loud “Oriental” spectacle.

## Mood & materials

Feel like everyday Arabic hospitality — calm home light, familiar materials:

- Warm plaster / linen backgrounds  
- Olive-wood / soft green felt board family  
- Quiet brass (lamp), soft saffron accent  

Avoid: purple neon AI defaults, cream+terracotta cliché stacks, ornate damask overload, forced “exotic” patterns.

## Typography

IBM Plex Sans Arabic (display + body). Native Arabic copy — not translated English UI.

## Scaffold tokens

See `src/lib/theme.ts` (`colors`, `textures.notes`). Full art and 3D are follow-ups; do not block shipping the playable shell.
