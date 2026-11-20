/**
 * Kurumsal entegrasyonun iki kancası. İkisi de kartı kurumun kendi sunucusundan `getCard` ile ister (anahtar asla
 * uygulamada olmaz), Qup geçişine çevirir ve canlı odaya bağlanır.
 */
type Common = {
    /** Etkinlik kodu (4 karakter). */
    code: string;
    /** Qup sunucusu (varsayılan https://qupin.app). */
    origin?: string;
    /** Ekran görünüyor mu (gezinme kütüphanesinin odak bilgisi). Görünmüyorsa bağlantı kapanır. */
    active?: boolean;
};
/**
 * Katılımcı (kurumsal üye). `getCard`: kurumun sunucusundan bu etkinlik için üye kartı alır.
 * Geçiş cihazda saklanır: aynı etkinliğe dönen üye yeniden kart istemeden bağlanır (etkinlik boyunca geçerli).
 */
export declare function useQupRoom(o: Common & {
    getCard: () => Promise<string>;
}): {
    /** Kart alınıp geçişe çevrilirken true. */
    joining: boolean;
    /** Kart alınamadı ya da Qup kabul etmedi (expired, bad_signature, not_enabled, network…). */
    cardError: string | null;
    /** Yeni kartla baştan dener. */
    retryCard: () => void;
    status: import("./connection").RoomStatus;
    refusal: string | null;
    ask: (body: string, to: string | null) => boolean;
    vote: (id: number) => boolean;
    moderate: (t: "approve" | "reject" | "answer" | "restore", id: number) => boolean;
    spotlight: (id: number | null) => boolean;
    setApproval: (requireApproval: boolean) => boolean;
    setMembersOnly: (membersOnly: boolean) => boolean;
    close: () => boolean;
    reopen: () => boolean;
    showQr: (on: boolean) => boolean;
    pollCreate: (question: string, options: string[]) => boolean;
    pollAction: (t: "poll_open" | "poll_close" | "poll_delete", id: number) => boolean;
    pollResults: (id: number, show: boolean) => boolean;
    pollVote: (id: number, option: number) => boolean;
    report: (id: number, reason: import("./protocol").ReportReason) => boolean;
    mute: (id: number) => boolean;
    block: (id: number, on: boolean) => boolean;
    reportsOk: (id: number) => boolean;
    clearError: () => void;
    retry: () => void;
    event: import("./protocol").RoomEvent | null;
    questions: Record<number, import("./protocol").Question>;
    polls: Record<number, import("./protocol").Poll>;
    voted: Set<number>;
    asked: number;
    myName: string | null;
    lead: boolean | null;
    online: number;
    total: number;
    lastError: string | null;
    blocked: boolean;
};
/**
 * Moderasyon ve salon ekranı (kurumun yetkili kişisi). `getStaffCard`: kurumun sunucusundan bu kişi için yetkili
 * kartı alır (kişinin doğrulanmış e-postasıyla). Yetki Qup panelindeki ekipten okunur: Moderatör ya da Yönetici.
 */
export declare function useQupModeration(o: Common & {
    getStaffCard: () => Promise<string>;
}): {
    joining: boolean;
    cardError: string | null;
    retryCard: () => void;
    /** Sahibi ya da Yönetici: ayarlar, anket hazırlama, oturumu kapatma. Moderatörde false. */
    canManage: boolean;
    status: import("./connection").RoomStatus;
    refusal: string | null;
    ask: (body: string, to: string | null) => boolean;
    vote: (id: number) => boolean;
    moderate: (t: "approve" | "reject" | "answer" | "restore", id: number) => boolean;
    spotlight: (id: number | null) => boolean;
    setApproval: (requireApproval: boolean) => boolean;
    setMembersOnly: (membersOnly: boolean) => boolean;
    close: () => boolean;
    reopen: () => boolean;
    showQr: (on: boolean) => boolean;
    pollCreate: (question: string, options: string[]) => boolean;
    pollAction: (t: "poll_open" | "poll_close" | "poll_delete", id: number) => boolean;
    pollResults: (id: number, show: boolean) => boolean;
    pollVote: (id: number, option: number) => boolean;
    report: (id: number, reason: import("./protocol").ReportReason) => boolean;
    mute: (id: number) => boolean;
    block: (id: number, on: boolean) => boolean;
    reportsOk: (id: number) => boolean;
    clearError: () => void;
    retry: () => void;
    event: import("./protocol").RoomEvent | null;
    questions: Record<number, import("./protocol").Question>;
    polls: Record<number, import("./protocol").Poll>;
    voted: Set<number>;
    asked: number;
    myName: string | null;
    lead: boolean | null;
    online: number;
    total: number;
    lastError: string | null;
    blocked: boolean;
};
/**
 * Salon ekranı (izleyen bağlantı): kart istemez, yer tutmaz, hiçbir şey gönderemez; yalnız soruları, sahnedeki
 * soruyu ve anketi okur. Cihaza bir izleyici kimliği yazılır (yeniden açılınca aynı kimlik).
 */
export declare function useQupStage(o: Common): {
    status: import("./connection").RoomStatus;
    refusal: string | null;
    ask: (body: string, to: string | null) => boolean;
    vote: (id: number) => boolean;
    moderate: (t: "approve" | "reject" | "answer" | "restore", id: number) => boolean;
    spotlight: (id: number | null) => boolean;
    setApproval: (requireApproval: boolean) => boolean;
    setMembersOnly: (membersOnly: boolean) => boolean;
    close: () => boolean;
    reopen: () => boolean;
    showQr: (on: boolean) => boolean;
    pollCreate: (question: string, options: string[]) => boolean;
    pollAction: (t: "poll_open" | "poll_close" | "poll_delete", id: number) => boolean;
    pollResults: (id: number, show: boolean) => boolean;
    pollVote: (id: number, option: number) => boolean;
    report: (id: number, reason: import("./protocol").ReportReason) => boolean;
    mute: (id: number) => boolean;
    block: (id: number, on: boolean) => boolean;
    reportsOk: (id: number) => boolean;
    clearError: () => void;
    retry: () => void;
    event: import("./protocol").RoomEvent | null;
    questions: Record<number, import("./protocol").Question>;
    polls: Record<number, import("./protocol").Poll>;
    voted: Set<number>;
    asked: number;
    myName: string | null;
    lead: boolean | null;
    online: number;
    total: number;
    lastError: string | null;
    blocked: boolean;
};
export {};
