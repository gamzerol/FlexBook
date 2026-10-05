#Flexbook Backend

NestJS ile yazılmış rezervasyon/randevu platformu API'si. Frontend(react) bu API'yi tüketir.

#Teknoloji yığını

- Typescript(strict)
- NestJS [12.0.1]
- Veritabanı: PostgreSQL - ORM: Prisma
- Doğrulama: class-validator + class-transformer (DTO'lar üzerinden)
- Kimlik doğrulama: [JWT / session], yetkilendirme: guard'lar
- Test: [Jest + Supertest]

#Komutlar

- Geliştirme sunucusu: npm run start:dev
- Birim testler: `[npm run test]`
- E2E testler: `[npm run test:e2e]`
- Lint: `[npm run lint]`
- Build: `[npm run build]`

Bir görevi bitmiş saymadan önce lint, build ve ilgili testleri çalıştır ve sonucu raporla.

## Klasör yapısı ve katmanlar

Her özellik kendi modülünde: `src/<özellik>/` altında `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/` (veya `schemas/`).

- **Controller**: yalnızca HTTP katmanı. İstek al, DTO ile doğrula, service'i çağır, yanıt dön. İş mantığı ve veritabanı erişimi yok.
- **Service**: iş kuralları burada. Veritabanına [DOLDUR: repository / ORM client] üzerinden erişir.
- **Guard / Decorator**: kimlik ve rol kontrolü. Ortak olanlar `src/common/` altında.
- Modüller arası bağımlılık tek yönlü olsun; döngüsel bağımlılık ekleme. Başka modülün verisine o modülün service'i üzerinden eriş, tablosuna doğrudan değil.
- Yeni bir yardımcı yazmadan önce `src/common/` içinde zaten var mı kontrol et.

## Kod kuralları

- Her endpoint için girdi bir DTO ile doğrulanır; `any` kullanma, `unknown` + daralt.
- Global `ValidationPipe` açık kalır (`whitelist: true`); DTO'da olmayan alanlar kabul edilmez.
- İsimlendirme: dosyalar `kebab-case`, sınıflar `PascalCase`, değişken/fonksiyon `camelCase`.
- Hataları NestJS exception'larıyla fırlat (`NotFoundException` vb.); ham `Error` fırlatma, hata yutma.
- Konfigürasyon `ConfigService` üzerinden okunur; `process.env` doğrudan kullanılmaz.
- Yeni özellik yazarken mevcut bir modülü (ör. [DOLDUR: örnek modül]) örnek al ve aynı kalıbı izle.

## Güvenlik kuralları (en önemli bölüm)

- Her endpoint için kimlik doğrulama ve yetkilendirme açıkça belirtilmeli. Herkese açık endpoint'ler bilinçli olarak işaretlenir.
- Kullanıcıya ait kaynaklarda (rezervasyon, profil vb.) **sahiplik kontrolü zorunlu**: istekten gelen ID'ye güvenme, kaynağın giriş yapmış kullanıcıya ait olduğunu service katmanında doğrula (IDOR'a karşı).
- Kullanıcı kimliği istek gövdesinden değil, doğrulanmış token/oturumdan alınır.
- Parola düz metin saklanmaz veya loglanmaz; [DOLDUR: bcrypt / argon2] kullan.
- Sır, anahtar, token koda veya loga yazılmaz. `.env` dosyasını okuma, değiştirme, commit etme.
- Ham SQL yazman gerekirse parametreli sorgu kullan; string birleştirme yok.
- Listeleme endpoint'lerinde sayfalama zorunlu; sınırsız `find()` yok.

## Veritabanı ve performans

- Döngü içinde sorgu atma (N+1); ilişkileri tek sorguda yükle veya toplu sorgula.
- Sık filtrelenen/sıralanan alanlar ve yabancı anahtarlar için indeks düşün; ekleyeceksen migration ile.
- Birden fazla yazma gerektiren işlemlerde (ör. rezervasyon oluşturma + stok/slot düşme) transaction kullan.
- **Çifte rezervasyon (race condition)**: aynı slota eşzamanlı isteklerde çakışma olmamalı; benzersiz kısıt veya kilit ile koru ve test et.
- Şema değişikliği yalnızca migration ile yapılır; `synchronize: true` üretimde kullanılmaz.

## Test kuralları

- Yeni davranış için test yaz; hata düzeltmede önce hatayı yeniden üreten testi yaz.
- Mutlu yolun yanında hata yolları ve sınır durumları da test edilir (yetkisiz erişim, başkasının kaynağı, geçersiz girdi, dolu slot).
- Geçmeyen testi geçirmek için testi silme, zayıflatma veya anlamsız mock'lama. Test değişiyorsa nedenini açıkla.
- Refactor öncesi mevcut davranışı sabitleyen test yoksa önce onu yaz.

## Yapma listesi

- Onay almadan yeni paket ekleme; eklersen neden gerektiğini söyle ve paketin gerçekten var olduğunu doğrula.
- İstenen kapsamın dışındaki dosyalara dokunma, "fırsattan istifade" refactor yapma.
- Mevcut migration dosyalarını düzenleme; yeni migration ekle.
- Davranış değiştiren iş ile davranış değiştirmeyen refactor'u aynı commit'e koyma.
- Emin olmadığın bir şeyi varsay ve ilerleme; sor.

## Çalışma biçimi

- Birden fazla dosyayı etkileyen işlerde önce kısa bir plan sun, onay al, sonra uygula.
- Değişiklikleri küçük tut: bir görev, bir amaç.
- İş bittiğinde ne değiştirdiğini, hangi komutları çalıştırdığını ve sonuçlarını özetle.
