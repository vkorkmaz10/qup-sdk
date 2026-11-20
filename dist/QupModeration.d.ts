import type { QupRoomConnection } from './connection';
import { type QupRoomUi, type QupTheme } from './QupRoom';
import { type QupStrings } from './strings';
/**
 * Hazır moderasyon ekranı (Qup panelinin "tek liste" düzeni; Volkan, 19–20 Kasım 2026). Ekranda tek iş var: soruyu
 * sahneye almak. Sorular desteğe göre sıralı, her kartta tek düğme ("Sahneye al", sahnedekinde "Bitti"); seyrek
 * işler sorunun ⋯ düğmesinde, etkinlik işleri başlıktaki ⋯ menüsünde. Onay bekleyenler telefonda üstteki tek
 * satırdan, geniş ekranda sağ sütunda. Cevaplananlar ve gizlenenler listenin altında katlı.
 * Yetki Qup panelindeki ekipten gelir: Moderatör soruları ve hazır anketi yönetir; sahibi ve Yönetici ayrıca
 * ayarları, anket hazırlamayı ve oturumu. Veri `useQupModeration` kancasından gelir.
 */
export type QupModerationProps = {
    room: QupRoomConnection & {
        joining?: boolean;
        cardError?: string | null;
        retryCard?: () => void;
        canManage?: boolean;
    };
    theme?: Partial<QupTheme>;
    /** Kurumun kendi kartı ve düğmesi (destek kutusu Qup'unkidir). */
    ui?: Pick<QupRoomUi, 'Card' | 'Button'>;
    lang?: 'tr' | 'en';
    strings?: Partial<QupStrings>;
    /** Geri düğmesi. Verilmezse çizilmez. */
    onBack?: () => void;
    /** Kurumun kendi salon ekranını açar (QupStage). Verilmezse düğme görünmez. */
    onOpenStage?: () => void;
    /** Katılım bağlantısını paylaşır (kurumun paylaşma penceresi). Bağlantı: https://qupin.app/<KOD>. */
    onShare?: (url: string) => void;
    /** Soruları CSV olarak indirir (kurumun sunucusu, kurumsal anahtarla GET /api/v1/events/<KOD>/export). */
    onExportCsv?: () => void;
    /** Geniş düzen (sağ sütun) hangi genişlikten başlar. Varsayılan 1000 piksel. */
    wideFrom?: number;
};
export declare function QupModeration(props: QupModerationProps): import("react").JSX.Element;
