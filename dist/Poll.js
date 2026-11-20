import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useQupTheme } from './QupRoom';
/**
 * Katılımcı anketi (Qup'taki gibi): alttan açılan pencere, tek seçim, "Gönder". Oy sonradan değiştirilemez.
 * Sonuçlar anket kapanıp moderatör gösterince çubuklarla görünür. Kapatılırsa üstte küçük bir şeritten yeniden açılır.
 */
export function PollSheet({ poll, t, onVote, onClose, }) {
    const theme = useQupTheme();
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const [choice, setChoice] = useState(null);
    const voted = poll.myVote !== null;
    const results = poll.counts;
    const total = results ? results.reduce((a, b) => a + b, 0) : 0;
    const r = Math.max(6, theme.radius - 4);
    return (_jsx(Modal, { transparent: true, animationType: "fade", visible: true, onRequestClose: onClose, children: _jsxs(View, { style: styles.backdrop, children: [_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('poll.close'), style: styles.flex, onPress: onClose }), _jsxs(View, { style: [
                        styles.sheet,
                        { backgroundColor: theme.card, borderTopLeftRadius: theme.radius + 8, borderTopRightRadius: theme.radius + 8 },
                    ], children: [_jsx(View, { style: [styles.grabber, { backgroundColor: theme.cardBorder }] }), _jsxs(View, { style: styles.head, children: [_jsx(Text, { style: [styles.kicker, font, { color: theme.mark }], children: t('poll.kicker') }), _jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('poll.close'), onPress: onClose, style: [styles.x, { backgroundColor: theme.muted, borderRadius: r }], children: _jsx(Text, { style: { color: theme.text, fontSize: 14 }, children: "\u2715" }) })] }), _jsx(Text, { style: [styles.question, font, { color: theme.text }], children: poll.question }), results ? (_jsxs(View, { style: styles.gap, children: [poll.options.map((o, i) => {
                                    const pct = total ? Math.round((results[i] / total) * 100) : 0;
                                    const mine = poll.myVote === i;
                                    return (_jsxs(View, { style: [styles.row, { borderColor: mine ? theme.accent : theme.cardBorder, borderRadius: r }], children: [_jsx(View, { style: [styles.bar, { width: `${pct}%`, backgroundColor: theme.mark, opacity: mine ? 0.3 : 0.15 }] }), _jsxs(Text, { style: [styles.option, font, { color: theme.text }], children: [o, mine ? ' ✓' : ''] }), _jsxs(Text, { style: [styles.pct, font, { color: theme.text }], children: ["%", pct] })] }, i));
                                }), _jsx(Text, { style: [styles.note, font, { color: theme.textSecondary }], children: t('poll.totalVotes', { n: total }) })] })) : (_jsxs(View, { style: styles.gap, children: [poll.options.map((o, i) => {
                                    const selected = voted ? poll.myVote === i : choice === i;
                                    return (_jsx(Pressable, { accessibilityRole: "radio", accessibilityState: { selected, disabled: voted || poll.status !== 'open' }, disabled: voted || poll.status !== 'open', onPress: () => setChoice(i), style: [
                                            styles.row,
                                            {
                                                borderColor: selected ? theme.accent : theme.cardBorder,
                                                borderRadius: r,
                                                backgroundColor: selected ? theme.muted : 'transparent',
                                            },
                                        ], children: _jsxs(Text, { style: [styles.option, font, { color: theme.text, fontWeight: selected ? '700' : '500' }], children: [o, selected ? ' ✓' : ''] }) }, i));
                                }), voted ? (_jsx(Text, { style: [styles.note, font, { color: theme.textSecondary }], children: t('poll.thanks') })) : poll.status === 'open' ? (_jsxs(_Fragment, { children: [_jsx(Pressable, { accessibilityRole: "button", accessibilityState: { disabled: choice === null }, disabled: choice === null, onPress: () => choice !== null && onVote(choice), style: [styles.send, { borderRadius: r, backgroundColor: choice === null ? theme.muted : theme.accent }], children: _jsx(Text, { style: [styles.sendText, font, { color: choice === null ? theme.textSecondary : theme.onAccent }], children: t('poll.send') }) }), _jsx(Text, { style: [styles.note, font, { color: theme.textSecondary }], children: t('poll.once') })] })) : (_jsx(Text, { style: [styles.note, font, { color: theme.textSecondary }], children: t('poll.closed') }))] }))] })] }) }));
}
/** Pencere kapatılınca listenin üstünde duran şerit. */
export function PollStrip({ poll, t, onOpen }) {
    const theme = useQupTheme();
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const label = poll.counts ? t('poll.stripResults') : poll.myVote !== null ? t('poll.stripVoted') : t('poll.stripOpen');
    return (_jsxs(Pressable, { accessibilityRole: "button", onPress: onOpen, style: [styles.strip, { backgroundColor: theme.stage, borderRadius: theme.radius }], children: [_jsx(Text, { style: [styles.kicker, font, { color: theme.mark }], children: t('poll.kicker') }), _jsx(Text, { numberOfLines: 1, style: [styles.stripText, font, { color: theme.onStage }], children: poll.question }), _jsxs(Text, { style: [styles.stripAction, font, { color: theme.mark }], children: [label, " \u203A"] })] }));
}
const styles = StyleSheet.create({
    flex: { flex: 1 },
    gap: { gap: 10 },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: { padding: 18, paddingBottom: 28, gap: 14, width: '100%', maxWidth: 640, alignSelf: 'center' },
    grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center' },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    x: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    question: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
    row: { minHeight: 50, borderWidth: 1.5, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
    option: { fontSize: 15 },
    bar: { position: 'absolute', top: 0, bottom: 0, left: 0 },
    pct: { marginLeft: 'auto', fontSize: 15, fontWeight: '800' },
    send: { height: 52, alignItems: 'center', justifyContent: 'center' },
    sendText: { fontSize: 16, fontWeight: '700' },
    note: { fontSize: 12, lineHeight: 17, textAlign: 'center' },
    strip: { paddingHorizontal: 14, paddingVertical: 12, gap: 2 },
    stripText: { fontSize: 15, fontWeight: '600' },
    stripAction: { fontSize: 13, fontWeight: '700' },
});
