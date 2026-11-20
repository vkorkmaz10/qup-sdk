import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { exchangeMemberCard, exchangeStaffCard } from './cards';
import { DEFAULT_ORIGIN, useQupConnection } from './connection';
const PASS_KEY = (code) => `qup.member.${code.toUpperCase()}`;
/**
 * Katılımcı (kurumsal üye). `getCard`: kurumun sunucusundan bu etkinlik için üye kartı alır.
 * Geçiş cihazda saklanır: aynı etkinliğe dönen üye yeniden kart istemeden bağlanır (etkinlik boyunca geçerli).
 */
export function useQupRoom(o) {
    const code = o.code.toUpperCase();
    const origin = o.origin ?? DEFAULT_ORIGIN;
    const [member, setMember] = useState(null);
    const [cardError, setCardError] = useState(null);
    const [attempt, setAttempt] = useState(0);
    const getCard = o.getCard;
    useEffect(() => {
        let alive = true;
        (async () => {
            setCardError(null);
            const saved = attempt === 0 ? await AsyncStorage.getItem(PASS_KEY(code)).catch(() => null) : null;
            if (saved) {
                try {
                    const m = JSON.parse(saved);
                    if (alive && m.voter && m.pass)
                        return setMember(m);
                }
                catch {
                    // bozuk kayıt: yeni kart istenir
                }
            }
            let card;
            try {
                card = await getCard();
            }
            catch {
                if (alive)
                    setCardError('card_unavailable');
                return;
            }
            const r = await exchangeMemberCard(code, card, origin);
            if (!alive)
                return;
            if (!r.ok)
                return setCardError(r.error);
            await AsyncStorage.setItem(PASS_KEY(code), JSON.stringify(r.value)).catch(() => undefined);
            setMember(r.value);
        })();
        return () => {
            alive = false;
        };
        // getCard her çizimde yeni olabilir; kart yalnız kod ya da deneme değişince istenir.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, origin, attempt]);
    const room = useQupConnection({
        code,
        origin,
        active: o.active,
        voter: member?.voter ?? null,
        name: member?.name ?? null,
        pass: member?.pass ?? null,
    });
    // Geçiş geçersiz sayıldıysa (ör. anahtar yenilendi) kayıt silinir, yeni kartla yeniden denenir.
    const badPass = room.refusal === 'bad_pass';
    useEffect(() => {
        if (!badPass)
            return;
        AsyncStorage.removeItem(PASS_KEY(code)).catch(() => undefined);
        setMember(null);
        room.retry();
        setAttempt((a) => a + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [badPass, code]);
    return {
        ...room,
        /** Kart alınıp geçişe çevrilirken true. */
        joining: !member && !cardError,
        /** Kart alınamadı ya da Qup kabul etmedi (expired, bad_signature, not_enabled, network…). */
        cardError,
        /** Yeni kartla baştan dener. */
        retryCard: () => setAttempt((a) => a + 1),
    };
}
/**
 * Moderasyon ve salon ekranı (kurumun yetkili kişisi). `getStaffCard`: kurumun sunucusundan bu kişi için yetkili
 * kartı alır (kişinin doğrulanmış e-postasıyla). Yetki Qup panelindeki ekipten okunur: Moderatör ya da Yönetici.
 */
export function useQupModeration(o) {
    const code = o.code.toUpperCase();
    const origin = o.origin ?? DEFAULT_ORIGIN;
    const [staff, setStaff] = useState(null);
    const [cardError, setCardError] = useState(null);
    const [attempt, setAttempt] = useState(0);
    const getStaffCard = o.getStaffCard;
    useEffect(() => {
        let alive = true;
        (async () => {
            setCardError(null);
            let card;
            try {
                card = await getStaffCard();
            }
            catch {
                if (alive)
                    setCardError('card_unavailable');
                return;
            }
            const r = await exchangeStaffCard(code, card, origin);
            if (!alive)
                return;
            if (!r.ok)
                return setCardError(r.error);
            setStaff(r.value);
        })();
        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, origin, attempt]);
    const room = useQupConnection({
        code,
        origin,
        active: o.active,
        voter: staff?.voter ?? null,
        mod: staff?.mod ?? null,
        role: staff?.role ?? null,
    });
    return {
        ...room,
        joining: !staff && !cardError,
        cardError,
        retryCard: () => setAttempt((a) => a + 1),
        /** Sahibi ya da Yönetici: ayarlar, anket hazırlama, oturumu kapatma. Moderatörde false. */
        canManage: room.lead ?? staff?.lead ?? false,
    };
}
const WATCHER_KEY = 'qup.watcher';
/**
 * Salon ekranı (izleyen bağlantı): kart istemez, yer tutmaz, hiçbir şey gönderemez; yalnız soruları, sahnedeki
 * soruyu ve anketi okur. Cihaza bir izleyici kimliği yazılır (yeniden açılınca aynı kimlik).
 */
export function useQupStage(o) {
    const [voter, setVoter] = useState(null);
    useEffect(() => {
        let alive = true;
        (async () => {
            let id = await AsyncStorage.getItem(WATCHER_KEY).catch(() => null);
            if (!id) {
                id = `g:${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
                await AsyncStorage.setItem(WATCHER_KEY, id).catch(() => undefined);
            }
            if (alive)
                setVoter(id);
        })();
        return () => {
            alive = false;
        };
    }, []);
    return useQupConnection({ code: o.code.toUpperCase(), origin: o.origin, active: o.active, voter, watch: true });
}
