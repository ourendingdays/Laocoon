# LAOCOON — The Flame & The Scroll

> *Your mind is an oracle. Not the kind that speaks in riddles—the kind that speaks only when you listen.*

A personal journaling app built for long-term self-reflection. Write daily, look back across any point in time, and watch the shape of your own thinking emerge.

---

## What It Is

Laocoon is a private space to record what matters. Each day you write — your thoughts, your clarity, your confusion. No audience. No rules.

But the real value comes later: return to any day, any year, and read the voice of who you were then. Watch patterns repeat. Measure the distance. Understand your own becoming.

The app is named for the Trojan priest Laocoon — a man who saw clearly when no one else would listen. This is built for that kind of clarity: not for being heard by the world, but for hearing *yourself*.

---

## Screens

| Screen | Purpose |
|---|---|
| **Home** | Daily writing field — lined card, clear + save |
| **Journal** | Entry list and history |
| **Calendar** | Navigate any month/year, see days with entries highlighted, tap to preview |
| **Profile** | User profile |
| **Settings** | App preferences |
| **About** | App philosophy and story |

---

## Stack

- **React Native** + **Expo** (file-based routing via Expo Router)
- **TypeScript**
- Tabs navigation — `app/(tabs)/`
- Custom design system in `styles/theme.ts` — dark ancient-world palette (gold/bronze accents, stone/ash text)

---

## Getting Started

```bash
npm install
npx expo start
```

Opens options to run on:
- iOS simulator
- Android emulator
- Web browser
- Expo Go (physical device)

---

## Project Structure

```
app/
  (tabs)/         # Tab screens
    index.tsx     # Home — writing field
    journal.tsx   # Entry history
    calendar.tsx  # Calendar view
    profile.tsx
    settings.tsx
    about.tsx
assets/
  cards/          # Background card images (marble, frieze, cracked stone…)
  icons/          # SVG icon components
styles/
  theme.ts        # Design tokens — colors, typography, spacing, radius
```

---

*Your thoughts. Your timeline. Your truth.*
