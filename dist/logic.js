import { useEffect, useMemo, useRef, useState } from 'react';
/**
 * Sekmeye göre liste. Sahnedeki soru listeden çıkar (üstte ayrı gösterilir). Cevaplanan sorular "Öne çıkan" ve
 * "Yeni"den düşer; soran kişi onları "Benim"de görür. Onay bekleyen soru yalnız sahibine görünür.
 */
export function questionsFor(questions, tab, spotlightId) {
    const items = Object.values(questions).filter((q) => q.id !== spotlightId);
    if (tab === 'mine')
        return items.filter((q) => q.mine).sort((a, b) => b.createdAt - a.createdAt);
    const visible = items.filter((q) => q.status === 'live' || (q.mine && q.status === 'pending'));
    if (tab === 'new')
        return visible.sort((a, b) => b.createdAt - a.createdAt);
    return visible.sort((a, b) => b.votes - a.votes || a.id - b.id);
}
/** Destek verilebilir mi: yayında, başkasının sorusu, kişi kısıtlanmamış. */
export const canVote = (q, blocked) => q.status === 'live' && !q.mine && !blocked;
/** "⋯" (bildir / gösterme) sunulur mu. */
export const canReport = (q, blocked) => !blocked && !q.mine && (q.status === 'live' || q.status === 'answered');
/** Dakikada bir tazelenen "şu an" (yalnız ekranda; sunucuya istek yok). */
export function useNow() {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);
    return now;
}
export function minutesSince(createdAt, now) {
    return Math.max(0, Math.floor((now - createdAt) / 60000));
}
/** Liste + sahnedeki soru, sekme durumuyla. */
export function useQuestionList(room, initial = 'top') {
    const [tab, setTab] = useState(initial);
    const spotId = room.event?.spotlight ?? null;
    const spotlight = spotId != null ? room.questions[spotId] : undefined;
    const list = useMemo(() => questionsFor(room.questions, tab, spotlight?.id), [room.questions, tab, spotlight?.id]);
    return {
        tab,
        setTab,
        list,
        spotlight: tab === 'mine' ? undefined : spotlight,
    };
}
/**
 * Soru kutusu. `notice`: 'sentForApproval' | 'noneLeft' | 'reported' | 'muted' | 'err.<kod>' (metne çeviri ekranda).
 * Gönderimden sonra sunucu hata dönerse yazı kutuya geri konur; kimse sorusunu kaybetmez.
 */
export function useComposer(room) {
    const [body, setBodyRaw] = useState('');
    const [to, setTo] = useState(null);
    const [notice, setNotice] = useState(null);
    const lastSent = useRef('');
    useEffect(() => {
        if (room.lastError && lastSent.current) {
            setBodyRaw(lastSent.current);
            setNotice(null);
            lastSent.current = '';
        }
    }, [room.lastError]);
    const event = room.event;
    const max = event?.maxQuestionLength ?? 280;
    const left = event ? Math.max(0, event.questionsPerPerson - room.asked) : 0;
    const canAsk = !!event && !event.closed && !room.blocked && left > 0 && room.status === 'open';
    const waiting = Object.values(room.questions).some((q) => q.mine && q.status === 'pending');
    const shown = room.lastError
        ? `err.${room.lastError}`
        : notice === 'sentForApproval' && !waiting
            ? null
            : (notice ?? (left === 0 && event && !event.closed ? 'noneLeft' : null));
    return {
        body,
        setBody: (v) => {
            setBodyRaw(v);
            setNotice(null);
            if (room.lastError)
                room.clearError();
        },
        to,
        setTo,
        max,
        left,
        canAsk,
        notice: shown,
        setNotice,
        send: () => {
            const clean = body.trim();
            if (clean.length < 3 || clean.length > max) {
                setNotice('err.bad_length');
                return false;
            }
            room.clearError();
            if (!room.ask(clean, to))
                return false;
            lastSent.current = clean;
            setBodyRaw('');
            setNotice(event?.requireApproval ? 'sentForApproval' : null);
            return true;
        },
    };
}
/**
 * Soru kutusunun alt satırı tek satırda kalır: "Kime" seçimi, kalan hak ve gönder düğmesi sığmazsa düğme kısa metne
 * ("Gönder") geçer; hiçbir yazı kesilmez, satır alta kaymaz. Ölçüler ekrandan okunur (sabit bir eşik yok):
 * `measure('row')` satıra, `measure('full')` görünmeyen uzun metinli düğmeye, diğer anahtarlar satırdaki öbür parçalara.
 */
export function useShortSend(gap) {
    const [sizes, setSizes] = useState({});
    const measure = (key) => (e) => {
        const w = Math.ceil(e.nativeEvent.layout.width);
        setSizes((s) => (s[key] === w ? s : { ...s, [key]: w }));
    };
    const { row = 0, full = 0, ...parts } = sizes;
    const others = Object.values(parts);
    const need = full + others.reduce((a, b) => a + b, 0) + gap * others.length;
    return { measure, short: row > 0 && full > 0 && need > row };
}
/** Katılımcının gördüğü anket: açık olan ya da kapanıp sonuçları gösterilen en son anket. */
export function activePoll(polls) {
    return Object.values(polls)
        .sort((a, b) => b.id - a.id)
        .find((p) => p.status === 'open' || (p.status === 'closed' && !!p.counts));
}
