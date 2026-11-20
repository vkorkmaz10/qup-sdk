import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AppState } from 'react-native';
/**
 * Canlı odaya bağlantı (Qup'un kendi ekranları da bunu kullanır). Kurallar:
 * - Ekran görünmüyorsa (`active: false`) ya da uygulama arka plandaysa bağlantı kapanır; dönünce yeniden kurulur ve
 *   sunucu güncel hâli baştan gönderir ("kimse bakmıyorsa iş yok"). Sunucu kopan kişinin yerini 2 dakika ayırır.
 * - Beklenmedik kopmada artan aralıklarla yeniden dener (1, 2, 5, 10 saniye).
 * - Sunucu "dolu", "kapalı" gibi kesin bir ret gönderirse yeniden denemez (`refusal`).
 */
export const DEFAULT_ORIGIN = 'https://qupin.app';
const initial = {
    event: null,
    questions: {},
    polls: {},
    voted: new Set(),
    asked: 0,
    myName: null,
    lead: null,
    online: 0,
    total: 0,
    lastError: null,
    blocked: false,
};
export function roomReducer(state, msg) {
    switch (msg.t) {
        case 'snap':
            return {
                event: msg.event,
                questions: Object.fromEntries(msg.questions.map((q) => [q.id, q])),
                polls: Object.fromEntries((msg.polls ?? []).map((p) => [p.id, p])),
                voted: new Set(msg.me.voted),
                asked: msg.me.asked,
                myName: msg.me.name,
                lead: msg.me.mod ? (msg.me.lead ?? true) : null,
                online: msg.online ?? 0,
                total: msg.total,
                lastError: null,
                blocked: !!msg.me.blocked,
            };
        case 'q': {
            const isNewMine = msg.q.mine && !state.questions[msg.q.id];
            return {
                ...state,
                questions: { ...state.questions, [msg.q.id]: msg.q },
                asked: state.asked + (isNewMine ? 1 : 0),
            };
        }
        case 'gone': {
            const { [msg.id]: _removed, ...rest } = state.questions;
            return { ...state, questions: rest };
        }
        case 'votes': {
            const q = state.questions[msg.id];
            return q
                ? {
                    ...state,
                    questions: {
                        ...state.questions,
                        [msg.id]: { ...q, votes: msg.votes },
                    },
                }
                : state;
        }
        case 'voted': {
            const voted = new Set(state.voted);
            if (msg.on)
                voted.add(msg.id);
            else
                voted.delete(msg.id);
            return { ...state, voted };
        }
        case 'spotlight':
            return state.event ? { ...state, event: { ...state.event, spotlight: msg.id } } : state;
        case 'settings':
            return state.event
                ? {
                    ...state,
                    event: {
                        ...state.event,
                        requireApproval: msg.requireApproval,
                        questionsPerPerson: msg.questionsPerPerson,
                        membersOnly: msg.membersOnly ?? state.event.membersOnly,
                    },
                }
                : state;
        case 'closed':
            return state.event
                ? {
                    ...state,
                    event: {
                        ...state.event,
                        closed: true,
                        final: msg.final,
                        spotlight: null,
                    },
                }
                : state;
        case 'brand':
            return state.event ? { ...state, event: { ...state.event, brand: msg.brand } } : state;
        case 'role':
            return { ...state, lead: msg.lead };
        case 'blocked':
            return { ...state, blocked: msg.on };
        case 'qr':
            return state.event ? { ...state, event: { ...state.event, qr: msg.on } } : state;
        case 'reopened':
            return state.event ? { ...state, event: { ...state.event, closed: false } } : state;
        case 'poll':
            return { ...state, polls: { ...state.polls, [msg.poll.id]: msg.poll } };
        case 'poll_gone': {
            const { [msg.id]: _gone, ...rest } = state.polls;
            return { ...state, polls: rest };
        }
        case 'poll_counts': {
            const p = state.polls[msg.id];
            return p
                ? {
                    ...state,
                    polls: { ...state.polls, [msg.id]: { ...p, counts: msg.counts } },
                }
                : state;
        }
        case 'count':
            return { ...state, online: msg.n };
        case 'total':
            return { ...state, total: msg.n };
        case 'error':
            return { ...state, lastError: msg.code };
        case 'clear-error':
            return { ...state, lastError: null };
        default:
            return state;
    }
}
/** Uygulama ön planda mı? Web'de sekme gizlenince, telefonda arka plana geçince false olur. */
export function useAppActive() {
    const [active, setActive] = useState(AppState.currentState !== 'background');
    useEffect(() => {
        const sub = AppState.addEventListener('change', (s) => setActive(s === 'active'));
        return () => sub.remove();
    }, []);
    return active;
}
/**
 * Öne her dönüşte artan sayaç. Telefon tarayıcısı sekmeyi dondurunca "gizlendi" ve "göründü" tek seferde işlenebilir;
 * o zaman `useAppActive` hiç değişmez ve işletim sisteminin arkada öldürdüğü bağlantı açık sanılır. Sayaç bağlantıyı
 * her dönüşte yeniden kurdurur.
 */
function useResumeCount() {
    const [n, setN] = useState(0);
    useEffect(() => {
        const sub = AppState.addEventListener('change', (s) => s === 'active' && setN((x) => x + 1));
        return () => sub.remove();
    }, []);
    return n;
}
/** Gönderilen mesajdan sonra sunucudan bu sürede hiçbir şey gelmezse bağlantı ölü sayılır ve yeniden kurulur. */
const STALE_MS = 6000;
const BACKOFF = [1000, 2000, 5000, 10000];
export function useQupConnection(o) {
    const [state, dispatch] = useReducer(roomReducer, initial);
    const [status, setStatus] = useState('connecting');
    const [refusal, setRefusal] = useState(null);
    const appActive = useAppActive();
    const resumed = useResumeCount();
    // Ölü bağlantı fark edilince artar; bağlantı baştan kurulur.
    const [kick, setKick] = useState(0);
    const socket = useRef(null);
    const lastFrame = useRef(0);
    const probe = useRef(undefined);
    const { code, voter, name = null, pass = null, mod = null, role = null, watch = false, active = true } = o;
    const wsOrigin = (o.origin ?? DEFAULT_ORIGIN).replace(/^http/, 'ws');
    const wanted = !!voter && (!!name || !!mod || !!watch) && active && appActive && !refusal;
    useEffect(() => {
        if (!wanted)
            return;
        let stopped = false;
        let attempt = 0;
        let timer;
        const connect = () => {
            setStatus(attempt === 0 ? 'connecting' : 'retrying');
            const params = new URLSearchParams(mod
                ? { voter: voter, mod, ...(role ? { role } : {}) }
                : watch
                    ? { voter: voter, view: 'stage' }
                    : { voter: voter, name: name, ...(pass ? { pass } : {}) });
            const ws = new WebSocket(`${wsOrigin}/api/events/${encodeURIComponent(code)}/live?${params}`);
            socket.current = ws;
            let fatal = false;
            ws.onopen = () => setStatus('open');
            ws.onmessage = (e) => {
                lastFrame.current = Date.now(); // 'pong' dahil her çerçeve bağlantının yaşadığını gösterir
                let msg;
                try {
                    msg = JSON.parse(String(e.data));
                }
                catch {
                    return;
                }
                if (msg.t === 'error' && msg.fatal) {
                    fatal = true;
                    setRefusal(msg.code);
                    setStatus('refused');
                    return;
                }
                if (msg.t === 'snap')
                    attempt = 0;
                dispatch(msg);
            };
            ws.onclose = () => {
                if (socket.current === ws)
                    socket.current = null;
                if (stopped || fatal)
                    return;
                const delay = BACKOFF[Math.min(attempt, BACKOFF.length - 1)];
                attempt += 1;
                setStatus('retrying');
                timer = setTimeout(connect, delay);
            };
        };
        connect();
        return () => {
            stopped = true;
            if (timer)
                clearTimeout(timer);
            socket.current?.close(1000, 'leave');
            socket.current = null;
        };
    }, [wanted, code, voter, name, mod, role, watch, pass, wsOrigin, resumed, kick]);
    useEffect(() => () => clearTimeout(probe.current), []);
    const send = useCallback((message) => {
        const ws = socket.current;
        // Bağlantı yokken basılan düğme sessiz kalmaz: ekran "bağlantı koptu" der (bağlantı zaten yeniden kuruluyor).
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            dispatch({ t: 'error', code: 'offline' });
            return false;
        }
        ws.send(JSON.stringify(message));
        // Yoklama: sunucu 'ping'e odayı uyandırmadan 'pong' der. Cevap yoksa bağlantı açık görünen bir ölüdür
        // (telefon ağ değiştirdi ya da tarayıcı arkada kesti); mesaj da gitmemiştir. Kullanıcıya söylenir, bağlantı yenilenir.
        const sentAt = Date.now();
        ws.send('ping');
        clearTimeout(probe.current);
        probe.current = setTimeout(() => {
            if (socket.current !== ws || lastFrame.current >= sentAt)
                return;
            dispatch({ t: 'error', code: 'offline' });
            setKick((k) => k + 1);
        }, STALE_MS);
        return true;
    }, []);
    return {
        ...state,
        status,
        refusal,
        ask: (body, to) => send({ t: 'ask', body, to }),
        vote: (id) => send({ t: 'vote', id }),
        moderate: (t, id) => send({ t, id }),
        spotlight: (id) => send({ t: 'spotlight', id }),
        setApproval: (requireApproval) => send({ t: 'settings', requireApproval }),
        setMembersOnly: (membersOnly) => send({ t: 'settings', membersOnly }),
        close: () => send({ t: 'close' }),
        reopen: () => send({ t: 'reopen' }),
        showQr: (on) => send({ t: 'qr', on }),
        pollCreate: (question, options) => send({ t: 'poll_create', question, options }),
        pollAction: (t, id) => send({ t, id }),
        pollResults: (id, show) => send({ t: 'poll_results', id, show }),
        pollVote: (id, option) => send({ t: 'poll_vote', id, option }),
        report: (id, reason) => send({ t: 'report', id, reason }),
        mute: (id) => send({ t: 'mute', id }),
        block: (id, on) => send({ t: on ? 'block' : 'unblock', id }),
        reportsOk: (id) => send({ t: 'reports_ok', id }),
        clearError: () => dispatch({ t: 'clear-error' }),
        retry: () => setRefusal(null),
    };
}
