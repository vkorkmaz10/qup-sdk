import { type ComponentType, type ReactNode } from 'react';
import { type ViewStyle } from 'react-native';
import type { QupRoomConnection } from './connection';
import { type QupStrings } from './strings';
/**
 * Hazır katılımcı ekranı. Düzen Qup'unkidir (üst satırda geri, kişi sayısı ve CANLI; altında etkinlik adı; soru kutusu;
 * Öne çıkan / Yeni / Benim; sahnedeki soru; destek düğmesi sağda). Renkler ve parçalar kurumundur:
 * - `theme`: renkler, köşe yuvarlaklığı, yazı tipi
 * - `ui`: kurumun kendi bileşenleri (kart, profil fotoğrafı, ana düğme; isterse destek düğmesi). Verilmeyen yerde
 *   Qup'un parçası çizilir. Destek düğmesi varsayılan olarak Qup'unkidir: işaret üstte, sayı altta.
 * Veri `useQupRoom` kancasından gelir; bu bileşen yalnız çizer.
 */
export type QupTheme = {
    /** Ekran zemini (şeffaf bırakılırsa kurumun kendi zemini görünür). */
    background: string;
    /** Kart zemini ve kenarı (kurum `ui.Card` verirse kullanılmaz). */
    card: string;
    cardBorder: string;
    /** Kart iç boşluğu: soru kutusundaki yatay çizgi kartın iki kenarına bu kadar uzanır. */
    cardPadding: number;
    text: string;
    textSecondary: string;
    /** Vurgu: gönder düğmesi, verilmiş destek, seçili sekme. */
    accent: string;
    onAccent: string;
    /** Sekme şeridinin ve "Kime" seçiminin zemini. */
    muted: string;
    danger: string;
    /** "CANLI" yazısı. */
    live: string;
    /** Destek düğmesindeki Qup işaretinin rengi. */
    mark: string;
    /** Sahnedeki sorunun kartı. */
    stage: string;
    onStage: string;
    radius: number;
    fontFamily?: string;
};
export declare const DEFAULT_THEME: QupTheme;
export type CardProps = {
    children: ReactNode;
    style?: ViewStyle;
    dimmed?: boolean;
};
export type VoteButtonProps = {
    count: number;
    voted: boolean;
    disabled: boolean;
    onPress: () => void;
    label: string;
    onStage?: boolean;
};
export type AvatarProps = {
    name: string;
    picture: string | null;
    size: number;
};
export type ButtonProps = {
    title: string;
    onPress: () => void;
    disabled: boolean;
    /** primary: vurgu renginde dolu (varsayılan); outline: kenarlıklı, ikincil iş (Reddet, Sahneye al). */
    variant?: 'primary' | 'outline';
};
export type QupRoomUi = {
    Card?: ComponentType<CardProps>;
    VoteButton?: ComponentType<VoteButtonProps>;
    Avatar?: ComponentType<AvatarProps>;
    Button?: ComponentType<ButtonProps>;
};
export type QupRoomProps = {
    room: QupRoomConnection & {
        joining?: boolean;
        cardError?: string | null;
        retryCard?: () => void;
    };
    theme?: Partial<QupTheme>;
    ui?: QupRoomUi;
    lang?: 'tr' | 'en';
    strings?: Partial<QupStrings>;
    /** Profil fotoğrafları gösterilsin mi (varsayılan: evet, fotoğrafı olmayana baş harfler). */
    avatars?: boolean;
    /** Üst satır ve etkinlik adı çizilsin mi. Kurum kendi üst çubuğunu kullanıyorsa false. */
    titleBar?: boolean;
    /** Geri düğmesine basılınca. Verilmezse geri düğmesi çizilmez. */
    onBack?: () => void;
    /** Etkinlik adının altına, soru kutusunun üstüne kurumun eklemek istediği içerik. */
    header?: ReactNode;
};
export declare const useQupTheme: () => QupTheme;
/** Temayı alt parçalara verir (QupRoom ve QupModeration). */
export declare function QupThemeProvider({ theme, children }: {
    theme: QupTheme;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function QupRoom(props: QupRoomProps): import("react").JSX.Element;
export declare function DefaultCard({ children, style, dimmed }: CardProps): import("react").JSX.Element;
/**
 * Qup'un destek düğmesi: Qup işareti üstte, sayı altta. Destek verilince düğme vurgu rengine döner; işaret vurguyla
 * aynı renkteyse ters çevrilir (turuncu düğmede açık balon) ki kaybolmasın.
 */
export declare function QupVoteButton({ count, voted, disabled, onPress, label, onStage }: VoteButtonProps): import("react").JSX.Element;
export declare function DefaultAvatar({ name, picture, size }: AvatarProps): import("react").JSX.Element;
export declare function DefaultButton({ title, onPress, disabled, variant }: ButtonProps): import("react").JSX.Element;
