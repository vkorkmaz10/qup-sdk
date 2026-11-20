import type { LayoutChangeEvent } from 'react-native';
import type { QupRoomConnection } from './connection';
import type { Poll, Question } from './protocol';
/**
 * Katılımcı ekranının görünümden bağımsız kuralları. Qup'un kendi ekranı ve hazır şablon (QupRoom) aynı kuralları
 * kullanır; kurum kendi ekranını sıfırdan çizmek isterse de bunları kullanır.
 */
export type QuestionTab = 'top' | 'new' | 'mine';
/**
 * Sekmeye göre liste. Sahnedeki soru listeden çıkar (üstte ayrı gösterilir). Cevaplanan sorular "Öne çıkan" ve
 * "Yeni"den düşer; soran kişi onları "Benim"de görür. Onay bekleyen soru yalnız sahibine görünür.
 */
export declare function questionsFor(questions: Record<number, Question>, tab: QuestionTab, spotlightId?: number | null): Question[];
/** Destek verilebilir mi: yayında, başkasının sorusu, kişi kısıtlanmamış. */
export declare const canVote: (q: Question, blocked: boolean) => boolean;
/** "⋯" (bildir / gösterme) sunulur mu. */
export declare const canReport: (q: Question, blocked: boolean) => boolean;
/** Dakikada bir tazelenen "şu an" (yalnız ekranda; sunucuya istek yok). */
export declare function useNow(): number;
export declare function minutesSince(createdAt: number, now: number): number;
/** Liste + sahnedeki soru, sekme durumuyla. */
export declare function useQuestionList(room: QupRoomConnection, initial?: QuestionTab): {
    tab: QuestionTab;
    setTab: import("react").Dispatch<import("react").SetStateAction<QuestionTab>>;
    list: Question[];
    spotlight: Question | undefined;
};
/**
 * Soru kutusu. `notice`: 'sentForApproval' | 'noneLeft' | 'reported' | 'muted' | 'err.<kod>' (metne çeviri ekranda).
 * Gönderimden sonra sunucu hata dönerse yazı kutuya geri konur; kimse sorusunu kaybetmez.
 */
export declare function useComposer(room: QupRoomConnection): {
    body: string;
    setBody: (v: string) => void;
    to: string | null;
    setTo: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    max: number;
    left: number;
    canAsk: boolean;
    notice: string | null;
    setNotice: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    send: () => boolean;
};
/**
 * Soru kutusunun alt satırı tek satırda kalır: "Kime" seçimi, kalan hak ve gönder düğmesi sığmazsa düğme kısa metne
 * ("Gönder") geçer; hiçbir yazı kesilmez, satır alta kaymaz. Ölçüler ekrandan okunur (sabit bir eşik yok):
 * `measure('row')` satıra, `measure('full')` görünmeyen uzun metinli düğmeye, diğer anahtarlar satırdaki öbür parçalara.
 */
export declare function useShortSend(gap: number): {
    measure: (key: string) => (e: LayoutChangeEvent) => void;
    short: boolean;
};
/** Katılımcının gördüğü anket: açık olan ya da kapanıp sonuçları gösterilen en son anket. */
export declare function activePoll(polls: Record<number, Poll>): Poll | undefined;
