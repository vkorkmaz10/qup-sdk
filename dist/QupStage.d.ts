import { type ImageSourcePropType } from 'react-native';
import type { QupRoomConnection } from './connection';
import { type QupRoomUi, type QupTheme } from './QupRoom';
import { type QupStrings } from './strings';
/**
 * Hazır salon ekranı (projektör, büyük ekran). Qup'un salon ekranıyla aynı üç hâl: en çok desteklenen sorular,
 * sahnedeki soru büyük, açık ya da sonuçları gösterilen anket. Renkler, logo ve katılım bağlantısı kurumun.
 * - QR kurumun kendi uygulamasını açan bağlantıyı gösterir (`joinUrl`); "yalnız doğrulanmış üyeler" açıkken de
 *   görünür, çünkü uygulamadan giren üye zaten katılabilir (Volkan, 20 Kasım 2026).
 * - Küçük QR'a dokununca büyük QR ortada açılır, büyüğe dokununca kapanır; moderasyondan da açılır.
 * - Ekranın uyumaması kurumun işidir (Expo'da `expo-keep-awake`).
 * Veri `useQupStage` (yalnız izler) ya da `useQupModeration` (QR düğmesi moderasyonla aynı ayarı değiştirir) kancasından.
 */
export type QupStageProps = {
    room: QupRoomConnection;
    theme?: Partial<QupTheme>;
    ui?: Pick<QupRoomUi, 'Avatar'>;
    lang?: 'tr' | 'en';
    strings?: Partial<QupStrings>;
    /**
     * Kurumun logosu (sol üst ve QR'ın ortası): adres (`'https://…/logo.png'`) ya da uygulamanın kendi dosyası
     * (`require('./assets/logo.png')`). Verilmezse Qup işareti.
     */
    logo?: string | ImageSourcePropType;
    /** QR'ın açtığı bağlantı: kurumun uygulamasını bu etkinlikle açan adres. Verilmezse https://qupin.app/<KOD>. */
    joinUrl?: (code: string) => string;
    /**
     * Katılım yazısı (ör. "Uygulamamızdan katılın"). Verilmezse bağlantının kendisi. Küçük QR'ın yanında ve büyük QR'ın
     * altında görünür; sahnede soru varken küçük QR'ın yanındaki yazı gizlenir (ekran soruya kalsın diye).
     */
    joinText?: string;
    /** Profil fotoğrafları (varsayılan: evet). */
    avatars?: boolean;
};
export declare function QupStage(props: QupStageProps): import("react").JSX.Element;
