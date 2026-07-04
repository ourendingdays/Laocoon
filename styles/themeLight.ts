/**
 * Laocoon — Light Theme
 * Mirror of styles/theme.ts using the light palette from the design mockup.
 *
 * Shape and keys match theme.ts exactly. Consumed via useTheme() in styles/theme.ts.
 */

// ─────────────────────────────────────────────
// COLOURS — light palette
// ─────────────────────────────────────────────

export const colors = {

  background: {
    void:      '#e4d9c8',
    app:       '#f2e9dc',
    pitch:     '#faf5ea',
    dusk:      '#faf5ea',
    charcoal:  '#efe4d0',
  },

  gold: {
    aureate:   '#b8905a',
    bronze:    '#8a6a35',
    patina:    '#6b4f22',
    verdigris: '#c4a878',
    ember:     '#f5ecd8',
  },

  stone: {
    marble:    '#2b2318',
    limestone: '#5c4f3d',
    ash:       '#8a7c68',
    cinder:    '#d8cbb0',
  },

  semantic: {
    success:   '#3f6b4c',
    error:     '#7a3020',
    warning:   '#6b5a2e',
    info:      '#1f3a54',
  },

  primary:     '#8a6a35', // = gold.bronze
  primaryDim:  '#6b4f22', // = gold.patina
  primaryGlow: '#b8905a', // = gold.aureate

  text: {
    primary:     '#2b2318', // = stone.marble
    secondary:   '#5c4f3d', // = stone.limestone
    placeholder: '#8a7c68', // = stone.ash
    inverse:     '#faf5ea', // Cream text on bronze buttons
    gold:        '#8a6a35', // = gold.bronze
  },

  border: {
    subtle:   '#d8cbb0', // = stone.cinder
    default:  '#c4a878', // = gold.verdigris
    strong:   '#6b4f22', // = gold.patina
    gold:     '#8a6a35', // = gold.bronze
  },

  tabBar: {
    background:  '#faf5ea',
    active:      '#8a6a35',
    inactive:    '#8a7c68',
    border:      '#d8cbb0',
  },

} as const;

// ─────────────────────────────────────────────
// TYPOGRAPHY — identical shape, light text colors
// ─────────────────────────────────────────────

export const typography = {

  display: {
    fontSize:   32,
    fontWeight: '300' as const,
    letterSpacing: 2,
    color: colors.text.primary,
  },

  h1: {
    fontSize:   24,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: colors.text.primary,
  },

  h2: {
    fontSize:   18,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    color: colors.text.primary,
  },

  h3: {
    fontSize:   15,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
    color: colors.text.primary,
  },

  body: {
    fontSize:   16,
    fontWeight: '400' as const,
    lineHeight: 26,
    color: colors.text.primary,
  },

  bodySmall: {
    fontSize:   14,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: colors.text.secondary,
  },

  caption: {
    fontSize:   12,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
    color: colors.text.placeholder,
  },

  label: {
    fontSize:   13,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: colors.text.primary,
  },

  overline: {
    fontSize:   11,
    fontWeight: '500' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.text.placeholder,
  },

} as const;

// ─────────────────────────────────────────────
// SPACING / RADIUS / ICON / DURATION — identical to dark
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

export const radius = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  24,
  full: 999,
} as const;

export const shadows = {

  card: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius:  8,
    elevation:     4,
  },

  glow: {
    shadowColor:   '#8a6a35',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius:  12,
    elevation:     6,
  },

  deep: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius:  24,
    elevation:     12,
  },

} as const;

export const iconSize = {
  sm:  16,
  md:  24,
  lg:  32,
  xl:  48,
} as const;

export const duration = {
  fast:   150,
  normal: 250,
  slow:   400,
  crawl:  600,
} as const;

// ─────────────────────────────────────────────
// QUICK REFERENCE — Common style objects
// ─────────────────────────────────────────────

export const styles = {

  screen: {
    flex: 1,
    backgroundColor: colors.background.app,
  },

  screenCentered: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  card: {
    backgroundColor: colors.background.pitch,
    borderRadius:    radius.lg,
    borderWidth:     0.5,
    borderColor:     colors.border.subtle,
    padding:         spacing.md,
  },

  buttonPrimary: {
    backgroundColor: colors.gold.bronze,
    borderRadius:    radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    alignItems:      'center' as const,
  },

  buttonGhost: {
    backgroundColor: 'transparent',
    borderRadius:    radius.md,
    borderWidth:     0.5,
    borderColor:     colors.gold.bronze,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    alignItems:      'center' as const,
  },

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

  divider: {
    height:          0.5,
    backgroundColor: colors.border.subtle,
  },

} as const;
