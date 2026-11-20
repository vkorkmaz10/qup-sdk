import type { Poll, Question, ReportReason, RoomEvent, ServerMessage } from './protocol';
/**
 * Canlı odaya bağlantı (Qup'un kendi ekranları da bunu kullanır). Kurallar:
 * - Ekran görünmüyorsa (`active: false`) ya da uygulama arka plandaysa bağlantı kapanır; dönünce yeniden kurulur ve
 *   sunucu güncel hâli baştan gönderir ("kimse bakmıyorsa iş yok"). Sunucu kopan kişinin yerini 2 dakika ayırır.
 * - Beklenmedik kopmada artan aralıklarla yeniden dener (1, 2, 5, 10 saniye).
 * - Sunucu "dolu", "kapalı" gibi kesin bir ret gönderirse yeniden denemez (`refusal`).
 */
export declare const DEFAULT_ORIGIN = "https://qupin.app";
export type RoomStatus = 'connecting' | 'open' | 'retrying' | 'refused';
export type RoomState = {
    event: RoomEvent | null;
    questions: Record<number, Question>;
    polls: Record<number, Poll>;
    voted: Set<number>;
    asked: number;
    myName: string | null;
    /** Moderatör bağlantısında yönetme yetkisi (sahibi ya da Yönetici); rol değişince sunucu günceller. */
    lead: boolean | null;
    /** Yalnız moderatörde: içerideki kişi sayısı. */
    online: number;
    /** Sorulan bütün soruların sayısı. */
    total: number;
    lastError: string | null;
    /** Moderatör bu katılımcıyı etkinlikte engelledi: okuyabilir, yazamaz. */
    blocked: boolean;
};
type Action = ServerMessage | {
    t: 'clear-error';
};
export declare function roomReducer(state: RoomState, msg: Action): RoomState;
/** Uygulama ön planda mı? Web'de sekme gizlenince, telefonda arka plana geçince false olur. */
export declare function useAppActive(): boolean;
/**
 * Bağlantı biçimleri:
 * - katılımcı: `voter` + `name` (kurumsal üyede ayrıca `pass`; ad geçişten okunur)
 * - moderatör: `voter` + `mod` (ekip üyesinde ayrıca `role`)
 * - izleyen sahne: `voter` + `watch` (ad istemez, yer tutmaz, hiçbir şey gönderemez)
 */
export type ConnectOptions = {
    code: string;
    voter: string | null;
    name?: string | null;
    pass?: string | null;
    mod?: string | null;
    role?: string | null;
    watch?: boolean;
    /** Qup sunucusu (varsayılan https://qupin.app). */
    origin?: string;
    /** Ekran görünüyor mu (gezinme kütüphanesinin odak bilgisi). Görünmüyorsa bağlantı kapanır. */
    active?: boolean;
};
export declare function useQupConnection(o: ConnectOptions): {
    status: RoomStatus;
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
    report: (id: number, reason: ReportReason) => boolean;
    mute: (id: number) => boolean;
    block: (id: number, on: boolean) => boolean;
    reportsOk: (id: number) => boolean;
    clearError: () => void;
    retry: () => void;
    event: RoomEvent | null;
    questions: Record<number, Question>;
    polls: Record<number, Poll>;
    voted: Set<number>;
    asked: number;
    myName: string | null;
    /** Moderatör bağlantısında yönetme yetkisi (sahibi ya da Yönetici); rol değişince sunucu günceller. */
    lead: boolean | null;
    /** Yalnız moderatörde: içerideki kişi sayısı. */
    online: number;
    /** Sorulan bütün soruların sayısı. */
    total: number;
    lastError: string | null;
    /** Moderatör bu katılımcıyı etkinlikte engelledi: okuyabilir, yazamaz. */
    blocked: boolean;
};
export type QupRoomConnection = ReturnType<typeof useQupConnection>;
export {};
