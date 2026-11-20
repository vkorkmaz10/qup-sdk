import { StyleSheet, View } from 'react-native';

import {
  QupModeration,
  QupRoom,
  QupStage,
  useQupModeration,
  useQupRoom,
  useQupStage,
  useQupTheme,
  type CardProps,
  type QupTheme,
} from '@qupin/react-native';

/**
 * Örnek: koyu temalı bir kurum uygulaması Qup'u kendi renkleri ve kendi kartıyla gösterir. Düzen, destek düğmesi,
 * kurallar ve canlı veri Qup'tan gelir. `getCard` kurumun kendi sunucusuna gider (anahtar uygulamada olmaz).
 */

const theme: Partial<QupTheme> = {
  background: '#000000',
  card: '#121214',
  cardBorder: '#26262B',
  text: '#F5F5F7',
  textSecondary: '#8E8E96',
  accent: '#FFFFFF',
  onAccent: '#000000',
  muted: '#1C1C20',
  danger: '#FF6B5B',
  live: '#22C55E',
  stage: '#1F1F24',
  onStage: '#FFFFFF',
  radius: 18,
  cardPadding: 12,
};

/** Kurumun kendi kartı ("cam" görünümü). */
function GlassCard({ children, dimmed }: CardProps) {
  const t = useQupTheme();
  return (
    <View
      style={[
        styles.glass,
        { backgroundColor: t.card, borderColor: t.cardBorder, borderRadius: t.radius, padding: t.cardPadding },
        dimmed && { opacity: 0.55 },
      ]}
    >
      {children}
    </View>
  );
}

export function KoyuTemaOrnegi({ code, getCard, origin, onBack }: { code: string; getCard: () => Promise<string>; origin?: string; onBack?: () => void }) {
  const room = useQupRoom({ code, getCard, origin });
  return <QupRoom room={room} theme={theme} ui={{ Card: GlassCard }} onBack={onBack} />;
}

const styles = StyleSheet.create({
  glass: { borderWidth: 1, gap: 8 },
});

/** Aynı kurumun moderasyon ekranı: yetkili kartını kurumun sunucusu kişinin doğrulanmış e-postasıyla üretir. */
export function KoyuTemaModerasyon({
  code,
  getStaffCard,
  origin,
  onBack,
  onOpenStage,
}: {
  code: string;
  getStaffCard: () => Promise<string>;
  origin?: string;
  onBack?: () => void;
  onOpenStage?: () => void;
}) {
  const room = useQupModeration({ code, getStaffCard, origin });
  return <QupModeration room={room} theme={theme} ui={{ Card: GlassCard }} onBack={onBack} onOpenStage={onOpenStage} />;
}

/**
 * Aynı kurumun salon ekranı: QR kurumun kendi uygulamasını bu etkinlikle açan bağlantıyı gösterir. Uygulamadan giren
 * üye katılır (yalnız doğrulanmış üyeler açıkken de).
 */
export function KoyuTemaSahne({ code, origin, logo }: { code: string; origin?: string; logo?: string }) {
  const room = useQupStage({ code, origin });
  return (
    <QupStage
      room={room}
      theme={{ ...theme, background: '#000000' }}
      logo={logo}
      joinUrl={(c) => `https://ornek-kurum.app/qup/${c}`}
      joinText="Uygulamamızdan katılın"
    />
  );
}
