# FlexBook

Esnek, çok sektörlü randevu/rezervasyon platformu — kuaförden danışmanlığa, toplantı odasından klinik randevusuna kadar tek bir çekirdek mimariyle çalışacak şekilde tasarlandı.

**Stack:** NestJS · React · PostgreSQL · Prisma · Redis/BullMQ · TypeScript (uçtan uca)

## Öne Çıkan Mimari Kararlar

| Konu | Nasıl çözüldü |
|---|---|
| **Refresh token rotation + reuse detection** | Her token yenilemesinde eski token iptal edilir; iptal edilmiş bir token tekrar sunulursa (çalınma şüphesi) o oturuma ait tüm token ailesi iptal edilir |
| **Rezervasyon çakışma kontrolü** | Transaction içinde, kaydı oluşturmadan önce aynı kaynağın aynı zaman aralığında aktif bir rezervasyonu olup olmadığı kontrol edilir |
| **Durum makinesi** | `Booking.status` hiçbir yerde doğrudan güncellenmez — `PENDING → CONFIRMED → COMPLETED/NO_SHOW` gibi geçişler merkezi bir guard fonksiyonundan geçer, terminal durumlardan (`CANCELLED`, `COMPLETED`, `NO_SHOW`) geri dönüş yoktur |
| **Asenkron bildirimler** | Rezervasyon onayı/iptali ve hatırlatma SMS'leri (mock) BullMQ ile kuyruğa alınır; kuyruğa ekleme her zaman veritabanı transaction'ı **commit olduktan sonra** yapılır |
| **Paylaşılan doğrulama katmanı** | Zod şemaları `packages/shared`'da tek yerden tanımlanır, hem backend (NestJS Pipe) hem frontend (React Hook Form) aynı kuralı kullanır — validasyon iki kez yazılmaz |
| **Business izolasyonu** | Her sorgu `businessId` ile filtrelenir; bir işletme başka bir işletmenin kaynağına/rezervasyonuna asla erişemez |

## Özellikler

- 🔐 Kayıt/giriş, httpOnly cookie tabanlı refresh token akışı
- 📅 Gün/hafta görünümlü takvim — kaynak bazlı renk kodlama, çakışan rezervasyonların yan yana dizilmesi
- 🧩 Kaynak ↔ Hizmet çoka-çok eşleştirmesi
- 🕐 Haftalık müsaitlik tanımlama (çoklu aralık desteği — öğle arası gibi bölünmüş mesai)
- ✅ Rezervasyon durum yönetimi (onayla / iptal et / tamamlandı / gelmedi)
- 📱 Asenkron SMS bildirimleri (onay, iptal, 24 saat öncesinden hatırlatma)

## Teknik Yığın

**Backend:** NestJS · Prisma · PostgreSQL · Redis · BullMQ · Passport/JWT · Zod
**Frontend:** React · Vite · TanStack Query · Zustand · React Hook Form · Tailwind CSS
**Monorepo:** npm workspaces (`apps/api`, `apps/web`, `packages/shared`)
