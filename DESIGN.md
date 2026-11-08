# Design direction — Arabic Chess

Working name until the brand is locked. Read the visible name from `src/lib/brand.ts`.

## Mood

Premium dark chess product: charcoal and black surfaces, crisp white type, silver structure, and a restrained gold accent. High-contrast black-and-white squares. Not warm plaster, and not an olive-wood board.

## Information architecture

Five tabs: الرئيسية، تعلّم، العب، المتجر، حسابي.

The store is a showroom preview. Profile is a guest prototype on this device. Ranked and online modes stay visibly unavailable.

## Board

`BoardStage` still draws the flat board. Coordinates stay `a–h` and `1–8`. A 3D scene is a later milestone and must keep the same props.

## Language

Arabic is the default interface. English chrome lives beside it in `src/lib/i18n`. Lesson prose stays in the chapter files. Layout stays right to left.

## Tutor

The lamp remains the existing mentor control. A new genie character is a later milestone.
