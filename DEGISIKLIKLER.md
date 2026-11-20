# Qup paketi: sürüm notları

Bu dosya `@qupin/react-native` paketinin her sürümünde ne değiştiğini ve sizin ne yapmanız gerektiğini söyler. Yapay zekâ asistanları için yazılmıştır; kurum sahibi de okuyabilir. English: `CHANGELOG.md`.

**Nasıl güncellenir:** asistanınıza şunu yazın:

> https://github.com/vkorkmaz10/qup-sdk deposundaki DEGISIKLIKLER.md dosyasını oku ve Qup paketini en yeni sürüme güncelle.

**Asistan için kurallar:**

- Projedeki kurulu sürümü `package.json` içinden oku; o sürümden sonraki bütün başlıkları sırayla uygula.
- Kurulum: `npm install github:vkorkmaz10/qup-sdk#v<sürüm>` (ya da projenin paket yöneticisi).
- "Yapmanız gereken" boşsa yalnız paketi kurmak yeter; kodda değişiklik gerekmez.
- Yeni ekran ya da görsel değişiklik getiren maddeleri projenin kendi kurallarıyla yap (taslak, onay, commit izni).
- Eski sürümler çalışmaya devam eder. Güncelleme zorunlu olursa bu dosyanın en üstünde tarihle duyurulur.
- Sunucu tarafındaki düzeltmeler (aşağıda "Qup sunucusu" diye geçenler) kendiliğinden gelir; bir şey kurmanız gerekmez.

## 0.1.4 (20 Kasım 2026)

**Ne değişti**

- `QupModeration`, sunucunun reddettiği işlemi gösterir (ör. süresi dolmuş etkinliği yeniden açmak: "Etkinliğin süresi doldu; yeniden açılamaz"). Önce ekranda hiçbir şey olmuyordu.
- Ölü bağlantı fark edilir: telefon ağ değiştirince ya da tarayıcı sekmeyi arkada kesince bağlantı açık görünüp mesajları yutabiliyordu (düğmeye basılıyor, hiçbir şey olmuyordu). Artık her işlemden sonra bağlantı yoklanır; cevap yoksa ekran "Bağlantı koptu, yeniden kuruluyor" der ve bağlantı yenilenir. Öne her dönüşte de bağlantı yeniden kurulur.
- Qup sunucusu: kapalı oturumda açık kalmış anket kapatılabilir.
- Qup sunucusu: kapatılmış ama süresi dolmamış oturuma katılımcı da bağlanır; "kapalı" görür, soru soramaz ve oturum yeniden açılınca ekranı kendiliğinden canlıya döner. Önce ekran, sayfa yenilenene kadar kapalı kalıyordu.

**Yapmanız gereken**

- Yalnız paketi kurun. Etkinlik listeniz varsa, moderasyon ekranından dönünce listeyi yenileyin (durum değişmiş olabilir).

## 0.1.3 (20 Kasım 2026)

**Ne değişti**

- Yazı tipi kalınlığa göre verilebilir: `theme.fonts { regular, medium, semibold, bold }`. Her kalınlığı ayrı adla yüklenen yazı tiplerinde (Expo Google Fonts gibi) kalın yazılar artık sistem yazı tipine düşmez.
- `QupStage` logosu uygulamanın kendi dosyası olabilir: `logo={require('./assets/logo.png')}`. QR'ın ortasında da aynı logo çizilir.
- `QupModeration` yeni `joinUrl` alır: "Paylaş" sizin bağlantınızı verir.
- Süresi dolmuş etkinlikte salon ekranı "Bu oturum sona erdi" der.
- Qup sunucusu: kapatılmış ama süresi dolmamış oturumda salon ekranı açık kalır ("KAPALI" etiketi ve son sorular).
- Qup sunucusu: yeni `GET /api/v1/account` (paket, sınırlar, marka) ve `PUT /api/v1/brand` (logo ve sayfa rengi). Ayrıntı `llms.txt` A1.

**Yapmanız gereken**

- Her kalınlığı ayrı yüklenen yazı tipi kullanıyorsanız temada `fontFamily` yerine `fonts` verin.
- İsteğe bağlı: moderasyona `joinUrl`, salon ekranına yerel logo.
- İsteğe bağlı: kendi yönetim panelinize hesap bilgisi ile logo ve renk girişi.

## 0.1.2 (20 Kasım 2026)

- Paket ve rehberler açık GitHub deposundan kurulur. Kodda değişiklik yok.

## 0.1.1 (20 Kasım 2026)

- Yetkisi olmayan kişiye gösterilen yazı düzeltildi (ekibe davet bağlantısıyla katılınır). Kodda değişiklik yok.

## 0.1.0 (20 Kasım 2026)

- İlk sürüm: `QupRoom`, `QupModeration`, `QupStage`.
