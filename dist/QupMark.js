import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Svg, { Circle, Path } from 'react-native-svg';
/** Qup işareti (soru balonu). Destek her yerde bu işaretle gösterilir. fill: balon, chevron: içindeki ok. */
export function QupMark({ size = 32, chevron = '#1B1B1F', fill = '#FF6B2C', }) {
    return (_jsxs(Svg, { width: size, height: size, viewBox: "0 0 200 200", children: [_jsx(Circle, { cx: 96, cy: 96, r: 66, fill: fill }), _jsx(Path, { d: "M96 96 L155.3 124.9 Q154 154 176 176 Q142 166 122.8 156.3 Z", fill: fill }), _jsx(Path, { d: "M70 108 L96 82 L122 108", fill: "none", stroke: chevron, strokeWidth: 18, strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
