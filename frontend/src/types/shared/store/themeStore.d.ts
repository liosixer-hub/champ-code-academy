export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export declare const useThemeStore: import('zustand').UseBoundStore<import('zustand').StoreApi<ThemeState>>;
