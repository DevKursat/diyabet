"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import RiskGauge from "@/components/RiskGauge";

type FormData = {
  ad: string;
  yas: number;
  cinsiyet: string;
  kilo: number;
  boy: number;
  belCevresi: number;
  kanBasinciSistolik: number;
  kanBasinciDiyastolik: number;
  acKanSekeri: number;
  hba1c: number;
  aileGecmisi: string;
  aktivite: string;
};

type Sonuc = {
  yuzde: number;
  seviye: string;
  renk: string;
  mesaj: string;
  bmi: number;
};

const adimlar = [
  { baslik: "Kişisel Bilgiler", ikon: "👤" },
  { baslik: "Ölçümler", ikon: "📏" },
  { baslik: "Kan Değerleri", ikon: "🩸" },
  { baslik: "Yaşam Tarzı", ikon: "🏃" },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function AnaSayfa() {
  const [adim, setAdim] = useState(0);
  const [yon, setYon] = useState(1);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState<Sonuc | null>(null);
  const [hata, setHata] = useState("");

  const [form, setForm] = useState<FormData>({
    ad: "",
    yas: 35,
    cinsiyet: "erkek",
    kilo: 75,
    boy: 170,
    belCevresi: 85,
    kanBasinciSistolik: 120,
    kanBasinciDiyastolik: 80,
    acKanSekeri: 95,
    hba1c: 5.4,
    aileGecmisi: "yok",
    aktivite: "orta",
  });

  const guncelle = (alan: keyof FormData, deger: string | number) => {
    setForm((prev) => ({ ...prev, [alan]: deger }));
  };

  const ileri = () => {
    setYon(1);
    setAdim((a) => a + 1);
  };

  const geri = () => {
    setYon(-1);
    setAdim((a) => a - 1);
  };

  const hesapla = async () => {
    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch("/api/hesapla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setHata(data.error);
      } else {
        setSonuc(data.sonuc);
      }
    } catch {
      setHata("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  };

  const yenidenBasla = () => {
    setSonuc(null);
    setAdim(0);
  };

  if (sonuc) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="glass-card w-full max-w-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Analiz Tamamlandı
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400"
            >
              {form.ad || "Kullanıcı"} için diyabet risk değerlendirmesi
            </motion.p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <RiskGauge yuzde={sonuc.yuzde} renk={sonuc.renk} seviye={sonuc.seviye} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-5 mb-6 text-center"
            style={{
              background: `${sonuc.renk}15`,
              border: `1px solid ${sonuc.renk}30`,
            }}
          >
            <p className="text-slate-200 leading-relaxed">{sonuc.mesaj}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {[
              { etiket: "BMI", deger: sonuc.bmi, birim: "kg/m²" },
              { etiket: "Risk Yüzdesi", deger: `%${sonuc.yuzde}`, birim: "" },
              { etiket: "Kan Şekeri", deger: form.acKanSekeri, birim: "mg/dL" },
              { etiket: "HbA1c", deger: form.hba1c, birim: "%" },
            ].map((item) => (
              <div
                key={item.etiket}
                className="glass-card p-4 text-center"
                style={{ borderRadius: 16 }}
              >
                <p className="text-slate-400 text-xs mb-1">{item.etiket}</p>
                <p className="text-white font-bold text-xl">
                  {item.deger}
                  {item.birim && (
                    <span className="text-slate-400 text-sm font-normal ml-1">{item.birim}</span>
                  )}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3"
          >
            <button onClick={yenidenBasla} className="btn-secondary flex-1">
              Yeni Analiz
            </button>
            <Link href="/gecmis" className="btn-primary flex-1 text-center">
              Geçmişi Gör
            </Link>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="shimmer-text">Diyabet Risk</span>
          <br />
          <span className="text-white">Analizi</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Sağlık verilerinizi girin, yapay zeka destekli algoritmamız risk düzeyinizi hesaplasın.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="glass-card w-full max-w-xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          {adimlar.map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="step-indicator w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  background:
                    i < adim
                      ? "linear-gradient(135deg, #6366f1, #a855f7)"
                      : i === adim
                      ? "rgba(99,102,241,0.3)"
                      : "rgba(255,255,255,0.07)",
                  border:
                    i === adim
                      ? "2px solid rgba(99,102,241,0.8)"
                      : i < adim
                      ? "2px solid transparent"
                      : "2px solid rgba(255,255,255,0.1)",
                  color: i <= adim ? "white" : "#64748b",
                  boxShadow: i === adim ? "0 0 20px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {i < adim ? "✓" : a.ikon}
              </div>
              <span
                className="text-xs hidden sm:block"
                style={{ color: i === adim ? "#a5b4fc" : "#475569" }}
              >
                {a.baslik}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full h-1 rounded-full bg-white/5 mb-8">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
            animate={{ width: `${((adim + 1) / adimlar.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <AnimatePresence mode="wait" custom={yon}>
          <motion.div
            key={adim}
            custom={yon}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {adim === 0 && (
              <AdimKisisel form={form} guncelle={guncelle} />
            )}
            {adim === 1 && (
              <AdimOlcumler form={form} guncelle={guncelle} />
            )}
            {adim === 2 && (
              <AdimKanDegerleri form={form} guncelle={guncelle} />
            )}
            {adim === 3 && (
              <AdimYasamTarzi form={form} guncelle={guncelle} />
            )}
          </motion.div>
        </AnimatePresence>

        {hata && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center mt-4 bg-red-900/20 rounded-xl p-3"
          >
            {hata}
          </motion.p>
        )}

        <div className="flex gap-3 mt-8">
          {adim > 0 && (
            <button onClick={geri} className="btn-secondary flex-1">
              ← Geri
            </button>
          )}
          {adim < adimlar.length - 1 ? (
            <button onClick={ileri} className="btn-primary flex-1">
              Devam Et →
            </button>
          ) : (
            <button
              onClick={hesapla}
              disabled={yukleniyor}
              className="btn-primary flex-1"
              style={{ opacity: yukleniyor ? 0.7 : 1 }}
            >
              {yukleniyor ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Hesaplanıyor...
                </span>
              ) : (
                "Risk Analizi Yap 🔬"
              )}
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Link
          href="/gecmis"
          className="text-slate-500 hover:text-indigo-400 transition-colors text-sm"
        >
          📋 Geçmiş analizleri görüntüle
        </Link>
      </motion.div>
    </main>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-slate-300 text-sm font-medium mb-2">{children}</label>
  );
}

function SliderField({
  etiket,
  deger,
  min,
  max,
  adim = 1,
  birim,
  onChange,
}: {
  etiket: string;
  deger: number;
  min: number;
  max: number;
  adim?: number;
  birim: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <FormLabel>{etiket}</FormLabel>
        <span className="text-indigo-300 font-semibold text-sm">
          {deger} {birim}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={adim}
        value={deger}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{
          background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${((deger - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((deger - min) / (max - min)) * 100}%)`,
        }}
      />
      <div className="flex justify-between text-slate-600 text-xs mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function AdimKisisel({ form, guncelle }: { form: FormData; guncelle: (alan: keyof FormData, deger: string | number) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white mb-6">Kişisel Bilgileriniz</h2>

      <div>
        <FormLabel>Ad Soyad</FormLabel>
        <input
          type="text"
          placeholder="Adınızı girin (isteğe bağlı)"
          value={form.ad}
          onChange={(e) => guncelle("ad", e.target.value)}
          className="form-input"
        />
      </div>

      <SliderField
        etiket="Yaş"
        deger={form.yas}
        min={18}
        max={90}
        birim="yaş"
        onChange={(v) => guncelle("yas", v)}
      />

      <div>
        <FormLabel>Cinsiyet</FormLabel>
        <div className="grid grid-cols-2 gap-3">
          {[
            { deger: "erkek", etiket: "Erkek", ikon: "♂" },
            { deger: "kadin", etiket: "Kadın", ikon: "♀" },
          ].map((opt) => (
            <button
              key={opt.deger}
              onClick={() => guncelle("cinsiyet", opt.deger)}
              className="py-3 rounded-xl font-medium text-sm transition-all"
              style={{
                background:
                  form.cinsiyet === opt.deger
                    ? "linear-gradient(135deg, #6366f1, #a855f7)"
                    : "rgba(255,255,255,0.07)",
                border:
                  form.cinsiyet === opt.deger
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.1)",
                color: form.cinsiyet === opt.deger ? "white" : "#94a3b8",
                boxShadow:
                  form.cinsiyet === opt.deger
                    ? "0 4px 15px rgba(99,102,241,0.3)"
                    : "none",
              }}
            >
              <span className="mr-2">{opt.ikon}</span>
              {opt.etiket}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdimOlcumler({ form, guncelle }: { form: FormData; guncelle: (alan: keyof FormData, deger: string | number) => void }) {
  const boy_m = form.boy / 100;
  const bmi = form.kilo / (boy_m * boy_m);

  const getBmiRenk = () => {
    if (bmi < 18.5) return "#60a5fa";
    if (bmi < 25) return "#10b981";
    if (bmi < 30) return "#f59e0b";
    return "#ef4444";
  };

  const getBmiEtiket = () => {
    if (bmi < 18.5) return "Zayıf";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Kilolu";
    return "Obez";
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white mb-6">Vücut Ölçümleri</h2>

      <SliderField
        etiket="Boy"
        deger={form.boy}
        min={140}
        max={220}
        birim="cm"
        onChange={(v) => guncelle("boy", v)}
      />

      <SliderField
        etiket="Kilo"
        deger={form.kilo}
        min={40}
        max={200}
        birim="kg"
        onChange={(v) => guncelle("kilo", v)}
      />

      <SliderField
        etiket="Bel Çevresi"
        deger={form.belCevresi}
        min={50}
        max={150}
        birim="cm"
        onChange={(v) => guncelle("belCevresi", v)}
      />

      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.4 }}
        key={Math.round(bmi * 10)}
        className="rounded-xl p-4 text-center"
        style={{
          background: `${getBmiRenk()}15`,
          border: `1px solid ${getBmiRenk()}30`,
        }}
      >
        <p className="text-slate-400 text-xs mb-1">Vücut Kitle İndeksi (BMI)</p>
        <p className="text-2xl font-bold" style={{ color: getBmiRenk() }}>
          {bmi.toFixed(1)}
        </p>
        <p className="text-xs mt-1" style={{ color: getBmiRenk() }}>
          {getBmiEtiket()}
        </p>
      </motion.div>
    </div>
  );
}

function AdimKanDegerleri({ form, guncelle }: { form: FormData; guncelle: (alan: keyof FormData, deger: string | number) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white mb-6">Kan Değerleri</h2>

      <SliderField
        etiket="Sistolik Kan Basıncı"
        deger={form.kanBasinciSistolik}
        min={80}
        max={200}
        birim="mmHg"
        onChange={(v) => guncelle("kanBasinciSistolik", v)}
      />

      <SliderField
        etiket="Diyastolik Kan Basıncı"
        deger={form.kanBasinciDiyastolik}
        min={50}
        max={130}
        birim="mmHg"
        onChange={(v) => guncelle("kanBasinciDiyastolik", v)}
      />

      <SliderField
        etiket="Açlık Kan Şekeri"
        deger={form.acKanSekeri}
        min={60}
        max={300}
        birim="mg/dL"
        onChange={(v) => guncelle("acKanSekeri", v)}
      />

      <SliderField
        etiket="HbA1c (Glikozillenmiş Hemoglobin)"
        deger={form.hba1c}
        min={4}
        max={14}
        adim={0.1}
        birim="%"
        onChange={(v) => guncelle("hba1c", v)}
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs text-center">
        {[
          { etiket: "Normal", aralik: "< 5.7%", renk: "#10b981" },
          { etiket: "Prediyabet", aralik: "5.7–6.4%", renk: "#f59e0b" },
          { etiket: "Diyabet", aralik: "≥ 6.5%", renk: "#ef4444" },
        ].map((item) => (
          <div
            key={item.etiket}
            className="rounded-lg p-2"
            style={{ background: `${item.renk}15`, border: `1px solid ${item.renk}25` }}
          >
            <p style={{ color: item.renk }} className="font-semibold">
              {item.etiket}
            </p>
            <p className="text-slate-500">{item.aralik}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdimYasamTarzi({ form, guncelle }: { form: FormData; guncelle: (alan: keyof FormData, deger: string | number) => void }) {
  const aileSecenekleri = [
    { deger: "yok", etiket: "Yok", aciklama: "Ailemde diyabet yok" },
    { deger: "kardes_dede", etiket: "Uzak akraba", aciklama: "Amca, teyze, büyükbaba" },
    { deger: "bir_ebeveyn", etiket: "1 Ebeveyn", aciklama: "Anne veya babamda var" },
    { deger: "her_ikisi", etiket: "Her ikisi", aciklama: "Anne ve babamda var" },
  ];

  const aktiviteSecenekleri = [
    { deger: "aktif", etiket: "Aktif", aciklama: "Haftada 5+ gün egzersiz", ikon: "🏃" },
    { deger: "orta", etiket: "Orta", aciklama: "Haftada 3-4 gün", ikon: "🚶" },
    { deger: "az", etiket: "Az", aciklama: "Haftada 1-2 gün", ikon: "🧍" },
    { deger: "hic", etiket: "Hareketsiz", aciklama: "Neredeyse hiç", ikon: "🛋️" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Yaşam Tarzı ve Aile Geçmişi</h2>

      <div>
        <FormLabel>Ailede Diyabet Geçmişi</FormLabel>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {aileSecenekleri.map((opt) => (
            <button
              key={opt.deger}
              onClick={() => guncelle("aileGecmisi", opt.deger)}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background:
                  form.aileGecmisi === opt.deger
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.04)",
                border:
                  form.aileGecmisi === opt.deger
                    ? "1px solid rgba(99,102,241,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="font-medium text-sm"
                style={{
                  color: form.aileGecmisi === opt.deger ? "#a5b4fc" : "#94a3b8",
                }}
              >
                {opt.etiket}
              </p>
              <p className="text-slate-600 text-xs mt-0.5">{opt.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <FormLabel>Fiziksel Aktivite</FormLabel>
        <div className="space-y-2">
          {aktiviteSecenekleri.map((opt) => (
            <button
              key={opt.deger}
              onClick={() => guncelle("aktivite", opt.deger)}
              className="w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left"
              style={{
                background:
                  form.aktivite === opt.deger
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.04)",
                border:
                  form.aktivite === opt.deger
                    ? "1px solid rgba(99,102,241,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-2xl">{opt.ikon}</span>
              <div>
                <p
                  className="font-medium text-sm"
                  style={{
                    color: form.aktivite === opt.deger ? "#a5b4fc" : "#94a3b8",
                  }}
                >
                  {opt.etiket}
                </p>
                <p className="text-slate-600 text-xs">{opt.aciklama}</p>
              </div>
              {form.aktivite === opt.deger && (
                <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(99,102,241,0.5)" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
