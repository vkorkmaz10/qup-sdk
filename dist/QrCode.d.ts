/**
 * Bağlantıyı QR olarak çizer (tek bir yol, hafif). Kenar boşluğu okunabilirlik için 2 modül.
 * Ortada her zaman bir işaret durur: organizatörün (kurumun) logosu, yoksa Qup'un soru balonu (Volkan, 16 Kasım 2026).
 * Bu yüzden hata düzeltme en yüksektir (H, %30); işaret alanın yaklaşık %22'sini kaplar, kod okunur kalır.
 */
export declare function QrCode({ value, size, color, background, logo, }: {
    value: string;
    size: number;
    color?: string;
    background?: string;
    logo?: string | null;
}): import("react").JSX.Element;
