import { ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, styles as themeStyles, typography } from '../../styles/theme';

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w10-cracked@web.png')
  : require('../../assets/cards/card-w10-cracked.png');

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={themeStyles.divider} />;
}

export default function AboutScreen() {
  return (
    <ImageBackground
      source={cardSource}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>LAOCOON</Text>
          <Text style={styles.tagline}>The Flame & The Scroll</Text>
          <Text style={styles.lead}>
            Your mind is an oracle. Not the kind that speaks in riddles—the kind that speaks only when you listen.
          </Text>
          <Text style={[styles.body, { marginTop: spacing.sm }]}>
            Every day, you carry thoughts too large for ordinary conversation. Moments that shift your understanding. Feelings that circle back. Patterns you sense but cannot name. This app is where those thoughts find form.
          </Text>
        </View>

        <Divider />

        {/* Why Laocoon */}
        <Section title="Why Laocoon?">
          <Text style={styles.body}>
            In ancient Troy, there lived a priest named Laocoon. He was given a terrible gift: the sight of what was coming. He saw the wooden horse. He understood the danger. He tried to warn his people—
            <Text style={styles.italic}>do not bring this inside the walls</Text>
            —but his voice was drowned out by those who would not listen. He was killed, silenced, erased.
          </Text>
          <Text style={styles.body}>
            Laocoon knew something true. He tried to speak it. The world was not ready.
          </Text>
          <Text style={styles.body}>
            But here's what we often miss:{' '}
            <Text style={styles.italic}>Laocoon had clarity</Text>. In a city built on denial, he saw clearly. He knew himself, his intuition, his vision—well enough to act on it, even unto death.
          </Text>
          <Text style={styles.body}>
            This app is named for that clarity. Not for the tragedy, but for the sight itself. In a world of noise and distraction, you too have visions that matter. The app doesn't promise you'll be heard by the world. It promises you'll hear{' '}
            <Text style={styles.italic}>yourself</Text>—clearly, consistently, across time.
          </Text>
        </Section>

        <Divider />

        {/* What This Is */}
        <Section title="What This Is">
          <Text style={styles.body}>
            A sacred space to write what matters. Each day, you record your thoughts—your mood, your understanding of yourself, the small clarities and large confusions. No rules. No audience. Just the blank page and your voice.
          </Text>
          <Text style={styles.body}>
            But here's where it becomes something more:{' '}
            <Text style={styles.italic}>time folds back on itself</Text>.
          </Text>
          <Text style={styles.body}>
            Weeks, months, years later—return to this day. Read what you wrote at this exact moment. What were you carrying then? What have you learned? Watch your understanding compound across seasons, like sediment forming stone.
          </Text>
        </Section>

        <Divider />

        {/* The Recognition */}
        <Section title="The Recognition">
          <Text style={styles.body}>
            As you write and reflect, the app learns what lifts you. It recognizes the patterns of your positive emotions—the moments when you felt most yourself, most alive, most at peace. Not to judge. Not to prescribe. But to{' '}
            <Text style={styles.italic}>notice</Text>.
          </Text>
          <Text style={styles.body}>
            Over time, a map emerges. Not a self-help prescription. A mirror that remembers.
          </Text>
        </Section>

        <Divider />

        {/* The Ritual */}
        <Section title="The Ritual">
          <Text style={styles.body}>
            Light the torch. Open the scroll. Write what is true today.
          </Text>
          <Text style={styles.body}>
            Then, when the moment is right, look back. Read the voice of who you were. Measure the distance. Feel the continuity. Understand the shape of your own becoming.
          </Text>
          <Text style={styles.body}>
            This is not a diary. It is a conversation with yourself across time.
          </Text>
          <Text style={styles.body}>
            This is how you remember who you are.
          </Text>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Your thoughts. Your timeline. Your truth.</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingBottom: spacing.lg,
  },
  appTitle: {
    ...typography.overline,
    color: colors.gold.bronze,
    letterSpacing: 4,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  lead: {
    ...typography.body,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  section: {
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.gold.bronze,
    marginBottom: spacing.xs,
  },
  body: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 26,
  },
  italic: {
    fontStyle: 'italic',
    color: colors.text.primary,
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.subtle,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.gold.patina,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
