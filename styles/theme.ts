/**
 * Laocoon — Design System Theme
 * Generated from the Laocoon colour palette.
 *
 * Usage:
 *   import { colors, typography, spacing, shadows } from './theme';
 *   <View style={{ backgroundColor: colors.background.app }} />
 *   <Text style={{ color: colors.text.primary, ...typography.body }} />
 */

// ─────────────────────────────────────────────
// COLOURS
// ─────────────────────────────────────────────

export const colors = {

  /**
   * Backgrounds & Surfaces
   * Use in order from deepest to most elevated.
   */
  background: {
    void:      '#0a0806', // Deepest bg — use behind everything
    app:       '#131009', // Main app background
    pitch:     '#1c1710', // Cards, sheets, icon bg
    dusk:      '#18161a', // Splash bg, modals
    charcoal:  '#221e18', // Elevated surfaces, popovers
  },

  /**
   * Gold & Bronze Accents
   * Primary brand colour family.
   */
  gold: {
    aureate:   '#e8c87a', // Highlights, flame glow, active focus ring
    bronze:    '#c9a96e', // PRIMARY accent — buttons, CTAs, active icons
    patina:    '#a8843e', // Pressed / active states
    verdigris: '#7a5c28', // Muted gold, subtle borders
    ember:     '#3d2e12', // Very subtle gold tint backgrounds
  },

  /**
   * Stone & Ash — Text & Neutral
   */
  stone: {
    marble:    '#d4cfc8', // Primary text — headings
    limestone: '#b8a99a', // Secondary text — body, descriptions
    ash:       '#7a6e62', // Tertiary text — placeholders, hints
    cinder:    '#3a3228', // Borders, dividers, separators
  },

  /**
   * Semantic Colours
   * Functional states — keep within the ancient world palette.
   */
  semantic: {
    success:   '#4a7c59', // Laurel   — saved, confirmed, streak
    error:     '#8b3a2a', // Troy     — delete, failed, destructive
    warning:   '#7a6a3a', // Oracle   — unsaved, attention needed
    info:      '#2a4a6a', // Aegean   — links, informational
  },

  /**
   * Convenience aliases for common patterns
   */
  primary:     '#c9a96e', // = gold.bronze
  primaryDim:  '#a8843e', // = gold.patina  (pressed)
  primaryGlow: '#e8c87a', // = gold.aureate (highlight)

  text: {
    primary:     '#d4cfc8', // = stone.marble
    secondary:   '#b8a99a', // = stone.limestone
    placeholder: '#7a6e62', // = stone.ash
    inverse:     '#131009', // Dark text on gold backgrounds
    gold:        '#c9a96e', // Gold text on dark backgrounds
  },

  border: {
    subtle:   '#3a3228', // Default dividers
    default:  '#4a3e30', // Standard borders
    strong:   '#7a5c28', // Emphasis borders
    gold:     '#c9a96e', // Active / focused borders
  },

  /** Tab bar specific */
  tabBar: {
    background:  '#1c1710',
    active:      '#c9a96e',
    inactive:    '#7a6e62',
    border:      '#3a3228',
  },

} as const;

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────

export const typography = {

  /** Display — hero titles, splash text */
  display: {
    fontSize:   32,
    fontWeight: '300' as const,
    letterSpacing: 2,
    color: colors.text.primary,
  },

  /** Heading 1 — screen titles */
  h1: {
    fontSize:   24,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: colors.text.primary,
  },

  /** Heading 2 — section titles */
  h2: {
    fontSize:   18,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    color: colors.text.primary,
  },

  /** Heading 3 — card titles */
  h3: {
    fontSize:   15,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
    color: colors.text.primary,
  },

  /** Body — journal entries, main content */
  body: {
    fontSize:   16,
    fontWeight: '400' as const,
    lineHeight: 26,
    color: colors.text.primary,
  },

  /** Body small — descriptions, metadata */
  bodySmall: {
    fontSize:   14,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: colors.text.secondary,
  },

  /** Caption — timestamps, labels */
  caption: {
    fontSize:   12,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
    color: colors.text.placeholder,
  },

  /** Label — buttons, tabs, badges */
  label: {
    fontSize:   13,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: colors.text.primary,
  },

  /** Overline — section headers, small uppercase labels */
  overline: {
    fontSize:   11,
    fontWeight: '500' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.text.placeholder,
  },

} as const;

// ─────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
  xxxl: 64,
} as const;

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────

export const radius = {
  sm:   4,   // Subtle — input fields, small chips
  md:   8,   // Standard — buttons, badges
  lg:   12,  // Cards, sheets
  xl:   16,  // Large cards, bottom sheets
  xxl:  24,  // App icon shape, modals
  full: 999, // Pills, avatars
} as const;

// ─────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────

export const shadows = {

  /** Subtle card lift */
  card: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius:  8,
    elevation:     4,
  },

  /** Gold glow — for active/focused elements */
  glow: {
    shadowColor:   '#c9a96e',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius:  12,
    elevation:     6,
  },

  /** Deep — modals, bottom sheets */
  deep: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius:  24,
    elevation:     12,
  },

} as const;

// ─────────────────────────────────────────────
// ICON SIZES
// ─────────────────────────────────────────────

export const iconSize = {
  sm:  16, // Inline, badges
  md:  24, // Tab bar, headers  ← most common
  lg:  32, // Buttons, list items
  xl:  48, // Feature, onboarding
} as const;

// ─────────────────────────────────────────────
// ANIMATION DURATIONS
// ─────────────────────────────────────────────

export const duration = {
  fast:   150,  // Micro-interactions
  normal: 250,  // Standard transitions
  slow:   400,  // Page transitions, modals
  crawl:  600,  // Dramatic reveals
} as const;

// ─────────────────────────────────────────────
// QUICK REFERENCE — Common style objects
// ─────────────────────────────────────────────

export const styles = {

  /** Standard screen container */
  screen: {
    flex: 1,
    backgroundColor: colors.background.app,
  },

  /** Standard screen container with centered content */
  screenCentered: {
    flex: 1,
    backgroundColor: colors.background.app,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  /** Card surface */
  card: {
    backgroundColor: colors.background.pitch,
    borderRadius:    radius.lg,
    borderWidth:     0.5,
    borderColor:     colors.border.subtle,
    padding:         spacing.md,
  },

  /** Primary button */
  buttonPrimary: {
    backgroundColor: colors.gold.bronze,
    borderRadius:    radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    alignItems:      'center' as const,
  },

  /** Ghost button */
  buttonGhost: {
    backgroundColor: 'transparent',
    borderRadius:    radius.md,
    borderWidth:     0.5,
    borderColor:     colors.gold.bronze,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    alignItems:      'center' as const,
  },

  /** Text input */
  input: {
    backgroundColor: colors.background.charcoal,
    borderRadius:    radius.md,
    borderWidth:     0.5,
    borderColor:     colors.border.subtle,
    color:           colors.text.primary,
    fontSize:        16,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },

  /** Divider line */
  divider: {
    height:          0.5,
    backgroundColor: colors.border.subtle,
  },

} as const;

// ─────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────

export type ColorKeys    = keyof typeof colors;
export type SpacingKeys  = keyof typeof spacing;
export type RadiusKeys   = keyof typeof radius;
