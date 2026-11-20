/**
 * Qup canlı oda sözleşmesi v1: sunucunun (worker/src/room.ts) gönderdiği mesajlar. Değişiklikler eskisini bozmadan
 * eklenir (yeni alan isteğe bağlıdır); kaldırma ya da anlam değişikliği yeni sürüm demektir.
 */
export type QuestionStatus = 'pending' | 'live' | 'answered' | 'rejected';
export type Question = {
    id: number;
    name: string;
    body: string;
    /** Seçilen konuşmacı; herkese soruldaysa null. */
    to: string | null;
    status: QuestionStatus;
    votes: number;
    createdAt: number;
    mine: boolean;
    /** Yalnız moderatörde: bildirim özeti ("Sorun yok" denildikten sonrakiler); yoksa null. */
    reports?: {
        n: number;
        reasons: Partial<Record<ReportReason, number>>;
    } | null;
    /** Yalnız moderatörde: sorunun yazarı bu etkinlikte engelli mi. */
    blocked?: boolean;
    /** Kurumsal üyenin profil fotoğrafı (üye kartındaki https adresi); yoksa null. */
    picture?: string | null;
};
/** Sunucudaki REPORT_REASONS ile aynı sıra (worker/src/shared/rules.ts). */
export declare const REPORT_REASONS: readonly ["abuse", "harassment", "personal", "spam", "other"];
export type ReportReason = (typeof REPORT_REASONS)[number];
export type Poll = {
    id: number;
    question: string;
    options: string[];
    status: 'draft' | 'open' | 'closed';
    showResults: boolean;
    createdAt: number;
    /** Moderatörde her zaman; katılımcıda yalnız anket kapanıp sonuçlar gösterilince. */
    counts: number[] | null;
    myVote: number | null;
};
/** color: sayfanın zemin rengi (butonlar hep Qup renginde); logoPath: logonun adresi. */
export type EventBrand = {
    color: string | null;
    logoPath: string | null;
};
export type RoomEvent = {
    code: string;
    title: string;
    requireApproval: boolean;
    /** Yalnız doğrulanmış üyeler (kurumsal üye kartıyla); misafir alınmaz, sahnede QR görünmez. */
    membersOnly?: boolean;
    /** Ayar bu etkinlikte değiştirilebilir mi (sahibi Kurumsal ve anahtarı etkin). */
    membersAllowed?: boolean;
    maxQuestionLength: number;
    questionsPerPerson: number;
    speakers: string[];
    /** Etkinlikte açılabilecek anket sayısı (ücretsizde 1). */
    pollLimit: number;
    /** Organizatörün markası (ücretli pakette); yoksa Qup görünümü. */
    brand: EventBrand | null;
    closed: boolean;
    final: boolean;
    closesAt: number;
    spotlight: number | null;
    /** Sahne ekranında katılım penceresi açık mı. */
    qr: boolean;
};
export type ServerMessage = {
    t: 'snap';
    event: RoomEvent;
    me: {
        mod: boolean;
        lead?: boolean;
        owner?: boolean;
        name: string;
        asked: number;
        voted: number[];
        blocked?: boolean;
    };
    questions: Question[];
    polls: Poll[];
    online?: number;
    total: number;
} | {
    t: 'brand';
    brand: EventBrand | null;
} | {
    t: 'role';
    lead: boolean;
} | {
    t: 'deleted';
} | {
    t: 'blocked';
    on: boolean;
} | {
    t: 'poll';
    poll: Poll;
} | {
    t: 'poll_gone';
    id: number;
} | {
    t: 'poll_counts';
    id: number;
    counts: number[];
} | {
    t: 'total';
    n: number;
} | {
    t: 'count';
    n: number;
} | {
    t: 'q';
    q: Question;
} | {
    t: 'gone';
    id: number;
} | {
    t: 'votes';
    id: number;
    votes: number;
} | {
    t: 'voted';
    id: number;
    on: boolean;
} | {
    t: 'spotlight';
    id: number | null;
} | {
    t: 'settings';
    requireApproval: boolean;
    questionsPerPerson: number;
    membersOnly?: boolean;
} | {
    t: 'closed';
    final: boolean;
} | {
    t: 'reopened';
} | {
    t: 'qr';
    on: boolean;
} | {
    t: 'error';
    code: string;
    fatal?: boolean;
};
