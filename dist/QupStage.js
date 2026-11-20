import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { QrCode } from './QrCode';
import { QupMark } from './QupMark';
import { DEFAULT_THEME, DefaultAvatar, QupThemeProvider } from './QupRoom';
import { makeText } from './strings';
/** Listede en çok bu kadar soru; ekrana tam sığmayan satır gizlenir (yarım satır görünmez). */
const LIST_MAX = 5;
export function QupStage(props) {
    const theme = useMemo(() => ({ ...DEFAULT_THEME, background: '#0B0B0D', ...props.theme }), [props.theme]);
    return (_jsx(QupThemeProvider, { theme: theme, children: _jsx(StageScreen, { ...props, theme: theme }) }));
}
function StageScreen(props) {
    const { room, ui = {}, lang = 'tr', strings, logo, avatars = true } = props;
    const theme = props.theme;
    const t = makeText(lang, strings);
    const { width, height } = useWindowDimensions();
    // Ölçek 1280×720 tasarımdan; projektörde büyür, küçük pencerede küçülür.
    const s = Math.max(0.55, Math.min(2.2, Math.min(width / 1280, height / 720)));
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const Avatar = ui.Avatar ?? DefaultAvatar;
    const event = room.event;
    const code = event?.code ?? '';
    const joinUrl = props.joinUrl ? props.joinUrl(code) : `https://qupin.app/${code}`;
    const joinText = props.joinText ?? joinUrl.replace(/^https?:\/\//, '');
    // Büyük QR: moderasyondan gelen ayar ya da bu ekranda dokunma. İzleyen bağlantıda dokunma yalnız bu ekranı değiştirir.
    const [qrLocal, setQrLocal] = useState(null);
    const qrShared = !!event?.qr;
    const qrOpen = qrLocal && qrLocal.base === qrShared ? qrLocal.on : qrShared;
    const setQr = (on) => {
        if (room.lead !== null && room.showQr(on))
            return;
        setQrLocal({ on, base: qrShared });
    };
    const top = useMemo(() => Object.values(room.questions)
        .filter((q) => q.status === 'live')
        .sort((a, b) => b.votes - a.votes || a.id - b.id)
        .slice(0, LIST_MAX), [room.questions]);
    const poll = useMemo(() => Object.values(room.polls)
        .sort((a, b) => b.id - a.id)
        .find((p) => p.status === 'open' || (p.status === 'closed' && p.showResults)), [room.polls]);
    const spotlight = !poll && event?.spotlight != null ? room.questions[event.spotlight] : undefined;
    const [avail, setAvail] = useState(0);
    const [bottoms, setBottoms] = useState({});
    const fg = { color: theme.text };
    const fg2 = { color: theme.textSecondary };
    const row = { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 };
    const who = (q, size) => (_jsxs(View, { style: [styles.who, { gap: 10 * s }], children: [avatars ? _jsx(Avatar, { name: q.name, picture: q.picture ?? null, size: size }) : null, _jsxs(Text, { style: [fg2, font, { fontSize: size * 0.55 }], children: [q.name, q.to ? _jsxs(Text, { style: [fg, { fontWeight: '700' }], children: [" \u2192 ", q.to] }) : null] })] }));
    let middle;
    if (!event) {
        middle = _jsx(Text, { style: [fg2, font, { fontSize: 20 * s }], children: room.refusal ? t('err.generic') : t('joining') });
    }
    else if (poll) {
        const counts = poll.counts ?? [];
        const total = counts.reduce((a, b) => a + b, 0);
        middle = (_jsx(Fit, { avail: avail, origin: "top left", children: _jsxs(View, { style: { maxWidth: 1100 * s, gap: 16 * s }, children: [_jsx(Text, { style: [styles.kicker, font, { color: theme.mark, fontSize: 15 * s }], children: poll.status === 'open' ? t('stage.pollOpen') : t('stage.pollResults') }), _jsx(Text, { style: [styles.big, fg, font, { fontSize: 44 * s, lineHeight: 54 * s }], children: poll.question }), poll.options.map((o, i) => {
                        const pct = poll.status === 'closed' && total ? Math.round(((counts[i] ?? 0) / total) * 100) : null;
                        return (_jsxs(View, { style: [styles.row, row, { padding: 18 * s, borderRadius: theme.radius * s, overflow: 'hidden' }], children: [pct !== null ? _jsx(View, { style: [styles.bar, { width: `${pct}%`, backgroundColor: theme.mark }] }) : null, _jsx(Text, { style: [styles.rowText, fg, font, { fontSize: 26 * s, flex: 1 }], children: o }), pct !== null ? _jsxs(Text, { style: [styles.num, fg, font, { fontSize: 26 * s }], children: ["%", pct] }) : null] }, i));
                    })] }) }));
    }
    else if (spotlight) {
        middle = (_jsx(Fit, { avail: avail, origin: "left center", children: _jsxs(View, { style: { maxWidth: 1000 * s, gap: 18 * s }, children: [who(spotlight, 40 * s), _jsx(Text, { style: [styles.big, fg, font, { fontSize: 56 * s, lineHeight: 66 * s }], children: spotlight.body }), _jsxs(View, { style: [styles.who, { gap: 10 * s }], children: [_jsx(QupMark, { size: 30 * s, fill: theme.mark }), _jsx(Text, { style: [styles.num, fg, font, { fontSize: 24 * s }], children: t('stage.supports', { n: spotlight.votes }) })] })] }) }));
    }
    else if (top.length === 0) {
        middle = _jsx(Text, { style: [fg2, font, { fontSize: 24 * s, marginTop: 80 * s, textAlign: 'center' }], children: t('stage.empty') });
    }
    else {
        middle = (_jsx(View, { style: { gap: 12 * s }, children: top.map((q, i) => (_jsxs(View, { onLayout: (e) => {
                    const bottom = e.nativeEvent.layout.y + e.nativeEvent.layout.height;
                    setBottoms((b) => (b[q.id] === bottom ? b : { ...b, [q.id]: bottom }));
                }, style: [
                    styles.row,
                    row,
                    { padding: 16 * s, gap: 18 * s, borderRadius: theme.radius * s },
                    i > 0 && avail > 0 && (bottoms[q.id] ?? 0) > avail ? { opacity: 0 } : null,
                ], children: [_jsx(Text, { style: [styles.rank, fg2, font, { fontSize: 22 * s, width: 32 * s }], children: i + 1 }), avatars ? _jsx(Avatar, { name: q.name, picture: q.picture ?? null, size: 44 * s }) : null, _jsxs(View, { style: styles.flex, children: [_jsx(Text, { numberOfLines: 2, style: [styles.rowText, fg, font, { fontSize: 24 * s, lineHeight: 31 * s }], children: q.body }), _jsx(Text, { style: [fg2, font, { fontSize: 15 * s, marginTop: 4 * s }], children: q.to ? `${q.name} → ${q.to}` : q.name })] }), _jsxs(View, { style: { width: 64 * s, alignItems: 'center', gap: 2 * s }, children: [_jsx(QupMark, { size: 30 * s, fill: theme.mark }), _jsx(Text, { style: [styles.num, fg, font, { fontSize: 24 * s }], children: q.votes })] })] }, q.id))) }));
    }
    return (_jsxs(View, { style: [styles.root, { backgroundColor: theme.background, padding: 40 * s }], children: [_jsxs(View, { style: styles.header, children: [logo ? (_jsx(Image, { source: { uri: logo }, style: { width: 52 * s, height: 52 * s, borderRadius: 12 * s, marginRight: 16 * s } })) : (_jsx(View, { style: { marginRight: 16 * s }, children: _jsx(QupMark, { size: 48 * s, fill: theme.mark }) })), _jsxs(View, { style: styles.flex, children: [_jsx(Text, { numberOfLines: 1, style: [styles.title, fg, font, { fontSize: 34 * s }], children: event?.title ?? '' }), !spotlight && !poll ? _jsx(Text, { style: [fg2, font, { fontSize: 16 * s }], children: t('stage.topQuestions') }) : null] }), event ? (_jsx(View, { style: [
                            styles.pill,
                            {
                                marginLeft: 16 * s,
                                paddingHorizontal: 16 * s,
                                height: 34 * s,
                                backgroundColor: spotlight ? theme.accent : theme.muted,
                            },
                        ], children: _jsx(Text, { style: [
                                styles.pillText,
                                font,
                                { fontSize: 14 * s, color: spotlight ? theme.onAccent : event.closed ? theme.textSecondary : theme.live },
                            ], children: spotlight ? t('stage.onStageNow') : `● ${event.closed ? t('closed') : t('live')}` }) })) : null] }), _jsx(View, { onLayout: (e) => setAvail(e.nativeEvent.layout.height), style: [styles.flex, styles.clip, { justifyContent: spotlight ? 'center' : 'flex-start', marginTop: 32 * s }], children: middle }), _jsxs(View, { style: [styles.footer, { paddingTop: 20 * s, borderTopWidth: spotlight ? 0 : 1, borderTopColor: theme.cardBorder }], children: [_jsxs(Text, { style: [fg2, font, { fontSize: 15 * s }], children: [spotlight || !event ? '' : `${t('mod.people', { n: room.online })} · ${t('mod.total', { n: room.total })} · `, t('stage.withQup')] }), event ? (_jsxs(View, { style: [styles.join, { gap: 14 * s }], children: [!spotlight ? (_jsxs(View, { style: { alignItems: 'flex-end' }, children: [_jsx(Text, { style: [fg2, font, { fontSize: 14 * s }], children: joinText }), _jsxs(Text, { style: [fg, font, { fontSize: 15 * s, fontWeight: '700' }], children: [t('mod.code'), ": ", code] })] })) : null, _jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('mod.showQr'), onPress: () => setQr(true), style: [styles.qr, { padding: 6 * s, borderRadius: 10 * s }], children: _jsx(QrCode, { value: joinUrl, size: 64 * s, logo: logo }) })] })) : null] }), qrOpen && event ? (_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('mod.hideQr'), onPress: () => setQr(false), style: styles.overlay, children: _jsxs(View, { style: [styles.popup, { padding: 32 * s, borderRadius: 28 * s, gap: 18 * s }], children: [_jsx(QrCode, { value: joinUrl, size: 360 * s, logo: logo }), _jsx(Text, { style: [styles.popupTitle, font, { fontSize: 28 * s }], children: t('stage.askAndSupport') }), _jsxs(Text, { style: [styles.popupText, font, { fontSize: 18 * s }], children: [joinText, " \u00B7 ", t('mod.code'), ": ", _jsx(Text, { style: { fontWeight: '800', color: '#1B1B1F' }, children: code })] })] }) })) : null] }));
}
/** İçerik orta alana sığmazsa küçültülür (uzun soru ya da çok seçenekli anket). */
function Fit({ avail, origin, children }) {
    const [h, setH] = useState(0);
    const k = avail > 0 && h > avail ? avail / h : 1;
    return (_jsx(View, { style: { transform: [{ scale: k }], transformOrigin: origin }, children: _jsx(View, { onLayout: (e) => setH(e.nativeEvent.layout.height), children: children }) }));
}
const styles = StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    clip: { overflow: 'hidden' },
    header: { flexDirection: 'row', alignItems: 'center' },
    title: { fontWeight: '800' },
    pill: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
    pillText: { fontWeight: '800', letterSpacing: 0.5 },
    who: { flexDirection: 'row', alignItems: 'center' },
    kicker: { fontWeight: '800', letterSpacing: 1 },
    big: { fontWeight: '700' },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowText: { fontWeight: '600' },
    rank: { fontWeight: '700' },
    num: { fontWeight: '800' },
    bar: { position: 'absolute', top: 0, bottom: 0, left: 0, opacity: 0.28 },
    footer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
    join: { flexDirection: 'row', alignItems: 'flex-end' },
    qr: { backgroundColor: '#FFFFFF' },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.72)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    popup: { backgroundColor: '#FFFFFF', alignItems: 'center' },
    popupTitle: { color: '#1B1B1F', fontWeight: '700' },
    popupText: { color: '#55555E' },
});
