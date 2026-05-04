"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Kayit = {
  id: string;
  ad: string;
  yas: number;
  cinsiyet: string;
  kilo: number;
  boy: number;
  bmi: number;
  bel_cevresi: number;
  kan_basinci: string;
  ac_kan_sekeri: number;
  hba1c: number;
  aile_gecmisi: string;
  aktivite: string;
  risk_yuzdesi: number;
  risk_seviyesi: string;
  olusturma: string;
};

function getRenkBySeviye(seviye: string) {
  switch (seviye) {
    case "Düşük": return "#10b981";
    case "Orta": return "#f59e0b";
    case "Yüksek": return "#ef4444";
    case "Çok Yüksek": return "#7c3aed";
    default: return "#6366f1";
  }
}

function formatTarih(tarih: string) {
  const d = new Date(tarih);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GecmisSayfasi() {
  const [kayitlar, setKayitlar] = useState<Kayit[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [silinen, setSilinen] = useState<string | null>(null);
  const [acikKayit, setAcikKayit] = useState<string | null>(null);

  useEffect(() => {
    let aktif = true;

    const veriGetir = async () => {
      try {
        const res = await fetch("/api/kayitlar");
        const data = await res.json();

        if (aktif) {
          setKayitlar(data.kayitlar || []);
        }
      } catch {
        // pass
      } finally {
        if (aktif) {
          setYukleniyor(false);
        }
      }
    };

    void veriGetir();

    return () => {
      aktif = false;
    };
  }, []);

  const sil = async (id: string) => {
    setSilinen(id);
    try {
      await fetch(`/api/kayitlar?id=${id}`, { method: "DELETE" });
      setKayitlar((prev) => prev.filter((k) => k.id !== id));
      if (acikKayit === id) setAcikKayit(null);
    } catch {
      // pass
    } finally {
      setSilinen(null);
    }
  };

  const grafik = kayitlar
    .slice()
    .reverse()
    .slice(-10)
    .map((k) => ({
      tarih: new Date(k.olusturma).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
      risk: k.risk_yuzdesi,
      kan: k.ac_kan_sekeri,
      hba1c: k.hba1c,
    }));

  const ozet = {
    ortalama: kayitlar.length
      ? Math.round(kayitlar.reduce((s, k) => s + k.risk_yuzdesi, 0) / kayitlar.length)
      : 0,
    enYuksek: kayitlar.length ? Math.max(...kayitlar.map((k) => k.risk_yuzdesi)) : 0,
    toplamKayit: kayitlar.length,
  };

  return (
    <main className="min-h-screen px-4 py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1 className="text-4xl font-extrabold text-white">
            <span className="shimmer-text">Analiz</span> Geçmişi
          </h1>
          <p className="text-slate-400 mt-1">Tüm sağlık verisi kayıtlarınız</p>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Link href="/" className="btn-primary inline-block">
            + Yeni Analiz
          </Link>
        </motion.div>
      </div>

      {!yukleniyor && kayitlar.length > 0 && (
        <>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-5 sm:gap-6 mb-8"
          >
            {[
              { etiket: "Toplam Kayıt", deger: ozet.toplamKayit, ikon: "📋" },
              { etiket: "Ortalama Risk", deger: `%${ozet.ortalama}`, ikon: "📊" },
              { etiket: "En Yüksek", deger: `%${ozet.enYuksek}`, ikon: "⚠️" },
            ].map((item) => (
              <div key={item.etiket} className="glass-card p-5 text-center">
                <p className="text-2xl mb-1">{item.ikon}</p>
                <p className="text-2xl font-bold text-white">{item.deger}</p>
                <p className="text-slate-400 text-xs mt-1">{item.etiket}</p>
              </div>
            ))}
          </motion.div>

          {grafik.length > 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-white font-semibold mb-4">Risk Trendi (Son 10 Kayıt)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={grafik}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="tarih" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,12,41,0.95)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                    }}
                    labelStyle={{ color: "#a5b4fc" }}
                    formatter={(v) => [`%${v}`, "Risk"] as [string, string]}
                  />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#riskGradient)"
                    dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </>
      )}

      {yukleniyor && (
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!yukleniyor && kayitlar.length === 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-16 text-center"
        >
          <p className="text-6xl mb-4">🩺</p>
          <p className="text-white text-xl font-semibold mb-2">Henüz kayıt yok</p>
          <p className="text-slate-400 mb-6">İlk analizinizi yaparak başlayın.</p>
          <Link href="/" className="btn-primary inline-block">
            Analiz Yap
          </Link>
        </motion.div>
      )}

      <AnimatePresence>
        <div className="space-y-4">
          {kayitlar.map((kayit, i) => {
            const renk = getRenkBySeviye(kayit.risk_seviyesi);
            const acik = acikKayit === kayit.id;

            return (
              <motion.div
                key={kayit.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card overflow-hidden"
              >
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer"
                  onClick={() => setAcikKayit(acik ? null : kayit.id)}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                    style={{ background: `${renk}20`, border: `1px solid ${renk}30`, color: renk }}
                  >
                    %{kayit.risk_yuzdesi}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-white font-semibold truncate">
                        {kayit.ad || "İsimsiz"}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${renk}20`, color: renk }}
                      >
                        {kayit.risk_seviyesi}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                      {kayit.yas} yaş · BMI {kayit.bmi} · {formatTarih(kayit.olusturma)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.svg
                      animate={{ rotate: acik ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-slate-500"
                    >
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </div>
                </div>

                <AnimatePresence>
                  {acik && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-4">
                          {[
                            { etiket: "Kan Basıncı", deger: kayit.kan_basinci, birim: "mmHg" },
                            { etiket: "Kan Şekeri", deger: kayit.ac_kan_sekeri, birim: "mg/dL" },
                            { etiket: "HbA1c", deger: kayit.hba1c, birim: "%" },
                            { etiket: "Bel Çevresi", deger: kayit.bel_cevresi, birim: "cm" },
                          ].map((item) => (
                            <div
                              key={item.etiket}
                              className="rounded-xl p-3 text-center"
                              style={{ background: "rgba(255,255,255,0.04)" }}
                            >
                              <p className="text-slate-500 text-xs mb-1">{item.etiket}</p>
                              <p className="text-white font-semibold text-sm">
                                {item.deger}
                                <span className="text-slate-500 text-xs ml-1">{item.birim}</span>
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sil(kayit.id);
                            }}
                            disabled={silinen === kayit.id}
                            className="text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-xl transition-colors"
                            style={{ background: "rgba(239,68,68,0.1)" }}
                          >
                            {silinen === kayit.id ? "Siliniyor..." : "🗑️ Sil"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </main>
  );
}
