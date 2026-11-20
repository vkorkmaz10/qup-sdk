# Qup kurulumu (Kurumsal paket)

Bu dosya, Qup'u kendi uygulamasına ekleyen kurumun yazılımcısı ve onun yapay zekâ asistanı içindir. Kurumsal paketteki her kurum için aynıdır. İngilizcesi: SETUP.md. Bu dosya, teknik rehber (`llms.txt`) ve paketin kendisi aynı açık depodadır: https://github.com/vkorkmaz10/qup-sdk (kopyaları qupin.app/kurulum.md, /setup.md, /llms.txt).

Yazılımcı, asistanına yalnız şunu yazar:

> https://github.com/vkorkmaz10/qup-sdk deposundaki KURULUM.md dosyasını oku ve oradaki adımlarla Qup'u bu projeye kur.

---

## Asistan için çalışma sırası

1. **Projenin kendi kurallarını oku** (`CLAUDE.md`, `AGENTS.md`, `README` ve benzerleri). Projenin kuralları bu dosyadan önce gelir. Bu dosyayla çelişen bir kural görürsen proje sahibine sor, kararı projenin karar kaydına yaz.
2. **Teknik rehberi oku:** aynı depodaki `llms.txt` (depoyu klonla ya da GitHub'dan oku; paket kurulunca `node_modules/@qupin/react-native/llms.txt` içinde de durur). `qupin.app` adresine erişemiyor olman engel değildir; her şey GitHub'dadır. Bütün uç noktalar, kart biçimleri, ekranlar, hata kodları ve test listesi oradadır.
3. **Yolu seç:**
   - Proje React Native / Expo ise **A yolu**: Qup paketi, kurumun kendi teması ve bileşenleriyle.
   - Değilse **B yolu**: gömülü sayfa (iframe ya da WebView).
4. **Kur:** önce sunucu (üye kartı, yetkili kartı, etkinlik yönetimi), sonra uygulama (katılımcı, moderasyon, salon ekranı).
5. **Test listesini çalıştır** (rehberin sonunda). Çalışma ortamın `qupin.app`'e erişemiyorsa canlı adımları proje sahibine bırak (telefonda ya da yayındaki sitede dener) ve bunu geri bildirim dosyasına yaz.
6. **Geri bildirim dosyasını doldur** (aşağıda). Bu adım zorunludur.

## Proje sahibinden istenecekler

- **Kurumsal anahtar:** Kurum sahibi anahtarı Qup panelinde oluşturur (Hesap › Kurumsal entegrasyon) ve sunucunun gizli ayarına `QUP_SECRET` adıyla **kendisi girer**.
  - Anahtarı sohbette isteme; sana yazılırsa kullanma, sahibine yenisini oluşturmasını söyle.
  - Ayar henüz girilmemişse sahibine nereden oluşturacağını ve nereye gireceğini söyle. Bu arada kodu yazmaya devam et; anahtar gerektiren testler bekler.
- **Moderatörler kurulum için gerekmez; bu konuda bir şey sorma.** Kurum sahibi istediği zaman, kurulumdan sonra da, Qup panelinden (Hesap › Ekip) birine Moderatör ya da Yönetici yetkisi verebilir: davet bağlantısı gönderir, kişi bağlantıyı açıp Qup'a bir kez giriş yapar. Qup kişiyi o Qup hesabının e-postasıyla eşleştirir; bu e-posta, uygulamanın o kişi için doğruladığı e-postayla aynı olmalıdır (kurum sahibinin kendi hesabı için de geçerli). Senin kodun yalnız moderasyon ekranını açan kişinin doğrulanmış e-postasını yetkili kartıyla Qup'a bildirir; e-posta ekipteyse rolü Qup uygular, değilse ekran "yetkiniz yok" der. Uygulamada ayrı yetki listesi tutma.
- **Uygulama bağlantısı:** Salon ekranındaki QR'ın açacağı adres; uygulamayı o etkinliğin katılımcı ekranında açan bağlantı (ör. evrensel bağlantı ya da uygulama bağlantısı). Biçimi sen öner, proje sahibi onaylasın.
- **Etkinlik kodlarının yeri:** Kodların kurumun veritabanında hangi kayıtla tutulacağını ve uygulamada hangi ekrandan açılacağını proje sahibiyle kararlaştır.

## Bağlantı kuralı

- Kurumsal anahtar ve kart imzalama yalnız kurumun sunucusunda durur. Anahtar uygulamaya, web sayfasına ya da depoya girmez.
- Canlı akış (sorular, oylar, anket) uygulamadan doğrudan `qupin.app`'e açılan sürekli bir bağlantıyla (WebSocket) gelir. Bu bağlantı kurumun sunucusundan **geçirilemez**: sunucusuz barındırma (Vercel gibi) sürekli bağlantı taşıyamaz, taşısa da sürekli maliyet doğurur.
- Kural başka sözlerle yazılmış olabilir. Şunların hepsi bu kuraldır: "telefon dış kaynağı doğrudan çağırmaz", "veri her zaman kendi sunucumuzdan gelir", "üçüncü taraf çağrıları sunucumuzdan geçer", "istemciden dış API'ye doğrudan istek yok".
- Projede "uygulama dış servislere doğrudan bağlanmaz" gibi bir kural yoksa bu madde seni ilgilendirmez; soru sorma.
- Böyle bir kural varsa kuralı kendi başına çiğneme. Proje sahibine şu soruyu **aynen** sor (cevabı tahmin etme):

  > Qup'un canlı soru-cevap ekranı, uygulamadan doğrudan qupin.app'e bağlanıyor (Firebase gibi hazır servislerin yaptığı gibi). Bu bağlantı sunucunuzdan geçmiyor ve sunucunuza maliyet eklemiyor. Qup'a giden bilgiler: üyenin görünen adı, profil fotoğrafının adresi, sorduğu sorular ve verdiği oylar. Üye numaranız Qup'ta geri çözülemeyen bir kimliğe çevrilir. Telefon ve web aynı bağlantıyı kullanır. "Uygulama dış servislere doğrudan bağlanmaz" kuralına yalnız bu bağlantı için istisna tanıyor musunuz?

  - **Evet derse:** kararı projenin karar kaydına yaz (yalnız `qupin.app`, yalnız Qup ekranları açıkken; kural geri kalan her şey için aynen geçerli) ve kuruluma devam et.
  - **Hayır derse:** kurulumu bırak ve durumu geri bildirim dosyasına yaz. Bağlantıyı sunucudan geçirmeye çalışma.
- Gömülü sayfa (B yolu) da `qupin.app`'e bağlanır, yalnız bir web penceresinin içinde.

## Yapılmayacaklar

- Projede benzer bir özellik varsa (ör. eski bir soru-cevap modülü), proje sahibi açıkça istemedikçe silme ya da değiştirme. Yerine geçirme ayrı bir karardır.
- Qup'un kurallarını uygulamada yeniden yazma (sıralama, sınırlar, kimin oy verebileceği). Paketteki ekranları ya da yardımcıları kullan.
- Commit, push ve yayına alma projenin kendi kurallarına göre yapılır. Kural yoksa proje sahibine sormadan yapma.

## Geri bildirim (zorunlu)

Projenin kökünde `QUP-GERI-BILDIRIM.md` dosyasını tut. Dosya Türkçe olsun ve çalışırken doldurulsun, yalnız sonda değil. Şunları yaz:

- takıldığın her nokta,
- bu dosyada ya da rehberde eksik, yanlış ya da belirsiz bulduğun her şey,
- aldığın her hata,
- uyguladığın her geçici çözüm.

Her şey sorunsuz geçtiyse bunu da yaz. Proje sahibi dosyayı Qup ekibine gönderir; paketi ve rehberi ona göre iyileştiriyoruz.

```markdown
# Qup entegrasyonu geri bildirim

Proje: <uygulamanın adı> · Yol: <A paket / B gömülü sayfa> · SDK sürümü: <ör. 0.1.0> · Tarih: <YYYY-AA-GG>

## Takıldığım noktalar
### <kısa başlık>
- Adım: <bu dosyadaki ya da rehberdeki bölüm, ör. A4>
- Beklediğim: …
- Olan: … (hata mesajı varsa aynen)
- Nasıl çözdüm / geçici çözüm: … (çözülmediyse "çözülmedi")
- Önem: engelleyici / zaman kaybettirdi / küçük

## Rehberde eksik, yanlış ya da belirsiz olanlar
- …

## Pakette eksik olan ya da değişmesini önerdiğim şeyler
- …

## Proje kurallarıyla çatışanlar ve verilen kararlar
- …

## Test listesi sonucu
- 1–12: geçti / kaldı (kaldıysa neden)
```
