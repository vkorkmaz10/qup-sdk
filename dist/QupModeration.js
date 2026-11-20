import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { DEFAULT_THEME, DefaultButton, DefaultCard, QupThemeProvider, useQupTheme, } from './QupRoom';
import { QupMark } from './QupMark';
import { errorKey, makeText } from './strings';
/** Kurumun kartı ve düğmesi alt parçalara bağlamla ulaşır. */
const SlotsContext = createContext({});
const useSlots = () => useContext(SlotsContext);
export function QupModeration(props) {
    const theme = useMemo(() => ({ ...DEFAULT_THEME, ...props.theme }), [props.theme]);
    return (_jsx(QupThemeProvider, { theme: theme, children: _jsx(SlotsContext.Provider, { value: props.ui ?? {}, children: _jsx(ModerationScreen, { ...props, theme: theme }) }) }));
}
function ModerationScreen(props) {
    const { room, ui = {}, lang = 'tr', strings, onBack, onOpenStage, onShare, onExportCsv, wideFrom = 1000 } = props;
    const theme = props.theme;
    const t = makeText(lang, strings);
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const Card = ui.Card ?? DefaultCard;
    const Button = ui.Button ?? DefaultButton;
    const wide = useWindowDimensions().width >= wideFrom;
    const [open, setOpen] = useState(null);
    const close = () => setOpen(null);
    const event = room.event;
    const lead = room.canManage ?? room.lead ?? false;
    const groups = useMemo(() => {
        const all = Object.values(room.questions);
        const byVotes = (a, b) => b.votes - a.votes || a.id - b.id;
        return {
            pending: all.filter((q) => q.status === 'pending').sort((a, b) => a.createdAt - b.createdAt),
            live: all.filter((q) => q.status === 'live' && q.id !== event?.spotlight).sort(byVotes),
            answered: all.filter((q) => q.status === 'answered').sort(byVotes),
            hidden: all.filter((q) => q.status === 'rejected').sort(byVotes),
        };
    }, [room.questions, event?.spotlight]);
    const spotlight = event?.spotlight != null ? room.questions[event.spotlight] : undefined;
    const openPolls = Object.values(room.polls).filter((p) => p.status === 'open').length;
    const message = (text, action) => (_jsxs(View, { style: [styles.flex, styles.center, { backgroundColor: theme.background }], children: [_jsx(Text, { style: [styles.note, font, { color: theme.text, textAlign: 'center' }], children: text }), action] }));
    if (room.cardError) {
        return message(room.cardError === 'not_staff' ? t('mod.notStaff') : t('cardError'), room.retryCard ? _jsx(Button, { title: t('tryAgain'), onPress: room.retryCard, disabled: false }) : null);
    }
    if (room.refusal) {
        return message(room.refusal === 'removed' ? t('mod.removed') : room.refusal === 'closed' ? t('mod.finalText') : t(errorKey(room.refusal)));
    }
    if (!event)
        return message(t('joining'));
    const header = (_jsxs(View, { style: [styles.header, wide && styles.wideWidth], children: [onBack ? (_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('back'), onPress: onBack, hitSlop: { left: 10, right: 12 }, style: styles.back, children: _jsx(Text, { style: [styles.backText, { color: theme.text }], children: "\u2039" }) })) : null, _jsxs(View, { style: styles.flex, children: [_jsx(Text, { numberOfLines: 1, style: [styles.title, font, { color: theme.text }], children: event.title }), _jsxs(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: [t('mod.code'), " ", _jsx(Text, { style: [styles.code, { color: theme.text }], children: event.code }), " \u00B7", ' ', t('mod.people', { n: room.online }), " \u00B7", ' ', _jsxs(Text, { style: [styles.status, { color: event.closed ? theme.textSecondary : theme.live }], children: ["\u25CF ", event.closed ? t('closed') : t('live')] })] })] }), wide ? (_jsxs(_Fragment, { children: [event.membersOnly ? null : (_jsx(Button, { title: event.qr ? t('mod.hideQr') : t('mod.showQr'), onPress: () => room.showQr(!event.qr), disabled: false, variant: event.qr ? 'primary' : 'outline' })), onOpenStage ? _jsx(Button, { title: t('mod.openStage'), onPress: onOpenStage, disabled: false, variant: "outline" }) : null] })) : null, _jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('mod.menu'), onPress: () => setOpen('menu'), style: [styles.menuButton, { borderColor: theme.cardBorder, borderRadius: Math.max(8, theme.radius - 4) }], children: _jsx(Text, { style: [styles.menuText, { color: theme.text }], children: "\u22EF" }) })] }));
    const list = (_jsxs(View, { style: [styles.gap, wide && styles.flex], children: [room.status === 'retrying' ? (_jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: t('reconnecting') })) : null, !wide && groups.pending.length > 0 ? (_jsxs(Pressable, { accessibilityRole: "button", onPress: () => setOpen('pending'), style: [styles.banner, { borderColor: theme.mark, borderRadius: theme.radius }], children: [_jsx(Text, { style: [styles.bannerText, font, { color: theme.text }], children: t('mod.pendingBanner', { n: groups.pending.length }) }), _jsx(Text, { style: [styles.bannerText, font, { color: theme.text }], children: t('mod.see') })] })) : null, spotlight ? (_jsx(ModCard, { q: spotlight, t: t, onStage: true, onMain: () => room.moderate('answer', spotlight.id), onMore: () => setOpen({ question: spotlight }) })) : null, groups.live.map((q) => (_jsx(ModCard, { q: q, t: t, onMain: () => room.spotlight(q.id), onMore: () => setOpen({ question: q }) }, q.id))), !spotlight && groups.live.length === 0 ? (_jsx(Text, { style: [styles.empty, font, { color: theme.textSecondary }], children: t('mod.empty') })) : null, _jsx(Folded, { title: t('mod.answeredList'), count: groups.answered.length, children: groups.answered.map((q) => (_jsx(ModCard, { q: q, t: t, dimmed: true, mainLabel: t('mod.restage'), onMain: () => room.spotlight(q.id), onMore: () => setOpen({ question: q }) }, q.id))) }), _jsx(Folded, { title: t('mod.hiddenList'), count: groups.hidden.length, children: groups.hidden.map((q) => (_jsx(ModCard, { q: q, t: t, dimmed: true, mainLabel: q.blocked ? t('mod.unblock') : t('mod.restore'), onMain: () => (q.blocked ? room.block(q.id, false) : room.moderate('restore', q.id)) }, q.id))) }), _jsx(Text, { style: [styles.small, font, { color: theme.textSecondary, textAlign: 'center' }], children: t('mod.total', { n: room.total }) })] }));
    return (_jsxs(View, { style: [styles.flex, { backgroundColor: theme.background }], children: [header, _jsx(ScrollView, { contentContainerStyle: [styles.scroll, wide && styles.wideWidth], children: wide ? (_jsxs(View, { style: styles.columns, children: [list, _jsxs(View, { style: [styles.gap, styles.side], children: [_jsxs(Text, { style: [styles.section, font, { color: theme.text }], children: [t('mod.pending'), groups.pending.length > 0 ? _jsxs(Text, { style: { color: theme.mark }, children: [" ", groups.pending.length] }) : null] }), _jsx(PendingList, { items: groups.pending, room: room, t: t }), _jsx(Text, { style: [styles.section, font, { color: theme.text, marginTop: 10 }], children: t('mod.polls') }), _jsx(PollArea, { room: room, t: t, lead: lead })] })] })) : (list) }), open === 'menu' ? (_jsxs(Sheet, { onClose: close, children: [wide ? null : (_jsx(Item, { label: t('mod.polls'), detail: openPolls > 0 ? t('mod.pollsOpen', { n: openPolls }) : '›', onPress: () => setOpen('polls') })), !wide && onOpenStage ? _jsx(Item, { label: t('mod.openStage'), onPress: () => (close(), onOpenStage()) }) : null, wide || event.membersOnly ? null : (_jsx(Item, { label: event.qr ? t('mod.hideQr') : t('mod.showQr'), onPress: () => (close(), room.showQr(!event.qr)) })), onShare ? _jsx(Item, { label: t('mod.share'), onPress: () => (close(), onShare(`https://qupin.app/${event.code}`)) }) : null, lead ? (_jsxs(_Fragment, { children: [_jsx(Item, { label: t('mod.settings'), detail: event.requireApproval ? t('mod.approvalIsOn') : t('mod.approvalIsOff'), onPress: () => setOpen('settings') }), onExportCsv ? _jsx(Item, { label: t('mod.csv'), onPress: () => (close(), onExportCsv()) }) : null, event.final ? null : event.closed ? (_jsx(Item, { label: t('mod.reopen'), onPress: () => (close(), room.reopen()) })) : (_jsx(Item, { label: t('mod.close'), danger: true, onPress: () => (close(), room.close()) }))] })) : (_jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: t('mod.moderatorNote') }))] })) : null, open === 'pending' ? (_jsx(Sheet, { title: `${t('mod.pending')} ${groups.pending.length}`, onClose: close, children: _jsx(PendingList, { items: groups.pending, room: room, t: t }) })) : null, open === 'polls' ? (_jsx(Sheet, { title: t('mod.polls'), onClose: close, children: _jsx(PollArea, { room: room, t: t, lead: lead }) })) : null, open === 'settings' ? (_jsxs(Sheet, { title: t('mod.settings'), onClose: close, children: [_jsx(Setting, { label: t('mod.approval'), text: t('mod.approvalText'), value: event.requireApproval, disabled: event.closed, onChange: room.setApproval }), event.membersAllowed ? (_jsx(Setting, { label: t('mod.membersOnly'), text: t('mod.membersOnlyText'), value: !!event.membersOnly, disabled: event.closed, onChange: room.setMembersOnly })) : null, _jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: event.final ? t('mod.finalText') : event.closed ? t('mod.closedText') : t('mod.openText') })] })) : null, open && typeof open === 'object' && 'question' in open ? (_jsx(QuestionMenu, { q: room.questions[open.question.id] ?? open.question, room: room, t: t, onClose: close, onBlock: (q) => setOpen({ block: q }) })) : null, open && typeof open === 'object' && 'block' in open ? (_jsx(Sheet, { title: t('mod.blockTitle', { name: open.block.name }), subtitle: t('mod.blockText'), onClose: close, children: _jsxs(View, { style: styles.actions, children: [_jsx(Button, { title: t('cancel'), onPress: close, disabled: false, variant: "outline" }), _jsx(Button, { title: t('mod.block'), onPress: () => {
                                room.block(open.block.id, true);
                                close();
                            }, disabled: false })] }) })) : null] }));
}
/** Soru kartı: üstte destek sayısı, soru ve ⋯; altta sağa yaslı tek düğme. Sahnedeki turuncu çerçeveli, "Bitti". */
function ModCard({ q, t, onStage, dimmed, mainLabel, onMain, onMore, }) {
    const theme = useQupTheme();
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const reported = !!q.reports && q.reports.n > 0 && (q.status === 'live' || q.status === 'answered');
    return (_jsx(View, { style: [styles.cardFrame, { borderColor: onStage ? theme.mark : 'transparent', borderRadius: theme.radius + 2 }], children: _jsxs(CardSlot, { dimmed: dimmed, children: [_jsxs(View, { style: styles.cardTop, children: [_jsxs(View, { style: [styles.votes, { borderColor: theme.cardBorder, borderRadius: Math.max(8, theme.radius - 4) }], children: [_jsx(QupMark, { size: 20, fill: theme.mark, chevron: "#1B1B1F" }), _jsx(Text, { style: [styles.votesText, font, { color: theme.text }], children: q.votes })] }), _jsxs(View, { style: styles.flex, children: [onStage ? _jsx(Text, { style: [styles.stageLabel, { color: theme.mark }], children: t('onStage') }) : null, _jsx(Text, { style: [styles.body, font, { color: theme.text }], children: q.body }), _jsxs(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: [q.name, q.to ? ` → ${q.to}` : ''] }), reported ? _jsxs(Text, { style: [styles.flag, { color: theme.danger }], children: ["\u2691 ", t('mod.reported')] }) : null, q.blocked ? _jsxs(Text, { style: [styles.flag, { color: theme.danger }], children: ["\u2298 ", t('mod.blockedTag')] }) : null] }), onMore ? (_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: t('more'), onPress: onMore, hitSlop: 6, style: styles.more, children: _jsx(Text, { style: [styles.moreText, { color: theme.textSecondary }], children: "\u22EF" }) })) : null] }), _jsx(View, { style: styles.actions, children: _jsx(ButtonSlot, { title: mainLabel ?? (onStage ? t('mod.done') : t('mod.stageIt')), onPress: onMain, variant: onStage ? 'primary' : 'outline' }) })] }) }));
}
function CardSlot({ children, dimmed }) {
    const Card = useSlots().Card ?? DefaultCard;
    return _jsx(Card, { dimmed: dimmed, children: children });
}
function ButtonSlot(props) {
    const Button = useSlots().Button ?? DefaultButton;
    return _jsx(Button, { ...props, disabled: false });
}
function PendingList({ items, room, t }) {
    const theme = useQupTheme();
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    if (items.length === 0) {
        return (_jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: room.event?.requireApproval ? t('mod.noPending') : t('mod.approvalOff') }));
    }
    return (_jsx(_Fragment, { children: items.map((q) => (_jsxs(CardSlot, { children: [_jsx(Text, { style: [styles.body, font, { color: theme.text }], children: q.body }), _jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: q.name }), _jsxs(View, { style: styles.actions, children: [_jsx(ButtonSlot, { title: t('mod.reject'), onPress: () => room.moderate('reject', q.id), variant: "outline" }), _jsx(ButtonSlot, { title: t('mod.approve'), onPress: () => room.moderate('approve', q.id) })] })] }, q.id))) }));
}
function QuestionMenu({ q, room, t, onClose, onBlock, }) {
    const reported = !!q.reports && q.reports.n > 0;
    const run = (fn) => () => {
        fn();
        onClose();
    };
    const reasons = reported
        ? Object.entries(q.reports.reasons)
            .filter(([, n]) => n)
            .map(([r, n]) => `${t(`reason.${r}`)} (${n})`)
            .join(', ')
        : '';
    return (_jsxs(Sheet, { title: q.name, subtitle: reported ? `⚑ ${q.reports.n} · ${reasons}` : q.body, onClose: onClose, children: [reported ? _jsx(Item, { label: t('mod.reportsClear'), onPress: run(() => room.reportsOk(q.id)) }) : null, q.status === 'live' ? _jsx(Item, { label: t('mod.markAnswered'), onPress: run(() => room.moderate('answer', q.id)) }) : null, q.status !== 'rejected' ? _jsx(Item, { label: t('mod.hide'), danger: true, onPress: run(() => room.moderate('reject', q.id)) }) : null, q.blocked ? null : _jsx(Item, { label: t('mod.block'), danger: true, onPress: () => onBlock(q) })] }));
}
/** Anket: yoksa kısa not ve "Anket hazırla" (form basınca açılır); varsa her anket kartı ve durumuna göre tek düğme. */
function PollArea({ room, t, lead }) {
    const theme = useQupTheme();
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const [form, setForm] = useState(false);
    const polls = Object.values(room.polls).sort((a, b) => a.id - b.id);
    const limit = room.event?.pollLimit ?? 1;
    if (polls.length === 0 && !form) {
        return (_jsxs(CardSlot, { children: [_jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: lead ? t('mod.noPollYet') : t('mod.noPollMod') }), lead ? (_jsx(View, { style: styles.actions, children: _jsx(ButtonSlot, { title: t('mod.pollNew'), onPress: () => setForm(true), variant: "outline" }) })) : null] }));
    }
    return (_jsxs(_Fragment, { children: [polls.map((p) => (_jsx(PollCard, { poll: p, room: room, t: t, lead: lead }, p.id))), lead ? (polls.length < limit ? (_jsx(PollForm, { room: room, t: t })) : (_jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: t('mod.pollLimit', { n: limit }) }))) : null] }));
}
function PollCard({ poll, room, t, lead }) {
    const theme = useQupTheme();
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const counts = poll.counts ?? poll.options.map(() => 0);
    const total = counts.reduce((a, b) => a + b, 0);
    const status = { draft: t('mod.pollDraft'), open: t('mod.pollOpen'), closed: t('mod.pollClosed') }[poll.status];
    return (_jsxs(CardSlot, { children: [_jsxs(View, { style: styles.row, children: [_jsxs(Text, { style: [styles.flag, { color: poll.status === 'open' ? theme.live : theme.textSecondary, marginTop: 0 }], children: ["\u25CF ", status] }), _jsx(Text, { style: [styles.small, font, { color: theme.textSecondary }], children: t('mod.pollVotes', { n: total }) })] }), _jsx(Text, { style: [styles.body, font, { color: theme.text, fontWeight: '700' }], children: poll.question }), poll.options.map((o, i) => {
                const pct = total ? Math.round((counts[i] / total) * 100) : 0;
                return (_jsxs(View, { style: [styles.result, { backgroundColor: theme.muted, borderRadius: Math.max(6, theme.radius - 8) }], children: [_jsx(View, { style: [styles.bar, { width: `${pct}%`, backgroundColor: theme.mark, opacity: 0.25 }] }), _jsx(Text, { style: [styles.small, font, { color: theme.text }], children: o }), _jsxs(Text, { style: [styles.small, font, { color: theme.text, fontWeight: '800', marginLeft: 'auto' }], children: [counts[i], " \u00B7 %", pct] })] }, i));
            }), _jsx(View, { style: styles.actions, children: poll.status === 'draft' ? (_jsxs(_Fragment, { children: [lead ? (_jsx(ButtonSlot, { title: t('mod.pollDelete'), onPress: () => room.pollAction('poll_delete', poll.id), variant: "outline" })) : null, _jsx(ButtonSlot, { title: t('mod.pollStart'), onPress: () => room.pollAction('poll_open', poll.id) })] })) : poll.status === 'open' ? (_jsx(ButtonSlot, { title: t('mod.pollStop'), onPress: () => room.pollAction('poll_close', poll.id) })) : (_jsx(ButtonSlot, { title: poll.showResults ? t('mod.pollHideResults') : t('mod.pollShowResults'), onPress: () => room.pollResults(poll.id, !poll.showResults), variant: poll.showResults ? 'outline' : 'primary' })) })] }));
}
function PollForm({ room, t }) {
    const theme = useQupTheme();
    const font = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [error, setError] = useState(null);
    const submit = () => {
        const q = question.trim();
        const opts = options.map((o) => o.trim()).filter(Boolean);
        if (q.length < 3)
            return setError(t('mod.pollNeedQuestion'));
        if (opts.length < 2)
            return setError(t('mod.pollNeedOptions'));
        if (room.pollCreate(q, opts)) {
            setQuestion('');
            setOptions(['', '']);
            setError(null);
        }
    };
    const input = [
        styles.input,
        font,
        { color: theme.text, borderColor: theme.cardBorder, borderRadius: Math.max(6, theme.radius - 6) },
    ];
    return (_jsxs(CardSlot, { children: [_jsx(TextInput, { value: question, onChangeText: setQuestion, placeholder: t('mod.pollQuestion'), placeholderTextColor: theme.textSecondary, maxLength: 160, accessibilityLabel: t('mod.pollQuestion'), style: input }), options.map((o, i) => (_jsx(TextInput, { value: o, onChangeText: (v) => setOptions(options.map((x, j) => (j === i ? v : x))), placeholder: t('mod.pollOption', { n: i + 1 }), placeholderTextColor: theme.textSecondary, maxLength: 60, accessibilityLabel: t('mod.pollOption', { n: i + 1 }), style: input }, i))), error ? _jsx(Text, { style: [styles.small, font, { color: theme.danger }], children: error }) : null, _jsxs(View, { style: styles.actions, children: [options.length < 6 ? (_jsx(ButtonSlot, { title: t('mod.pollAddOption'), onPress: () => setOptions([...options, '']), variant: "outline" })) : null, _jsx(ButtonSlot, { title: t('mod.pollPrepare'), onPress: submit })] })] }));
}
/** Listenin altındaki katlı bölüm (Cevaplananlar, Gizlenenler). Boşsa görünmez. */
function Folded({ title, count, children }) {
    const theme = useQupTheme();
    const [open, setOpen] = useState(false);
    if (count === 0)
        return null;
    return (_jsxs(View, { style: styles.gap, children: [_jsxs(Pressable, { accessibilityRole: "button", accessibilityState: { expanded: open }, onPress: () => setOpen(!open), style: styles.fold, children: [_jsxs(Text, { style: [styles.foldText, { color: open ? theme.text : theme.textSecondary }], children: [title, " ", count] }), _jsx(Text, { style: [styles.foldText, { color: theme.textSecondary }], children: open ? '⌃' : '⌄' })] }), open ? children : null] }));
}
function Setting({ label, text, value, disabled, onChange, }) {
    const theme = useQupTheme();
    return (_jsxs(View, { style: styles.setting, children: [_jsxs(View, { style: styles.flex, children: [_jsx(Text, { style: [styles.body, { color: theme.text, fontWeight: '700' }], children: label }), _jsx(Text, { style: [styles.small, { color: theme.textSecondary }], children: text })] }), _jsx(Switch, { accessibilityLabel: label, value: value, onValueChange: (v) => {
                    onChange(v);
                }, disabled: disabled, trackColor: { true: theme.mark, false: theme.muted }, thumbColor: "#FFFFFF" })] }));
}
/** Alttan açılan pencere; dışına basınca kapanır. */
function Sheet({ title, subtitle, onClose, children, }) {
    const theme = useQupTheme();
    return (_jsx(Modal, { transparent: true, animationType: "fade", visible: true, onRequestClose: onClose, children: _jsxs(View, { style: styles.backdrop, children: [_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: "\u00D7", style: styles.flex, onPress: onClose }), _jsxs(View, { style: [
                        styles.sheet,
                        { backgroundColor: theme.card, borderTopLeftRadius: theme.radius + 8, borderTopRightRadius: theme.radius + 8 },
                    ], children: [_jsx(View, { style: [styles.grabber, { backgroundColor: theme.cardBorder }] }), title ? _jsx(Text, { style: [styles.section, { color: theme.text }], children: title }) : null, subtitle ? _jsx(Text, { style: [styles.small, { color: theme.textSecondary }], children: subtitle }) : null, _jsx(ScrollView, { style: styles.sheetScroll, contentContainerStyle: styles.gap, children: children })] })] }) }));
}
function Item({ label, detail, onPress, danger }) {
    const theme = useQupTheme();
    return (_jsxs(Pressable, { accessibilityRole: "button", onPress: onPress, style: [styles.item, { borderBottomColor: theme.cardBorder }], children: [_jsx(Text, { style: [styles.itemText, { color: danger ? theme.danger : theme.text }], children: label }), detail ? _jsx(Text, { style: [styles.small, { color: theme.textSecondary }], children: detail }) : null] }));
}
const styles = StyleSheet.create({
    flex: { flex: 1 },
    center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
    gap: { gap: 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: '100%',
        maxWidth: 720,
        alignSelf: 'center',
    },
    wideWidth: { maxWidth: 1360 },
    back: { width: 22, height: 44, justifyContent: 'center' },
    backText: { fontSize: 30, lineHeight: 32 },
    title: { fontSize: 17, fontWeight: '700' },
    code: { fontWeight: '700', letterSpacing: 1.5 },
    status: { fontSize: 12, fontWeight: '700' },
    menuButton: { width: 40, height: 40, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    menuText: { fontSize: 20, fontWeight: '800', lineHeight: 22 },
    scroll: { padding: 16, paddingTop: 8, paddingBottom: 40, width: '100%', maxWidth: 720, alignSelf: 'center' },
    // Destek sayısı Qup'taki gibi: işaret üstte, sayı altta (yalnız gösterir; moderatör destek vermez).
    votes: {
        width: 52,
        minHeight: 58,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        paddingVertical: 6,
    },
    votesText: { fontSize: 15, fontWeight: '700' },
    columns: { flexDirection: 'row', alignItems: 'flex-start', gap: 28 },
    side: { width: 380 },
    section: { fontSize: 17, fontWeight: '700' },
    banner: {
        borderWidth: 1.5,
        minHeight: 48,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bannerText: { fontSize: 14, fontWeight: '700' },
    cardFrame: { borderWidth: 2, margin: -2 },
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    stageLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
    body: { fontSize: 15, lineHeight: 21, marginBottom: 2 },
    small: { fontSize: 12, lineHeight: 17 },
    note: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
    flag: { fontSize: 12, fontWeight: '700', marginTop: 3 },
    more: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginTop: -4, marginRight: -4 },
    moreText: { fontSize: 18, fontWeight: '800', letterSpacing: 1 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 },
    empty: { textAlign: 'center', fontSize: 14, lineHeight: 20, paddingVertical: 32, paddingHorizontal: 16 },
    fold: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginTop: 6,
    },
    foldText: { fontSize: 14, fontWeight: '700' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    result: { minHeight: 36, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
    bar: { position: 'absolute', top: 0, bottom: 0, left: 0 },
    input: { height: 44, borderWidth: 1.5, paddingHorizontal: 12, fontSize: 15, outlineWidth: 0, outlineColor: 'transparent' },
    setting: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: { padding: 18, paddingBottom: 30, gap: 8, width: '100%', maxWidth: 640, maxHeight: '85%', alignSelf: 'center' },
    sheetScroll: { flexGrow: 0 },
    grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
    item: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        borderBottomWidth: 1,
    },
    itemText: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
});
