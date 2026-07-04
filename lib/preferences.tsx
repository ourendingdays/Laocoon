import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

export type ThemePref = 'dark' | 'light' | 'system';
export type FontSizePref = 'small' | 'default' | 'large';
export type DefaultDayView = 'onthisday' | 'calendar';

export type Preferences = {
  theme: ThemePref;
  fontSize: FontSizePref;
  defaultDayView: DefaultDayView;
};

const DEFAULT_PREFERENCES: Preferences = {
  theme: 'dark',
  fontSize: 'default',
  defaultDayView: 'onthisday',
};

const STORAGE_KEY = 'laocoon:preferences';

async function readStored(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(STORAGE_KEY);
  }
  return AsyncStorage.getItem(STORAGE_KEY);
}

async function writeStored(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, value);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEY, value);
}

export const FONT_SCALE: Record<FontSizePref, number> = {
  small: 0.9,
  default: 1,
  large: 1.15,
};

type PreferencesContextValue = {
  preferences: Preferences;
  loading: boolean;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    readStored()
      .then((raw) => {
        if (!alive) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Partial<Preferences>;
            setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
          } catch {
            // ignore corrupt state
          }
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      loading,
      setPreference: (key, val) => {
        setPreferences((prev) => {
          const next = { ...prev, [key]: val };
          writeStored(JSON.stringify(next)).catch(() => {});
          return next;
        });
      },
    }),
    [preferences, loading],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return ctx;
}
