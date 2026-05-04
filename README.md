# 🩺 Diyabet Risk Analizi

Sağlık verilerinizi girerek diyabet risk yüzdenizi hesaplayan, sonuçları veritabanına kaydeden ve analiz geçmişinizi listeleyen full-stack web uygulaması.

## Özellikler

- 🎯 **Çok adımlı form** — Kişisel bilgiler, ölçümler, kan değerleri ve yaşam tarzı
- 📊 **Risk hesaplama** — Klinik faktörlere dayalı ağırlıklı algoritma (BMI, HbA1c, kan basıncı, aile geçmişi vb.)
- 💾 **Veritabanı kaydı** — Tüm analizler SQLite'a otomatik kaydedilir
- 📋 **Geçmiş listesi** — Tüm kayıtlar, grafikler ve detay görünümü
- ✨ **Animasyonlar** — Framer Motion ile akıcı geçişler, animated gauge, blob arka planlar
- 🐳 **Tek komutla çalıştır** — Docker Compose ile deploy

## Tek Komutla Çalıştır

```bash
docker-compose up --build
```

Uygulama `http://localhost:3000` adresinde çalışır.

## Lokal Geliştirme

```bash
cp .env.example .env
npm install
npm run dev
```

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS + Custom CSS |
| Animasyon | Framer Motion |
| Grafik | Recharts |
| Veritabanı | SQLite (better-sqlite3) |
| Deploy | Docker + docker-compose |

## Ekran Görüntüleri

Ana form sayfası → Risk sonucu → Geçmiş analizler
