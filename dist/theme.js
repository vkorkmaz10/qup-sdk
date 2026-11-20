import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
export const DEFAULT_THEME = {
    background: 'transparent',
    card: '#FFFFFF',
    cardBorder: '#E6E6EA',
    cardPadding: 12,
    text: '#1B1B1F',
    textSecondary: '#6B6B76',
    accent: '#FF6B2C',
    onAccent: '#1B1B1F',
    muted: '#EFEFF2',
    danger: '#C2410C',
    live: '#16A34A',
    mark: '#FF6B2C',
    stage: '#1B1B1F',
    onStage: '#FFFFFF',
    radius: 14,
};
/** Varsayılan parçaların temaya ulaştığı yer (kurumun kendi parçaları da `useQupTheme` ile okuyabilir). */
const ThemeContext = createContext(DEFAULT_THEME);
export const useQupTheme = () => useContext(ThemeContext);
/** Temayı alt parçalara verir (QupRoom ve QupModeration). */
export function QupThemeProvider({ theme, children }) {
    return _jsx(ThemeContext.Provider, { value: theme, children: children });
}
