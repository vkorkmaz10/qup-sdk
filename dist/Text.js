import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, Text as RNText, TextInput as RNTextInput } from 'react-native';
import { useQupTheme } from './theme';
/**
 * Şablonların yazısı. Tema `fonts` verdiyse kalınlığa göre doğru aileyi seçer ve `fontWeight`'i kaldırır (ayrı
 * yüklenen ailelerde kalınlık ailenin kendisidir; ikisi birlikte verilirse Android yapay kalınlaştırır ya da
 * sistem yazı tipine düşer). `fonts` yoksa `fontFamily` (varsa) ve kalınlık olduğu gibi kullanılır.
 */
export function fontFor(theme, weight) {
    const f = theme.fonts;
    if (!f)
        return theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const n = weight === 'bold' ? 700 : weight === 'normal' || weight == null ? 400 : Number(weight) || 400;
    const order = n >= 700
        ? [f.bold, f.semibold, f.medium, f.regular]
        : n >= 600
            ? [f.semibold, f.bold, f.medium, f.regular]
            : n >= 500
                ? [f.medium, f.semibold, f.regular, f.bold]
                : [f.regular, f.medium, f.semibold, f.bold];
    const family = order.find(Boolean);
    return family ? { fontFamily: family, fontWeight: 'normal' } : null;
}
export function Text({ style, ...rest }) {
    const theme = useQupTheme();
    const flat = StyleSheet.flatten(style);
    // Açıkça aile verilmiş yazıya (ör. tek aralıklı) dokunulmaz.
    const font = flat?.fontFamily && !theme.fonts ? null : fontFor(theme, flat?.fontWeight);
    return _jsx(RNText, { ...rest, style: font ? [style, font] : style });
}
export function TextInput({ style, ...rest }) {
    const theme = useQupTheme();
    const flat = StyleSheet.flatten(style);
    const font = fontFor(theme, flat?.fontWeight);
    return _jsx(RNTextInput, { ...rest, style: font ? [style, font] : style });
}
