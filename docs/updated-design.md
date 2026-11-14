# DigiBridge color theme: Evergreen and Marigold

## Colors

| Token | Hex | Use |
| --- | --- | --- |
| `evergreen` | #1E5B44 | Primary buttons, links, selected answer, progress |
| `evergreen-hover` | #174A37 | Hover and pressed state |
| `evergreen-soft` | #EDF6F0 | Selected answer background |
| `marigold` | #F4A51C | Timer, lesson icons, highlights (fill only, never text) |
| `marigold-text` | #8A5A00 | Marigold-colored text on white |
| `marigold-soft` | #FDF1DA | Tip and notice backgrounds |
| `ink` | #12241C | Text |
| `quiet` | #4F6459 | Secondary text |
| `line` | #D4E3DA | Borders, dividers |
| `line-strong` | #6F8A7C | Input and radio borders |
| `surface` | #FFFFFF | Cards, inputs |
| `mist` | #E4EFE8 | Page background |
| `mist-soft` | #F2F7F4 | Panels, stat tiles |
| `track` | #E7F1EB | Empty part of progress and score bars |
| `error` | #C2412D | Errors, timer under 1 minute |
| `error-soft` | #FBEDEA | Error backgrounds |

## Levels

| Token | Hex | Level | Text on it |
| --- | --- | --- | --- |
| `level-1` | #D6EBDF | Beginner | `on-level` (#12241C in both themes) |
| `level-2` | #8CC5A6 | Basic | `on-level` |
| `level-3` | #2F7D58 | Intermediate | white |
| `level-4` | #1E5B44 | Advanced | white |

## Rules

- Evergreen for every action; marigold only where the eye should go next.
- Red only for errors and the last minute of the timer, never for scores or levels.
- Never use `marigold` as text on white (2.1:1); use `marigold-text` instead.
- All text pairs above pass WCAG AA or better.

## Tailwind v4

```css
@theme {
  --color-evergreen: #1e5b44;
  --color-evergreen-hover: #174a37;
  --color-evergreen-soft: #edf6f0;
  --color-marigold: #f4a51c;
  --color-marigold-text: #8a5a00;
  --color-marigold-soft: #fdf1da;
  --color-ink: #12241c;
  --color-quiet: #4f6459;
  --color-line: #d4e3da;
  --color-line-strong: #6f8a7c;
  --color-surface: #ffffff;
  --color-mist: #e4efe8;
  --color-mist-soft: #f2f7f4;
  --color-track: #e7f1eb;
  --color-error: #c2412d;
  --color-error-soft: #fbedea;
  --color-level-1: #d6ebdf;
  --color-level-2: #8cc5a6;
  --color-level-3: #2f7d58;
  --color-level-4: #1e5b44;
}
```
