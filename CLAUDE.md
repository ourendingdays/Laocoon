# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npx expo start       # Start dev server (choose iOS/Android/web/Expo Go)
npx expo start --ios     # iOS simulator directly
npx expo start --android # Android emulator directly
npx expo start --web     # Web browser directly
npm run lint         # Run ESLint via expo lint
```

There are no tests in this project.

## Architecture

**Laocoon** is a personal journaling app (React Native + Expo, TypeScript).

### Routing
File-based routing via **Expo Router**. `app/_layout.tsx` is the root Stack with a single `(tabs)` group. All six tab screens live in `app/(tabs)/`: `index.tsx` (Home), `calendar.tsx`, `journal.tsx`, `profile.tsx`, `settings.tsx`, `about.tsx`. Tab bar configuration (icons, colors) is in `app/(tabs)/_layout.tsx`.

### Design system
`styles/theme.ts` is the single source of truth for all visual design. Import from it exclusively — never hardcode colors, spacing, or typography values. Key exports:

- `colors` — dark ancient-world palette: `background.*` (void → charcoal), `gold.*` (aureate/bronze/patina), `stone.*` (marble/limestone/ash), `text.*`, `border.*`, `tabBar.*`
- `typography` — text style objects: `display`, `h1`–`h3`, `body`, `bodySmall`, `caption`, `label`, `overline`
- `spacing` — `xs` (4) through `xxxl` (64)
- `radius` — `sm` (4) through `full` (999)
- `shadows` — `card`, `glow` (gold), `deep`
- `duration` — animation ms: `fast` (150) through `crawl` (600)
- `styles` — ready-made style objects: `screen`, `screenCentered`, `card`, `buttonPrimary`, `buttonGhost`, `input`, `divider`

### Icons
All icons are custom SVG components in `assets/icons/index.tsx`, built with `react-native-svg`. Each accepts `{ size?, color? }` props and defaults to `colors.gold.bronze`. Navigation icons: `HomeIcon`, `JournalIcon`, `HistoryIcon`, `ProfileIcon`, `SettingsIcon`, `AboutIcon`. Action icons: `NewEntryIcon`, `EditIcon`, `DeleteIcon`, `SearchIcon`, `ExportIcon`, `ArchiveIcon`. Thought-state icons: `ThoughtIcon`, `StarredIcon`, `MoodIcon`, `DailyLogIcon`, `TrendsIcon`, `FocusIcon`.

### Assets
`assets/cards/` — background card images in 1×/2×/3×/web variants (frieze, marble, papyrus, embers, starchart, cracked). Use `Platform.OS === 'web'` to select the `@web` variant. `assets/splash/` — splash screens at multiple resolutions. `assets/app-icons/` — app icon variants.

### Patterns
- Screens use `ImageBackground` with a semi-transparent card overlay (`rgba(19, 16, 9, 0.75)`) when placing a card over a textured background.
- Extend `themeStyles.card` / `themeStyles.buttonPrimary` / etc. in a local `StyleSheet` rather than duplicating them. Override only what differs (e.g., `cardOverlay` for transparency).
- `save` functionality is currently stubbed with `Alert.alert` — no persistence layer exists yet.
