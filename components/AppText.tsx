import { forwardRef } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { FONT_SCALE, usePreferences } from '../lib/preferences';

export const AppText = forwardRef<Text, TextProps>(function AppText(props, ref) {
  const { preferences } = usePreferences();
  const scale = FONT_SCALE[preferences.fontSize];

  const flat = StyleSheet.flatten(props.style) as TextStyle | undefined;
  const scaledStyle: TextStyle = { ...(flat ?? {}) };

  if (typeof flat?.fontSize === 'number') {
    scaledStyle.fontSize = flat.fontSize * scale;
  }
  if (typeof flat?.lineHeight === 'number') {
    scaledStyle.lineHeight = flat.lineHeight * scale;
  }

  return <Text ref={ref} {...props} style={scaledStyle} />;
});
