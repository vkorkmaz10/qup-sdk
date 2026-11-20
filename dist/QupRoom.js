import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { activePoll, canReport, canVote, minutesSince, useComposer, useNow, useQuestionList, useShortSend, } from './logic';
import { PollSheet, PollStrip } from './Poll';
import { REPORT_REASONS } from './protocol';
import { QupMark } from './QupMark';
import { errorKey, makeText } from './strings';
import { Text, TextInput } from './Text';
import { DEFAULT_THEME, QupThemeProvider, useQupTheme } from './theme';
export { DEFAULT_THEME, QupThemeProvider, useQupTheme };
export function QupRoom(props) {
    const theme = useMemo(() => ({ ...DEFAULT_THEME, ...props.theme }), [props.theme]);
    return (_jsx(QupThemeProvider, { theme: theme, children: _jsx(RoomScreen, { ...props, theme: theme }) }));
}
function RoomScreen(props) {
    const { room, ui = {}, lang = 'tr', strings, avatars = true, header, titleBar = true, onBack } = props;
    const theme = props.theme;
    const t = makeText(lang, strings);
    const composer = useComposer(room);
    const { tab, setTab, list, spotlight } = useQuestionList(room);
    // Anket açılınca pencere kendiliğinden açılır; kapatılırsa şeritten yeniden açılır. Durumu değişince yine açılır.
    const poll = useMemo(() => activePoll(room.polls), [room.polls]);
    const pollKey = poll ? `${poll.id}:${poll.status}:${poll.counts ? 1 : 0}` : null;
    const [dismissed, setDismissed] = useState(null);
    const now = useNow();
    const [picking, setPicking] = useState(false);
    const fit = useShortSend(ROW_GAP);
    const [menuFor, setMenuFor] = useState(null);
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const Card = ui.Card ?? DefaultCard;
    const Vote = ui.VoteButton ?? QupVoteButton;
    const Avatar = ui.Avatar ?? DefaultAvatar;
    const Button = ui.Button ?? DefaultButton;
    const event = room.event;
    // Üst satır (Qup'taki gibi): geri solda; kişi sayısı ve CANLI sağda. Etkinlik adı altında, en çok iki satır.
    const bar = titleBar ? (_jsxs(View, { children: [_jsxs(View, { style: styles.bar, children: [onBack ? (_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('back'), onPress: onBack, hitSlop: { left: 10, right: 12 }, style: styles.back, children: _jsx(Text, { style: [styles.backText, { color: theme.text }], children: "\u2039" }) })) : null, _jsx(View, { style: styles.flex }), event && !event.closed && room.online > 0 ? (_jsx(Text, { style: [styles.people, font, { color: theme.textSecondary }], children: t('people', { n: room.online }) })) : null, event ? (_jsxs(Text, { style: [styles.status, font, { color: event.closed ? theme.textSecondary : theme.live }], children: ["\u25CF ", event.closed ? t('closed') : t('live')] })) : null] }), event ? (_jsx(Text, { numberOfLines: 2, style: [styles.title, font, { color: theme.text }], children: event.title })) : null] })) : null;
    const message = (text, action) => (_jsxs(View, { style: [styles.flex, styles.page, { backgroundColor: theme.background }], children: [bar, _jsxs(View, { style: styles.center, children: [_jsx(Text, { style: [styles.note, font, { color: theme.text, textAlign: 'center' }], children: text }), action] })] }));
    if (room.cardError) {
        return message(room.cardError === 'members_only' ? t('err.members_only') : t('cardError'), room.retryCard ? _jsx(Button, { title: t('tryAgain'), onPress: room.retryCard, disabled: false }) : null);
    }
    if (room.refusal)
        return message(t(errorKey(room.refusal)));
    if (!event)
        return message(t('joining'));
    // Kapalı oturum: sorular ve anket gösterilmez (Volkan, 21 Kasım 2026). Bağlantı açık kalır; yeniden açılınca ekran döner.
    if (event.closed)
        return message(t('closedNote'));
    const notice = composer.notice
        ? composer.notice.startsWith('err.')
            ? t(errorKey(composer.notice.slice(4)), { max: composer.max })
            : t(composer.notice)
        : null;
    const tabs = [
        ['top', 'tabTop'],
        ['new', 'tabNew'],
        ['mine', 'tabMine'],
    ];
    const meta = (q) => {
        const m = minutesSince(q.createdAt, now);
        const when = m < 1 ? t('justNow') : t('minutesAgo', { n: m });
        const status = q.status === 'pending'
            ? t('pending')
            : q.status === 'rejected'
                ? t('rejected')
                : q.status === 'answered'
                    ? t('answered')
                    : null;
        return `${q.to ? `${q.name} → ${q.to}` : q.name} · ${when}${status ? `  ·  ${status}` : ''}`;
    };
    const composerBox = room.blocked ? (_jsx(Card, { children: _jsx(Text, { style: [styles.note, font, { color: theme.textSecondary }], children: t('blocked') }) })) : (_jsxs(Card, { children: [_jsx(TextInput, { value: composer.body, onChangeText: composer.setBody, placeholder: event.closed ? t('closedPlaceholder') : t('placeholder'), placeholderTextColor: theme.textSecondary, editable: composer.canAsk, multiline: true, maxLength: composer.max, accessibilityLabel: t('placeholder'), style: [styles.input, font, { color: theme.text }] }), _jsxs(Text, { style: [styles.small, font, { color: theme.textSecondary, alignSelf: 'flex-end' }], children: [composer.body.length, "/", composer.max] }), _jsx(View, { style: { height: 1, marginHorizontal: -theme.cardPadding, backgroundColor: theme.cardBorder } }), _jsxs(View, { style: styles.row, onLayout: fit.measure('row'), children: [_jsx(View, { style: styles.ghost, pointerEvents: "none", accessibilityElementsHidden: true, "aria-hidden": true, importantForAccessibility: "no-hide-descendants", onLayout: fit.measure('full'), children: _jsx(Button, { title: t('send'), onPress: () => undefined, disabled: !composer.canAsk }) }), event.speakers.length > 0 ? (_jsx(Pressable, { accessibilityRole: "button", accessibilityState: { expanded: picking }, onPress: () => setPicking(!picking), onLayout: fit.measure('chip'), style: [styles.chip, { backgroundColor: theme.muted }], children: _jsxs(Text, { numberOfLines: 1, style: [styles.chipText, font, { color: theme.text }], children: [t('to'), ": ", composer.to ?? t('everyone'), " \u2304"] }) })) : (_jsx(View, {})), _jsxs(View, { style: styles.sendGroup, children: [_jsx(Text, { onLayout: fit.measure('left'), style: [styles.small, font, { color: theme.textSecondary }], children: t('left', { n: composer.left }) }), _jsx(Button, { title: fit.short ? t('sendShort') : t('send'), onPress: composer.send, disabled: !composer.canAsk })] })] }), picking
                ? [null, ...event.speakers].map((s) => (_jsxs(Pressable, { accessibilityRole: "menuitem", accessibilityState: { selected: composer.to === s }, onPress: () => {
                        composer.setTo(s);
                        setPicking(false);
                    }, style: styles.menuItem, children: [_jsx(Text, { style: [styles.body, font, { color: theme.text, fontWeight: composer.to === s ? '700' : '400' }], children: s ?? t('everyone') }), composer.to === s ? _jsx(Text, { style: { color: theme.accent }, children: "\u2713" }) : null] }, s ?? '*')))
                : null] }));
    return (_jsxs(View, { style: [styles.flex, { backgroundColor: theme.background }], children: [_jsx(FlatList, { style: styles.flex, data: list, keyExtractor: (q) => String(q.id), contentContainerStyle: styles.list, keyboardShouldPersistTaps: "handled", ListHeaderComponent: _jsxs(View, { style: styles.gap, children: [bar, header, poll && dismissed === pollKey ? _jsx(PollStrip, { poll: poll, t: t, onOpen: () => setDismissed(null) }) : null, composerBox, notice ? (_jsx(Text, { style: [
                                styles.note,
                                font,
                                { color: room.lastError || composer.notice?.startsWith('err.') ? theme.danger : theme.text },
                            ], children: notice })) : null, room.status === 'retrying' ? (_jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: t('reconnecting') })) : null, _jsxs(Text, { style: [styles.heading, font, { color: theme.text }], children: [t('questions'), " ", _jsx(Text, { style: { color: theme.textSecondary }, children: room.total })] }), _jsx(View, { style: [styles.tabs, { backgroundColor: theme.muted, borderRadius: theme.radius }], accessibilityRole: "tablist", children: tabs.map(([key, label]) => (_jsx(Pressable, { accessibilityRole: "tab", accessibilityState: { selected: tab === key }, onPress: () => setTab(key), style: [
                                    styles.tab,
                                    { borderRadius: Math.max(4, theme.radius - 4) },
                                    tab === key && { backgroundColor: theme.card },
                                ], children: _jsx(Text, { style: [styles.tabText, font, { color: tab === key ? theme.text : theme.textSecondary }], children: t(label) }) }, key))) }), spotlight ? (_jsxs(View, { style: [styles.question, { backgroundColor: theme.stage, borderRadius: theme.radius, padding: 16 }], children: [_jsxs(View, { style: styles.flex, children: [_jsx(Text, { style: [styles.stageLabel, font, { color: theme.mark }], children: t('onStage') }), _jsx(Text, { style: [styles.stageBody, font, { color: theme.onStage }], children: spotlight.body }), _jsx(Text, { style: [styles.small, font, { color: theme.onStage, opacity: 0.7 }], children: spotlight.to ? `${spotlight.name} → ${spotlight.to}` : spotlight.name })] }), _jsx(Vote, { count: spotlight.votes, voted: room.voted.has(spotlight.id), disabled: !canVote(spotlight, room.blocked), onPress: () => room.vote(spotlight.id), label: room.voted.has(spotlight.id) ? t('unsupport') : t('support'), onStage: true })] })) : null] }), ListEmptyComponent: spotlight ? undefined : (_jsx(Text, { style: [styles.empty, font, { color: theme.textSecondary }], children: tab === 'mine' ? t('emptyMine') : t('empty') })), renderItem: ({ item: q }) => (_jsx(Card, { dimmed: q.status === 'answered' || q.status === 'rejected', children: _jsxs(View, { style: styles.question, children: [avatars ? _jsx(Avatar, { name: q.name, picture: q.picture ?? null, size: 36 }) : null, _jsxs(View, { style: styles.flex, children: [_jsx(Text, { style: [styles.body, font, { color: theme.text }], children: q.body }), _jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: meta(q) })] }), canReport(q, room.blocked) ? (_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('more'), onPress: () => setMenuFor(q), hitSlop: 6, style: styles.more, children: _jsx(Text, { style: [styles.moreText, { color: theme.textSecondary }], children: "\u22EF" }) })) : null, q.status === 'pending' || q.status === 'rejected' ? null : (_jsx(Vote, { count: q.votes, voted: room.voted.has(q.id), disabled: !canVote(q, room.blocked), onPress: () => room.vote(q.id), label: room.voted.has(q.id) ? t('unsupport') : t('support') }))] }) })) }), poll && dismissed !== pollKey ? (_jsx(PollSheet, { poll: poll, t: t, onVote: (option) => room.pollVote(poll.id, option), onClose: () => setDismissed(pollKey) })) : null, _jsx(ReportMenu, { q: menuFor, theme: theme, t: t, onClose: () => setMenuFor(null), onReport: (reason) => {
                    if (menuFor && room.report(menuFor.id, reason))
                        composer.setNotice('reported');
                    setMenuFor(null);
                }, onMute: () => {
                    if (menuFor && room.mute(menuFor.id))
                        composer.setNotice('muted');
                    setMenuFor(null);
                } })] }));
}
/** "⋯" penceresi: önce bildir / gösterme, bildir seçilince sebep. Bildirenin adı moderatöre gösterilmez. */
function ReportMenu({ q, theme, t, onClose, onReport, onMute, }) {
    const [why, setWhy] = useState(false);
    const close = () => {
        setWhy(false);
        onClose();
    };
    const items = why
        ? REPORT_REASONS.map((r) => [
            t(`reason.${r}`),
            () => {
                setWhy(false);
                onReport(r);
            },
        ])
        : [
            [t('report'), () => setWhy(true)],
            [t('mute'), () => onMute()],
        ];
    return (_jsx(Modal, { visible: !!q, transparent: true, animationType: "fade", onRequestClose: close, children: _jsx(Pressable, { style: styles.backdrop, onPress: close, accessibilityLabel: t('cancel'), children: _jsxs(Pressable, { style: [styles.sheet, { backgroundColor: theme.card, borderRadius: theme.radius }], onPress: () => undefined, children: [why ? _jsx(Text, { style: [styles.heading, { color: theme.text, marginTop: 0 }], children: t('reasonTitle') }) : null, items.map(([label, run]) => (_jsx(Pressable, { accessibilityRole: "button", onPress: run, style: styles.menuItem, children: _jsx(Text, { style: [styles.body, { color: theme.text }], children: label }) }, label))), _jsx(Pressable, { accessibilityRole: "button", onPress: close, style: styles.menuItem, children: _jsx(Text, { style: [styles.body, { color: theme.textSecondary }], children: t('cancel') }) })] }) }) }));
}
export function DefaultCard({ children, style, dimmed }) {
    const theme = useQupTheme();
    return (_jsx(View, { style: [
            {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                borderWidth: 1,
                borderRadius: theme.radius,
                padding: theme.cardPadding,
                gap: 8,
            },
            dimmed && { opacity: 0.6 },
            style,
        ], children: children }));
}
/**
 * Qup'un destek düğmesi: Qup işareti üstte, sayı altta. Destek verilince düğme vurgu rengine döner; işaret vurguyla
 * aynı renkteyse ters çevrilir (turuncu düğmede açık balon) ki kaybolmasın.
 */
export function QupVoteButton({ count, voted, disabled, onPress, label, onStage }) {
    const theme = useQupTheme();
    const same = theme.mark.toLowerCase() === theme.accent.toLowerCase();
    const fill = voted && same ? theme.onAccent : theme.mark;
    const chevron = voted && same ? theme.accent : '#1B1B1F';
    const fg = voted ? theme.onAccent : onStage ? theme.onStage : theme.text;
    return (_jsxs(Pressable, { accessibilityRole: "button", accessibilityLabel: label, accessibilityState: { disabled, selected: voted }, disabled: disabled, onPress: onPress, style: [
            styles.vote,
            {
                borderRadius: Math.max(8, theme.radius - 4),
                backgroundColor: voted ? theme.accent : onStage ? 'transparent' : theme.card,
                borderColor: voted ? theme.accent : onStage ? '#3A3A40' : theme.cardBorder,
                opacity: disabled && !voted ? 0.55 : 1,
            },
        ], children: [_jsx(QupMark, { size: 20, fill: fill, chevron: chevron }), _jsx(Text, { style: [styles.voteText, theme.fontFamily ? { fontFamily: theme.fontFamily } : null, { color: fg }], children: count })] }));
}
export function DefaultAvatar({ name, picture, size }) {
    const theme = useQupTheme();
    const box = { width: size, height: size, borderRadius: size / 2 };
    if (picture)
        return _jsx(Image, { source: { uri: picture }, style: box, accessibilityIgnoresInvertColors: true });
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toLocaleUpperCase())
        .join('');
    return (_jsx(View, { style: [box, { backgroundColor: theme.muted, alignItems: 'center', justifyContent: 'center' }], children: _jsx(Text, { style: { color: theme.textSecondary, fontSize: size * 0.38, fontWeight: '700' }, children: initials }) }));
}
export function DefaultButton({ title, onPress, disabled, variant = 'primary' }) {
    const theme = useQupTheme();
    const outline = variant === 'outline';
    return (_jsx(Pressable, { accessibilityRole: "button", accessibilityState: { disabled }, disabled: disabled, onPress: onPress, style: [
            styles.button,
            {
                borderRadius: Math.max(6, theme.radius - 4),
                backgroundColor: outline ? 'transparent' : disabled ? theme.muted : theme.accent,
                borderWidth: 1.5,
                borderColor: outline ? theme.cardBorder : disabled ? theme.muted : theme.accent,
                opacity: outline && disabled ? 0.5 : 1,
            },
        ], children: _jsx(Text, { style: [
                styles.buttonText,
                theme.fontFamily ? { fontFamily: theme.fontFamily } : null,
                { color: outline ? theme.text : disabled ? theme.textSecondary : theme.onAccent },
            ], children: title }) }));
}
const ROW_GAP = 10;
const styles = StyleSheet.create({
    flex: { flex: 1 },
    page: { padding: 16 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
    list: { gap: 10, padding: 16, paddingBottom: 32 },
    gap: { gap: 10 },
    bar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44 },
    back: { width: 22, height: 44, justifyContent: 'center' },
    backText: { fontSize: 30, lineHeight: 32 },
    people: { fontSize: 13, fontWeight: '600' },
    status: { fontSize: 12, fontWeight: '700' },
    title: { fontSize: 19, lineHeight: 24, fontWeight: '700' },
    input: { outlineWidth: 0, outlineColor: 'transparent', minHeight: 64, fontSize: 16, lineHeight: 22, textAlignVertical: 'top' },
    // Tek satır: yazılar kesilmez; yer yetmezse gönder düğmesi "Gönder"e kısalır (useShortSend).
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: ROW_GAP },
    sendGroup: { flexDirection: 'row', alignItems: 'center', gap: ROW_GAP },
    ghost: { position: 'absolute', left: 0, top: 0, opacity: 0 },
    chip: { flexShrink: 0, minHeight: 36, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center' },
    chipText: { fontSize: 14, fontWeight: '600' },
    menuItem: { minHeight: 44, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    small: { fontSize: 12, lineHeight: 17 },
    note: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
    heading: { fontSize: 18, fontWeight: '700', marginTop: 8 },
    tabs: { flexDirection: 'row', padding: 4 },
    tab: { flex: 1, minHeight: 36, alignItems: 'center', justifyContent: 'center' },
    tabText: { fontSize: 14, fontWeight: '600' },
    question: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    stageLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    stageBody: { fontSize: 17, fontWeight: '600', lineHeight: 23 },
    empty: { textAlign: 'center', paddingVertical: 32, fontSize: 14 },
    body: { fontSize: 15, lineHeight: 21, marginBottom: 4 },
    more: { width: 30, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    moreText: { fontSize: 18, fontWeight: '700', letterSpacing: 1 },
    vote: {
        width: 52,
        minHeight: 58,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        paddingVertical: 6,
    },
    voteText: { fontSize: 15, fontWeight: '700' },
    button: { height: 44, paddingHorizontal: 16, justifyContent: 'center' },
    buttonText: { fontSize: 15, fontWeight: '700' },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end', padding: 12 },
    sheet: { padding: 16, gap: 4 },
});
