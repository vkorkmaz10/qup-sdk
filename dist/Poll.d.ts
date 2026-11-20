import type { Poll } from './protocol';
import type { makeText } from './strings';
type T = ReturnType<typeof makeText>;
/**
 * Katılımcı anketi (Qup'taki gibi): alttan açılan pencere, tek seçim, "Gönder". Oy sonradan değiştirilemez.
 * Sonuçlar anket kapanıp moderatör gösterince çubuklarla görünür. Kapatılırsa üstte küçük bir şeritten yeniden açılır.
 */
export declare function PollSheet({ poll, t, onVote, onClose, }: {
    poll: Poll;
    t: T;
    onVote: (option: number) => void;
    onClose: () => void;
}): import("react").JSX.Element;
/** Pencere kapatılınca listenin üstünde duran şerit. */
export declare function PollStrip({ poll, t, onOpen }: {
    poll: Poll;
    t: T;
    onOpen: () => void;
}): import("react").JSX.Element;
export {};
