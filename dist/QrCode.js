import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import makeQr from 'qrcode-generator';
import { useMemo } from 'react';
import Svg, { Circle, G, Image as SvgImage, Path, Rect } from 'react-native-svg';
/**
 * Bağlantıyı QR olarak çizer (tek bir yol, hafif). Kenar boşluğu okunabilirlik için 2 modül.
 * Ortada her zaman bir işaret durur: organizatörün (kurumun) logosu, yoksa Qup'un soru balonu (Volkan, 16 Kasım 2026).
 * Bu yüzden hata düzeltme en yüksektir (H, %30); işaret alanın yaklaşık %22'sini kaplar, kod okunur kalır.
 */
export function QrCode({ value, size, color = '#1B1B1F', background = '#FFFFFF', logo, }) {
    const { d, count } = useMemo(() => {
        const qr = makeQr(0, 'H');
        qr.addData(value);
        qr.make();
        const n = qr.getModuleCount();
        let path = '';
        for (let r = 0; r < n; r++)
            for (let c = 0; c < n; c++)
                if (qr.isDark(r, c))
                    path += `M${c + 2} ${r + 2}h1v1h-1z`;
        return { d: path, count: n + 4 };
    }, [value]);
    const box = count * 0.22;
    const at = (count - box) / 2;
    return (_jsxs(Svg, { width: size, height: size, viewBox: `0 0 ${count} ${count}`, children: [_jsx(Rect, { width: count, height: count, fill: background }), _jsx(Path, { d: d, fill: color }), _jsx(Rect, { x: at - 0.6, y: at - 0.6, width: box + 1.2, height: box + 1.2, rx: 1, fill: background }), logo ? (_jsx(SvgImage, { href: logo, x: at, y: at, width: box, height: box, preserveAspectRatio: "xMidYMid meet" })) : (_jsxs(G, { transform: `translate(${at} ${at}) scale(${box / 200})`, children: [_jsx(Circle, { cx: 96, cy: 96, r: 66, fill: "#FF6B2C" }), _jsx(Path, { d: "M96 96 L155.3 124.9 Q154 154 176 176 Q142 166 122.8 156.3 Z", fill: "#FF6B2C" }), _jsx(Path, { d: "M70 108 L96 82 L122 108", fill: "none", stroke: "#1B1B1F", strokeWidth: 18, strokeLinecap: "round", strokeLinejoin: "round" })] }))] }));
}
