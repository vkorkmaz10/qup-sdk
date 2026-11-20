import { type TextInputProps, type TextProps } from 'react-native';
import { type QupTheme } from './theme';
/**
 * Şablonların yazısı. Tema `fonts` verdiyse kalınlığa göre doğru aileyi seçer ve `fontWeight`'i kaldırır (ayrı
 * yüklenen ailelerde kalınlık ailenin kendisidir; ikisi birlikte verilirse Android yapay kalınlaştırır ya da
 * sistem yazı tipine düşer). `fonts` yoksa `fontFamily` (varsa) ve kalınlık olduğu gibi kullanılır.
 */
export declare function fontFor(theme: QupTheme, weight: unknown): {
    fontFamily?: string;
    fontWeight?: 'normal';
} | null;
export declare function Text({ style, ...rest }: TextProps): import("react").JSX.Element;
export declare function TextInput({ style, ...rest }: TextInputProps): import("react").JSX.Element;
