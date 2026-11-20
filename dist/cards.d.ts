/**
 * Kurumun sunucusunun imzaladığı kartları Qup geçişine çevirir (sunucu: worker/src/org.ts).
 * - Üye kartı → katılımcı geçişi (kimlik, ad, profil fotoğrafı sabit; etkinlik boyunca geçerli)
 * - Yetkili kartı → moderasyon bağlantısı (rol Qup panelindeki ekipten okunur)
 * Kart 5 dakika ömürlüdür; her ekran açılışında kurumun sunucusundan yenisi istenir.
 */
export type MemberPass = {
    voter: string;
    name: string;
    pass: string;
};
export type StaffPass = {
    voter: string;
    mod: string;
    role: 'moderator' | 'manager' | null;
    lead: boolean;
};
export type CardResult<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: string;
};
export declare const exchangeMemberCard: (code: string, card: string, origin?: string) => Promise<CardResult<MemberPass>>;
export declare const exchangeStaffCard: (code: string, card: string, origin?: string) => Promise<CardResult<StaffPass>>;
