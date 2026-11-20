import { type ReactNode } from 'react';
export type QupTheme = {
    /** Ekran zemini (şeffaf bırakılırsa kurumun kendi zemini görünür). */
    background: string;
    /** Kart zemini ve kenarı (kurum `ui.Card` verirse kullanılmaz). */
    card: string;
    cardBorder: string;
    /** Kart iç boşluğu: soru kutusundaki yatay çizgi kartın iki kenarına bu kadar uzanır. */
    cardPadding: number;
    text: string;
    textSecondary: string;
    /** Vurgu: gönder düğmesi, verilmiş destek, seçili sekme. */
    accent: string;
    onAccent: string;
    /** Sekme şeridinin ve "Kime" seçiminin zemini. */
    muted: string;
    danger: string;
    /** "CANLI" yazısı. */
    live: string;
    /** Destek düğmesindeki Qup işaretinin rengi. */
    mark: string;
    /** Sahnedeki sorunun kartı. */
    stage: string;
    onStage: string;
    radius: number;
    /** Tek yazı tipi ailesi (kalınlıkları kendi içinde olan aileler ve sistem yazı tipi için). */
    fontFamily?: string;
    /**
     * Kalınlığa göre ayrı aile (Expo Google Fonts gibi her kalınlığın ayrı adla yüklendiği yazı tipleri için):
     * `{ regular: 'Inter_400Regular', medium: 'Inter_500Medium', semibold: 'Inter_600SemiBold', bold: 'Inter_700Bold' }`.
     * Verilmeyen kalınlık en yakın verilene düşer. Verilirse `fontFamily` yerine kullanılır.
     */
    fonts?: {
        regular?: string;
        medium?: string;
        semibold?: string;
        bold?: string;
    };
};
export declare const DEFAULT_THEME: QupTheme;
export declare const useQupTheme: () => QupTheme;
/** Temayı alt parçalara verir (QupRoom ve QupModeration). */
export declare function QupThemeProvider({ theme, children }: {
    theme: QupTheme;
    children: ReactNode;
}): import("react").JSX.Element;
